import React, { Component } from 'react'
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import Select from 'sub-antd/lib/select';
import Cookies from 'js-cookie';
import axios from 'axios';
const FormItem = Form.Item;
export class ViewExport extends Component {
    static defaultProps = {

    }
    constructor(props){
        super(props);
        this.state = {
            name: '',
            describe: '',
            type: 1,
        }
    }
    // componentWillMount(){
    //     const Authorization = Cookies.get('Authorization');
    //     axios.get(`/sysware/api/se/basicdata/loadBypid?pid=0&code=611_ORM`, { headers: { 'Authorization': Authorization}}).then(res => {
    //         let data=res.data.data.resultSet || res.data.data || [];
    //         this.setState({
    //             docType:data
    //         });
    //     }).catch(error => {
    //     })
    // }
    componentDidMount() {
        this.props.onRef(this);
    }
    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                { required: true, message: '此项必须填写' },
                { max: 100, message: '请控制内容长度不超过100个字' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const securityLevelProps = getFieldProps('securityLevel', {
            initialValue: 2,
            rules: [
                { required: true, message: '此项必须填写' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const descProps = getFieldProps('desc', {
            rules: [
                { max: 500, message: ' ' },
            ],
        });
        return (
            <Form inline autoComplete='off'>
                <FormItem label='文档名称：' {...fourColLayout}>
                    <Input type="text" maxLength='101' {...nameProps }/>
                </FormItem>
                <FormItem label='文档说明' {...fourColLayout}>
                    <Input.CountDown 
                        type="textarea" 
                        style={{height:'auto !important'}}
                        maxTextareaLength={500} 
                        rows={5} 
                        {...descProps}
                    />
                </FormItem>
                <FormItem label='文档密级：' {...fourColLayout}>
                    <Select {...securityLevelProps}>
                        <Select.Option value={0}>绝密</Select.Option>
                        <Select.Option value={1}>秘密</Select.Option>
                        <Select.Option value={2}>非密</Select.Option>
                    </Select>
                </FormItem>
            </Form>
        )
    }
}
// ViewExport = Form.create()(ViewExport);
export default ViewExport
