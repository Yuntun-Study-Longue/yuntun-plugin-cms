import React, { Component } from 'react'
import axios from 'axios';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import { halfFourColLayout, fourColLayout } from "components/layout/formLayout";
import SysForm from 'components/sysForm'
import { required, max, dmax } from 'components/sysForm/sysRules'
import Select from 'sub-antd/lib/select';
import Steps from 'sub-antd/lib/steps';
import Button from 'sub-antd/lib/button';
const Step = Steps.Step
const Option = Select.Option;
const FormItem = SysForm.Item;
import message from 'sub-antd/lib/message';
import DocumentTemplate from '../../requirementDocumentConfig/tabs/documentTemplate'
import SetBasicInfo from '../forms/setBasicInfo'
import '../index.scss' 
export class DocAdd extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            pageOfficeHost: '',
            docModal: 1, 
            formData:'',
            onGetRandomNum:''
        }  
    }
 
    componentDidMount() {   
        this.getPageOfficeHost();
    }  
    getPageOfficeHost() {
        this.submitRequest('/sysware/pageoffice/pageofficeUrl', null, (pageOfficeHost) => {
            this.setState({ pageOfficeHost })
        }, 'GET');
    }
    submitRequest(url, data, callbackFn, method = 'post') {
        axios({ method, url, data }).then(res => {
            if (res.data.code === 200) {
                callbackFn && callbackFn(res.data.data)
            }
            else {
                message.error(res.data.message);
            }
        })
    }
    getStepContent = (current) => {  //this.state.attrType === 5 ? {} : { display: "none" }
        switch (current) {
            case 0:
                return <SetBasicInfo  onAddRef={this.props.onRef} setBaseInfoformData={this.props.setBaseInfoformData}/>;
            case 1:
                return <DocumentTemplate docStep={1} docModal={this.state.docModal} pageOfficeHost={this.state.pageOfficeHost} />;
            case 2:
                return <DocumentTemplate docStep={2} docModal={this.state.docModal} pageOfficeHost={this.state.pageOfficeHost} fileListId={this.props.fileListId} 
                onGetRandom = {(onGetRandomNum)=>console.log('hahahahaha',a)} 
                />;
        }
    } 
    render() {
        const { current } = this.props;
        return (
            <div>
                <div style={{ width: '180px', paddingLeft: '19px', paddingTop: '27px', float: 'left', borderRight: '1px solid #D8D8D8', color: '#005785' }}>
                    <Steps direction="vertical" current={this.props.current}>
                        <Step title="设置基本信息" key='0' />
                        <Step title="导入条目" key='1' />
                        <Step title="设置文档模板" key='2' />
                    </Steps>
                </div>
                <div style={{ width: '720px', float: 'left' }}>
                    {this.getStepContent(current)}
                </div>
            </div>
        )
    }
}
// DocAdd = SysForm.create()(DocAdd);
export default DocAdd
