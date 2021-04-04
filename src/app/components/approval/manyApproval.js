import React, { Component } from 'react';

import BatchChoice from 'core/components/batchChoice/views'
import axios from "axios";

import Select from 'sub-antd/lib/select';
import Checkbox from 'sub-antd/lib/checkbox';
import Button from 'sub-antd/lib/button';
import message from 'sub-antd/lib/message';

const Option = Select.Option;

import './approval.scss'

/**
 * 多人审批与会签组件
 */
export default class ManyApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opList: [], //option集合
            disable: false,     //表示select是否被禁用
            name: "",   //lable
            hasCheck: false,    //是否有跳过按钮
            selectValues: [],    //select选中的值 eg:{label:"审批3",key:"3"}
            submitData: {
                participateId: "",    //选中的id的拼串
                check: false,   //是否选中跳过
                activityId: "",    //节点id
                roleId: "", // 角色ID
                departmentId: "",   //部门ID
                isErr: false,    //是否存在搜索内容---主页需要控制是否可以提交数据
            },
            userVisible: false, //批量选择弹框显隐
            selectbutVisible: props.selectbutVisible === (undefined || true), //是否显示批量选人
            userIds: props.userIds, //会签默认请求角色
            queryDepts: "", //搜索的部门
            qeuryRoles: "", //搜索的角色
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {    //获取数据
        const data = this.props.dataSource;
        const attributes = data.attributes;
        const operateType = attributes.operateType;
        const operateCode = attributes.operateCode;
        this.state.queryDepts = attributes.departmentId;
        this.state.qeuryRoles = attributes.roleId;
        let selectValues = [];
        if ("1" === operateType) {  //直接选择审核人
            const participantId = attributes.participantId;
            if (participantId.length > 0) {
                const ids = participantId.split(",");
                const names = attributes.participantName.split("、");
                ids.forEach((item, index) => {
                    selectValues.push({ label: names[index], key: item });
                })
                this.state.selectValues = selectValues;
                this.getParticipateId();
            }

        }

        if ("customProjectRoleUser" === operateCode) {  //项目角色，不需要从接口中获取审批人，数据直接返回数据
            const participantId = attributes.participantId;
            if (participantId.length > 0) {
                const ids = participantId.split(",");
                const names = attributes.participantName.split("、");
                let opList = [];
                ids.forEach((item, index) => {
                    opList[opList.length] = { label: names[index], key: item };
                })
                this.setState({ opList });
            }
        } else {    //正常获取审批人接口
            let params = "";
            params = `deepDeptId=${attributes.departmentId}&roleId=${attributes.roleId}&limit=50&containSelf=true${attributes.operateCode == 'customUser' ? `&userIds=${this.state.userIds}` : ''}`
            axios.get(globalInitConfig.eap_url + `eap/api/componentQuery/user.action?${params}`).then(res => {
                const data = res.data;
                let selectValues = [];
                if (1 === data.code) {
                    const resultSet = data.result.resultSet;
                    let opList = [];
                    resultSet.forEach(item => {
                        opList[opList.length] = { label: item.userName, key: item.userId };
                        selectValues.push({ key: item.userId, label: item.userName });
                    });
                    //扩展会审会签时默认选中所有下拉框数据
                    if (attributes.autoShowApprovaluser == "1") {
                        this.setState({ selectValues });
                        this.getParticipateId(); //默认更新form表单值
                        this.props.update(this.state.submitData); //默认更新form表单值
                    }
                    this.setState({ opList });
                }
            }).catch(error => {
                console.log(error);
            });
        }

        this.setState({
            name: data.activityName,
            hasCheck: "1" === attributes.allowStep ? true : false,
            submitData: {
                ...this.state.submitData,
                activityId: data.activityId,
                roleId: attributes.roleId,
                departmentId: attributes.departmentId,
            }
        }, () => {
            this.props.update(this.state.submitData);
        })
    }

    getParticipateId() {   //根据选中的list获取对应的串
        let arr = [];
        this.state.selectValues.forEach(item => {
            arr.push(item.key);
        })
        this.state.submitData.participateId = arr.join(",");
    }

    checkChange(e) {
        const flag = e.target.checked;
        this.setState({ submitData: { ...this.state.submitData, check: flag } }, () => {
            this.props.update(this.state.submitData);
        });
        if (flag) {
            this.setState({ disable: true });
        } else {
            this.setState({ disable: false });
        }
        this.props.form.resetFields();
    }

    onSearch(value) {
        const data = this.props.dataSource;
        const attributes = data.attributes;
        //修改错误提示页面
        this.state.submitData.isErr = false;
        this.setState({ searchValue: value })
        const params = `name=${value}&deepDeptId=${attributes.departmentId}&roleId=${attributes.roleId}&limit=50&containSelf=true${attributes.operateCode == 'customUser' ? `&userIds=${this.state.userIds}` : ''}`;

        axios.get(globalInitConfig.eap_url + `eap/api/componentQuery/user.action?${params}`).then(res => {
            const data = res.data;
            if (1 === data.code) {
                const resultSet = data.result.resultSet;
                let opList = [];
                resultSet.forEach(item => {
                    opList[opList.length] = { label: item.userName, key: item.userId };
                });
                this.setState({ opList });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    //显示/隐藏回调
    onToggleShow(visible) {
        if (!visible && this.state.searchValue) {
            this.setState({
                submitData: {
                    ...this.state.submitData,
                    isErr: true
                }
            }, () => {
                this.props.update(this.state.submitData);
            })
        } else {
            this.props.update(this.state.submitData);
        }
    }

    //清空
    clearAll() {
        if (this.state.selectValues.length === 0) {
            return;
        }
        //一定要调用本身的方法，要不校验就会不生效
        this.nameSelect.props.onChange([]);
    }

    batch() {
        this.setState({ userVisible: true });
    }

    changeVisible(userVisible) {
        this.setState({ userVisible });
    }

    getSelectedData(selectedData) {
        let flag = false, msg = [], userObj = this.state.selectValues;
        selectedData.forEach(item => {
            flag = false;
            userObj.forEach(obj => {
                if (obj.key == item.userId) {
                    flag = true;
                    msg.push(item.userName);
                }
            })
            if (!flag) {
                userObj.push({ key: item.userId, label: item.userName });
            }
            this.props.form.resetFields();
        });

        if (msg.length > 0) {
            message.warning(msg.join(",") + "已添加，请勿重复操作");
        }
        this.setState({ selectValues: userObj }, () => {
            this.getParticipateId();
            this.props.update(this.state.submitData);
        });
    }

    render() {
        const { FormItem, formItemLayout, parentId, dataSource } = this.props;
        const { operateCode } = dataSource.attributes;
        const { getFieldProps } = this.props.form;

        const manySelectProps = getFieldProps('selectmany' + this.state.submitData.activityId, {
            'initialValue': this.state.selectValues,   //为了解决多渲染一个selectmany的错误数据
            rules: [
                { required: this.state.submitData.check ? false : true, message: '必选' },
            ],
            onChange: (selectValues) => {
                //清空搜索内容
                this.state.searchValue = "";
                this.state.submitData.isErr = false
                this.setState({ selectValues }, () => {
                    this.getParticipateId();
                    this.props.update(this.state.submitData);
                });
            }
        });
        return (
            <FormItem
                {...formItemLayout}
                label={"1" === parentId ? this.state.name + "-参与人" : this.state.name}
            >
                <Select
                    {...manySelectProps}
                    multiple={true}
                    value={this.state.selectValues}
                    disabled={this.state.disable}
                    className={this.state.submitData.isErr ? "select-error" : "user-item"}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    style={{ width: 376, marginRight: 10 }}
                    onSearch={this.onSearch.bind(this)}
                    filterOption={false}
                    optionLabelProp="name"
                    labelInValue={true}
                    ref={node => this.nameSelect = node}
                    onToggleShow={this.onToggleShow.bind(this)}
                >
                    {
                        this.state.opList.map((item, index) => {
                            return <Option
                                value={item.key}
                                key={index}
                                name={item.label}
                            >
                                {item.label}
                            </Option>
                        })
                    }
                </Select>
                {
                    this.state.hasCheck && parentId != "1" ? <Checkbox className="many-approval-check-step" checked={this.state.submitData.check} onChange={(e) => this.checkChange(e)}>跳过</Checkbox> : null
                }

                <Button disabled={this.state.disable} onClick={() => this.clearAll()} className="many-approval-button-clear" type="ghost" size="small">清空</Button>

                {
                    operateCode !== 'customUser'
                    && operateCode !== 'customProjectRoleUser'
                    && <Button disabled={this.state.disable} onClick={() => this.batch()} className="many-approval-button-selectbut" type="primary" size="small">批量选择</Button>
                }

                {
                    this.state.submitData.isErr ? <p style={{ color: "#e96149" }} className="tip">不能邀请系统外的用户，请检查</p> : null
                }
                {
                    this.state.userVisible ?
                        <BatchChoice
                            visible={this.state.userVisible}
                            getSelectedData={this.getSelectedData.bind(this)}
                            changeVisible={this.changeVisible.bind(this)}
                            depts={this.state.queryDepts}
                            roles={this.state.qeuryRoles}
                        /> : null
                }
            </FormItem>
        )
    }
}