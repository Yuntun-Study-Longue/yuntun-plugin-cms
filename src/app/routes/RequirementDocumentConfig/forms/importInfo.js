import React, { Component } from 'react'
import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import axios from 'axios'
import Table from 'sub-antd/lib/table'
import qs from 'querystring';
const queryMatch = qs.parse(location.search.slice(1));
export default class ImportInfo extends Component {
    constructor(props) {
        console.log(props)
        super(props)
        this.state = {
            selectedRowKeys: [],
            dataSource: [],
        }

    }
    componentDidMount() {
        this.getImportList()
    }
    UNSAFE_componentWillReceiveProps(nextProp, nextState) { 
        this.props.showModal !== nextProp.showModal
        && this.getImportList()
    }
    onSelectChange=(selectedRowKeys)=> { 
        this.setState({ selectedRowKeys });
    }

    getImportList = () => {
        let importListUrl = `sysware/api/org-udef/listImport?documentId=${this.props.documentId}`
        axios.get(importListUrl).then(res => {  
            if (res.data.code == 200) { 
                this.setState({
                    dataSource: res.data.data, 
                })
            } else {
                message.error(res.data.message);
            }
        }, rej => {
            console.log(rej)
        }).catch(error => {
            console.log(error);
        })
    }

    handleCancel = () => {
        let status = false;
        this.props.status(status)
        this.setState({
            selectedRowKeys: [], 
        })
        this.props.refreshParentPage()
    }

    handleOk=()=>{
         let importOkUrl=`/sysware/api/docu/importOrgToDocu`
         axios.post(importOkUrl,{docId: queryMatch.id,orgAttrIds:this.state.selectedRowKeys}).then(res => { 
            if (res.data.code == 200) {  
                message.success('导入成功！');
                let status = false;
                this.props.status(status)
                this.props.refreshParentPage()
            } else {
                message.error(res.data.message);
            }
           
        }, rej => {
            console.log(rej)
        }).catch(error => {
            console.log(error);
        }) 
    }
   
    render() {
        const { showModal } = this.props;
        const columns = [
            {
                title: '名称',
                dataIndex: 'attrCode',
                key: 'attrCode',
                nowrap: true,
            },
            {
                title: '数据类型',
                width: 90,
                dataIndex: 'attrType',
                key: 'attrType',
                nowrap: true,
                render: (text, record, index) => {
                    const attrTypes = {
                        0: '文本',
                        1: '长文本',
                        2: '文件',
                        3: '日期',
                        4: '用户',
                        5: '枚举',
                        6: '枚举',
                        7: '功能列'
                    }
                    let attrText = attrTypes[text] ? attrTypes[text] : 'nein'
                    return <div title={attrText}>{attrText}</div>;
                }
            },
            {
                title: '作用范围',
                width: 90,
                dataIndex: 'scope',
                key: 'scope',
                nowrap: true,
                render: (text, record, index) => {
                    const scopes = {
                        1: '文档',
                        2: '条目',
                        3: '条目,文档'
                    }
                    return <div title={scopes[text]}>{scopes[text]}</div>;
                }
            },
            {
                title: '触发条目变更',
                width: 120,
                dataIndex: 'changeItem',
                key: 'changeItem',
                nowrap: true,
                render: (text, record, index) => {
                    const status = {
                        0: '否',
                        1: '是',
                    }
                    return <div title={status[text]}>{status[text]}</div>;
                }
            },
            {
                title: '生成历史记录',
                width: 120,
                dataIndex: 'createHistory',
                key: 'createHistory',
                nowrap: true,
                render: (text, record, index) => {
                    const status = {
                        0: '否',
                        1: '是',
                    }
                    return <div title={status[text]}>{status[text]}</div>;
                }
            },
        ]
        const { selectedRowKeys,dataSource } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <Modal  
                title='导入组织级扩展属性' 
                visible={showModal}
                width={624} 
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Table size="small" scroll={{ y:339 }}
                    pagination={false}
                    dataSource={dataSource}
                    rowKey={record=>record.id}
                    rowSelection={rowSelection} 
                    columns={columns} 
                />
            </Modal>

        )
    }
}
