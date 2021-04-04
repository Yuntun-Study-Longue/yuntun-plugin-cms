import React, { Component } from 'react';
import { Form } from 'antd';
import { type, scope, changeitem, selectType, createhistory } from '../constants/enumtype';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
const FormItem = Form.Item;
export default class LongTextInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Form inline>
               <FormItem label='名称：' {...halfFourColLayout}>{this.props.baseData.attrCode}</FormItem>
               <FormItem label='作用范围：' {...halfFourColLayout}>{scope(this.props.baseData.scope)}</FormItem>
               <FormItem label='数据类型：' {...halfFourColLayout}>{type(this.props.baseData.attrType)}</FormItem>
               <FormItem label='触发条目变更：' {...halfFourColLayout}>{changeitem(this.props.baseData.changeItem)}</FormItem>
               <FormItem label='生成历史记录：' {...halfFourColLayout}>{createhistory(this.props.baseData.createHistory)}</FormItem>
               <FormItem label='描述：' {...fourColLayout}><p>{this.props.baseData.describe}</p></FormItem>
            </Form>
        )
    }
}