import React, { Component } from 'react'
import axios from 'axios'
import qs from 'querystring'
import { Form } from 'antd'
const FormItem = Form.Item
import Input from 'sub-antd/lib/input'
import Select from 'sub-antd/lib/select'
import TreeSelect from 'sub-antd/lib/tree-select'
const TreeNode = TreeSelect.TreeNode
import Checkbox from 'sub-antd/lib/checkbox'
import SysShuttle from 'components/sysShuttle'
export class SysMemberSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleList: [],
            treeData: [],
            data: [],
            isloading: true,
            params:{}
        }
    }
    componentDidMount(){
        this.fetchDepartList()
        this.fetchRoleList()
    }
    
    fetchDepartList=()=>{
        axios.get('/sysware/api/dept/queryDept?id=0').then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({treeData: res.data.data});
            }
        })
    }
    getData=(node)=>{
        return new Promise((resolve) => {
            axios.get(`/sysware/api/dept/queryDept?id=${node.props.value}`).then(res => {
                if (res.data.code == 200 || !res.data.code) {
                    const data = res.data.data;
                    if (data) {
                        const selectNode = this.state.treeData.find(item => item.id === node.props.value);
                        selectNode.children = data;
                        this.setState({ isloading: false, treeData: this.state.treeData},()=>{
                            resolve()
                        })
                    }
                }
            })
        })
    }
    onChange=(value)=>{
        this.setState({ data: value,params:{...this.state.params,department:value.value}});
    }
    fetchRoleList=()=>{
        axios.get('/sysware/api/role/selectRoleList').then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({roleList: res.data.data});
            }
        })
    }
    searchIncludeSubTeam=(e)=>{
        this.setState({params:{...this.state.params,includeSubTeam:e.target.checked?1:0}})
    }
    searchByRole=(ids)=>{
        this.setState({params:{...this.state.params,roleId:ids.join(',')}})
    }
    searchByName=(e)=>{
        this.setState({params:{...this.state.params,name:e.target.value}})
    }
    render() {
        const columns = [
            {
                title: "姓名",
                dataIndex: "userName",
                nowrap: true,
            },
            {
                title: "登录名",
                width:100,
                dataIndex: "loginName",
                nowrap: true,
            },
        ];
        const formColLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            style: { width: "70%" },
        }
        const formColLayoutSub = {
            style: { width: "30%",float:"right",paddingTop:8},
        }
        const loop = data =>{ 
            return data.map((item) => {
            if (item.children) {
                return <TreeNode value={item.id} title={item.text} key={item.id}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode value={item.id} title={item.text} key={item.id} isLeaf={item.leaf} />;
        })};
        const treeNodes = loop(this.state.treeData);
        return (
            <div style={{width:640,margin:'10px auto'}}>
                <Form inline>
                    <FormItem label="部门" {...formColLayout}>
                        <TreeSelect
                            value={this.state.data}
                            labelInValue
                            // treeCheckable
                            forceShowValue
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择部门"
                            loadData={this.getData}
                            onChange={this.onChange}
                            async noLabelDel
                            isloading={this.state.isloading}
                        >{treeNodes}</TreeSelect>
                    </FormItem>
                    <FormItem {...formColLayoutSub}>
                        <Checkbox 
                            checked={this.state.params.includeSubTeam}
                            onChange={this.searchIncludeSubTeam}
                        />
                        <label> 包含子部门</label>
                    </FormItem>
                    <FormItem label="角色" {...formColLayout}>
                        <Select 
                            multiple 
                            showSearch 
                            noLabelDel
                            tagsNoWrap
                            placeholder="请选择角色" 
                            notFoundContent="无角色" 
                            optionFilterProp="children" 
                            onChange={this.searchByRole}
                        >
                            {this.state.roleList.map(item => {
                                return <Select.Option key={item.roleId} value={item.roleId}>{item.roleName}</Select.Option>
                            })}
                        </Select>
                    </FormItem> 
                    <FormItem label="姓名" {...formColLayout}>
                        <Input onChange={this.searchByName} />
                    </FormItem>
                </Form>   
                <SysShuttle 
                    ref = {el => this.$shuttle = el}
                    dataUrl={`/sysware/api/user/selectUserList?${qs.stringify(this.state.params)}`}
                    rowKey="userId"
                    leftColumns={columns}
                    rightColumns={columns}
                />
            </div>
        )
    }
}
export default SysMemberSelect
