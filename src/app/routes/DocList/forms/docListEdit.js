import React, { Component } from 'react';
// import ModalTable from 'components/modal/table/Table';
import axios from 'axios';
import Cookies from 'js-cookie';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Radio from 'sub-antd/lib/radio';
import Modal from 'sub-antd/lib/modal';
import { type, scope, changeitem, selectType, createhistory,extendType } from './enumtype';
import {halfFourColLayout,fourColLayout,halfFourColLayoutFn,fourColLayoutFn} from "components/layout/formLayout";
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
import SysModal from 'components/sysModal' 
import Select from 'sub-antd/lib/select'; 
const Option = Select.Option;

class DocListEdit extends Component {
    constructor(props) {
        super(props); 
        this.state = {
          baseData: this.props.baseData,
          delItems: [],
          addItems: [],
        } 
        console.log(props)
    }
    componentDidMount() {
      this.props.onRef && this.props.onRef(this);
    }
   
    save = (callback) => {
        this.props.form.validateFields((errors, values) =>{   

            const fileName = values.fileName;
            const documentVersion = values.documentVersion;
            const securityLevel = values.securityLevel;
            const desc = values.desc;  
            
            axios.post(`/sysware/api/documentTemplate/update`, {...this.state.baseData, fileName, documentVersion, securityLevel, desc}).then(res => {
                console.log(res)
                if (res.data.code === 200) { 
                    SysModal.success("修改成功！");
                    callback({...this.state.baseData, fileName, documentVersion, securityLevel, desc}) 
                }
                else{
                    SysModal.error(res.data.message);
                }
            })
        })
    }
     
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        const nameProps = getFieldProps('fileName', {
            initialValue: this.state.baseData.fileName,
            rules: [
                { required: true, message: '请输入名称' }, 
            ],
        }); 
        const descProps = getFieldProps('desc', {
            initialValue: this.state.baseData.desc?this.state.baseData.desc:'',
            rules: [
                { max: 500, message: '请控制内容长度不超过500个字' },
            ]
        }); 
        return (
            <Form inline>
                <FormItem label='文档名称：' {...halfFourColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem><br />
                <FormItem label='创建时间：' {...halfFourColLayout}>
                    {this.state.baseData.createTimeStr}
                </FormItem>
                <FormItem label='创建人：' {...halfFourColLayout}>
                    {this.state.baseData.creator}
                </FormItem>
                <FormItem label='文档基线' {...halfFourColLayout}>
                    <Select defaultValue="基线1.0" style={{ width: 120 }}  >
                        <Option value="基线1.0">基线1.0</Option>
                        <Option value="基线2.0">基线2.0</Option>
                        <Option value="基线3.0">基线3.0</Option>
                    </Select>
                </FormItem>
                <FormItem label='文档密级' {...halfFourColLayout}>
                    <Select defaultValue="JM" style={{ width: 120 }} >
                        <Option value="非M">非M</Option>
                        <Option value="JM">JM</Option>
                        <Option value="MM">MM</Option>
                    </Select>
                </FormItem>
                <FormItem label='状态' {...halfFourColLayout}>
                    {this.state.baseData.templateStatusName}
                </FormItem>
                <FormItem label='文档说明：' {...fourColLayout}>
                    <Input.CountDown type="textarea"  maxTextareaLength={500} rows={10} {...descProps} />
                </FormItem>
            </Form>
        );
    }
}
DocListEdit = Form.create()(DocListEdit);
export default DocListEdit
