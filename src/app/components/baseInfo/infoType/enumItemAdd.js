import React, { Component } from 'react'
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Select from 'sub-antd/lib/select';
import {halfFourColLayout,fourColLayout,twoColLayout} from "components/layout/formLayout";
const Option = Select.Option;
import Cookies from 'js-cookie';
import axios from 'axios';
const FormItem = Form.Item;
export class EnumItemAdd extends Component {
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
    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                { required: true, message: '此项必须填写' },
            ],
        });
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
                 <FormItem label='名称：' {...twoColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='描述：' {...twoColLayout}>
                    <Input type="textarea" maxLength='200' {...descProps} />
                    <p className="form-description-tip">还可输入{200-(this.props.baseData.describe ||this.state.desc ).length>0?200-(this.props.baseData.describe ||this.state.desc ).length:'0'}字</p>
                </FormItem>
            </Form>
        )
    }
}
// EnumItemAdd = Form.create()(EnumItemAdd);
export default EnumItemAdd
