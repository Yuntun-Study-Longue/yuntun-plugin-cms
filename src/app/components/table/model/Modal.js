import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Button from 'sub-antd/lib/button';
import Select from 'sub-antd/lib/select';
import Radio from 'sub-antd/lib/radio';
import Checkbox from 'sub-antd/lib/checkbox';
import Row from 'sub-antd/lib/row';
import Col from 'sub-antd/lib/col';
import columnConf from 'components/columnConf/columnConf';
import SyswareTable from 'components/table/Table';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

import './modal.css';

class ModalDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            desc:'',
            disabledItem: false,
            isShowEnum: false,
        }
    }
    componentDidMount() {
        setTimeout(()=>{
            this.props.form.resetFields();
        },30);
    }
    handleCancel = () => {
        this.props.closeModal(false);
        this.setState({
            loading:false
        });
    }
    handleSaveAndAdd = () => {
        this.props.save.bind(this,true)();
    }
    render() {
        return (
            <Modal title={this.props.title} visible={true} maskClosable={false}
                onCancel={this.handleCancel.bind(this)}
                width={this.props.width}
                className="demand-add-modal"
                footer={['fdm_baseinfo_modal', 'rm_doc_config_modal','rm_doc_config_modal','rm_doc_modal'].includes(this.props.type) ? [
                    <Button type="primary" loading={this.state.loading} onClick={this.props.save.bind(this,false)}>确定</Button>,
                    <Button type="ghost" onClick={this.handleSaveAndAdd}>确定并新增</Button>,
                    <Button type="ghost" onClick={this.handleCancel}>取消</Button>,
                  ] : [
                    <Button type="primary" loading={this.state.loading} onClick={this.props.save.bind(this)}>确定</Button>,
                    <Button type="ghost" onClick={this.handleCancel}>取消</Button>, 
                ]}
            >
                <div className="demand-management-base-info">
                    {this.props.children}
                </div>
            </Modal>
        )
    }
}
ModalDocument = Form.create()(ModalDocument);

export default ModalDocument;