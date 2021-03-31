import React, { Component } from 'react'
import LRLayout from 'components/sysLayout/LRLayout'
import SysTable from 'components/sysTable'
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import SysModal from 'components/sysModal'
import SysDetailPanel from 'components/sysDetailPanel'
import columns from '../columns/requirement_extension'
import BaseInfoAdd from '../forms/baseInfoAdd'
class ReqExtension extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectRows:[],
            btnDisabledFn(){} 
        }
    }
    add(){
        SysModal.addAndNext({
            url:'/sysware/api/org-udef/save',
            content:<BaseInfoAdd onRef={(el)=>this.$addForm=el}/>,
            form:()=>this.$addForm,
            table:()=>this.$table
        })
    }
    delete(){
        this.$table.delete('/sysware/api/org-udef/delete')
    }
    move(opea){
        this.$table.move('/sysware/api/org-udef/updateSort',opea,(item)=>{
            return {id:item.id,sortStr:opea}
        })
    }    
    selectChange=(keys,rows)=>{
        this.setState({
            selectRows:rows
        })
    }
    onSave=(data)=>{
        this.$table.load([this.state.selectRows[0].id])
    }
    btnDisabled=(btnDisabledFn)=>{
        this.setState({btnDisabledFn})
    }
    render() {
        return (
            <LRLayout draggable closable>
                {{
                    left: (
                        <LRLayout.LeftPanel>
                            <SysToolBar>
                                <SysButton
                                    title="新增"
                                    icon="add"
                                    onClick={() => this.add()}
                                />
                                <SysButton
                                    title="删除"
                                    icon="delete"
                                    onClick={() => this.delete()}
                                    disabled={this.state.btnDisabledFn('multiple')}
                                />
                                <SysButton
                                    title="上移"
                                    icon="moveup"
                                    onClick={() => this.move("up")}
                                    disabled={this.state.btnDisabledFn('up')}
                                />
                                <SysButton
                                    title="下移"
                                    icon="movedown"
                                    onClick={() => this.move("down")}
                                    disabled={this.state.btnDisabledFn('down')}
                                />
                            </SysToolBar>
                            <SysTable
                                ref={(el) => (this.$table = el)}
                                dataUrl="/sysware/api/org-udef/list"
                                number minWidth={260}
                                columns={columns}
                                selectChange={this.selectChange}
                                btnDisabled={this.btnDisabled}
                            />
                        </LRLayout.LeftPanel>
                    ),
                    right: this.state.selectRows.length === 1 && (
                        <LRLayout.RightPanel>
                            <SysDetailPanel
                                detailUrl={`/sysware/api/org-udef/queryDetail?id=${this.state.selectRows[0].id}`}
                                plain="fundamentalDataManagement/forms/reqExtensionInfo"
                                modify="fundamentalDataManagement/forms/reqExtensionEdit"
                                onSave={this.onSave}
                            />
                        </LRLayout.RightPanel>
                    ),
                }}
            </LRLayout>
        );
    }
}
export default ReqExtension