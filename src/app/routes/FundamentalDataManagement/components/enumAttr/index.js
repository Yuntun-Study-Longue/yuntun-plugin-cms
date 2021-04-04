import React, { Component } from 'react';
import SysModal from 'components/sysModal'
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import SysTable from 'components/sysTable'
import columns from '../../columns/enum_attr'
import EnumItemAdd from './enumItemAdd'
import EnumItemEdit from './enumItemEdit'
export default class EnumAttr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows:[],
            selectedKeys:[],
            data: this.props.data
        }
    }
    add() {
        SysModal.addAndNext({
            width:460,
            content:<EnumItemAdd onRef={el=>this.addForm = el}/>,
            form:()=>this.addForm,
            onOk:(values,window)=>{
                const existItem = this.state.data.find(item => item.name === values.name)
                if (existItem) {
                    SysModal.error('已存在同名枚举名称')
                    return
                }
                const addItem = { ...values, id:"local"+( + new Date()), isUsed: 0, attrId: this.props.attrId };
                this.setState({data: [...this.state.data, addItem]}, () => {
                    SysModal.success("新增成功！");
                    if(window)window.close()
                });
            }
        })
    }
    edit(){
        SysModal.edit({
            width:460,
            content:<EnumItemEdit onRef={el=>this.editForm = el} baseData={this.state.selectedRows[0]}/>,
            form:()=>this.editForm,
            onOk:(values,window)=>{
                const newData = this.state.data.map((item)=>{
                    if(item.id === this.state.selectedRows[0].id){
                        return {...item,...values}
                    }
                    return item
                })
                this.setState({
                    data:newData,
                    selectedRows:newData.filter((item)=>item.id === this.state.selectedRows[0].id)
                }, () => {
                    SysModal.success("保存成功！");
                    window.close()
                });
            }
        })
    }
    delete(){
        const data = this.state.data.filter(item =>!this.state.selectedKeys.includes(item.id))
        this.setState({
            data,
            selectedRows:[],
            selectedKeys:[],
        }, () => {
            SysModal.success("删除成功！");
        })
    }
    move(opea){
        const data = this.state.data.slice(0);
        let selectedIdIndex = this.getSelectRowIndex();
        if(opea === 'up'){
            data[selectedIdIndex] = data.splice(selectedIdIndex-1,1,data[selectedIdIndex])[0];
            this.setState({data})
        }else{
            data[selectedIdIndex] = data.splice(selectedIdIndex+1,1,data[selectedIdIndex])[0];
            this.setState({data})
        }
    }
    selectChange=(keys,rows)=>{
        this.setState({selectedKeys:keys,selectedRows:rows})
    }
    getSelectRowIndex(){
        if(this.state.selectedKeys.length === 1){
            const data = this.state.data.slice(0);
            const ids = data.map(item=>item.id);
            const selectedId = this.state.selectedKeys[0];
            const selectedIdIndex = ids.indexOf(selectedId);
            return selectedIdIndex;
        }
    }
    btnDisabled=(oper)=>{
        const len = this.state.selectedKeys.length;
        const operFn = {
            'single':()=>{
                return len !== 1
            },
            'multiple':()=>{
                return len === 0
            },
            'up':()=>{
                return len === 1?this.getSelectRowIndex() === 0:true
            },
            'down':()=>{
                return len === 1?this.getSelectRowIndex() === this.state.data.length-1:true
            }
        }
        return operFn[oper]();
    }
    render() {
        return (
            <div style={{height:205}}>
                <SysToolBar>
                    <SysButton
                        title="新增"
                        icon="add"
                        onClick={() => this.add()}
                    />
                    <SysButton
                        title="编辑"
                        icon="edit"
                        onClick={() => this.edit()}
                        disabled={this.btnDisabled('single')}
                    />
                    <SysButton
                        title="删除"
                        icon="delete"
                        onClick={() => this.delete()}
                        disabled={this.btnDisabled('multiple')}
                    />
                    <SysButton
                        title="上移"
                        icon="moveup"
                        onClick={() => this.move("up")}
                        disabled={this.btnDisabled('up')}
                    />
                    <SysButton
                        title="下移"
                        icon="movedown"
                        onClick={() => this.move("down")}
                        disabled={this.btnDisabled('down')}
                    />
                </SysToolBar>
                <SysTable
                    number
                    dataSource={this.state.data}
                    columns={columns}
                    selectChange={this.selectChange}
                />
            </div>
        );
    }
}
