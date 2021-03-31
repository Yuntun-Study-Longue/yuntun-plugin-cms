import React, { Component } from 'react'
import axios from "axios";
import Form from 'sub-antd/lib/form';
const FormItem = Form.Item;
import Select from 'sub-antd/lib/select';
import SysMemberSelect from 'components/sysMemberSelect'
import {twoColLayout, fourColLayout, halfFourColLayout, halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn} from "components/layout/formLayout";
import {required,max,dmax} from 'components/sysForm/sysRules'
class PermissionsAdd extends Component {
    constructor(props){
        super(props);
        this.state={
            roleList: [],
            roleId:[],
            userIds:'', 
        }
    } 
    componentDidMount() {
        this.props.onRef(this)
        this.fetchRoleList();  
    }

    //获取角色数据
    fetchRoleList() { 
        const params = { 
            name: '', 
        }
        axios.get(`/sysware/api/role/selectRoleList`,{params}).then(res => {
            if (res.data.code == 200) {
                this.setState({
                    roleList: res.data.data
                });
            } 
        }).catch(error => {
        }) 
    }
    submit=(cb)=>{
        if(this.props.nodeType === 'role'){
            this.props.form.validateFields((errors, values) =>{
                if (!!errors) {
                    console.log('Errors in form!!!', errors);
                    return;
                }
                cb({roleIdParams:values.roleIdParams.join(',')})
            })
        }else{
            const userIds = this.memberSelect.$shuttle.state.rightDataSource.map(item=>item.userId); 
            cb({userIds})
        }
    } 

    render() {  
        const {getFieldProps} = this.props.form;
        return (
            <div >
                {
                    this.props.nodeType == 'role' ?
                    <Form inline style={{paddingBottom:10}}>
                        <FormItem label="角色" {...twoColLayout}>
                            <Select 
                            multiple 
                            showSearch 
                            noLabelDel
                            tagsNoWrap
                            placeholder="请选择角色" 
                            notFoundContent="无角色" 
                            optionFilterProp="children" 
                            {...getFieldProps('roleIdParams', {
                                rules: [required],
                            })}
                            >
                                {this.state.roleList.map(item => {
                                    return <Select.Option key={item.roleId} value={item.roleId}>{item.roleName}</Select.Option>
                                })}
                            </Select>
                        </FormItem>
                    </Form>
                    : 
                    <SysMemberSelect  ref={(el)=>this.memberSelect=el} />
                }
            </div>
        )
    }
}
PermissionsAdd = Form.create()(PermissionsAdd);
export default PermissionsAdd