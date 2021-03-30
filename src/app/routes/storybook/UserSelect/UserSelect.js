"use strict";
import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import {twoColLayout, fourColLayout, halfFourColLayout, halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn} from "components/layout/formLayout";
import TreeSelect from 'sub-antd/lib/tree-select';
import Select from 'sub-antd/lib/select';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Table from 'sub-antd/lib/table';
import columnConf from 'components/columnConf/columnConf';
import Button from 'sub-antd/lib/button';
import Upload from 'sub-antd/lib/upload';
import './main.scss';
import qs from 'querystring';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;

const root = [{
  text: '节点一',
  value: '0-0',
  id: '0-0',
  children: [],
}, {
  text: '节点二',
  value: '0-1',
  id: '0-1',
  isLeaf: true,
}];

export default class UserSelect extends Component {
    static defaultProps = {
        selectOption: {
            uri: '/sysware/api/dept/queryDept',
            queryBuilder: (params) => params ? `?${qs.stringify(params)}` : ''
        },
        listOption: {
            uri: '/sysware/api/user/selectUserList',
            queryBuilder: (params) => params ? `?${qs.stringify(params)}` : ''
        },
        roleListOption: {
            uri: '/sysware/api/role/selectRoleList',
            queryBuilder: (params) => params ? `?${qs.stringify(params)}` : ''
        }
    } 
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],
            data: [],
            isloading: true,
            query: {
                department: 0,
                includeSubTeam: false,
                name: '',
                roleId: ''
            },
            selectedRowKeys: [],
            unselectedRowKeys: [],
            dataSource: [],
            selectItems: [],
            cancelItems: [],
            targetSource: [],
            roleList: [],
        };
    }
    onChange(value) {
        this.setState({ data: value });
    }
    componentDidMount() {
        this.fetchData(0).then(data => this.setState({ isloading: false, treeData: data }));
        this.fetchRoleList()
    }
    fetchData(id) {
        return new Promise((resolve) => {
            axios.get(this.props.selectOption.uri + this.props.selectOption.queryBuilder({ id })).then(res => {
                if (res.data.code == 200 || !res.data.code) {
                    resolve(res.data.data)
                }
            })
        });
    }
    fetchDepartList(query) {
        axios.get(this.props.listOption.uri+this.props.listOption.queryBuilder(query)).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({dataSource: res.data.data.resultSet}, () => console.log(this.state.dataSource));
            }
        })
    }
    fetchRoleList(query) {
        axios.get(this.props.roleListOption.uri+this.props.roleListOption.queryBuilder(query)).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({roleList: res.data.data}, () => console.log(this.state.roleList));
            }
        })
    }
    getData(e) {
        this.fetchData(e.props.value).then(data => {
            if (data) {
                const selectNode = this.state.treeData.find(item => item.id === e.props.value);
                selectNode.children = data;
                this.setState({ isloading: false, treeData: [selectNode] })
            }
            console.log(data, '=== data')
        });
    }
    getSelect(selectedId) {
        const query = {...this.state.query, department: selectedId };
        this.setState({ query }, () => this.fetchDepartList(this.state.query));
    }
    searchByName(e) {
        const query = {...this.state.query, name: e.target.value };
        this.setState({ query }, () => this.fetchDepartList(this.state.query));
    }
    searchIncludeSubTeam(e) {
        const query = {...this.state.query, includeSubTeam: e.target.checked };
        this.setState({ query }, () => this.fetchDepartList(this.state.query));
    }
    onSelectSourceChange(selectedRowKeys) {
        const selectItems = this.state.dataSource.filter(o=>selectedRowKeys.includes(o.userId))
        this.setState({ selectedRowKeys, selectItems });
    }
    onSelectTargetChange(selectedRowKeys) {
        const cancelItems = this.state.targetSource.filter(o=>selectedRowKeys.includes(o.userId))
        this.setState({ unselectedRowKeys: selectedRowKeys, cancelItems })
    }
    onClickShowhandRight() {
        this.setState({ targetSource: this.state.dataSource });
    }
    onClickShowhandLeft() {
        this.setState({ targetSource: [] });
    }
    onClickAddRight() {
        this.setState({ targetSource: this.state.selectItems });
    }
    onClickAddLeft() {
        this.setState({ targetSource: this.state.targetSource.filter(o => !this.state.unselectedRowKeys.includes(o.userId)) });
    }
    handleRoleChange(roleIds) {
        const query = {...this.state.query, roleId: roleIds.join(',') };
        this.setState({ query }, () => this.fetchDepartList(this.state.query));
    }
    render() {
        const loop = data => data.map((item) => {
            if (item.children) {
                return <TreeNode value={item.id} title={item.text} key={item.id}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode value={item.id} title={`${item.text}`} key={item.id} isLeaf={item.leaf} />;
        });
        const SourceRowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectSourceChange.bind(this),
        };
        const TargetRowSelection = {
            selectedRowKeys:this.state.unselectedRowKeys,
            onChange: this.onSelectTargetChange.bind(this),
        }
        const treeNodes = loop(this.state.treeData);
        return (
            <Form inline>
                 <FormItem label="部门" {...halfFourColLayout}>
                    <TreeSelect style={{ width: 300 }}
                        value={this.state.data}
                        allowClear
                        noLabelDel
                        onSelect={this.getSelect.bind(this)}
                        treeCheckStrictly
                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                        // treeCheckable
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择"
                        loadData={this.getData.bind(this)}
                        onChange={this.onChange.bind(this)}
                        async
                        isloading={this.state.isloading}
                    >{treeNodes}</TreeSelect>
                </FormItem>
                <FormItem label='包含子部门' {...halfFourColLayout}>
                    <Checkbox checked={this.state.query.includeSubTeam} onChange={this.searchIncludeSubTeam.bind(this)}/>
                </FormItem>
                <FormItem label="角色" {...halfFourColLayout}>
                   <Select multiple showSearch style={{ width: 300 }} placeholder="请选择角色" notFoundContent="无角色" optionFilterProp="children" onChange={this.handleRoleChange.bind(this)}>
                       {this.state.roleList.map(item => {
                            return <Select.Option value={item.roleId}>{item.roleName}</Select.Option>
                       })}
                   </Select>
                </FormItem> 
                <FormItem label="姓名" {...fourColLayout}>
                    <Input placeholder="" onChange={this.searchByName.bind(this)} />
                </FormItem>

                <div className='clearfix' style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{ width: '60%', float: 'left'}}>
                    <Table scroll={{y:330}} size="small" title={() => '用户列表'} rowKey={ record => record.userId } rowSelection={SourceRowSelection} columns={columnConf['Modal_Table_Requirement_User_Select']} dataSource={this.state.dataSource} pagination={false} rowClickMultSelect rowClickCheckToggle/>
                    </div>
                    
                    <div style={{width: '10%', float: 'left', display: 'flex', justifyContent: 'center'}}>
                        <ul>
                            <li style={{margin: '5px 0'}}><Button type="ghost" icon="forward" onClick={this.onClickShowhandRight.bind(this)} /></li>
                            <li style={{margin: '5px 0'}}><Button type="ghost" icon="caret-right" onClick={this.onClickAddRight.bind(this)} /></li>
                            <li style={{margin: '5px 0'}}><Button type="ghost" icon="caret-left" onClick={this.onClickAddLeft.bind(this)} /></li>
                            <li style={{margin: '5px 0'}}><Button type="ghost" icon="backward" onClick={this.onClickShowhandLeft.bind(this)} /></li>
                        </ul>
                    </div>
                   
                    <div style={{width:'30%', float: 'left'}}>
                        <Table showHeader={false} scroll={{y:330}} title={() => '已选用户'} size="small" rowKey={ record => record.userId } rowSelection={TargetRowSelection} columns={[{ title: '用户名', dataIndex: 'userName', nowrap: true }]} dataSource={this.state.targetSource} pagination={false} rowClickMultSelect rowClickCheckToggle  />
                    </div>
                </div>
                {/* <Input addonAfter={<Upload>
                    <span>点击上传</span>
                </Upload>} /> */}
            </Form>
            
        );
    }
}