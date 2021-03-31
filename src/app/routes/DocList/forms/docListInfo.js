import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
const FormItem = Form.Item;
import {halfFourColLayout,fourColLayout,halfFourColLayoutFn,fourColLayoutFn} from "components/sysLayout/formLayout";

function DocListInfo (props){
 
    console.log(props)
    return (
        <Form inline>
            <FormItem label='文档名称：' {...halfFourColLayout}>{props.baseData.fileName}</FormItem><br />
            <FormItem label='创建时间' {...halfFourColLayout}>{props.baseData.createTimeStr}</FormItem>
            <FormItem label='创建人' {...halfFourColLayout}>{props.baseData.creator}</FormItem>
            <FormItem label='文档基线' {...halfFourColLayout}>{props.baseData.documentVersion}</FormItem>
            <FormItem label='文档密级' {...halfFourColLayout}>{props.baseData.securityName}</FormItem>
            <FormItem label='状态' {...halfFourColLayout}>{props.baseData.templateStatusName}</FormItem>
            <FormItem label='文档说明：' {...fourColLayout}>{props.baseData.desc}</FormItem>
        </Form>
    )
}
export default DocListInfo