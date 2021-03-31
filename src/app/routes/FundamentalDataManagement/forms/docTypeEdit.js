import React, { Component } from 'react';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Radio from 'sub-antd/lib/radio';
import {twoColLayout} from "components/layout/formLayout";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import SysIcon from 'components/sysIcon'
import Tooltip from 'sub-antd/lib/tooltip';
class DocTypeEdit extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    render() {
        const { getFieldProps, setFieldsValue, resetFields } = this.props.form;
        const nameProps = getFieldProps('column1', {
            initialValue: this.props.baseData.column1,
            rules: [ 
                { required: true, message: '请输入名称' },
                { max: 20, message: '请控制内容长度不超过20个字' }, 
            ],
          });
          const codeProps= getFieldProps('column2', {
            initialValue: this.props.baseData.column2,
            rules: [
                { required: true, message: '请输入识别码' },
                { max: 20, message: '请控制内容长度不超过20个字' },
            ],
          });
        const descProps = getFieldProps('column3', {
            initialValue: this.props.baseData.column3?this.props.baseData.column3:'',
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ]
        });
        const statusProps = getFieldProps('column4', {
            initialValue: this.props.baseData.column4,
            rules: [
                { max: 200, message: '请控制内容长度不超过200个字' },
            ],
        });
        return (
            <Form inline>
                <FormItem label='名称：' {...twoColLayout}>
                    <Input type="text" {...nameProps} />
                </FormItem>
                <FormItem label='识别码：' {...twoColLayout}>
                    <Input type="text" {...codeProps} />
                </FormItem>
                <FormItem label='描述：' {...twoColLayout}>
                    <Input.CountDown 
                        type="textarea" 
                        maxTextareaLength={200} 
                        rows={5} 
                        {...descProps}
                    />
                </FormItem>
              
                <FormItem  label={<span>状态
                    <Tooltip 
                        title={
                            <div>
                                正常：在对应下拉框的下拉选项中可选。<br/>
                                作废：在对应下拉框的下拉选项中不可见，但已被选为属性值的选项将继续显示。
                            </div>
                        } 
                    ><i><SysIcon 
                        name="tips" 
                        style={{color:'#6398b4',fontSize:10,verticalAlign:'4px',margin:'0 2px'}}
                    /></i></Tooltip> </span>} 
                {...twoColLayout}
                >
                    <RadioGroup {...statusProps}>
                        <Radio key="a" value={'正常'}>正常</Radio>
                        <Radio key="b" value={'作废'}>作废</Radio>
                    </RadioGroup>
                </FormItem>
            </Form> 
        )
    }
}
// DocTypeEdit = Form.create()(DocTypeEdit);

export default DocTypeEdit