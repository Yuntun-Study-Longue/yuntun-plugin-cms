import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import {twoColLayout, fourColLayout, halfFourColLayout, halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn} from "components/layout/formLayout";
import TreeSelect from 'sub-antd/lib/tree-select';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Table from 'sub-antd/lib/table';
import columnConf from 'components/columnConf/columnConf';
import Button from 'sub-antd/lib/button';
import Upload from 'sub-antd/lib/upload';
import Col from 'sub-antd/lib/col';
import message from "sub-antd/lib/message";
import Select from 'sub-antd/lib/select';
const Option = Select.Option;
import './main.scss';

const InputGroup = Input.Group;
const qs = require('querystring');

export default class FilterItem extends Component {
    static defaultProps = {
        label: '',
        orderNum: 1,
        viewAttrRela: [],
        onChange: () => {},
        insertAfterPos: () => {},
        deleteByPos: () => {},
    }
    constructor(props) {
        super(props)
        this.state = {
            baseData: this.props.baseData || this.props['data-__meta'].initialValue,
            viewAttrRela: this.props.viewAttrRela || [],
        }
    }
    componentDidMount() {
        // console.log(this.props.viewAttrRela, '=====')
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.props.viewAttrRela) !== JSON.stringify(nextProps.viewAttrRela)){
            this.setState({ viewAttrRela: nextProps.viewAttrRela });
            return true;
        }
        return false
    }
    add() {
        // console.log('add here', this.props.orderNum)
        this.props.insertAfterPos(this.props.orderNum, this.props.label);
    }
    del() {
        // console.log('del here')
        this.props.deleteByPos(this.props.orderNum, this.props.label);
    }
    onCaluOprateChange(caluOprate) {
        // const caluOprate = option.key;
        const baseData = { ...this.state.baseData, caluOprate };
        this.setState({ baseData }, () => this.props.onChange(this.state.baseData))
        // console.log(option.key, '=== CaluOprate')
    }
    onViewAttrRelaIdChange(viewAttrRelaId) {
        // const viewAttrRelaId = option;
        const baseData = { ...this.state.baseData, viewAttrRelaId }
        this.setState({ baseData }, () => this.props.onChange(this.state.baseData))
        // console.log(option.key, '=== ViewAttrRelaId')
    }
    onArithmeticOprateChange(arithmeticOprate) {
        // const arithmeticOprate = option;
        const baseData = { ...this.state.baseData, arithmeticOprate };
        this.setState({ baseData }, () => this.props.onChange(this.state.baseData))
        // console.log(option.key, '=== ArithmeticOprate')
    }
    onFirstValueChange(e) {
        const firstValue = e.target.value;
        const baseData = { ...this.state.baseData, firstValue };
        this.setState({ baseData }, () => this.props.onChange(this.state.baseData))
        // console.log(e.target.value, '=== FirstValue')
    }
    render() {
        console.log( this.props.viewAttrRela, '=== this.props.viewAttrRela')
        return <div className='condition-item'>
            <InputGroup size="small">
                <Col span="4">
                    { this.props.orderNum > 1 ? <Select size='small' defaultValue={~~this.state.baseData.caluOprate} style={{ display: 'block' }} onChange={this.onCaluOprateChange.bind(this)}>
                            <Option value={0}>并且</Option>
                            <Option value={1}>或者</Option>
                        </Select> : <span>{this.props.label}</span>
                    }
                </Col> 
                <Col span="6">
                    <Select size='small' defaultValue={this.state.baseData.viewAttrRelaId} style={{ display: 'block' }} onChange={this.onViewAttrRelaIdChange.bind(this)}>
                        <Option value={0}>{''}</Option>
                        {this.props.viewAttrRela.filter(o => !!o.attrCode && o.attrCode !== '条目内容').map((item, i) => {
                            // console.log(`${this.props.orderNum}-${item.id}-${i}`, '== log', item)
                            return <Option key={`${this.props.orderNum}-${item.id}-${i}`} value={item.attrId || item.id}>{item.attrCode}</Option>
                        })}
                    </Select>
                </Col>
                <Col span="4">
                    <Select size='small' defaultValue={~~this.state.baseData.arithmeticOprate} style={{ display: 'block' }} onChange={this.onArithmeticOprateChange.bind(this)}>
                      <Option value={0}>等于</Option>
                      <Option value={1}>不等于</Option>
                      <Option value={2}>大于</Option>
                      <Option value={3}>大于等于</Option>
                      <Option value={4}>小于</Option>
                      <Option value={5}>小于等于</Option>
                      <Option value={6}>包含</Option>
                      <Option value={7}>不包含</Option>
                    </Select>
                </Col>
                <Col span="6">
                    <Input defaultValue={this.state.baseData.firstValue} onChange={this.onFirstValueChange.bind(this)} />
                </Col>
                <Col span="4">
                    <div className="opeation-icon" style={{backgroundColor: '#fff'}}>
                        <span title="新增" className="icon icon-add" onClick={this.add.bind(this)}></span>
                        <span title="删除" className="icon icon-del" onClick={this.del.bind(this)}></span>
                    </div>
                </Col>
            </InputGroup>
        </div>
    }
}