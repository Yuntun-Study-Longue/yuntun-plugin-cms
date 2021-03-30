import React, { Component } from 'react'
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Radio from 'sub-antd/lib/radio';
import Cookies from 'js-cookie';
import axios from 'axios';
import {twoColLayout} from "components/layout/formLayout";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
export class EnumItemEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            desc: '',
        }
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
            ],
        });
        
        const descProps = getFieldProps('describe', {
            initialValue: this.props.baseData.describe,
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ],
            onChange:(e)=>{
                this.setState({
                    desc:e.target.value
                })
            }
        });
        const isUsedProps = getFieldProps('isUsed', {
            initialValue: this.props.baseData.isUsed || 0,
            rules: [
                { type: 'number' }
            ]
        })
        return (
            <Form inline>
                <FormItem label='名称：' {...twoColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='描述：' {...twoColLayout}>
                    <Input type="textarea" maxLength='200' {...descProps} />
                    <p className="form-description-tip">还可输入{200-(this.props.baseData.describe ||this.state.desc ).length>0?200-(this.props.baseData.describe ||this.state.desc ).length:'0'}字</p>
                </FormItem>        
                <FormItem label='状态：' {...twoColLayout}>
                    <RadioGroup {...isUsedProps}>
                        <Radio key="a" value={0}>正常</Radio>
                        <Radio key="b" value={1}>作废</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        )
    }
}
EnumItemEdit = Form.create()(EnumItemEdit);
export default EnumItemEdit
