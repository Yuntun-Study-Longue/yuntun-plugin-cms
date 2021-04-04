import React, {Component} from 'react'
import { Form } from 'antd';
const FormItem = Form.Item;
function SysForm (props){
    const children = props.children.length?props.children:[props.children];
    return (
        <Form inline autoComplete="off">
            {children.map((item,index)=>{
                return (
                    <FormItem key={item.props.label} {...item.props}>
                        {item.props.children}
                    </FormItem>
                )
            })}
        </Form>
    )
}
function SysFormItem(props){
    return (
        <div>
            {props.children}
        </div>
    )
}
SysForm.Item = SysFormItem;
SysForm.create = Form.create;
export default SysForm