import React, { Component } from 'react';
import ModalTable from 'components/modal/table/Table';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Select from 'sub-antd/lib/select';
import Radio from 'sub-antd/lib/radio';
import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import { type, scope, changeitem, selectType, createhistory,extendType } from '../constants/enumtype';
import {halfFourColLayout,fourColLayout,halfFourColLayoutFn,fourColLayoutFn} from "components/layout/formLayout";
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

class DocConfigInfoEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
          desc:this.props.baseData.describe || '',
          baseData: this.props.baseData,
          delItems: [],
          addItems: [],
        }
    }
    componentDidMount() {
      this.props.onRef && this.props.onRef(this);
      this.fetchDetail(this.props.baseData.id);
    }
    UNSAFE_componentWillReceiveProps(nextProp, nextState) {
        this.props.baseData.id !== nextProp.baseData.id && this.fetchDetail(nextProp.baseData.id)
        console.log(this.props.baseData)
    }
    fetchDetail(id) {
        const Authorization = Cookies.get('Authorization');
        axios.get(`/sysware/api/docu/queryDetail?id=${id}`, { headers: { 'Authorization': Authorization}}).then(res => {
            this.setState({ baseData: {...this.state.baseData, ...res.data.data } });
        })
    }
    directSubmit(data, callback) {
        console.log(data,'===data');
        axios.post(`/sysware/api/docu/modify`, {...data, validateType:1}, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (res.data.code === 200 || !res.data.code) {
                this.setState({ addItems: [] });
                callback({...data, validateType:1})
                message.success('修改成功');
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
                message.error(res.data.message);
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
            const id = this.state.baseData.id;
            values = values.scope? {...values, scope: values.scope.reduce((prev, next) => prev += ~~next, 0)} : values;
            if(this.state.baseData.docuExtends){
                console.log(values.docuExtends, 'values.docuExtends')
                console.log(this.state.baseData.docuExtends, 'this.state.baseData.docuExtends')
                // 找到被删的枚举
                const ids = this.state.baseData.docuExtends.map(item => item.id); // 初始传过来的元素id集合， 得到集合A
                const submit_ids = values.docuExtends.map(item => item.id); // 更改后的元素id集合，得到集合B
                const delItems = this.state.baseData.docuExtends.filter(item => !submit_ids.includes(item.id));

                // const ids = this.state.baseData.docuExtends.map(item => item.id); // 初始传过来的元素id集合， 得到集合A
                // const submit_ids = values.docuExtends.concat(this.state.baseData.docuExtends).map(item => item.id); // 集合A + 更改后的元素id集合，得到集合B
                // const delItems = this.state.baseData.docuExtends.filter(item => !submit_ids.includes(item.id)); // 排除A中存在，B中不存在的元素就是被删的元素
                console.log(delItems, '==== delItems');
                if (delItems.length) {
                    return this.showConfirm(delItems, { ...this.state.baseData, ...values }, (data) => this.validateSubmit(data, callback) );
                }
            }
            return this.directSubmit({ ...this.state.baseData, ...values }, callback)
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
        const typeProps= getFieldProps('attrType', {
            initialValue: this.props.baseData.attrType,
            rules: [
                {type: 'number'},
                { required: true, message: '请选择数据类型' }
            ],
            onChange: val => this.setState({ attrType: val })
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
        const changeItemProps = getFieldProps('changeItem', {
            initialValue: this.props.baseData.changeItem,
            rules: [
                { type: 'number' },
            ],
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
        const multiTypeProps = getFieldProps('multiType', {
            initialValue: this.props.baseData.multiType,
            rules: [{type: 'number'}]
        })
        const docuExtendsProps =getFieldProps('docuExtends', {
            initialValue: this.state.baseData.docuExtends,
            rules: [{type: 'array'}]
        })
        function isExtend(data){
            return data.extendType === 0?true:false;
        }
        return (
            <Form inline>
                <FormItem label='名称：' {...halfFourColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='作用范围：' {...halfFourColLayout}>
                    {isExtend(this.state.baseData)?
                        <CheckboxGroup
                            options={[
                                { label: "文档", value: 1 },
                                { label: "条目", value: 2 },
                            ]}
                            {...scopeProps}
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
                    {this.state.baseData.docuExtends ? (
                        <ModalTable
                            attrId={this.props.baseData.id}
                            controlIcons={isExtend(this.state.baseData)?[
                                "add",
                                "edit",
                                "del",
                                "moveup",
                                "movedown",
                            ]:[]}
                            {...docuExtendsProps}
                        />
                        ) : ("")}
                </FormItem>
                <FormItem label='描述：' {...fourColLayout}>
                    { isExtend(this.state.baseData)?
                        ([<Input
                            type="textarea"
                            maxLength="200"
                            {...descProps}
                        />,
                        <p className="form-description-tip">
                            还可输入{200 - this.state.desc.length}字
                        </p>])
                        :
                       (this.state.baseData.describe)
                    }
                    
                </FormItem>
            </Form>
        );
    }
}


// DocConfigInfoEdit = Form.create()(DocConfigInfoEdit);

export default DocConfigInfoEdit