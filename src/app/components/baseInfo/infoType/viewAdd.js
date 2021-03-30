import React, { Component } from 'react'
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import Radio from 'sub-antd/lib/radio';
const RadioGroup = Radio.Group;
import Cookies from 'js-cookie';
import axios from 'axios';
const FormItem = Form.Item;
export class ViewAdd extends Component {
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
    componentWillMount(){
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
            rules: [
                { required: true, message: '此项必须填写' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const typeProps = getFieldProps('type', {
            initialValue: 0,
            rules: [
                { required: true, message: '此项必须填写' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const descProps = getFieldProps('describe', {
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
                    <RadioGroup {...typeProps}>
                        <Radio key="a" value={0}>个人</Radio>
                        <Radio key="b" value={1}>共享</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label='描述' {...fourColLayout}>
                    <Input type="textarea" maxLength='200' {...descProps} autosize={{ minRows: 2, maxRows: 8 }} />
                    <p className="form-description-tip">还可输入{200-this.state.describe.length}字</p>
                </FormItem>
            </Form>
        )
    }
}
ViewAdd = Form.create()(ViewAdd);
export default ViewAdd
