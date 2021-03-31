import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
const FormItem = Form.Item;
import {twoColLayout} from "components/layout/formLayout";

class DocTypeAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                { max: 20, message: '请控制内容长度不超过20个字' },
            ],
          });
          const codeProps= getFieldProps('column2', {
            rules: [
                { required: true, message: '请输入识别码' },
                { max: 20, message: '请控制内容长度不超过20个字' },
            ],
          });
        const descProps = getFieldProps('column3', {
            initialValue: this.props.baseData.column3,
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ]
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
                    <Input.CountDown 
                        type="textarea" 
                        maxTextareaLength={200} 
                        rows={5} 
                        {...descProps}
                    />
                </FormItem>
            </Form> 
        )
    }
}
DocTypeAdd = Form.create()(DocTypeAdd);
export default DocTypeAdd