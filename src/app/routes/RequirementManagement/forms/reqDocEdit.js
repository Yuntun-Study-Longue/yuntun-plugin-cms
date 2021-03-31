import React, { Component } from "react";
import axios from 'axios'
import { Form } from 'antd';
const FormItem = Form.Item;
import Input from 'sub-antd/lib/input';
import DatePicker from 'sub-antd/lib/date-picker';
import Select from 'sub-antd/lib/select';
const Option = Select.Option;
import SysUpload from 'components/sysUpload/SysUpload';
import SysUserSelect from 'components/sysUserSelect/SysUserSelect';
import SysModal from 'components/sysModal'
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import { required, max, dmax } from 'components/sysForm/sysRules'
class ReqDocEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.notEdit = ['创建人','创建日期','最后修改人','最后修改日期']
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }
    onToggleShow(item,visible){
        if(visible){
            this.setState({
                isloading: true,
            });
            const dataUrl = {
                5:`/sysware/api/docu/queryDetail?id=${item.attrId}`,
                6:`/sysware/api/se/basicdata/loadBypid?pid=${item.pid}&code=611_ORM&state=1`
            }
            axios.get(dataUrl[item.formType]).then(res => {
                let data=res.data.data.resultSet || res.data.data || [];
                if(item.formType === '5'){
                    data = data.docuExtends
                }
                this.setState({
                    isloading: false,
                    enumValues:data
                });
            }).catch(error => {
            })
        }else{
            this.setState({
                enumValues:[]
            });
        }
    }
    createComponentByFormType(item){
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        if(this.notEdit.includes(item.name)){
            return item.value
        }
        let comp = null;
        let formProps;
        if(!['文档名称','文档编号','文档说明' ].includes(item.name)){
            switch (item.formType) {
                case '6':
                    formProps = getFieldProps(`${item.attrId}`, {
                        initialValue: item.value,
                        //onChange: item => console.log(item),
                    })
                    break;
                case '3':
                    formProps = getFieldProps(`${item.attrId}`, {
                        initialValue: item.value,
                        getValueFromEvent:(date, dateString) => dateString
                    })
                    break;
                default:
                    formProps = getFieldProps(`${item.attrId}`,{
                        initialValue: item.value?item.value:'',
                    })
                    break;
            }
        }
        switch (item.name) {
            case '文档名称':
                formProps = getFieldProps(`${item.attrId}`,{
                    initialValue: item.value?item.value:'',
                    rules: [required,max(100)],
                })
                break;
            case '文档编号':
                formProps = getFieldProps(`${item.attrId}`,{
                    initialValue: item.value?item.value:'',
                    rules: [required,max(200)],
                })
                break;
            case '文档说明':
                formProps = getFieldProps(`${item.attrId}`,{
                    initialValue: item.value?item.value:'',
                    rules: [dmax(500)],
                })
                break;
        }
        switch(item.formType){
            case '1' :
                comp = <Input.CountDown 
                        type="textarea" 
                        maxTextareaLength={500} 
                        rows={5} 
                        {...formProps}
                    />
                break;
            case '2' :
                //文件
                comp = (
                    <SysUpload
                        field={item.attrId}
                        value={item.baseDataId}
                        label={item.value}
                        hasSecurityLevel
                        baseData={item}
                        getFieldProps={getFieldProps}
                    />
                );
                break;
            case '3' :
                //日期
                comp = <DatePicker {...formProps}/>
                break;
            case '4' :
                // 用户
                comp = <SysUserSelect field={item.attrId} value={item.baseDataId} label={item.value} getFieldProps={getFieldProps}/>
                break;
            case '5' :
            case '6' :
                //枚举
                comp = <Select
                            onToggleShow={(visible)=>this.onToggleShow(item,visible)}
                            labelInValue={true}
                            noLabelDel
                            async
                            isloading={this.state.isloading}
                            loadingContent="加载中..."
                            multiple={item.multiType === 1?true:false}
                            {...getFieldProps(`${item.attrId}`, {
                                initialValue:item.multiType === 1
                                    ?item.baseDataId
                                        ?item.baseDataId.split(',').map((key,index)=>{
                                            return { 
                                                key: ~~key,
                                                label:item.value.split(',')[index]  
                                            }
                                        })
                                        :[]
                                    :{
                                        key:item.baseDataId?item.baseDataId:'',
                                        label:item.value?item.value:''
                                    },
                                })
                            }
                        >
                            {   this.state.enumValues &&
                                this.state.enumValues.map((enumVal,index) => {
                                    return <Option key={enumVal.id} value={enumVal.id}>
                                        {item.formType === '6'?enumVal.column1:enumVal.name}
                                    </Option>;
                                })
                            }
                        </Select>;
                break;   
            default:
                comp = <Input key={item.attrId} type="text"  {...formProps}/>;
        }
        return  comp;
    }
    save = (callback) => {
        this.props.form.validateFields((errors, values) =>{
            if(!!errors) return;
            const valueData = this.props.baseData.map((item)=>{
                if(!values[item.attrId]) return item;
                if(Array.isArray(values[item.attrId])){
                    const baseDataIdArr = [];
                    const valueArr = [];
                    values[item.attrId].forEach((itemVal)=>{
                        if(itemVal.key){
                            baseDataIdArr.push(itemVal.key);
                            valueArr.push(itemVal.label)
                        }
                    })
                    return {...item, baseDataId:baseDataIdArr.join(','), value:valueArr.join(',')}
                }
                if (typeof values[item.attrId] === 'object') {
                    const baseDataId = values[item.attrId].key;
                    const value = values[item.attrId].label;
                    let securityLevel = null;
                    let securityLevelName = null;
                    let enable = null;
                    if(item.formType === '2'){
                        securityLevel = values[item.attrId].securityLevel
                        securityLevelName = values[item.attrId].securityLevelName
                        enable = values[item.attrId].enable
                    }
                    return {...item, baseDataId, value,securityLevel,securityLevelName,enable}
                }
                const value = values[item.attrId];
                const baseDataId = values[item.attrId];
                return {...item,baseDataId,value}
            })
            axios.post(`/sysware/api/document/update`, {data:valueData}).then(res => {
                if (res.data.code === 200) { 
                    SysModal.success("修改成功！");
                    callback(valueData);
                }
                else{
                    SysModal.error(res.data.message);
                }
            })
        })
    }
    render() {
        return (
            <Form inline>
                {this.props.baseData && this.props.baseData.map((item,index)=>{
                    let formLayout = item.formType === '1' || item.formType === '2'?fourColLayout:halfFourColLayout;
                    return <FormItem key={index} label={item.name} {...formLayout}>{this.createComponentByFormType.bind(this,item)()}</FormItem>
                })}
            </Form>
        )
    }
}
// ReqDocEdit = Form.create()(ReqDocEdit);
export default ReqDocEdit