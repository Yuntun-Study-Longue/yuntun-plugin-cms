import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from '@/redux/approval/store'

import SingleApproval from './singleApproval'
import ManyApproval from './manyApproval'
import FinalApproval from './finalApproval'

import axios from "axios";

import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Select from 'sub-antd/lib/select';
import Upload from 'sub-antd/lib/upload';
import Button from 'sub-antd/lib/button';
import Icon from 'sub-antd/lib/icon';

const Option = Select.Option;
const FormItem = Form.Item;
const CountDown = Input.CountDown;

import './approval.scss'

let inited = false;
let openApproval = function(){}
//抛出一个接口，提供第三方调用自动生成html
//window.ApprovalUtil = {};
exports.openApproval = function(params){
    if(!inited) {
        $('body').append('<div id="approval-container"></div>');
        ReactDOM.render(<Provider store={store}><SubmitApproval /></Provider>,document.getElementById("approval-container"));
        inited = true;
    }
    openApproval(params)
}

let axios_load = true;

/**
 * 送审
 */
export default class SubmitApproval extends Component{
    constructor(props){
        super(props);
        this.state={
            visible: false,
            postScript: "", //附言
            submitData: [], //提交的数据
            params: "", //调用方提供的参数  //templateType审批类型 --objectId审批对象id
            processId: "",   //clone后的流程id
            fileList : '', //文件
            secretLevel : '', //文件密级
        }
    }

    componentDidMount () {
        openApproval = params => {
            params.openSuccess && params.openSuccess()
            this.setState({
                visible: true,
                params
            });
        }
    }

    clearData () {
        this.state = {
            ...this.state,
            postScript: "", 
            submitData: [], 
            processId: "",
            fileList: "",
            secretLevel: ""
        }
    }

    handleOk () {

        if( !axios_load ){
            return;
        }

        let closeFlag = true;
        this.cform.validateFieldsAndScroll((errors, values) => {
            if(errors){
                for(let key in errors){
                    this.state.submitData.forEach(item => {
                        if (key.indexOf(item.activityId) !== -1) {
                            closeFlag = false;
                            return;
                        }
                    })
                }
                if (errors.msg) {   //校验送审附言
                    closeFlag = false;
                    return;
                }
            }

            if (!closeFlag) {
                return;
            }

            //验证多选是否有搜索内容
            const submitData = this.state.submitData;
            for (let i =0 ,len=submitData.length;i<len;i++) {
                if (submitData[i].isErr) {
                    return;
                }
            }

            let param = {};
            param["processInstanceId"] = this.state.processId;
            param["objectId"] = this.state.params.objectId; //审批对象id
            param["objectType"] = this.state.params.templateType;   //审批类型
            param["memo"] = this.state.params.objectMemo; //审批对象描述
            param["approvalNote"] = this.state.postScript;
            submitData.forEach(item=>{
                const key = item.activityId;
                let participateId = item.participateId || '';
                param[key] = participateId.constructor === Array ? function(){

                    return participateId.map( item => {
                        return item.value
                    }).join(',')

                }() : participateId;
                if (item.roleId.length > 0) {
                    param[key+"_role"] = item.roleId;
                }
                if (item.departmentId.length > 0) {
                    param[key+"_dep"] = item.departmentId;
                }
                if (item.chargedUserId) {
                    param[key+"_leader"] = item.chargedUserId;
                }
                param[key+"_checkbox_hidden"] = item.check ? "1" : "0";
            });

            if( this.state.fileList && !this.state.fileList.response ){
                message.info("文件正在上传中");
                return;
            }

            axios_load = false;
            axios.post(globalInitConfig.eap_url+`eap/api/approval/update-send.action`, param).then(res=>{
                    const data = res.data;
                    if (200 === data.code) {

                        axios.post(globalInitConfig.mdm_url+`flow/approval/file`, {
                            objectId : this.state.params.objectId,
                            fileId : this.state.fileList ? this.state.fileList.response.root.datas[0].fileId : undefined,
                            fileName : this.state.fileList ? this.state.fileList.name : undefined,
                            fileSecurity : this.state.secretLevel ? this.state.secretLevel.toString() : undefined,
                        }).then(res=>{
                            const data = res.data;
                            if (200 === data.code) {

                                axios_load = true;
                                this.clearData();
                                this.setState({ visible: false })
                                this.state.params.approvalSuccess && this.state.params.approvalSuccess();

                            }
                        }).catch ( error=>{
                            console.log(error);
                        });
                    }
                }).catch ( error=>{
                    console.log(error);
                });
           
        });

    }

    updateData (obj) { //更新参数
        const submitData = this.state.submitData;
        let noData = true;
        for (let i =0,len=submitData.length; i<len; i++) {
            let item=submitData[i];
            if(obj.activityId === item.activityId){
                this.state.submitData[i] = obj;
                noData = false;
            }
        }
        if (noData) {
            this.state.submitData.push(obj);
        }
    }

    updatePostScript (postScript) {
        this.setState({ postScript });
    }

    updateProcessId (processId) {
        this.setState({ processId , submitData: [] });
    }

