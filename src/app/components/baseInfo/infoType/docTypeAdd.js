import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Select from 'sub-antd/lib/select';
import Radio from 'sub-antd/lib/radio';
import message from 'sub-antd/lib/message';
import axios from 'axios';
import Cookies from 'js-cookie';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
import {twoColLayout} from "components/layout/formLayout";

class DocTypeAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc:'',
            disabledItem: false,
            isShowEnum: false,
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    save = (callback) => {
        this.props.form.validateFields((errors, values) =>{
            axios.post(`/sysware/api/se/basicdata/add`, values, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
                if (res.status==200) {
                    message.success("新增成功");
                    callback();
                }
                else{
                    message.error(res.data.message);
                }
            })
        })
    }
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        const nameProps = getFieldProps('column1', {
            initialValue: this.props.baseData.column1,
            rules: [
                { required: true, message: '请输入名称' },
            ],
          });
          const codeProps= getFieldProps('column2', {
            rules: [
                { required: true, message: '请输入识别码' }
            ],
          });
        const descProps = getFieldProps('column3', {
            initialValue: this.props.baseData.column3,
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ],
            onChange:(e)=>{
                this.setState({
                    desc:e.target.value
                })
            }
        });
        const statusProps = getFieldProps('column4', {
            initialValue: this.props.baseData.column4,
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ],
        });
        return (
            <Form inline>
                <FormItem label='名称：' {...twoColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='识别码：' {...twoColLayout}>
                    <Input type="text" {...codeProps} />
                </FormItem>
                <FormItem label='描述：' {...twoColLayout}>
                    <Input type="textarea" maxLength='200' {...descProps} />
                    <p className="form-description-tip">还可输入{200-(this.props.baseData.describe ||this.state.desc ).length>0?200-(this.props.baseData.describe ||this.state.desc ).length:'0'}字</p>
                </FormItem>
            </Form> 
        )
    }
}
DocTypeAdd = Form.create()(DocTypeAdd);

export default DocTypeAdd