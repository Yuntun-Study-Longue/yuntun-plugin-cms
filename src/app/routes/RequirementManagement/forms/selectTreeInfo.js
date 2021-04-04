import React, { Component } from "react";
import { Form } from 'antd';
const FormItem = Form.Item;
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
export default class SelectTreeInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        function nodeType(typeVal) {
            const nodeTypes = {
                PROJECT: "项目",
                FOLDER: "文件夹",
            };
            return nodeTypes[typeVal] ? nodeTypes[typeVal] : "";
        }
        return (
            <Form inline>
                <FormItem label="名称：" {...halfFourColLayout}>{this.props.baseData.name}</FormItem>
                <FormItem label="类型：" {...halfFourColLayout}>{nodeType(this.props.baseData.nodeType)}</FormItem>
                <FormItem label="代号：" {...halfFourColLayout}>{this.props.baseData.code}</FormItem>
                <FormItem label="描述：" {...fourColLayout}>{this.props.baseData.describe}</FormItem>
            </Form>
        );
    }
}
