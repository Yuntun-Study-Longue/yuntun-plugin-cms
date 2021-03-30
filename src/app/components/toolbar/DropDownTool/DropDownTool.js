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
import Menu from 'sub-antd/lib/menu';
import Dropdown from 'sub-antd/lib/dropdown';
import Icon from 'sub-antd/lib/icon';
// import './DropDownTool.css';

export default class DropDownTool extends Component {
    static defaultProps = {
        title: '点击触发',
        overlay: (<Menu>
            <Menu.Item key="0">
              <a href="#">重置为默认设置</a>
            </Menu.Item>
            <Menu.Item key="1">
              <a href="#">删除视图</a>
            </Menu.Item>
            {/* <Menu.Divider /> */}
            <Menu.Item key="3">
                <a href="#">编辑视图基本信息</a>
            </Menu.Item>
        </Menu>), 
        trigger: ['click']
    }
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return <Dropdown overlay={this.props.overlay} trigger={this.props.trigger}>
            <a className="ant-dropdown-link" href="#">{this.props.title} <Icon type="down" /></a>
        </Dropdown>
    }
}