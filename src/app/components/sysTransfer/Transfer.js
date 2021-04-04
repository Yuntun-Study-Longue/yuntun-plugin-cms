import React, { Component } from 'react';
import Row from 'sub-antd/lib/row';
import Col from 'sub-antd/lib/col';
import { Form } from 'antd';
import axios from 'axios';
import Input from 'sub-antd/lib/input';
import Table from 'sub-antd/lib/table';
import Button from 'sub-antd/lib/button';
import message from "sub-antd/lib/message";
import qs from 'querystring';
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import SysIcon from "components/sysIcon";

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
            // console.log(this);
            // const viewAttrRela = result.map(item => ({ ...item, viewId: this.props.viewId, attrId: item.id }) )
            // console.log(viewAttrRela, '=== viewAttrRela')
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
    onChangeSearch(e) {
        const query = { ...this.state.query, name: e.target.value };
        this.setState({ query }, () => this.fetchUnselectedList(this.state.query))
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this)
        this.fetchUnselectedList(this.state.query);
        // this.setState({ targetSource: this.props.viewAttrRela }, () => this.injectOrderNum());
    }
    fetchUnselectedList(params) {
        axios.get('/sysware/api/documentTemplateAttr/list' + this.props.listOption.queryBuilder(params)).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({ dataSource: res.data.data.attr, targetSource: res.data.data.tempAttr }, () => console.log(this.state.dataSource));
            }
        })
    }
    injectOrderNum() {
       
    }
    onSelectSourceChange(selectedRowKeys) {
        const selectItems = this.state.dataSource.filter(o=>selectedRowKeys.includes(o.id))
        this.setState({ selectedRowKeys, selectItems });
    }
    onSelectTargetChange(selectedRowKeys) {
        const cancelItems = this.state.targetSource.filter(o=>selectedRowKeys.includes(o.id))
        this.setState({ unselectedRowKeys: selectedRowKeys, cancelItems })
    }
    onClickAddRight(record) {
        const ids = this.state.targetSource.map(item => item.id)
        let submitData = this.state.selectItems.map(item => {
            return { attrId: item.id, documentId: item.documentId, attrName: item.attrCode, attrType: item.attrType }
        });
        if(record.id) submitData = [{ attrId: record.id, documentId: record.documentId, attrName: record.attrCode, attrType: record.attrType }];
        axios.post('/sysware/api/documentTemplateAttr/add', submitData).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                const targetSource = [...this.state.targetSource, ...res.data.data ];
                this.setState({ targetSource }, () => {
                    this.injectOrderNum(); 
                    this.fetchUnselectedList(this.state.query);
                    message.success('属性新增成功')
                });
            }
        })
    }
    onClickAddLeft(record) {
        const ids = this.state.dataSource.map(item => item.id)
        let submitData = this.state.unselectedRowKeys;
        if(record.id) submitData = [record.id];
        this.setState({ unselectedRowKeys: [], targetSource: this.state.targetSource.filter(o => {
            if(record.id)!record.id === o.id;
            !this.state.unselectedRowKeys.includes(o.id)
        })}, 
        () => {
            this.injectOrderNum();
            axios.post('/sysware/api/documentTemplateAttr/del', submitData).then(res => {
                if (res.data.code == 200 || !res.data.code) {
                    this.fetchUnselectedList(this.state.query);
                    message.success('属性删除成功')
                }
            })
        });
    }
    move(type){
        if(this.state.unselectedRowKeys.length!=1){
          message.warning("请选择一条数据");
          return false;
        } 
        let moveItem = this.state.targetSource.find(item => this.state.unselectedRowKeys.includes(item.id));
        const submitData = {
            id: moveItem.id,
            documentId: qs.parse(location.search.replace('?', '')).id,
            type,
        };
        axios.get('/sysware/api/documentTemplateAttr/move', { params: submitData }).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                message.success('属性移动成功')
                this.fetchUnselectedList(this.state.query);
            }
        })
    }
    render() {
        const SourceRowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectSourceChange.bind(this),
        };
        const TargetRowSelection = {
            selectedRowKeys:this.state.unselectedRowKeys,
            onChange: this.onSelectTargetChange.bind(this),
        }
        return (
            <div className="sys-transfer">
                <div className="tool-bar fl">
                    <Row>
                        <Col span={6}>待选属性:</Col>
                        <Col span={18}>
                            <Input 
                                type="text" 
                                placeholder="输入名称过滤待选列" 
                                onChange={this.onChangeSearch.bind(this)} 
                            />
                        </Col>
                    </Row>
                </div>    
                <div className="tool-bar fr">
                    导出属性:
                    <SysButton
                        title="上移"
                        icon="moveup"
                        onClick={this.move.bind(this,'up')}
                    />
                    <SysButton
                        title="下移"
                        icon="movedown"
                        onClick={this.move.bind(this,'down')}
                    />
                </div>
                <div className="sys-transfer-left fl">
                    <Table scroll={{y:339}} size="small" 
                        rowKey={ record => record.id } 
                        rowSelection={SourceRowSelection} 
                        columns={[
                            {
                                title: '名称',
                                dataIndex: 'attrCode',
                                nowrap: true,
                            }]} 
                        dataSource={this.state.dataSource} 
                        pagination={false} 
                        rowClickMultSelect
                        rowClickCheckToggle
                        onRowDoubleClick={this.onClickAddRight.bind(this)}
                    />
                </div>
                <div className="sys-transfer-center fl">
                    <div className="sys-transfer-operation">
                        <Button
                            type="ghost"
                            size="small"
                            onClick={this.onClickAddRight.bind(this)}
                        ><SysIcon name="double-right"/></Button>
                        <Button
                            type="ghost"
                            size="small"
                            onClick={this.onClickAddLeft.bind(this)}
                        ><SysIcon name="double-left"/></Button>
                    </div>
                </div>
                <div className="sys-transfer-right fl">
                    <Table showHeader={true} scroll={{y:339}} 
                        size="small" 
                        rowKey={ record => record.id } 
                        rowSelection={TargetRowSelection} 
                        columns={[
                            {
                                title: '名称',
                                dataIndex: 'attrName',
                                nowrap: true,
                            }]} 
                        dataSource={this.state.targetSource} 
                        pagination={false} 
                        rowClickMultSelect 
                        rowClickCheckToggle  
                        onRowDoubleClick={this.onClickAddLeft.bind(this)}
                    />
                </div>
            </div>
        );
    }
}