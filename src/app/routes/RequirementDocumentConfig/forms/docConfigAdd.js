import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Select from 'sub-antd/lib/select';
import Radio from 'sub-antd/lib/radio';
import Tooltip from 'sub-antd/lib/tooltip';
import {twoColLayout, fourColLayout, halfFourColLayout, halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn} from "components/layout/formLayout";
import { required, max,dmax} from 'components/sysForm/sysRules'
import SysIcon from 'components/sysIcon'
import EnumAttr from '../../fundamentalDataManagement/components/enumAttr'
import TypeTips from '../../fundamentalDataManagement/components/typeTips'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
class DocConfigAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabledItem: false,
            isShowEnum: false,
            attrType: 1
        }
        this.scope = [2];
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    submit(cb){
        this.props.form.validateFields((errors, values) =>{
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            }
            const docuExtends =this.$enumAttr?this.$enumAttr.state.data.map((item,index)=>{
                if(typeof (item.id) === 'string'){
                    delete item.id;
                }
                item.orderNum = index+1;
                return item
            }):null;
            values = {...values,docuExtends, scope: values.scope.reduce((prev, next) => prev += ~~next, 0)};
            cb(values)
        })
    }
    render() {
        const { getFieldProps, setFieldsValue} = this.props.form;
        const nameProps = getFieldProps('attrCode', {
            initialValue: this.props.baseData.attrCode,
            rules: [required,max(100)],
        });
        const typeProps= getFieldProps('attrType', {
            rules: [
                {type: 'number'},required
            ],
            onChange: val => this.setState({ attrType: val })
        });
        const scopeProps = getFieldProps('scope', {
            initialValue: [2],
            rules: [
                { type: 'array' },required
            ]
        });
        const changeItemProps = getFieldProps('changeItem', {
            initialValue: 0,
            rules: [
                { type: 'number' },
            ],
        });
        const createHistoryProps = getFieldProps('createHistory', {
            initialValue: 0,
            rules: [{type: 'number'}]
        });
        const descProps = getFieldProps('describe', {
            initialValue: this.props.baseData.describe,
            rules: [dmax(200)]
        });
        const multiTypeProps = getFieldProps('multiType', {
            initialValue: 0,
            rules: [{type: 'number'}]
        })
        return (
            <Form inline autoComplete='off'>
                <FormItem label='名称：' {...halfFourColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='作用范围' {...halfFourColLayout}>
                    <CheckboxGroup options={[
                        { label: '文档', value: 1 },
                        { label: '条目', value: 2 },
                    ]} {...scopeProps} 
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
                        val.includes(2)?this.setState({ disabledItem: false }):this.setState({disabledItem: true });
                    }}/>
                </FormItem> 
                <FormItem label={<span>数据类型
                    <Tooltip title={<TypeTips/>} overlayClassName="not-text-tip">
                        <i>
                            <SysIcon 
                            name="tips" 
                            style={{color:'#6398b4',fontSize:10,verticalAlign:'4px',margin:'0 2px'}}/>
                        </i>
                    </Tooltip></span>}
                    {...halfFourColLayout}>
                    <Select {...typeProps}
                    //     getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                        <Select.Option value={0}>文本</Select.Option>
                        <Select.Option value={1}>长文本</Select.Option>
                        <Select.Option value={2}>文件</Select.Option>
                        <Select.Option value={3}>日期</Select.Option>
                        <Select.Option value={4}>用户</Select.Option>
                        <Select.Option value={5}>枚举</Select.Option>
                    </Select>
                </FormItem>
                <FormItem label='触发条目变更：' {...halfFourColLayout}>
                    {
                    this.state.disabledItem ? <RadioGroup {...changeItemProps} disabled={this.state.disabledItem}>
                        <Radio key="a" value={1}>是</Radio>
                        <Radio key="b" value={0}>否</Radio>
                    </RadioGroup> : <RadioGroup {...changeItemProps} disabled={this.state.disabledItem}>
                        <Radio key="a" value={1}>是</Radio>
                        <Radio key="b" value={0}>否</Radio>
                    </RadioGroup>
                    }
                </FormItem>
                {
                    (this.state.attrType===5) && 
                    (
                        <FormItem label='选择方式：' {...halfFourColLayout}>
                            <RadioGroup {...multiTypeProps}>
                                <Radio key="b" value={0}>单选</Radio>
                                <Radio key="a" value={1}>多选</Radio>
                            </RadioGroup>
                        </FormItem>
                    )
                }
                <FormItem label='生成历史记录：' {...halfFourColLayout}>
                    <RadioGroup {...createHistoryProps}>
                        <Radio key="a" value={1}>是</Radio>
                        <Radio key="b" value={0}>否</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    (this.state.attrType === 5 ) &&
                    (
                        <FormItem label='枚举值' {...fourColLayout}>
                            <EnumAttr 
                                ref={el=>this.$enumAttr=el}
                                attrId={null}
                                data = {[]}
                            />
                        </FormItem>
                    )
                }
                <FormItem label='描述：' {...fourColLayout}>
                    <Input.CountDown 
                        type="textarea" 
                        maxTextareaLength={200} 
                        rows={5} 
                        {...descProps}
                    />
                </FormItem> 
            </Form> 
        )
    }
}
DocConfigAdd = Form.create()(DocConfigAdd);
export default DocConfigAdd