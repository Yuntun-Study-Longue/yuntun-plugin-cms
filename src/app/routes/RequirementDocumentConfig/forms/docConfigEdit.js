import React, { Component } from 'react';
// import ModalTable from 'components/modal/table/Table';
import axios from 'axios';
import Cookies from 'js-cookie';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Radio from 'sub-antd/lib/radio';
import Modal from 'sub-antd/lib/modal';
import { type, scope, changeitem, selectType, createhistory,extendType } from './enumtype';
import {halfFourColLayout,fourColLayout,halfFourColLayoutFn,fourColLayoutFn} from "components/layout/formLayout";
import {required,max,dmax} from 'components/sysForm/sysRules'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
import SysModal from 'components/sysModal' 
import EnumAttr from '../../fundamentalDataManagement/components/enumAttr'

class DocConfigEdit extends Component {
    constructor(props) {
        super(props);
        this.scope = this.props.baseData.scope === 3? [1, 2]:[this.props.baseData.scope];
        this.state = {
          baseData: this.props.baseData,
          delItems: [],
          addItems: [],
          disabledItem:this.scope.includes(2)? false :true
        }
    }
    componentDidMount() {
      this.props.onRef && this.props.onRef(this);
    }
    directSubmit(data, callback) {
        axios.post(`/sysware/api/docu/modify`, {...data, validateType:1}, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (res.data.code === 200 || !res.data.code) {
                this.setState({ addItems: [] });
                callback({...data, validateType:1})
            }
        })
    }
    validateSubmit(data, callback) {
        const that = this;
        axios.post(`/sysware/api/docu/modify`, {...data, validateType:0}, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (res.data.code === 200 || !res.data.code) {
                // 直接请求
                that.directSubmit(data, callback);
            }
            else if (res.data.code === 105){
                // 弹出验证
                Modal.confirm({
                    title: '您是否确认要删除这项内容',
                    content: `${res.data.message}`,
                    onOk() {
                        that.directSubmit(data, callback);
                    },
                    onCancel() {},
                });
            }
            else {
                SysModal.error(res.data.message);
            }
        })
    }
    showConfirm(itemList, submitValues, callbackFn = () => {}) {
        const msgStr = itemList.slice(0, 3).map(item => item.name).join(',');
        Modal.confirm({
            title: '您是否确认要删除这项内容',
            content: `删除“${msgStr}”${itemList.length > 3 ? '等' : ''}枚举值将无法恢复。确定删除吗`,
            onOk() {
                callbackFn(submitValues);
            },
            onCancel() {},
          });
    }
    save(callback) {
        this.props.form.validateFields((errors, values) =>{
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            }
            values = values.scope? {...values, scope: values.scope.reduce((prev, next) => prev += ~~next, 0)} : values;
            if(this.state.baseData.docuExtends){
                let newOrgExtends = this.$enumAttr.state.data;
                // 找到被删的枚举
                const submit_ids = newOrgExtends.map(item => item.id); // 更改后的元素id集合，得到集合B
                const delItems = this.state.baseData.docuExtends.filter(item => !submit_ids.includes(item.id));
                newOrgExtends = newOrgExtends.map((item,index)=>{
                    if(typeof (item.id) === 'string'){
                        delete item.id;
                    }
                    item.orderNum = index+1;
                    return item
                })
                if (delItems.length) {
                    return this.showConfirm(delItems, { ...this.state.baseData, ...values,docuExtends:newOrgExtends}, (data) => this.validateSubmit(data, callback) );
                }else{
                    return this.directSubmit({ ...this.state.baseData, ...values,docuExtends:newOrgExtends}, callback)
                }
            }else{
                return this.directSubmit({ ...this.state.baseData, ...values}, callback)
            }
        })
    }
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        const nameProps = getFieldProps('attrCode', {
            initialValue: this.state.baseData.attrCode,
            rules: [required,max(20)],
        });
        const typeProps= getFieldProps('attrType', {
            initialValue: this.state.baseData.attrType,
            rules: [
                {type: 'number'},
                { required: true, message: '请选择数据类型' }
            ],
            onChange: val => this.setState({ attrType: val })
        });
        const scopeProps = getFieldProps('scope', {
            initialValue: this.state.baseData.scope === 3? [1, 2]:[this.props.baseData.scope],
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
        const changeItemProps = getFieldProps('changeItem', {
            initialValue: this.state.baseData.changeItem,
            rules: [
                { type: 'number' },
            ],
          });
        const createHistoryProps = getFieldProps('createHistory', {
            initialValue: this.state.baseData.createHistory,
            rules: [{type: 'number'}]
        });
        const descProps = getFieldProps('describe', {
            initialValue: this.state.baseData.describe?this.state.baseData.describe:'',
            rules: [dmax(200)]
        });
        const multiTypeProps = getFieldProps('multiType', {
            initialValue: this.state.baseData.multiType,
            rules: [{type: 'number'}]
        })
        function isExtend(data){
            return data.extendType === 0?true:false;
        }
        return (
            <Form inline autoComplete='off'>
                <FormItem label='名称：' {...halfFourColLayout}>
                    { isExtend(this.state.baseData)?
                        <Input type="text" {...nameProps} />
                        :
                        this.state.baseData.attrCode
                    }
                </FormItem>
                <FormItem label='作用范围：' {...halfFourColLayout}>
                    {isExtend(this.state.baseData)?
                        <CheckboxGroup
                            options={[
                                { label: "文档", value: 1 },
                                { label: "条目", value: 2 },
                            ]}
                            {...scopeProps}
                            onChange={(val)=>{
                                if(!val.length){
                                    if(this.scope.includes(1)){
                                        val = [2];
                                    }else{
                                        val = [1];
                                    }
                                }
                                this.scope = val
                                setFieldsValue({'scope': val});
                                this.setState({ disabledItem:val.includes(2)? false :true});
                            }}
                        />
                        :
                        scope(this.state.baseData.scope)    
                    }
                </FormItem>
                <FormItem label='内置/扩展' {...halfFourColLayout}>
                    {extendType(this.state.baseData.extendType)}
                </FormItem>
                <FormItem label='触发条目变更：' {...halfFourColLayout}>
                    { isExtend(this.state.baseData)?
                        this.state.disabledItem ? (
                            <RadioGroup disabled={this.state.disabledItem} {...changeItemProps}>
                                <Radio key="a" value={1}>
                                    是
                                </Radio>
                                <Radio key="b" value={0}>
                                    否
                                </Radio>
                            </RadioGroup>
                        ) : (
                            <RadioGroup {...changeItemProps}>
                                <Radio key="a" value={1}>
                                    是
                                </Radio>
                                <Radio key="b" value={0}>
                                    否
                                </Radio>
                            </RadioGroup>
                        )
                        :
                        changeitem(this.state.baseData.changeItem)
                    }
                </FormItem>
                <FormItem label='数据类型：' {...halfFourColLayout}>
                    {type(this.state.baseData.attrType)}
                </FormItem>
                <FormItem label='生成历史记录：' {...halfFourColLayout}>
                    { isExtend(this.state.baseData)?
                        <RadioGroup {...createHistoryProps}>
                            <Radio key="a" value={1}>
                                是
                            </Radio>
                            <Radio key="b" value={0}>
                                否
                            </Radio>
                        </RadioGroup>
                        :
                        createhistory(this.state.baseData.createHistory)
                    }
                </FormItem>
                <FormItem label='选择方式：' {...halfFourColLayoutFn(
                    [5,6].includes(this.state.baseData.attrType)?{}:{display:'none'}
                )}>
                    { isExtend(this.state.baseData)?
                        <RadioGroup {...multiTypeProps}>
                            <Radio key="b" value={0}>
                                单选
                            </Radio>
                            <Radio key="a" value={1}>
                                多选
                            </Radio>
                        </RadioGroup>
                        :
                        selectType(this.state.baseData.multiType)
                    }
                    
                </FormItem>
                <FormItem label='枚举值：' {...fourColLayoutFn(
                    [5,6].includes(this.state.baseData.attrType)?{}:{display:'none'}
                )}>
                    {   this.state.baseData.docuExtends ? (
                            <EnumAttr 
                                ref={el=>this.$enumAttr=el}
                                attrId={this.props.baseData.id}
                                data = {this.state.baseData.docuExtends}
                            />
                        ) : ("")
                    }
                </FormItem>
                <FormItem label='描述' {...fourColLayout}>
                    { isExtend(this.state.baseData)?
                        <Input.CountDown 
                            type="textarea" 
                            maxTextareaLength={200} 
                            rows={5} 
                            {...descProps}
                        />
                        :
                       (this.state.baseData.describe)
                    }
                    
                </FormItem>
            </Form>
        );
    }
}
DocConfigEdit = Form.create()(DocConfigEdit);
export default DocConfigEdit