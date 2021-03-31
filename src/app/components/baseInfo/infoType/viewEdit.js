import React, { Component } from 'react'
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import Radio from 'sub-antd/lib/radio';
const RadioGroup = Radio.Group;
import Cookies from 'js-cookie';
import axios from 'axios';
const FormItem = Form.Item;
export class ViewEdit extends Component {
    static defaultProps = {
        baseData: {}
    }
    constructor(props){
        super(props);
        this.state = {
            name: '',
            describe: this.props.baseData ? this.props.baseData.describe : '',
            type: 1,
        }
    }
    UNSAFE_componentWillMount(){
        const Authorization = Cookies.get('Authorization');
        axios.get(`/sysware/api/se/basicdata/loadBypid?pid=0&code=611_ORM`, { headers: { 'Authorization': Authorization}}).then(res => {
            let data=res.data.data.resultSet || res.data.data || [];
            this.setState({
                docType:data
            });
        }).catch(error => {
        })
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name', {
            initialValue: this.props.baseData.name,
            rules: [
                { required: true, message: '此项必须填写' },
                { max: 50, message: '请控制内容长度不超过50个字' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        // const typeProps = getFieldProps('type', {
        //     initialValue: this.props.baseData.type,
        //     rules: [
        //         { required: true, message: '此项必须填写' },
        //     ],
        //     trigger: ['onBlur', 'onChange']
        // });
        const descProps = getFieldProps('describe', {
            initialValue: this.props.baseData.describe,
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ],
            onChange:(e)=>{
                this.setState({
                    describe: e.target.value
                })
            }
        });
        return (
            <Form inline autoComplete='off'>
                <FormItem label='名称：' {...fourColLayout}>
                    <Input type="text" {...nameProps }/>
                </FormItem>
                <FormItem label='类型：' {...fourColLayout}>
                    <span>{this.props.baseData.type == 0 ? '个人' : this.props.baseData.type == 1 ? '共享' : '内置'}</span>
                </FormItem>
                <FormItem label='描述' {...fourColLayout}>
                    <Input type="textarea" autosize={{ minRows: 2, maxRows: 8 }} maxLength='200' {...descProps} />
                    <p className="form-description-tip">还可输入{200-this.state.describe.length}字</p>
                </FormItem>
            </Form>
        )
    }
}
// ViewEdit = Form.create()(ViewEdit);
export default ViewEdit
