import React, { Component } from 'react';

import axios from "axios";

import Select from 'sub-antd/lib/select';
import Checkbox from 'sub-antd/lib/checkbox';

const Option = Select.Option;

import './approval.scss'

/**
 * 单人审批
 */
export default class SingleApproval extends Component{
    constructor (props) {
        super(props);
        this.state={
            opList: [], //option集合
            disable: false,     //表示select是否被禁用
            name: "",   //lable
            hasCheck: false,    //是否有跳过按钮
            isOnlyOne: false,    //是否是直接选人方式
            submitData:{
                participateId: [],    //select选中的值---用户id的list
                check: false,   //是否选中跳过 --默认不选中
                activityId: "" ,    //节点id
                roleId: "", // 角色ID
                departmentId: "",   //部门ID
                chargedUserId: "",  //决审人ID（决审会签特有属性）单独保存，用于与单审进行区别，取了此值就不要再去取selectValue
            }
        }
    }

    componentDidMount () {
        this.getData();
    }

    getData () {    //获取数据
        const data = this.props.dataSource;
        const attributes = data.attributes;
        const operateType = attributes.operateType;
        const { parentId } = this.props;
        let participantId = "";
        let participantName = "";
        if ("0" === parentId) { //送审页面调用
            participantId = attributes.participantId;
            participantName = attributes.participantName;
        } else {    //决审页面调用
            participantId = attributes.chargedUserId;
            participantName = attributes.chargedUserName;
        }
        if ("1" === operateType) {  //直接选择审核人
            this.setState({
                isOnlyOne: true,
                opList: [{name: participantName, value: participantId}]
            })
        } else if ("5" === operateType) {   //5:选择发起人部门领导
            const ids = participantId.split(",");
            const names = participantName.split(",");
            let opList = [];
            ids.forEach((item, index)=>{
                opList.push({name: names[index], value: item});
            })
            if (ids.length > 1) {   //如果部门领导大于1，则直接去掉默认值
                participantId = "";
            }
            this.setState({
                isOnlyOne: true,
                opList,
            })
        } else if ("customOperateType" === operateType ) {  //自定义操作，固定的选人(只有单人才会有这个)
            let opList = [];
            const map = attributes.customUserMap;
            for (let key in map) {
                opList.push({name: map[key], value: key});
            }
            this.setState({
                isOnlyOne: true,
                opList
            })
        } else {
            let params = "";
            params = `deepDeptId=${attributes.departmentId}&roleId=${attributes.roleId}&limit=50&containSelf=true`
            axios.get(globalInitConfig.eap_url+`eap/api/componentQuery/user.action?${params}`).then(res=>{
                const data = res.data;
                if (1 === data.code) {
                    const resultSet = data.result.resultSet;
                    let opList = [];
                    resultSet.forEach(item => {
                        opList[opList.length] = {name:item.userName,value:item.userId};
                    });
                    this.setState({ opList });
                }
            }).catch ( error=>{
                console.log(error);
            });
        }


        this.setState({
            name: data.activityName,
            hasCheck: "1" === attributes.allowStep ? true: false,
            submitData:{
                ...this.state.submitData,
                participateId: function(){
                    if( participantId ){
                        return [{
                            key : participantName,
                            value : participantId
                        }]
                    }
                    return [];
                }(),
                activityId: data.activityId ,
                roleId: attributes.roleId,
                departmentId: attributes.departmentId,
                chargedUserId: attributes.chargedUserId ? attributes.chargedUserId : "",
            }
        },()=>{
            this.props.update(this.state.submitData);
        })
    }

    checkChange (e) {
        const flag = e.target.checked;
        this.setState({ submitData:{...this.state.submitData, check: flag }},()=>{
            this.props.update(this.state.submitData);
        });
        if (flag) {
            this.setState({ disable: true });
        }else {
            this.setState({ disable: false });
        }
        this.props.form.resetFields();
        if (this.props.updateCheck) {
            this.props.updateCheck(e);
        }
    }

    onSearch(value){
        const data = this.props.dataSource;
        const attributes = data.attributes;
        //修改错误提示页面
        this.state.isErr = false;
        this.setState({searchValue:value})
        axios.get(globalInitConfig.eap_url+`eap/api/componentQuery/user.action?name=${value}&deepDeptId=${attributes.departmentId}&roleId=${attributes.roleId}&limit=50&containSelf=true`).then(res=>{
            const data = res.data;
            if (1 === data.code) {
                const resultSet = data.result.resultSet;
                let opList = [];
                resultSet.forEach(item => {
                    opList[opList.length] = {name:item.userName,value:item.userId};
                });
                this.setState({ opList });
            }
        }).catch ( error=>{
            console.log(error);
        });
    }

    render () {
        const {FormItem, formItemLayout} = this.props;
        const { getFieldProps } = this.props.form;
        const singleSelectProps = getFieldProps('selectsingle'+this.state.submitData.activityId, {
            'initialValue': this.state.submitData.participateId,
            rules: [
                { required: this.state.submitData.check ? false : true, message: '必选' },
            ],
            onChange: (participateId)=>{
                if ("1" === this.props.parentId) {  //决审
                    this.state.submitData.chargedUserId = participateId.key;
                }

                this.setState({ submitData:{...this.state.submitData, participateId }},()=>{

                    this.props.update({
                        ...this.state.submitData,
                        participateId : participateId.key
                    });
                });
            }
        });
        return (
          <FormItem
            {...formItemLayout}
            label= {"1" === this.props.parentId ? this.state.name+"-负责人" : this.state.name}
          >
              <Select
                {...singleSelectProps }
                value={this.state.submitData.participateId}
                disabled={this.state.disable}
                labelInValue
                filterOption={false}
                style={{ width: 376, marginRight: 10 }}
                getPopupContainer={ triggerNode => triggerNode.parentNode }
                showSearch={this.state.isOnlyOne ? false : true }
                onSearch={this.onSearch.bind(this)}
              >
                  {
                      this.state.opList.map((item,index)=>{
                          return <Option value={item.value} key={index}>{item.name}</Option>
                      })
                  }
              </Select>
              {
                  this.state.hasCheck ? <Checkbox checked={this.state.submitData.check} onChange={(e)=>this.checkChange(e)}>跳过</Checkbox> : null
              }
          </FormItem>
        )
    }
}