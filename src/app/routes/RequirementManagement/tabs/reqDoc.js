import React, { Component } from 'react'
// import Tabs from 'sub-antd/lib/tabs';
// const TabPane = Tabs.TabPane;
import TBLayout from 'components/sysLayout/TBLayout'
import SysTabs from 'components/sysTabs'
const TabPane = SysTabs.TabPane;
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import SysIcon from 'components/sysIcon'
import SysTable from 'components/sysTable'
import SysModal from 'components/sysModal'
import SysDetailPanel from 'components/sysDetailPanel'
import columns from '../columns/reqDoc'
// import DocAdd from '../forms/docAdd'
import AccessAuthority from './accessAuthority'
import Menu from 'sub-antd/lib/menu';
import Dropdown from 'sub-antd/lib/dropdown';
import Icon from 'sub-antd/lib/icon';
import axios from 'axios';
import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import Button from 'sub-antd/lib/button';
import SysForm from 'components/sysForm'
import Select from 'sub-antd/lib/select';
import Steps from 'sub-antd/lib/steps';
import { logger, isBtnShowOrNot } from '../../storybook/ViewerTree/Utils';
const Step = Steps.Step
import DocumentTemplate from '../../requirementDocumentConfig/tabs/documentTemplate'
import SetBasicInfo from '../forms/setBasicInfo'
import ProductMove from '../forms/productMove'
import '../index.scss'
import './reqDoc.scss'
class ReqDoc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hideBottom: true,
            selectId: this.props.selectId,
            selectRows: [],
            selectKeys: [],//行id
            srcType: 1, //srcType=1 时 objectId为文档id 
            btnDisabledFn() { },
            DocAddModal: false,
            current: 0,
            // setBaseInfoformData:{},
            fileListId: '',
            docModal: 1,
            onGetRandomNum: '',
            fileNum: 0,
            pageOfficeHost: '',
        }
        this.setBaseInfoData = {}
    }
    componentWillReceiveProps(nextProps, nextState) {
        this.props.selectId !== nextProps.selectId
            && this.setState({ selectId: nextProps.selectId })
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

    handleCancel = (e) => {
        this.$addForm.props.form.resetFields();
        this.setBaseInfoData = {}
        this.setState({
            current: 0,
            // setBaseInfoformData:{},
            onGetRandomNum: '',
            DocAddModal: false,
        });

    }
    //Step组件的事件
    next = () => {
        this.$addForm.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            } else {
                // this.setState({
                //     setBaseInfoformData: values,
                // })    
                axios.get(`/sysware/api/document/validateCode?projectId=&code=${values.code}`).then(res => {
                   if(res.data.code==200){   
                    let setBaseInfoData = this.setBaseInfoData = { ...this.setBaseInfoData, ...values};
                    let current = this.state.current + 1; 
                    if (current > 2) {
                        current = 2;  
                        if (this.state.fileNum > 0) {
                            if (this.state.onGetRandomNum) {
                                axios.post(`/sysware/api/document/save`, { ...setBaseInfoData,documentType:setBaseInfoData.documentType.key, projectId: this.state.selectId, tempFlag: this.state.onGetRandomNum, }).then(res => {
                                    let data = res.data.data.resultSet || res.data.data || [];
                                    this.setBaseInfoData = {}
                                    this.setState({
                                        docType: data,
                                        DocAddModal: false,
                                        current: 0,
                                        onGetRandomNum: '',
                                    }, () => {
                                        this.$table.load()
                                    });
                                }).catch(error => {
                                    console.log(error);
                                })
                            } else {
                                message.warn('文档模板不能为空！')
                            }
                        } else {
                            message.warn('文档模板不能为空！')
                        } 
                    }
                    this.setState({ current });
                   }else{
                    message.error(res.data.message);
                   }
                }).catch(error => {
                    console.log(error);
                })    
            }
        });
    };
    prev = () => {
        let current = this.state.current - 1;
        if (current < 0) {
            current = 0;
        }
        this.setState({ current })
    }
    add() {
        this.setState({
            DocAddModal: true,
        });
        // SysModal.addAndNext({
        //     width:900,
        //     url:`/sysware/api/document/save`,
        //     content:<DocAdd onRef={(el)=>this.$addForm=el}/>,
        //     form:()=>this.$addForm,
        //     table:()=>this.$table,
        //     paramsBuilder:()=>({
        //         projectId:this.state.selectId
        //     })
        // })
    }
    delete() {
        this.$table.delete('/sysware/api/document/delete')
    }
    moveTo(){
        SysModal.add({
            title:'选择移动位置',
            url:'/sysware/api/project/moveTo',
            width:460,
            content:<ProductMove onRef={(el)=>this.$moveForm=el} currentIds={this.state.selectKeys}/>,
            form:()=>this.$moveForm,
            paramsBuilder:()=>{
                return {moveType:1}
            },
            onOk:({targetId})=>{
                this.props.treeLoad([targetId])
            }
        })
    }
    move(opea) {
        this.$table.move('/sysware/api/document/move', opea)
    }
    selectChange = (selectKeys, selectRows) => {
        this.setState({ selectRows, selectKeys })
        if (selectRows.length === 1) {
            this.setState({ hideBottom: false })
        } else {
            this.setState({ hideBottom: true })
        }
    }
    onSave = () => {
        this.$table.load(this.state.selectKeys)
    }

    menuHref(e, record) {
        if (e.key == '1' || e.key == '2') {
            axios.get(`/sysware/api/document/lockDocu?documentId=${record.id}&editType=${e.key}`).then(res => {
                if (res.data.code === 200) {
                    if(this.props.pageTypes){ 
                        window.location.href = `requirement_fullpage.html?id=${record.id}&edit_type=${e.key}&pageTypes=1`;
                    }else{
                        window.location.href = `requirement_fullpage.html?id=${record.id}&edit_type=${e.key}`;
                    }
                }
                else {
                    message.error(res.data.message);
                }
            })
        } else {
            if(this.props.pageTypes){
                window.location.href = `requirement_fullpage.html?id=${record.id}&edit_type=${e.key}&pageTypes=1`;
            }else{
                window.location.href = `requirement_fullpage.html?id=${record.id}&edit_type=${e.key}`;
            }
            // window.location.href = `requirement_fullpage.html?id=${record.id}&edit_type=${e.key}`;
        }
    }
    btnDisabled = (btnDisabledFn) => {
        this.setState({ btnDisabledFn })
    }

    //弹框内容
    getStepContent = (current) => {
        switch (current) {
            case 0:
                return <SetBasicInfo onRef={(el) => this.$addForm = el} setBaseInfoformData={this.setBaseInfoData} />;
            case 1:
                return <DocumentTemplate selectId={this.state.selectId} docStep={1} docModal={this.state.docModal} pageOfficeHost={this.state.pageOfficeHost}
                    onGetRandom={(onGetRandomNum) => this.setState({ onGetRandomNum })} fileNum={(fileNum) => this.setState({ fileNum })}
                />;
            case 2:
                return <DocumentTemplate selectId={this.state.selectId} docStep={2} docModal={this.state.docModal} pageOfficeHost={this.state.pageOfficeHost}
                    onGetRandom={(onGetRandomNum) => this.setState({ onGetRandomNum })} fileNum={(fileNum) => this.setState({ fileNum })}
                />;
        }
    }
    
    render() {
        const status = {
            title: <div style={{ width: 35, textAlign: 'center' }}></div>,
            width: 55,
            dataIndex: "userEditType",
            nowrap: true,
            render: (text, record, index) => { 
               let eidtText= record.userEditType == 1 ?'共享编辑' : record.userEditType == 2 ? '独占编辑':''  
                return <div title={record.editUser ? record.editUser.join(',')+'正在'+ eidtText : ''} style={{ textAlign: 'center' }}>
                    {text === 1 ? <SysIcon name="teamwork" style={{ width: '14px' }} /> : ''}
                    {text === 2 ? <SysIcon name="oneself" style={{ width: '14px' }} /> : ''}
                </div>;
            }
        }
        const number = {
            title: <div style={{ width: 35, textAlign: 'center' }}>序号</div>,
            width: 55,
            dataIndex: "number",
            nowrap: true,
            render: (text, record, index) => {
                return <div title={index + 1} style={{ textAlign: 'center' }}>{index + 1}</div>;
            }
        }
        const mode = {
            title: "文档名称",
            //width:150,
            dataIndex: "documentName",
            nowrap: true,
            render: (text, record, index) => {
                return (
                    <div className='reqDoc'>
                        {text}
                        <span className='reqDoc_span' onClick={(e) => { e.stopPropagation() }}>
                            <SysButton.Dropdown icon="bianjibiankuang"
                                onItemClick={(e) => this.menuHref(e, record)}
                                title='编辑' >
                                {[
                                    { title: '查看' },
                                    { title: '共享编辑', disabled: isBtnShowOrNot('共享编辑')({ editType: record.userEditType, editUser: record.editUser, currentUser: this.props.currentUser }) },
                                    { title: '独占编辑', disabled: isBtnShowOrNot('独占编辑')({ editType: record.userEditType, editUser: record.editUser, currentUser: this.props.currentUser }) }
                                ]}
                            </SysButton.Dropdown>
                        </span>
                    </div >
                );
            },
        }
        //SysDetailPanel.create(DocAdd,1)
        return (
            <TBLayout id="reqDoc" draggable closable
                hideBottom={this.state.hideBottom}
            >
                {{
                    top: (
                        <div style={{ height: '100%' }}>
                            <SysToolBar>
                                <SysButton title="新增" icon="add" aclValues={this.state.selectRows.length ? this.state.selectRows[0].valueList : []}
                                    onClick={() => this.add()}
                                />
                                <SysButton title="删除" icon="delete" aclValues={this.state.selectRows.length ? this.state.selectRows[0].valueList : []}
                                    onClick={() => this.delete()}
                                    disabled={this.state.btnDisabledFn('multiple')}
                                />
                                <SysButton title="移动至" icon="adjust-category" 
                                    //aclValues={this.state.selectRows[0]?this.state.selectRows[0].valueList:[]}
                                    onClick={() => this.moveTo()}
                                    disabled={this.state.btnDisabledFn('multiple')}
                                />
                                <SysButton title="上移" icon="moveup" aclValues={this.state.selectRows.length ? this.state.selectRows[0].valueList : []}
                                    onClick={() => this.move('up')}
                                    disabled={this.state.btnDisabledFn('up')}
                                />
                                <SysButton title="下移" icon="movedown" aclValues={this.state.selectRows.length ? this.state.selectRows[0].valueList : []}
                                    onClick={() => this.move('down')}
                                    disabled={this.state.btnDisabledFn('down')}
                                />
                            </SysToolBar>
                            <SysTable
                                ref={(el) => this.$table = el}
                                dataUrl={this.state.selectId ? `/sysware/api/document/list?projectId=${this.state.selectId}` : ''}
                                // number
                                minWidth={620}
                                columns={[status, number, mode, ...columns]}
                                selectChange={this.selectChange}
                                btnDisabled={this.btnDisabled}
                            />

                            <Modal title="新增" width='900px' visible={this.state.DocAddModal}
                                onCancel={this.handleCancel}
                                footer={[
                                    <Button key="prev" type="ghost" onClick={this.prev} style={this.state.current == 0 ? { display: 'none' } : { display: 'inline-block' }} >上一步</Button>,
                                    <Button key="submit" type="primary" loading={this.state.loading} onClick={this.next}>
                                        {this.state.current == 2 ? '确定' : '下一步'}
                                    </Button>,
                                    <Button key="cancel" type="ghost" onClick={this.handleCancel}>取消</Button>,
                                ]}
                            >
                                <div className='guideLineBox'>
                                    <div className='guideLineBox-left'>
                                        <Steps direction="vertical" current={this.state.current}>
                                            <Step title="设置基本信息" key='0' />
                                            <Step title="导入条目" key='1' />
                                            <Step title="设置文档模板" key='2' />
                                        </Steps>
                                    </div>
                                    <div className='guideLineBox-right'>
                                        {this.getStepContent(this.state.current)}
                                    </div>
                                </div>
                                {/* <DocAdd onRef={(el)=>this.$addForm=el} current={this.state.current} setBaseInfoformData={this.state.setBaseInfoformData} fileListId={this.fileListId}  />  */}
                            </Modal>
                        </div>
                    ),
                    bottom: (
                        this.state.selectRows.length === 1 &&
                        <SysTabs ref={el=>this.$tab=el}>
                            <TabPane title="基本信息">
                                <SysDetailPanel
                                    remoteUpdate
                                    detailUrl={`/sysware/api/document/queryDetail?documentId=${this.state.selectRows[0].id}`}
                                    plain="requirementManagement/forms/reqDocInfo"
                                    modify="requirementManagement/forms/reqDocEdit"
                                    onSave={this.onSave}
                                />
                            </TabPane>
                            <TabPane title="访问权限">
                                <AccessAuthority
                                    selectId={this.state.selectRows[0].id}
                                    srcType={this.state.srcType}
                                    selectRow={this.state.selectRows}
                                    onError={() => this.$tab.onChange('0')}
                                />
                            </TabPane>
                        </SysTabs>
                    )
                }}
            </TBLayout>
        )
    }
}

export default ReqDoc
