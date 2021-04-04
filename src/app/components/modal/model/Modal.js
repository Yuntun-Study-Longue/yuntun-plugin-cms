import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Button from 'sub-antd/lib/button';
import Select from 'sub-antd/lib/select';
import Radio from 'sub-antd/lib/radio';
import Checkbox from 'sub-antd/lib/checkbox';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

import './modal.css';

class ModalInModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            desc:'',
            disabledItem: false,
            isShowEnum: false,
            isClosed: false,
        }
    }
    componentDidMount() {
        setTimeout(()=>{
            this.props.form.resetFields();
        },30);
    }
    handleCancel = () => {
        this.props.closeModal();
        this.setState({ isClosed: true });
    }
    render() {
        return (
            <Modal title={this.props.title} visible={true} maskClosable={false} wrapClassName="vertical-center-modal"
             onCancel={this.handleCancel.bind(this)} 
                className="demand-add-modal"
                width={this.props.width || "436"}
                footer={[
                    <Button type="primary" loading={this.state.loading} onClick={this.props.save.bind(this)}>确定</Button>,
                    <Button type="ghost" onClick={this.handleCancel.bind(this)}>确定并新增</Button>,
                    <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button>,
                  ]}
            >
                <div className="demand-management-base-info">
                    {this.props.children}
                </div>
            </Modal>
        )
    }
}
// ModalInModal = Form.create()(ModalInModal);

export default ModalInModal;