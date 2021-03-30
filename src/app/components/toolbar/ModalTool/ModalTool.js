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
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

import './ModalTool.css';

class ModalTool extends Component {
    static defaultProps = {
        title: '弹出框 - 工具',
        width: 736,
        buttonList: ['ok', 'okNext', 'reset', 'cancel'],
        wrapClassName: 'vertical-center-modal',
    }
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isClosed: false,
        }
    }
    componentDidMount() {
        
    }
    handleEnsure() {
        this.props.save();
    }
    handleEnsureAndNext() {
        this.props.save(() => this.props.reset());
    }
    handleReset() {
        this.props.reset(true);
    }
    handleCancel() {
        this.props.closeModal();
        this.setState({ isClosed: true });
    }
    render() {
        const footer = [
            this.props.buttonList.includes('ok') ? <Button type="primary" loading={this.state.loading} onClick={this.handleEnsure.bind(this)}>确定</Button> : null,
            this.props.buttonList.includes('okNext') ? <Button type="ghost" onClick={this.handleEnsureAndNext.bind(this)}>确定并新增</Button> : null,
            this.props.buttonList.includes('reset') ? <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button> : null,
            this.props.buttonList.includes('cancel') ? <Button type="ghost" onClick={this.handleCancel.bind(this)}>取消</Button> : null,
        ]
        return (
            <Modal title={this.props.title} visible={true} maskClosable={false} wrapClassName={this.props.wrapClassName}
             onCancel={this.handleCancel.bind(this)} 
                className="tool-modal"
                width={this.props.width || "436"}
                footer={footer}
            >
                <div className="system-tool-info">
                    {this.props.children}
                </div>
            </Modal>
        )
    }
}
ModalTool = Form.create()(ModalTool);

export default ModalTool;