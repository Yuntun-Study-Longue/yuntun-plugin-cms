import React, { Component } from "react";
import axios from "axios";
import { Form } from 'antd';
import Input from "sub-antd/lib/input";
const FormItem = Form.Item;
import {halfFourColLayout,fourColLayout} from "components/sysLayout/formLayout";
import { required, max,dmax} from 'components/sysForm/sysRules'
import SysModal from 'components/sysModal'
class SelectTreeInfoEdit extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    save = (callback) => {
        this.props.form.validateFields((errors, values) => {
            if(!!errors){
                return
            }
            axios.post(
                    `/sysware/api/project/update`,
                    { ...this.props.baseData, ...values },
                )
                .then((res) => {
                    if (res.data.code === 200) {
                        callback({ ...this.props.baseData, ...values });
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
            rules: [required,max(50)],
        });
        const codeProps = getFieldProps("code", {
            initialValue: this.props.baseData.code,
            rules: [required,max(50)],
        });
        const descProps = getFieldProps("describe", {
            initialValue: this.props.baseData.describe?this.props.baseData.describe:'',
            rules: [dmax(200)],
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
                    <Input.CountDown 
                        type="textarea" 
                        maxTextareaLength={200} 
                        rows={5} 
                        {...descProps}
                    />
                </FormItem>
            </Form>
        );
    }
}
// SelectTreeInfoEdit = Form.create()(SelectTreeInfoEdit);

export default SelectTreeInfoEdit;
