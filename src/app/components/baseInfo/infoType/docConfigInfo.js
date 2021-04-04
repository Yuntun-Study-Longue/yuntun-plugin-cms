import React, { Component } from 'react';
import ModalTable from 'components/modal/table/Table';
import axios from 'axios';
import Cookies from 'js-cookie';
import { type, scope, changeitem, selectType, createhistory,extendType } from '../constants/enumtype';
import {halfFourColLayout,fourColLayout,halfFourColLayoutFn,fourColLayoutFn} from "components/layout/formLayout";
import { Form } from 'antd';
const FormItem = Form.Item;

export default class EnumInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
          baseData: this.props.baseData
        }
    }
    componentDidMount() {
        this.fetchDetail(this.props.baseData.id);
    }
    UNSAFE_componentWillReceiveProps(nextProp, nextState) {
        this.props.baseData.id !== nextProp.baseData.id && this.fetchDetail(nextProp.baseData.id)
    }
    fetchDetail(id) {
        const Authorization = Cookies.get('Authorization');
        axios.get(`/sysware/api/docu/queryDetail?id=${id}`, { headers: { 'Authorization': Authorization}}).then(res => {
            this.setState({ baseData: {...this.state.baseData, ...res.data.data } }, () => console.log(this.state.baseData, '=== base data'));
        })
    }
    render() {
        return (
            <Form inline>
                <FormItem label='名称：' {...halfFourColLayout}>{this.state.baseData.attrCode}</FormItem>
                <FormItem label='作用范围：' {...halfFourColLayout}>{scope(this.state.baseData.scope)}</FormItem>
                <FormItem label='内置/扩展' {...halfFourColLayout}>{extendType(this.state.baseData.extendType)}</FormItem>
                <FormItem label='触发条目变更：' {...halfFourColLayout}>{changeitem(this.state.baseData.changeItem)}</FormItem>
                <FormItem label='数据类型：' {...halfFourColLayout}>{type(this.state.baseData.attrType)}</FormItem>
                <FormItem label='生成历史记录：' {...halfFourColLayout}>{createhistory(this.state.baseData.createHistory)}</FormItem>
                <FormItem label='选择方式：' {...halfFourColLayoutFn(
                    [5,6].includes( this.state.baseData.attrType)?{}:{display:'none'}
                )}>{selectType(this.state.baseData.multiType)}</FormItem>
                <FormItem label='枚举值：' {...fourColLayoutFn(
                    [5,6].includes( this.state.baseData.attrType)?{}:{display:'none'}
                )}>{ this.state.baseData.docuExtends ? <ModalTable initialValue={this.state.baseData.docuExtends} /> : '' }</FormItem>
                <FormItem label='描述：' {...fourColLayout}>{this.state.baseData.describe}</FormItem>
            </Form>
        )
    }
}