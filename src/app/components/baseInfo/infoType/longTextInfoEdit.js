import React, { Component } from 'react';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Radio from 'sub-antd/lib/radio';
import message from 'sub-antd/lib/message';
import axios from 'axios';
import Cookies from 'js-cookie';
import { type, scope, changeitem, selectType, createhistory } from '../constants/enumtype';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

class LongTextInfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            desc: '',
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    save = (callback) => {
        this.props.form.validateFields((errors, values) =>{
            const scope = values.scope.reduce((prev, next) => prev += ~~next, 0);
            const attrType = this.props.baseData.attrType || 0;
            const orgId = this.props.baseData.attrType || 0;
            const newData = {...this.props.baseData, ...values, scope, attrType, orgId, validateType: 1};
            axios.put(`/sysware/api/org-udef/update`, newData, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
                if (!res.data.code||res.data.code === 200) { 
                    message.success("修改成功");
                    callback(newData);
                }
                else{
                    message.error(res.data.message);
                }
            })
            
        })
    }
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
      
        const nameProps = getFieldProps('attrCode', {
            initialValue: this.props.baseData.attrCode,
            rules: [
                { required: true, message: '请输入名称' },
                { max: 100, message: '请控制内容长度不超过100个字' },
            ],
          });
        const scopeProps = getFieldProps('scope', {
            initialValue: this.props.baseData.scope === 3? [1, 2]:[this.props.baseData.scope],
            rules: [
                { type: 'array' },
            ],
            onChange:(val)=>{
                val.includes(2) ? this.setState({ disabledItem: false }) : this.setState({disabledItem: true });
                setFieldsValue({'changeItem': undefined});
                this.setState({
                    scope:val
                })
            }
        });
        const createHistoryProps = getFieldProps('createHistory', {
            initialValue: this.props.baseData.createHistory,
            rules: [{type: 'number'}]
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
        const changeItemProps = getFieldProps('changeItem', {
            initialValue: this.props.baseData.changeItem,
            rules: [
                { type: 'number' },
            ]
        });
        return (
            <Form inline>
                <FormItem label='名称：' {...halfFourColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='作用范围：' {...halfFourColLayout}>
                    <CheckboxGroup options={[
                        { label: '条目', value: 1 },
                        { label: '文档', value: 2 },
                    ]} {...scopeProps} />
                </FormItem>
                <FormItem label='数据类型：' {...halfFourColLayout}>
                    {type(this.props.baseData.attrType)}
                </FormItem>
                <FormItem label='触发条目变更：' {...halfFourColLayout}>
                    {
                        this.state.disabledItem ? <RadioGroup disabled={this.state.disabledItem}>
                            <Radio key="a" value={1}>是</Radio>
                            <Radio key="b" value={0}>否</Radio>
                        </RadioGroup> : <RadioGroup {...changeItemProps}>
                            <Radio key="a" value={1}>是</Radio>
                            <Radio key="b" value={0}>否</Radio>
                        </RadioGroup>
                    }
                </FormItem>
                <FormItem label='生成历史记录：' {...halfFourColLayout}>
                    <RadioGroup {...createHistoryProps}>
                        <Radio key="a" value={1}>是</Radio>
                        <Radio key="b" value={0}>否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label='描述：' {...fourColLayout}>
                    <Input type="textarea" maxLength='200' {...descProps} />
                    <p className="form-description-tip">还可输入{200-(this.props.baseData.describe ||this.state.desc ).length>0?200-(this.props.baseData.describe ||this.state.desc ).length:'0'}字</p>
                </FormItem>
            </Form>
        )
    }
}

// LongTextInfoEdit = Form.create()(LongTextInfoEdit);
export default LongTextInfoEdit