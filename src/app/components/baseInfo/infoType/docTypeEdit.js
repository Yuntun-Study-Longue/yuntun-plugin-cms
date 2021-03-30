import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Select from 'sub-antd/lib/select';
import Radio from 'sub-antd/lib/radio';
import message from 'sub-antd/lib/message';
import axios from 'axios';
import Cookies from 'js-cookie';
import {twoColLayout} from "components/layout/formLayout";
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

class DocTypeEdit extends Component {
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
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        const nameProps = getFieldProps('column1', {
            initialValue: this.props.baseData.column1,
            rules: [
                { required: true, message: '请输入名称' },
            ],
          });
          const codeProps= getFieldProps('column2', {
            initialValue: this.props.baseData.column2,
            rules: [
                { required: true, message: '请输入识别码' }
            ],
          });
        const descProps = getFieldProps('column3', {
            initialValue: this.props.baseData.column3,
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ],
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
                <FormItem label='状态：' {...twoColLayout}>
                    <RadioGroup {...statusProps}>
                        <Radio key="a" value={'正常'}>正常</Radio>
                        <Radio key="b" value={'作废'}>作废</Radio>
                    </RadioGroup>
                </FormItem>
            </Form> 
        )
    }
}
DocTypeEdit = Form.create()(DocTypeEdit);

export default DocTypeEdit