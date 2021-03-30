import React, { Component } from "react";
import axios from "axios";

import Cookies from "js-cookie";
import Modal from "sub-antd/lib/modal";
import Form from "sub-antd/lib/form";
import Input from "sub-antd/lib/input";
import {twoColLayout} from "components/layout/formLayout";
import Button from "sub-antd/lib/button";
import message from "sub-antd/lib/message";
const FormItem = Form.Item;

import "./modal.css";

class ModalDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            desc: "",
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.form.resetFields();
        }, 30);
    }
    clearData(e) {
        e.preventDefault();
        this.props.form.resetFields();
        this.setState({
            desc: "",
        });
    }
    handleOk(type = "", e) {
        e.preventDefault();
        // console.log('loading',this.state.loading);
        if (this.state.loading) {
            return false;
        }
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log("Errors in form!!!");
                return;
            }
            this.setState({
                loading: true,
            });
            axios
                .post(
                    "/sysware/api/project/save",
                    {
                        ...values,
                        nodeType: this.props.nodeType, //PROJECT 项目,FOLDER 文件夹
                        parentId: this.props.parentId, //默认0
                    },
                    { headers: { Authorization: Cookies.get("Authorization") } }
                )
                .then((res) => {
                    this.setState({
                        loading: false,
                    });
                    if (res.data.code == 200) {
                        message.success("新增成功");
                        this.props.success();
                        if (type == "continue") {
                            this.clearData(e);
                        } else {
                            this.handleCancel();
                        }
                    } else {
                        message.error(res.data.message);
                    }
                })
                .catch((error) => {
                    this.setState({
                        loading: false,
                    });
                });
        });
    }
    handleCancel() {
        this.props.closeModal(false, "");
        this.setState({
            loading: false,
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const nameProps = getFieldProps("name", {
            rules: [
                { required: true, message: "请输入名称" },
                { max: 100, message: "请控制内容长度不超过100个字" },
            ],
            trigger: "onBlur",
        });
        const codenameProps = getFieldProps("code", {
            rules: [
                { required: true, message: "请输入代号" },
                { max: 100, message: "请控制内容长度不超过100个字" },
                // { validator: this.checkCode.bind(this) }
            ],
            trigger: "onBlur",
        });
        const descProps = getFieldProps("desc", {
            rules: [{ max: 200, message: "请控制内容长度不超过200个字" }],
            onChange: (e) => {
                this.setState({
                    desc: e.target.value,
                });
            },
        });
        return (
            <Modal
                title={
                    this.props.nodeType == "PROJECT" ? "新增项目" : "新增文件夹"
                }
                visible={true}
                maskClosable={false}
                onCancel={this.handleCancel.bind(this)}
                className="demand-add-modal"
                width="466"
                footer={[
                    <Button
                        type="primary"
                        onClick={this.handleOk.bind(this, "")}
                    >
                        确定
                    </Button>,
                    <Button
                        type="primary"
                        onClick={this.handleOk.bind(this, "continue")}
                    >
                        确定并新增
                    </Button>,
                    <Button type="ghost" onClick={this.handleCancel.bind(this)}>
                        取消
                    </Button>,
                ]}
            >
                <Form inline>
                    <FormItem label="名称：" {...twoColLayout}>
                        <Input placeholder="请输入名称" {...nameProps} />
                    </FormItem>
                    <FormItem label="代号：" {...twoColLayout}>
                        <Input placeholder="请输入代号" {...codenameProps} />
                    </FormItem>
                    <FormItem label="描述：" {...twoColLayout}>
                        <Input type="textarea" maxLength="200" {...descProps} />
                        <p className="form-description-tip">
                            还可输入
                            {200 - this.state.desc.length > 0
                                ? 200 - this.state.desc.length
                                : "0"}
                            字
                        </p>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
ModalDocument = Form.create()(ModalDocument);

export default ModalDocument;
