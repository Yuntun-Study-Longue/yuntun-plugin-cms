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
                message.success('????????????');
            }
        })
    }
    validateSubmit(data, callback) {
        const that = this;
        axios.post(`/sysware/api/docu/modify`, {...data, validateType:0}, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (res.data.code === 200 || !res.data.code) {
                // ????????????
                that.directSubmit(data, callback);
            }
            else if (res.data.code === 105){
                // ????????????
                Modal.confirm({
                    title: '????????????????????????????????????',
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
            title: '????????????????????????????????????',
            content: `?????????${msgStr}???${itemList.length > 3 ? '???' : ''}??????????????????????????????????????????`,
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
                // ?????????????????????
                const ids = this.state.baseData.docuExtends.map(item => item.id); // ????????????????????????id????????? ????????????A
                const submit_ids = values.docuExtends.map(item => item.id); // ??????????????????id?????????????????????B
                const delItems = this.state.baseData.docuExtends.filter(item => !submit_ids.includes(item.id));

                // const ids = this.state.baseData.docuExtends.map(item => item.id); // ????????????????????????id????????? ????????????A
                // const submit_ids = values.docuExtends.concat(this.state.baseData.docuExtends).map(item => item.id); // ??????A + ??????????????????id?????????????????????B
                // const delItems = this.state.baseData.docuExtends.filter(item => !submit_ids.includes(item.id)); // ??????A????????????B??????????????????????????????????????????
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
                { required: true, message: '???????????????' },
                { max: 100, message: '??????????????????????????????100??????' },
            ],
          });
        const typeProps= getFieldProps('attrType', {
            initialValue: this.props.baseData.attrType,
            rules: [
                {type: 'number'},
                { required: true, message: '?????????????????????' }
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
                { max: 200, message: '??????????????????????????????200??????' },
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
                <FormItem label='?????????' {...halfFourColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='???????????????' {...halfFourColLayout}>
                    {isExtend(this.state.baseData)?
                        <CheckboxGroup
                            options={[
                                { label: "??????", value: 1 },
                                { label: "??????", value: 2 },
                            ]}
                            {...scopeProps}
                        />
                        :
                        scope(this.state.baseData.scope)    
                    }
                </FormItem>
                <FormItem label='??????/??????' {...halfFourColLayout}>
                    {extendType(this.state.baseData.extendType)}
                </FormItem>
                <FormItem label='?????????????????????' {...halfFourColLayout}>
                    { isExtend(this.state.baseData)?
                        this.state.disabledItem ? (
                            <RadioGroup disabled={this.state.disabledItem} {...changeItemProps}>
                                <Radio key="a" value={1}>
                                    ???
                                </Radio>
                                <Radio key="b" value={0}>
                                    ???
                                </Radio>
                            </RadioGroup>
                        ) : (
                            <RadioGroup {...changeItemProps}>
                                <Radio key="a" value={1}>
                                    ???
                                </Radio>
                                <Radio key="b" value={0}>
                                    ???
                                </Radio>
                            </RadioGroup>
                        )
                        :
                        changeitem(this.state.baseData.changeItem)
                    }
                </FormItem>
                <FormItem label='???????????????' {...halfFourColLayout}>
                    {type(this.state.baseData.attrType)}
                </FormItem>
                <FormItem label='?????????????????????' {...halfFourColLayout}>
                    { isExtend(this.state.baseData)?
                        <RadioGroup {...createHistoryProps}>
                            <Radio key="a" value={1}>
                                ???
                            </Radio>
                            <Radio key="b" value={0}>
                                ???
                            </Radio>
                        </RadioGroup>
                        :
                        createhistory(this.state.baseData.createHistory)
                    }
                </FormItem>
                <FormItem label='???????????????' {...halfFourColLayoutFn(
                    [5,6].includes(this.state.baseData.attrType)?{}:{display:'none'}
                )}>
                    { isExtend(this.state.baseData)?
                        <RadioGroup {...multiTypeProps}>
                            <Radio key="b" value={0}>
                                ??????
                            </Radio>
                            <Radio key="a" value={1}>
                                ??????
                            </Radio>
                        </RadioGroup>
                        :
                        selectType(this.state.baseData.multiType)
                    }
                    
                </FormItem>
                <FormItem label='????????????' {...fourColLayoutFn(
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
                <FormItem label='?????????' {...fourColLayout}>
                    { isExtend(this.state.baseData)?
                        ([<Input
                            type="textarea"
                            maxLength="200"
                            {...descProps}
                        />,
                        <p className="form-description-tip">
                            ????????????{200 - this.state.desc.length}???
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