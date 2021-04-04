import React, { Component } from 'react'
import { Form } from 'antd';
const FormItem = Form.Item;
import Input from 'sub-antd/lib/input';
import {halfFourColLayout,fourColLayout,twoColLayout} from "components/layout/formLayout";
import {required,max,dmax} from 'components/sysForm/sysRules';
export class EnumItemAdd extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [required,max(20)],
        });
        const descProps = getFieldProps('describe', {
            rules: [dmax(200)]
        });
        return (
            <Form inline>
                <FormItem label='名称：' {...twoColLayout}>
                    <Input type="text" {...nameProps} />
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
// EnumItemAdd = Form.create()(EnumItemAdd);
export default EnumItemAdd
