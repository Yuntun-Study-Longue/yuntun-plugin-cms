import React, { Component } from "react";
import Form from 'sub-antd/lib/form';
import Input from "sub-antd/lib/input";
import Checkbox from "sub-antd/lib/checkbox";
import Select from "sub-antd/lib/select";
import Radio from "sub-antd/lib/radio";
import message from "sub-antd/lib/message";
import ModalTable from "components/modal/table/Table";
import axios from "axios";
import Cookies from "js-cookie";
import {
    type,
    scope,
    changeitem,
    selectType,
    createhistory,
} from "../constants/enumtype";
import {
    twoColLayout,
    fourColLayout,
    halfFourColLayout,
    halfFourColLayoutFn,
    fourColLayoutFn,
    twoColLayoutFn,
} from "components/layout/formLayout";
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

class DocConfigAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: "",
            disabledItem: false,
            isShowEnum: false,
            attrType: 1,
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    saveAndAdd(){
        this.props.form.resetFields(['attrCode','attrType','describe','docuExtends'])
    }
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        const nameProps = getFieldProps("attrCode", {
            initialValue: this.props.baseData.attrCode,
            rules: [
                { required: true, message: "请输入名称" },
                { max: 100, message: "请控制内容长度不超过100个字" },
            ],
        });
        const typeProps = getFieldProps("attrType", {
            rules: [
                { type: "number" },
                { required: true, message: "请选择数据类型" },
            ],
            onChange: (val) => this.setState({ attrType: val }),
        });
        const scopeProps = getFieldProps("scope", {
            initialValue: [1],
            rules: [{ type: "array" }]
        });
        const changeItemProps = getFieldProps("changeItem", {
            initialValue: 1,
            rules: [{ type: "number" }],
        });
        const createHistoryProps = getFieldProps("createHistory", {
            initialValue: 1,
            rules: [{ type: "number" }],
        });
        const descProps = getFieldProps("describe", {
            initialValue: this.props.baseData.describe,
            rules: [{ max: 200, message: "请控制内容长度不超过200个字" }],
            onChange: (e) => {
                this.setState({
                    desc: e.target.value,
                });
            },
        });
        const multiTypeProps = getFieldProps("multiType", {
            initialValue: 0,
            rules: [{ type: "number" }],
        });
        const orgExtendsProps = getFieldProps("docuExtends", {
            initialValue: this.props.baseData.docuExtends,
            rules: [{ type: "array" }],
        });
        return (
            <Form inline>
                <FormItem label="名称：" {...halfFourColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label="作用范围：" {...halfFourColLayout}>
                    <CheckboxGroup
                        options={[
                            { label: "条目", value: 1 },
                            { label: "文档", value: 2 },
                        ]}
                        {...scopeProps}
                        onChange={(val)=>{
                            if (!val.length) return;
                            setFieldsValue({'scope': val});
                            val.includes(1)?this.setState({ disabledItem: false }):this.setState({disabledItem: true });
                            setFieldsValue({'changeItem': undefined});
                            this.setState({
                                scope: val,
                            });
                        }}
                    />
                </FormItem>
                <FormItem label="数据类型：" {...halfFourColLayout}>
                    <Select {...typeProps}>
                        <Select.Option value={0}>文本</Select.Option>
                        <Select.Option value={1}>长文本</Select.Option>
                        <Select.Option value={2}>文件</Select.Option>
                        <Select.Option value={3}>日期</Select.Option>
                        <Select.Option value={4}>用户</Select.Option>
                        <Select.Option value={5}>枚举</Select.Option>
                    </Select>
                </FormItem>
                <FormItem label="触发条目变更：" {...halfFourColLayout}>
                    {this.state.disabledItem ? (
                        <RadioGroup disabled={this.state.disabledItem}>
                            <Radio key="a" value={1}>
                                是
                            </Radio>
                            <Radio key="b" value={2}>
                                否
                            </Radio>
                        </RadioGroup>
                    ) : (
                        <RadioGroup {...changeItemProps} disabled={this.state.disabledItem}>
                            <Radio key="a" value={1}>
                                是
                            </Radio>
                            <Radio key="b" value={2}>
                                否
                            </Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    label="选择方式："
                    {...halfFourColLayoutFn(
                        this.state.attrType === 5 ? {} : { display: "none" }
                    )}
                >
                    <RadioGroup {...multiTypeProps}>
                        <Radio key="b" value={0}>
                            单选
                        </Radio>
                        <Radio key="a" value={1}>
                            多选
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="生成历史记录：" {...halfFourColLayout}>
                    <RadioGroup {...createHistoryProps}>
                        <Radio key="a" value={1}>
                            是
                        </Radio>
                        <Radio key="b" value={0}>
                            否
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label="枚举值："
                    {...fourColLayoutFn(
                        this.state.attrType === 5 ? {} : { display: "none" }
                    )}
                >
                    <ModalTable
                        listOption={{
                            uri: "/sysware/api/oudef-extend/list",
                            queryBuilder: (item) =>
                                item ? `` : `?attrid=${this.props.baseData.id}`,
                        }}
                        addOption={{
                            uri: "/sysware/api/oudef-extend/save",
                            paramsBuilder: (params) => {
                                const id = this.props.baseData.id;
                                return params ? { ...params, id } : null;
                            },
                        }}
                        modifyOption={{
                            uri: "/sysware/api/oudef-extend/update",
                        }}
                        controlIcons={[
                            "add",
                            "edit",
                            "del",
                            "moveup",
                            "movedown",
                        ]}
                        {...orgExtendsProps}
                    />
                </FormItem>
                <FormItem label="描述：" {...fourColLayout}>
                    <Input type="textarea" maxLength="200" {...descProps} />
                    <p className="form-description-tip">
                        还可输入
                        {200 -
                            (this.props.baseData.describe || this.state.desc)
                                .length >
                        0
                            ? 200 -
                              (this.props.baseData.describe || this.state.desc)
                                  .length
                            : "0"}
                        字
                    </p>
                </FormItem>
            </Form>
        );
    }
}
DocConfigAdd = Form.create()(DocConfigAdd);

export default DocConfigAdd;
