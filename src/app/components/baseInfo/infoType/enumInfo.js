import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import ModalTable from 'components/modal/table/Table';
import axios from 'axios';
import Cookies from 'js-cookie';
import { type, scope, changeitem, selectType, createhistory } from '../constants/enumtype';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
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
    componentWillReceiveProps(nextProp, nextState) {
        this.props.baseData.id !== nextProp.baseData.id && this.fetchDetail(nextProp.baseData.id)
    }
    fetchDetail(id) {
        const Authorization = Cookies.get('Authorization');
        axios.get(`/sysware/api/org-udef/queryDetail?id=${id}`, { headers: { 'Authorization': Authorization}}).then(res => {
            this.setState({ baseData: {...this.state.baseData, ...res.data.data } }, () => console.log(this.state.baseData, '=== base data'));
        })
    }
    render() {
        return (
            <Form inline>
                <FormItem label='名称：' {...halfFourColLayout}>{this.state.baseData.attrCode}</FormItem>
                <FormItem label='作用范围：' {...halfFourColLayout}>{scope(this.state.baseData.scope)}</FormItem>
                <FormItem label='数据类型：' {...halfFourColLayout}>{type(this.state.baseData.attrType)}</FormItem>
                <FormItem label='触发条目变更：' {...halfFourColLayout}>{changeitem(this.state.baseData.changeItem)}</FormItem>
                <FormItem label='选择方式：' {...halfFourColLayout}>{selectType(this.state.baseData.multiType)}</FormItem>
                <FormItem label='生成历史记录：' {...halfFourColLayout}>{createhistory(this.state.baseData.createHistory)}</FormItem>
                <FormItem label='枚举值：' {...fourColLayout}>{ this.state.baseData.orgExtends ? <ModalTable initialValue={this.state.baseData.orgExtends} /> : '' }</FormItem>
                <FormItem label='描述：' {...fourColLayout}><p className='ellips-describe'>{this.state.baseData.describe}</p></FormItem>
            </Form>
        )
    }
}