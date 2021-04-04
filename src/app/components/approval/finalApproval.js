import React, { Component } from 'react';

import SingleApproval from './singleApproval'
import ManyApproval from './manyApproval'

import './approval.scss'

/**
 * 决审
 */
export default class FinalApproval extends Component{
    constructor (props) {
        super(props);
        this.state={
            submitData:{
                participateId: "",    //参与人id
                check: false,   //是否选中跳过 --默认不选中
                activityId: "" ,    //节点id
                roleId: "", // 角色ID
                departmentId: "",   //部门ID
                chargedUserId: "",  //决审人ID（决审会签特有属性）单独保存，用于与单审进行区别，取了此值就不要再去取selectValue
            }
        }
    }

    componentDidMount () {
        const { dataSource } = this.props;
        const attributes = dataSource.attributes;
        this.state.submitData = {
            ...this.state.submitData,
            activityId: dataSource.activityId,
            roleId: attributes.roleId,
            departmentId: attributes.departmentId
        }
    }

    updateManySelect (e) {  //单人审批的跳过控制多人审批控件的使用与否
        this.manyApproval.checkChange(e);
    }

    update (obj, flag) {  //用于更新对应数据
        if ("1" === flag) {
            this.state.submitData = {
                ...this.state.submitData,
                check: obj.check,
                chargedUserId: obj.chargedUserId
            }
        } else {
            this.state.submitData = {
                ...this.state.submitData,
                participateId: obj.participateId,
                isErr: obj.isErr,
            }
        }
        this.props.update(this.state.submitData);
    }

    render () {
        const {FormItem, formItemLayout, dataSource} = this.props;
        return (
            <div>
                <SingleApproval
                    FormItem={FormItem}
                    formItemLayout={formItemLayout}
                    parentId="1"
                    update = {obj=>this.update(obj,"1")}
                    dataSource = {this.props.dataSource}
                    updateCheck={(e)=>this.updateManySelect(e)}
                    form={this.props.form}
                />
                <ManyApproval
                    ref ={node=>this.manyApproval=node}
                    FormItem={FormItem}
                    formItemLayout={formItemLayout}
                    parentId="1"
                    update = {obj=>this.update(obj,"2")}
                    dataSource = {this.props.dataSource} 
                    form={this.props.form}
                />
            </div>
        )
    }
}