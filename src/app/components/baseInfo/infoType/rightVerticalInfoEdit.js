import React, { Component } from 'react';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Radio from 'sub-antd/lib/radio';
import message from 'sub-antd/lib/message';
import DatePicker from 'sub-antd/lib/date-picker';
import axios from 'axios';
import Cookies from 'js-cookie';
import Select from 'sub-antd/lib/select';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import ModalInModal from 'components/modal/model/Modal';
import SysUpload from 'components/sysUpload/SysUpload';
import SysUserSelect from 'components/sysUserSelect/SysUserSelect';
const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
import Button from 'sub-antd/lib/button';

class RightVerticalInfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: '',
            docType:[],
            enumValues: [],
            isloading:false,
            showUserSelect: false,
            fileId:[],
            fileName:[]
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    save = (callback) => {
        this.props.form.validateFields((errors, values) =>{
            const valueData = this.props.baseData.detailArrData.map((item)=>{
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
                    return {...item, baseDataId, value}
                }
                const value = values[item.attrId];
                const baseDataId = values[item.attrId];
                return {...item,baseDataId,value}
            })
            //console.log(values)
            //console.log(valueData, '==== value data')
            //return 
            axios.post(`/sysware/api/document/update`, {data:valueData}, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
                if (res.data.code === 200) { 
                    message.success("修改成功");
                    callback({detailArrData:valueData});
                }
                else{
                    message.error(res.data.message);
                }
            })
        })
    }
    onToggleShow(item,visible){
        if(visible){
            this.setState({
                isloading: true,
            });
            const Authorization = Cookies.get('Authorization');
            const dataUrl = {
                5:`/sysware/api/docu/queryDetail?id=${item.attrId}`,
                6:`/sysware/api/se/basicdata/loadBypid?pid=${item.pid}&code=611_ORM`
            }
            axios.get(dataUrl[item.formType], { headers: { 'Authorization': Authorization}}).then(res => {
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
        let comp = null;
        let formProps;
        switch (item.formType) {
            case '6':
                formProps = getFieldProps(`${item.attrId}`, {
                    initialValue: item.value,
                    onChange: item => console.log(item),
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
                    initialValue: item.value,
                })
                break;
        }
        switch(item.formType){
            case '1' :
                comp = [
                    <Input type="textarea" maxLength='200'  {...formProps}/>,
                    <p className="form-description-tip">还可输入{200-(this.props.baseData.describe ||this.state.desc ).length>0?200-(this.props.baseData.describe ||this.state.desc ).length:'0'}字</p>
                ]
                break;
            case '2' :
                //文件
                comp = <SysUpload field={item.attrId} value={item.baseDataId} label={item.value} getFieldProps={getFieldProps}/>
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
                            onToggleShow={this.onToggleShow.bind(this,item)}
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
                            {this.state.enumValues.map((enumVal,index) => {
                                return <Option key={enumVal.id} value={enumVal.id}>
                                    {item.formType === '6'?enumVal.column1:enumVal.name}
                                </Option>;
                            })}
                        </Select>;
                break;   
            default:
                comp = <Input key={item.attrId} type="text"  {...formProps}/>;
        }
        return  comp;
    }
    render() {
        return <div>
            <Form inline>
                { this.props.baseData.detailArrData && this.props.baseData.detailArrData.map((item, index)=>{
                    let formLayout = item.formType === '1' || item.formType === '2'?fourColLayout:halfFourColLayout;
                    return <FormItem key={index} label={item.name} {...formLayout}>{this.createComponentByFormType.bind(this,item)()}</FormItem>
                })}
            </Form>
        </div>
    }
}
// RightVerticalInfoEdit = Form.create()(RightVerticalInfoEdit);

export default RightVerticalInfoEdit