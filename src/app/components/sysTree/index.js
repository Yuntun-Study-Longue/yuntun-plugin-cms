import React, { Component } from "react";
import './index.scss'
import axios from 'axios'
import Tree from 'sub-antd/lib/tree'
const TreeNode = Tree.TreeNode
import SysIcon from 'components/sysIcon'
import SysModal from 'components/sysModal'

function TreeNodeTitle(props){
    return (
        <span><SysIcon name={props.icon}/> <span title={props.name}>{props.name}</span></span>
    )
}
class SysTree extends Component {
    constructor(props){
        super(props);
        this.state = {
            treeData:[],
            autoExpandParent:true,
            expandedKeys:[],
            selectedKeys:[],
        }
    }
    componentDidMount(){
        if(this.props.dataUrl){
            this.load(this.props.selectedKeys)
        }
    }
    load(defaultKeys=[],cb){
        axios.get(this.props.dataUrl).then(res=>{
            if(!res.data.code || res.data.code === 200){
                //转换数据格式treeDataMap
                this.treeDataMap = this.getTreeDataMap(res.data.data);
                defaultKeys = defaultKeys.filter(id=>this.treeDataMap[id])
                this.setState({
                    treeData:res.data.data,
                    selectedKeys:defaultKeys,
                    expandedKeys:this.getDefaultExpandedKeys(defaultKeys)
                },()=>{
                    //按钮控制
                    typeof this.props.btnDisabled === 'function' && this.props.btnDisabled(this.btnDisabled);
                    //触发onSelect
                    typeof this.props.onSelect === 'function' && this.props.onSelect(this.selectedRows)
                })
            }
        }).catch((err)=>console.log(err))
    }
    getTreeDataMap(treeData){
        let map = {};
        function flat(arr){
            if(arr.length === 0) return;
            arr.forEach(item => {
                map[item.id] = item;
                if(item.children && item.children.length>0){
                    flat(item.children)
                }
            });
        }
        flat(treeData);
        return map;
    }
    getDefaultExpandedKeys(defaultKeys){
        if(defaultKeys.length === 0 && !this.props.expandedLevel) return [];
        const defaultExpandedKeys = [];
        if(defaultKeys.length !== 0){
            defaultKeys.forEach(item=>{
                let id  = item;
                while(id != 0){
                    defaultExpandedKeys.push(id)
                    id = this.treeDataMap[id].parentId
                }
            })
        }
        if(typeof this.props.expandedLevel === 'number' && this.props.expandedLevel){
            for(let dataId in this.treeDataMap){
                const dataItem = this.treeDataMap[dataId];
                if(dataItem.hierarchy < this.props.expandedLevel && !defaultExpandedKeys.includes(dataItem.id)){
                    defaultExpandedKeys.push(dataItem.id)
                }
            }
        }
        return defaultExpandedKeys
    }
    getRowIndexById=(id,oper)=>{
        const pnode = this.treeDataMap[this.treeDataMap[id].parentId];
        let siblingsKeys = [];
        if(pnode){
            siblingsKeys = pnode.children.map(item=>item.id);
        }else{
            for(let item in this.treeDataMap){
                if(this.treeDataMap[item].parentId == 0){
                    siblingsKeys.push(item)
                }
            }
        }
        const index = siblingsKeys.indexOf(id);
        return oper === 'up'?index === 0:index === siblingsKeys.length - 1;
    }
    get selectedRows(){
        const selectedRows = [];
        this.treeDataMap[this.state.selectedKeys[0]]&&
        selectedRows.push(this.treeDataMap[this.state.selectedKeys[0]])
        return [...selectedRows]
    }
    onExpand=(expandedKeys)=>{
        this.setState({expandedKeys,autoExpandParent:false});
    }
    onSelect=(selectedKeys)=>{
        this.setState({selectedKeys},()=>{
            typeof this.props.onSelect === 'function' && this.props.onSelect(this.selectedRows)
        });
    }
    btnDisabled=(oper)=>{
        const selectRowsLength = this.state.selectedKeys.length;
        const operFn = {
            'single':()=>{
                return selectRowsLength !== 1
            },
            'multiple':()=>{
                return selectRowsLength === 0
            },
            'up':()=>{
                return selectRowsLength === 1?
                this.getRowIndexById(this.state.selectedKeys[0],'up')
                :true
            },
            'down':()=>{
                return selectRowsLength === 1?
                this.getRowIndexById(this.state.selectedKeys[0],'down')
                :true
            }
        }
        return operFn[oper]()
    }
    delete(url,paramsBuilder){
        const selectItem = this.selectedRows[0];
        const params = typeof paramsBuilder === 'function'?paramsBuilder(selectItem):{id:selectItem.id};
        axios.get(url,{params}).then((res)=>{
            if (res.data.code === 200 || !res.data.code) {
                SysModal.success("删除成功");
                this.load([])
            }
        }).catch(error => {})
    }
    move(url,opea,paramsBuilder){
        const selectItem = this.selectedRows[0];
        const params = typeof paramsBuilder === 'function'?paramsBuilder(selectItem):{id:selectItem.id,sortStr:opea};
        axios.post(url,params).then((res)=>{
            if (res.data.code === 200 || !res.data.code) {
                if(opea=='up'){
                    SysModal.success("上移成功");
                }else{
                    SysModal.success("下移成功");
                }
                this.load([this.selectedRows[0].id])
            }
        }).catch(error => {})
    }
    render() {
        const loop = (data) =>
            data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode
                            key={item.id}
                            title={<TreeNodeTitle icon={item.icon?item.icon:'folder'} name={item.name}/>}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.id} title={<TreeNodeTitle icon={item.icon?item.icon:'folder'} name={item.name}/>} />;
            });
        return (
            <div className="sysTree" style={{...this.props.style}}>
                <Tree
                    expandedKeys={this.state.expandedKeys}
                    onExpand={this.onExpand}
                    autoExpandParent={this.state.autoExpandParent}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                >
                    {loop(this.state.treeData)}
                </Tree>
            </div>
        );
    }
}
export default SysTree;
