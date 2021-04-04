import React, { Component } from 'react'
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import SysTable from 'components/sysTable'
import SysModal from 'components/sysModal'
import columns from '../columns/doc_type'
import DocTypeAdd from '../forms/docTypeAdd'
import DocTypeEdit from '../forms/docTypeEdit'
class DocType extends Component {
    constructor(props){
        super(props)
        this.state={
            selectRows:[],
            btnDisabledFn(){} 
        }
    }
    add(){
        SysModal.add({
            width:466,
            url:'/sysware/api/se/basicdata/add',
            paramsBuilder:()=>{
                return {
                    parentId:0,
                    code:'611_ORM',
                    column4:'正常'
                }
            },
            content:<DocTypeAdd onRef={(el)=>this.$addForm=el} baseData={{}}/>,
            form:()=>this.$addForm,
            table:()=>this.$table
        })
    }
    edit(){
        if(this.state.selectRows.length !== 1){
            SysModal.error('请选择一条数据')
            return;
        }
        SysModal.edit({
            width:466,
            url:'/sysware/api/se/basicdata/update',
            paramsBuilder:()=>{
                return this.state.selectRows[0];
            },
            content:<DocTypeEdit onRef={(el)=>this.$editForm=el} baseData={this.state.selectRows[0]}/>,
            form:()=>this.$editForm,
            table:()=>this.$table
        })

    }
    delete(){
        this.$table.delete('/sysware/api/se/basicdata/delete')
    }
    move(opea){
        this.$table.move('/sysware/api/se/basicdata/move',opea,(item)=>{
            return {id:item.id,sortStr:opea,code:item.code}
        })
    }   
    selectChange=(keys,rows)=>{
        this.setState({selectRows:rows}) 
    }
    btnDisabled=(btnDisabledFn)=>{
        this.setState({btnDisabledFn})
    }
    render() {
        return (
            <div style={{ height: "100%" }}>
                <SysToolBar>
                    <SysButton
                        title="新增" icon="add"
                        onClick={() => this.add()}
                    />
                    <SysButton
                        title="编辑" icon="edit"
                        onClick={() => this.edit()}
                        disabled={this.state.btnDisabledFn('single')}
                    />
                    <SysButton
                        title="删除" icon="delete"
                        onClick={() => this.delete()}
                        disabled={this.state.btnDisabledFn('multiple')}
                    />
                    <SysButton
                        title="上移" icon="moveup"
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
                    dataUrl="/sysware/api/se/basicdata/loadBypid?pid=0&code=611_ORM"
                    number
                    columns={columns}
                    selectChange={this.selectChange}
                    btnDisabled={this.btnDisabled}
                />
            </div>
        );
    }
}
export default DocType