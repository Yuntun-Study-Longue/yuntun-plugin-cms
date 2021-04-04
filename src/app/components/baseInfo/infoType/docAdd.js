import React, { Component } from 'react'
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import Select from 'sub-antd/lib/select';
const Option = Select.Option;
import Cookies from 'js-cookie';
import axios from 'axios';
const FormItem = Form.Item;
export class DocAdd extends Component {
    constructor(props){
        super(props);
        this.state = {
            desc: '',
            docType:[]
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
    saveAndAdd(){
        this.props.form.resetFields(['documentName','code','documentType','describe'])
    }
    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('documentName', {
            rules: [
                { required: true, message: '此项必须填写' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const codeProps = getFieldProps('code', {
            rules: [
                { required: true, message: '此项必须填写' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const typeProps = getFieldProps('documentType', {
            rules: [
                { required: true, message: '此项必须填写' },
            ],
            trigger: ['onBlur', 'onChange']
        });
        const options = this.state.docType.map(type => <Option key={type.id} value={type.id}>{type.column1}</Option>);
        const descProps = getFieldProps('describe', {
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ],
            onChange:(e)=>{
                this.setState({
                    desc:e.target.value
                })
            }
        });
        return (
            <Form inline>
                <FormItem label='文档名称：' {...fourColLayout}>
                    <Input type="text" {...nameProps }/>
                </FormItem>
                <FormItem label='文档编号：' {...fourColLayout}>
                    <Input type="text" {...codeProps } />
                </FormItem>
                <FormItem label='文档类型：' {...halfFourColLayout}>
                    <Select {...typeProps}>
                        {options}
                    </Select>
                </FormItem>
                <FormItem label='文档说明：' {...fourColLayout}>
                    <Input type="textarea" maxLength='200' {...descProps} />
                    <p className="form-description-tip">还可输入{200-(this.props.baseData.describe ||this.state.desc ).length>0?200-(this.props.baseData.describe ||this.state.desc ).length:'0'}字</p>
                </FormItem>
            </Form>
        )
    }
}
// DocAdd = Form.create()(DocAdd);
export default DocAdd