    updateFile( obj ){

        //更新文件
        if( obj.fileList || obj.fileList === '' ){
            this.setState({
                fileList : obj.fileList
            });
        }

        //更新文件密级
        if( obj.secretLevel || obj.secretLevel === '' ){
            this.setState({
                secretLevel : obj.secretLevel
            });
        }

    }

    handleCancel () {
        this.clearData();
        this.setState({ visible: false });
        this.state.params.approvalCancel && this.state.params.approvalCancel();
        //删除流程id
        if (this.state.processId.length === 0) {
            return;
        }
        axios.delete(globalInitConfig.eap_url+`eap/api/approval/process.action?processId=${this.state.processId}`).then(res=>{
   
        }).catch ( error=>{
            console.log(error);
        });
    }

    render(){
        return(
            <div className="container">
                <Modal title="送审" 
                    visible={this.state.visible}
                    className="submit-approval-modal"
                    onOk={()=> this.handleOk()} 
                    onCancel={()=>this.handleCancel()}
                    width={860}
                >
                    {
                        this.state.visible ?<SubmitApprovalContent 
                                                ref={node=>this.cform=node}
                                                update={obj=>this.updateData(obj)}
                                                updatePostScript={value=>this.updatePostScript(value)}
                                                updateFile={value=>this.updateFile(value)}
                                                params={this.state.params}
                                                updateProcessId={(value)=>this.updateProcessId(value)}
                                            /> : null
                    }
                </Modal>
            </div>
        )
    }
}

class SubmitApprovalContent extends Component{
    constructor (props) {
        super(props);
        this.state={
            postScript: "", //附言
            process: "",    //选中的审批流程
            processList: [],    //审批流程list
            processInstanceId: "",  //clone出来的流程id，
            activities: [], //审批节点数据
            // mdm定制
            fileList: [],//上传文件集合
            fileSelectList : [],//密级集合
            initValue: [],  //上传文件密级的初始值 { value: '', selectId: '' }
            form : {
                fileId :'', //文件ID
                secretLevel :'' //文件密级
            },
            // mdm定制end
        }
    }

    componentDidMount () {
        this.getProcessList( this.props.params.processInstanceId );
        this.initSelectList();
        this.props.updateFile({
            fileList: '',
            secretLevel: '',
        });
        this.setState({
            postScript : this.props.params.postScript
        },()=>{
            this.props.updatePostScript(this.props.params.postScript);
        })
    }

    initSelectList () { //获取密级接口
        axios.get(globalInitConfig.eap_url+`eap/api/securityDegrees/byUserIdAndSecurityType.action?securityType=TaskObject`).then(res => {
            const data = res.data;
            if (1 === data.code) {
                let list = [];
                const datas = data.result;
                datas.forEach(item => {
                    list.push({name: item.securityName, value: item.securityValue});
                });
                this.setState({fileSelectList:list});
            }
        }, rej => {
        }).catch(error => {
            console.log(error);
        })
    }

    //processInstanceId如果存在，则自动配置了流程。
    getProcessList ( processInstanceId ) {

        const params = {
            templateType : this.props.params.templateType,
            limit : 999,
            objectId : this.props.params.objectId
        };

        axios.get(globalInitConfig.eap_url+`eap/approval/getApprovalProcessTemplateByType.action` , {
            params
        }).then(res=>{
            const data = res.data;
            if (data.success) {
                let processList = [];
                const dataList = data.data;
                dataList.map(item=>{
                    processList.push({
                        name: item.approvalProcessTemplateName,
                        value: item.approvalProcessTemplateId
                    });
                });

                this.setState({
                    processList,
                    process: processInstanceId || dataList[0].approvalProcessTemplateId
                },()=>{
                    //clone流程
                    this.cloneProcess(this.state.process);
                });
            }
        }).catch ( error=>{
            console.log(error);
        });
    }

    handleProcess (process) {
        this.deleteProcess();
        this.cloneProcess(process);
    }

    cloneProcess (process) {
        let param = {templateId: process};
        axios.post(globalInitConfig.eap_url+`eap/api/approval/process/clone.action`,param).then(res=>{
            const data = res.data;
            if (200 == data.code) {
                const processInstanceId = data.data.processInstanceId;
                this.props.updateProcessId(processInstanceId);
                this.setState({ processInstanceId , process },()=>{
                    //调用渲染节点接口 
                    const {templateType, objectId} = this.props.params;
                    let paramStr = `processInstanceId=${this.state.processInstanceId}&objectType=${templateType}&objectId=${objectId}`
                    axios.get(globalInitConfig.eap_url+`eap/api/approval/acitivty.action?${paramStr}`).then(res=>{
                        const data = res.data;
                        if (200 === data.code) {
                            const backData = data.data;
                            const activities = backData.activities;
                            this.setState({ activities });
                        }
                    }).catch ( error=>{
                        console.log(error);
                    });
                });
            } else {
                message.error("审批流程不正确，无法送审，请联系管理员");
            }
        }).catch ( error=>{
            console.log(error);
        });
    }

