import React, { Component } from "react";
import { Form } from 'antd';
import Input from "sub-antd/lib/input";
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import message from "sub-antd/lib/message";
import axios from "axios";
import Cookies from "js-cookie";
const FormItem = Form.Item;
class SelectTreeInfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: "",
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    save = (callback) => {
        this.props.form.validateFields((errors, values) => {
            console.log(this.props.baseData,values)
            axios
                .put(
                    `/sysware/api/project/update`,
                    { ...this.props.baseData, ...values },
                    { headers: { Authorization: Cookies.get("Authorization") } }
                )
                .then((res) => {
                    if (res.data.code === 200) {
                        message.success("修改成功");
                        callback({ ...this.props.baseData, ...values });
                    } else {
                        message.error(res.data.message);
                    }
                });
        });
    };
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        function nodeType(typeVal) {
            const nodeTypes = {
                PROJECT: "项目",
                FOLDER: "文件夹",
            };
            return nodeTypes[typeVal] ? nodeTypes[typeVal] : "";
        }
        const nameProps = getFieldProps("name", {
            initialValue: this.props.baseData.name,
            rules: [
                { required: true, message: "请输入名称" },
                { max: 100, message: "请控制内容长度不超过100个字" },
            ],
        });
        const codeProps = getFieldProps("code", {
            initialValue: this.props.baseData.code,
            rules: [
                { required: true, message: "请输入代号" },
                { max: 100, message: "请控制内容长度不超过100个字" },
            ],
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
        return (
            <Form inline>
                <FormItem label="名称：" {...halfFourColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label="类型：" {...halfFourColLayout}>
                    {nodeType(this.props.baseData.nodeType)}
                </FormItem>       
                <FormItem label="代号：" {...halfFourColLayout}>
                    <Input type="text" {...codeProps} />
                </FormItem>       
                <FormItem label="描述：" {...fourColLayout}>
                    <Input
                        type="textarea"
                        maxLength="200"
                        {...descProps}
                    />
                    <p className="form-description-tip">
                        还可输入
                        {200 -
                            (
                                this.props.baseData.describe ||
                                this.state.desc
                            ).length >
                        0
                            ? 200 -
                                (
                                    this.props.baseData.describe ||
                                    this.state.desc
                                ).length
                            : "0"}
                        字
                    </p>
                </FormItem>
            </Form>
        );
    }
}
// SelectTreeInfoEdit = Form.create()(SelectTreeInfoEdit);

export default SelectTreeInfoEdit;
