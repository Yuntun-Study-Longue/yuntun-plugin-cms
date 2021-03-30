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
import qs from 'querystring';

const InputGroup = Input.Group;
import './main.scss';

export default class Transfer extends Component {
    static defaultProps = {
        viewId: 1,
        listOption: {
            uri: '/sysware/api/viewRela/attrList',
            queryBuilder: (params) => params ? `?${qs.stringify(params)}` : ''
        },
        showListOption: {
            uri: '/sysware/api/viewRela/relaList',
            queryBuilder: params => params ? `?${qs.stringify(params)}` : ''
        },
        onChange: (result) => {
            console.log(this);
            const viewAttrRela = result.map(item => ({ ...item, viewId: this.props.viewId, attrId: item.id }) )
            console.log(viewAttrRela, '=== viewAttrRela')
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            isloading: true,
            query: {
                documentId: qs.parse(location.search.replace('?', '')).id,
                name: null
            },
            selectedRowKeys: [],
            unselectedRowKeys: [],
            dataSource: [],
            selectItems: [],
            cancelItems: [],
            targetSource: [],
        };
    }
    componentWillReceiveProps(nextProp, nextState) {
        if (this.props.viewId !== nextProp.viewId) {
            this.setState({ viewId: nextProp.viewId })
        }
    }
    onChangeSearch(e) {
        const query = { ...this.state.query, name: e.target.value };
        this.setState({ query }, () => this.fetchUnselectedList(this.state.query))
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this)
        this.fetchUnselectedList(this.state.query);
        this.setState({ targetSource: this.props.viewAttrRela }, () => this.injectOrderNum());
    }
    fetchUnselectedList(params) {
        axios.get('/sysware/api/documentTemplateAttr/list' + this.props.listOption.queryBuilder(params)).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({ dataSource: res.data.data.attr, targetSource: res.data.data.tempAttr }, () => console.log(this.state.dataSource));
            }
        })
    }
    injectOrderNum() {
        let max_id = this.state.targetSource.map(item => item.orderNum).reduce((prev, next) => Math.max(~~prev, ~~next), 0);
        
        const targetSource = this.state.targetSource.map(item => {
            if (!item.orderNum) return { ...item, orderNum: ++max_id }

            return item
        })
        console.log(max_id, targetSource);
        this.setState({ targetSource }, () => this.props.onChange(targetSource));
    }
    onSelectSourceChange(selectedRowKeys) {
        const selectItems = this.state.dataSource.filter(o=>selectedRowKeys.includes(o.id))
        this.setState({ selectedRowKeys, selectItems });
    }
    onSelectTargetChange(selectedRowKeys) {
        const cancelItems = this.state.targetSource.filter(o=>selectedRowKeys.includes(o.id))
        console.log(cancelItems,'===cancelItems')
        this.setState({ unselectedRowKeys: selectedRowKeys, cancelItems })
    }
    // onClickReset() {
    //     this.fetchShowList({ viewId: this.state.query.viewId })
    // }
    onClickAddRight() {
        const ids = this.state.targetSource.map(item => item.id)
        const targetSource = [...this.state.targetSource, ...this.state.selectItems.filter(item => !ids.includes(item.id)) ];
        this.setState({ targetSource }, this.injectOrderNum.bind(this));
    }
    onClickAddLeft() {
        const ids = this.state.dataSource.map(item => item.id)
        const dataSource = [...this.state.dataSource, ...this.state.cancelItems.filter(item => !ids.includes(item.id))]
        this.setState({ unselectedRowKeys: [], dataSource, targetSource: this.state.targetSource.filter(o => !this.state.unselectedRowKeys.includes(o.id)) }, () => this.injectOrderNum());
    }
    move(type){
        if(this.state.unselectedRowKeys.length!=1){
          message.warning("请选择一条数据");
          return false;
        } 
        let moveItem = this.state.targetSource.find(item => this.state.unselectedRowKeys.includes(item.id));
        const orderNums = this.state.targetSource.map( item => ~~item.orderNum );
        const prevNum = orderNums.filter( item => item < moveItem.orderNum).reduce((prev, next) => Math.max(prev, next), 0);
        const nextNum = orderNums.filter( item => item > moveItem.orderNum).reduce((prev, next) => Math.min(prev, next), Infinity);

        if (type === 'up') {
            if (!prevNum) return message.warn('第一个无法上移')
            const targetSource = this.state.targetSource.map(item => {
                if (item.orderNum === moveItem.orderNum) {
                    return {...item, orderNum: prevNum }
                }
                else if (item.orderNum === prevNum) {
                    return {...item, orderNum: moveItem.orderNum }
                }
                
                return item
            }).sort((a, b) => a.orderNum - b.orderNum)

            // console.log(targetSource, '=== targetSource');
            this.setState({ targetSource }, () => {
                let prevItem = this.state.targetSource.find(item => item.orderNum === prevNum);
                this.setState({ unselectedRowKeys: [prevItem.id] }, () => this.props.onChange(this.state.targetSource) );
                message.success("上移成功");
            })
        }
        else if (type === 'down') {
            if (!isFinite(nextNum)) return message.warn('最后一个无法下移')
            const targetSource = this.state.targetSource.map(item => {
                if (item.orderNum === moveItem.orderNum) {
                    return {...item, orderNum: nextNum }
                }
                else if (item.orderNum === nextNum) {
                    return {...item, orderNum: moveItem.orderNum }
                }

                return item
            }).sort((a, b) => a.orderNum - b.orderNum)
            // console.log(targetSource, '=== targetSource');
            this.setState({ targetSource }, () => {
                let nextItem = this.state.targetSource.find(item => item.orderNum === nextNum);
                this.setState({ unselectedRowKeys: [nextItem.id] }, () => this.props.onChange(this.state.targetSource));
                message.success("下移成功");
            })
        }
        // moveItem = {...moveItem, opea};
        // console.log(moveItem, '==== move item')
        
    }
    render() {
        const SourceRowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectSourceChange.bind(this),
        };
        const TargetRowSelection = {
            selectedRowKeys:this.state.unselectedRowKeys,
            onChange: this.onSelectTargetChange.bind(this),
            getCheckboxProps: record => ({
                disabled: [9,10,11].includes(record.attrId) ,    // 配置无法勾选的列
            }),
        }
        return (
            <Form inline>
                <div className='clearfix' style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{ width: '45%', float: 'left'}}>
                    <Table scroll={{y:330}} size="small" title={() => <InputGroup size="small">
                        <Col span="6">待选属性:</Col>
                        <Col span="18"><Input type="text" placeholder="输入名称过滤待选列" onChange={this.onChangeSearch.bind(this)} /></Col>
                    </InputGroup>} rowKey={ record => record.id } rowSelection={SourceRowSelection} columns={[
                    {
                        title: '名称',
                        dataIndex: 'attrCode',
                        nowrap: true,
                    }]} dataSource={this.state.dataSource} pagination={false} rowClickMultSelect rowClickCheckToggle/>
                    </div>
                    
                    <div style={{width: '10%', float: 'left', display: 'flex', justifyContent: 'center'}}>
                        <ul>
                            <li style={{margin: '15px 0', textAlign: 'center'}}><Button type="ghost" size="small" icon="caret-right" onClick={this.onClickAddRight.bind(this)} /></li>
                            <li style={{margin: '15px 0', textAlign: 'center'}}><Button type="ghost" size="small" icon="caret-left" onClick={this.onClickAddLeft.bind(this)} /></li>
                        </ul>
                    </div>
                   
                    <div style={{width:'45%', float: 'left'}}>
                        <Table showHeader={true} scroll={{y:330}} title={() => <InputGroup size="small">
                                <Col span="4">导出属性:</Col>
                                <Col span="20">
                                    <div className="opeation-icon">
                                        <span title="上移" className="icon icon-move-up" onClick={this.move.bind(this,'up')}></span>
                                        <span title="下移" className="icon icon-move-down" onClick={this.move.bind(this,'down')}></span>
                                    </div>
                                </Col>
                            </InputGroup>} size="small" rowKey={ record => record.id } rowSelection={TargetRowSelection} columns={[
                            {
                                title: '名称',
                                dataIndex: 'attrCode',
                                nowrap: true,
                            }]} dataSource={this.state.targetSource} pagination={false} rowClickMultSelect rowClickCheckToggle  />
                    </div>
                </div>
            </Form>
            
        );
    }
}