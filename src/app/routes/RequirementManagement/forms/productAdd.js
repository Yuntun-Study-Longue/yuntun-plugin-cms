import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import {twoColLayout, fourColLayout, halfFourColLayout, halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn} from "components/layout/formLayout";
import {required,max,dmax} from 'components/sysForm/sysRules'
const FormItem = Form.Item;
class ProductAdd extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        const nameProps = getFieldProps("name", {
            rules: [required,max(50)],
            trigger: "onBlur",
        });
        const codenameProps = getFieldProps("code", {
            rules: [required,max(50)],
            trigger: "onBlur",
        });
        const descProps = getFieldProps("desc", {
            rules: [dmax(200)],
        });
        return (
            <Form inline>
                <FormItem label="名称" {...twoColLayout}>
                    <Input placeholder="请输入名称" {...nameProps} />
                </FormItem>
                <FormItem label="代号" {...twoColLayout}>
                    <Input placeholder="请输入代号" {...codenameProps} />
                </FormItem>
                <FormItem label="描述" {...twoColLayout}>
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
ProductAdd = Form.create()(ProductAdd);
export default ProductAdd