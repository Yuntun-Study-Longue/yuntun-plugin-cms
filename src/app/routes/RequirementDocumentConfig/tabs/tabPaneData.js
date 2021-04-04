import React, { Component } from 'react'
import qs from 'querystring';
import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import axios from 'axios'
import Table from 'sub-antd/lib/table'
import getColumns from '../columns/getColumns'
import LRLayout from 'components/sysLayout/LRLayout'
import SysTable from 'components/sysTable'
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton' 
import SysModal from 'components/sysModal'
import ImportInfo from '../forms/importInfo' 
import DocConfigAdd from '../forms/docConfigAdd'
import SysDetailPanel from 'components/sysDetailPanel'

const queryMatch = qs.parse(location.search.slice(1));
export default class TabPaneData extends Component {
    constructor(props){
        super(props);
        this.state = { 
            selectedRowKeys:[], //行 id
            selectedRows:[],  //行数据
            showModal:false,
            
        }
    }
  
    addOption=()=>{{ 
        SysModal.addAndNext({
            url:'/sysware/api/docu/add',
            content:<DocConfigAdd onRef={(el)=>this.$addForm=el} baseData={{}}/>,
            form:()=>this.$addForm,
            table:()=>this.$table,
            paramsBuilder:()=>{
                return {
                    documentId:queryMatch.id
                }
            }
        })
    }}

   
    delOption=()=>{{
        SysModal.confirm('删除属性会造成当前文档中所有条目对应的属性值和所有视图中对应的属性列、过滤条件被清除，且无法恢复。确定删除吗？',
        ()=>{
            this.$table.delete('/sysware/api/docu/del')  
        })
    }}

    moveOption=(opea)=>{{
        this.$table.move('/sysware/api/docu/move',opea,(item)=>{
            return {id:item.id ,sortStr:opea}
        })   
    }}
   
    showModal() {
        this.setState({
          visible: true, 
        });
      } 

    importOption=()=>{{   
        this.setState({
            showModal:true
        })  
    }} 

    //改变弹框显示状态
    changeStatus = (status) => {
        this.setState({
            showModal: status
        })
      }

    selectChange=(keys,rows)=>{ 
        this.setState({
            selectedRowKeys:keys,
            selectedRows:rows
        })
    }

    onSave=(data)=>{
        this.$table.load()
    }
    refreshPage=()=>{
        this.$table.load()  
    }

    render() {
        
        return (
            <LRLayout id='rdc' draggable >
                {{
                    left:(
                        <LRLayout.LeftPanel>
                            <SysToolBar>
                                <SysButton title="新增" icon="add" onClick={()=>this.addOption()}/>  
                                <SysButton title="删除" icon="delete" 
                                    onClick={()=>this.delOption()}
                                    disabled={this.state.selectedRowKeys.length === 0}
                                /> 
                                <SysButton title="导入组织级扩展属性" icon="import" onClick={this.importOption}/> 
                                <SysButton title="上移" icon="moveup" 
                                    onClick={()=>this.moveOption('up')}
                                    disabled={this.state.selectedRowKeys.length !== 1}
                                />
                                <SysButton title="下移" icon="movedown" 
                                    onClick={()=>this.moveOption('down')}
                                    disabled={this.state.selectedRowKeys.length !== 1}
                                />
                            </SysToolBar>
                            <SysTable 
                                ref={(el)=>this.$table=el} 
                                dataUrl={`/sysware/api/docu/list?docId=${queryMatch.id}`} 
                                number minWidth={630}
                                columns={getColumns}
                                selectChange={this.selectChange}
                            /> 
                            <ImportInfo
                             documentId = {queryMatch.id}
                             showModal={this.state.showModal} 
                             refreshParentPage={() => this.refreshPage()}
                             status={this.changeStatus}
                             />
                        </LRLayout.LeftPanel>
                    ),
                    right:( 
                        this.state.selectedRows.length === 1 && 
                        <LRLayout.RightPanel>
                            <SysDetailPanel 
                                detailUrl={`/sysware/api/docu/queryDetail?id=${this.state.selectedRowKeys}`}  
                                plain="requirementDocumentConfig/forms/docConfigInfo" 
                                modify="requirementDocumentConfig/forms/docConfigEdit"
                                onSave={this.onSave}
                            />
                        </LRLayout.RightPanel>
                    )
                }}
            </LRLayout>
        )
    }
}