    deleteProcess () {    //删除clone出来的流程id
        if (this.state.processInstanceId.length === 0) {
            return;
        }
        axios.delete(globalInitConfig.eap_url+`eap/api/approval/process.action?processId=${this.state.processInstanceId}`).then(res=>{
        
        }).catch ( error=>{
            console.log(error);
        });
    }

    render () {
        const _this = this;
        const { getFieldProps} = this.props.form;
        const msg = getFieldProps( "msg", {
            'initialValue': this.state.postScript,
            rules: [
                {max:500,message:'最多输入500个字符'},
           ],
            onChange:(e)=>{
                let postScript = e.target.value;
                this.props.updatePostScript(postScript);
                this.setState({ postScript });
            }
        });
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        // mdm 定制
        const uploadPropsSetings = {
            action: globalInitConfig.file_url+'sid_ke/upload/?encoding=utf-8',
            listType: 'select',
            name: 'fileToUpload',   //上传文件的key，防止服务器存储名称乱码
            onChange(info){

                if( info.file && $.type(info.file.response) !== 'string' ){
                    _this.setState({ fileList: info.fileList });
                    _this.props.updateFile({
                        fileList: info.file,
                        secretLevel : _this.state.fileSelectList[_this.state.fileSelectList.length-1].value
                    });
                }else{
                    message.error(info.file.response,3);
                    _this.setState({
                        fileList: ''
                    });
                    _this.props.updateFile({
                        fileList: '',
                        secretLevel : ''
                    });
                }

            },
            beforeUpload (file) {
                if (file.size > 4*1024*1024*1024) {
                    message.info("上传的文件大于4G")
                    return false;
                }
                if (_this.state.fileList.length === 1) {
                    message.info("仅允许上传1个文件");
                    return false;
                }
                const value = _this.state.fileSelectList[_this.state.fileSelectList.length -1].value;
                _this.state.form.secretLevel = value;
                _this.state.initValue.push({selectId: file.uid, value })
            },
            selectList: _this.state.fileSelectList,
            selectChange(file, value) {
                _this.setState({
                    form : {
                        ..._this.state.form,
                        secretLevel : value
                    }   
                });
                _this.props.updateFile({
                    secretLevel : value
                });
            },
            selectValues: this.state.initValue, //初始化select的值
            selectWidth: 100,
            fileList: this.state.fileList,
            onRemove(){

                _this.setState({ fileList: [] });

                _this.props.updateFile({
                    fileList: '',
                    secretLevel : '',
                });
            },
            tipMsg:"仅允许上传1个附件，大小不能超过4G",
            render(name) {
                if( name.length > 20 ){
                    return name.substr(0, 20)+'...';
                }else{
                    return name
                }

            },
        };
        // mdm定制end
        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label="送审附言："
                >
                    <CountDown {...msg} value={this.state.postScript} type="textarea" maxTextareaLength={500} rows={4} />
                </FormItem>
                {/* mdm 定制 */}
                <FormItem
                    {...formItemLayout}
                    label="附件上传："
                >
                    <Upload {...uploadPropsSetings}>
                        <Button type="ghost">
                            <Icon type="upload" /> 点击上传
                        </Button>
                    </Upload>
                </FormItem>
                {/* mdm 定制end */}
                <FormItem
                    {...formItemLayout}
                    label= "审批流程："
                >
                    <Select
                        value={this.state.process}
                        disabled={ !!this.props.params.processInstanceId }
                        style={{ width: 376, marginRight: 10 }}
                        defaultValue={ this.props.params.processInstanceId }
                        onChange={(value)=>this.handleProcess(value)}
                    >
                        {
                            this.state.processList.map((item,index)=>{
                                return <Option value={item.value} key={index}>{item.name}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                {
                    this.state.activities.map((item,index)=>{
                        if (item.activityType == "SINGLE_APPROVAL_ACTIVITY") {  //单人审核
                            return  <SingleApproval
                                        key={item.activityId}
                                        FormItem={FormItem}
                                        formItemLayout={formItemLayout}
                                        parentId="0"
                                        update = {obj=>this.props.update(obj)}
                                        dataSource = {item}
                                        form={this.props.form}
                                    />
                        }else if (item.activityType == "DECIDE_APPROVAL_ACTIVITY") {   //决审
                            return  <FinalApproval
                                        key={item.activityId}
                                        FormItem={FormItem}
                                        formItemLayout={formItemLayout}
                                        update = {obj=>this.props.update(obj)}
                                        dataSource = {item} 
                                        form={this.props.form}
                                    />
                        }else { //多人审核和会审会签
                            return <ManyApproval
                                        key={item.activityId}
                                        FormItem={FormItem}
                                        formItemLayout={formItemLayout}
                                        userIds={ item.attributes.participantId }
                                        selectbutVisible={ !item.attributes.participantId }
                                        parentId="0"
                                        update = {obj=>this.props.update(obj)}
                                        dataSource = {item} 
                                        form={this.props.form}
                                    />
                        }
                    })
                }
            </Form>
        )
    }
}

SubmitApprovalContent = Form.create()(SubmitApprovalContent);