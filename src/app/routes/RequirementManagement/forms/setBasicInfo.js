import React, { Component } from 'react'
import axios from 'axios';
import SysForm from 'components/sysForm'
import Select from 'sub-antd/lib/select';
import Button from 'sub-antd/lib/button'; 
const Option = Select.Option;
const FormItem = SysForm.Item;
import Input from 'sub-antd/lib/input';
import { halfFourColLayout, fourColLayout } from "components/layout/formLayout";
import { required, max, dmax } from 'components/sysForm/sysRules' 
//设置基本信息 SetBasicInfo
class SetBasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docType: [],
            setBaseInfoformData:this.props.setBaseInfoformData,
            isloading: false,
        } 
    } 
    // componentWillMount() {
    //     axios.get(`/sysware/api/se/basicdata/loadBypid?pid=0&code=611_ORM&state=1`).then(res => {
    //         let data = res.data.data.resultSet || res.data.data || [];
    //         this.setState({
    //             docType: data
    //         });
    //     }).catch(error => {
    //     })
    // } 
    onToggleShow = (visible) => {
        if (visible) {
            this.setState({
                isloading: true,
            });
            axios.get(`/sysware/api/se/basicdata/loadBypid?pid=0&code=611_ORM&state=1`).then(res => {
                let data = res.data.data.resultSet || res.data.data || [];
                this.setState({
                    docType: data,
                    isloading: false,
                });
            }).catch(error => {

                this.setState({
                    docType: [],
                });
            }) 
        } else {
            this.setState({
                docType: [],
            });
        }
    }

 
    componentDidMount() {
        this.props.onRef(this); 
    } 
    render() {
        const { getFieldProps } = this.props.form;
        const nameProps = getFieldProps('documentName', {
            initialValue: this.state.setBaseInfoformData.documentName,
            rules: [required,max(100)],
            trigger: ['onBlur', 'onChange']
        });
        const codeProps = getFieldProps('code', {
            initialValue: this.state.setBaseInfoformData.code,
            rules: [required,max(200)],
            trigger: ['onBlur', 'onChange']
        });
        const typeProps = getFieldProps('documentType', {
            // initialValue: this.state.setBaseInfoformData.documentType,
            initialValue:  {
                key:this.state.setBaseInfoformData.documentType? this.state.setBaseInfoformData.documentType.key:'',
                label:this.state.setBaseInfoformData.documentType? this.state.setBaseInfoformData.documentType.label:''
            },
            rules: [required],
            trigger: ['onBlur', 'onChange']
        });
        const options = this.state.docType.map(type => <Option key={type.id} value={type.id}>{type.column1}</Option>);
        const descProps = getFieldProps('describe', {
            initialValue: this.state.setBaseInfoformData.describe,
            rules: [dmax(500)],
        });
        return (
            <SysForm  >
            <FormItem label='文档名称：'  {...fourColLayout}>
                <Input type="text" {...nameProps} />
            </FormItem>
            <FormItem label='文档编号：' {...fourColLayout}>
                <Input type="text" {...codeProps} />
            </FormItem>
            <FormItem label='文档类型：' {...halfFourColLayout}>
                <Select {...typeProps}
                    onToggleShow={this.onToggleShow}
                    labelInValue
                    allowClear
                    async
                    isloading={this.state.isloading}
                    loadingContent="加载中..."
                >
                    {options}
                </Select>
            </FormItem>
            <FormItem label='文档说明：' {...fourColLayout}>
                <Input.CountDown
                    type="textarea"
                    maxTextareaLength={500}
                    rows={5}
                    {...descProps}
                />
            </FormItem> 
        </SysForm>
        )
    }
}
SetBasicInfo = SysForm.create()(SetBasicInfo);
export default SetBasicInfo