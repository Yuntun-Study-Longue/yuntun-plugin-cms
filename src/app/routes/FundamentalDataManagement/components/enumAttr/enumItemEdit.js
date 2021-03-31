import React, { Component } from 'react'
import Form from 'sub-antd/lib/form'
import Input from 'sub-antd/lib/input'
import Radio from 'sub-antd/lib/radio'
import Tooltip from 'sub-antd/lib/tooltip'
import SysIcon from 'components/sysIcon'
import {twoColLayout} from "components/layout/formLayout"
import {required,max,dmax} from 'components/sysForm/sysRules'
const FormItem = Form.Item
const RadioGroup = Radio.Group
export class EnumItemEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            baseData:this.props.baseData
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name', {
            initialValue: this.props.baseData.name,
            rules: [required,max(20)],
        });
        const descProps = getFieldProps('describe', {
            initialValue: this.props.baseData.describe?this.props.baseData.describe:'',
            rules: [dmax(200)]
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
                    <Input.CountDown 
                        type="textarea" 
                        maxTextareaLength={200} 
                        rows={5} 
                        {...descProps}
                    />
                </FormItem>        
                <FormItem label={<span>状态
                    <Tooltip title={<div>正常：在对应下拉框的下拉选项中可选。<br/>
                                        作废：在对应下拉框的下拉选项中不可见，但已被选为属性值的选项将继续显示。
                                    </div>}>
                        <i>
                            <SysIcon 
                            name="tips" 
                            style={{color:'#6398b4',fontSize:10,verticalAlign:'4px',margin:'0 2px'}}/>
                        </i>
                    </Tooltip></span>} {...twoColLayout}>
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
