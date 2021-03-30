import React, { Component } from 'react';
import Tree from 'sub-antd/lib/tree';
import classNames  from 'classnames'
import SysIcon from 'components/sysIcon'
const TreeNode = Tree.TreeNode;
import '../ViewerTree.scss'

export default class SyncControlTree extends Component {
    static defaultProps = {
        expandedKeys: [],
        selectedNodeKeys: ['0-3'],
        treeData: [
            { key: '0-0', name: '胡彦兵1' },
            { key: '0-1', name: '胡彦兵2' },
            { key: '0-2', name: '胡彦兵3' },
            { key: '0-3', name: '胡彦兵4' },
        ]
    }
    constructor(props) {
        super(props)
        this.state = {
            expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
        }
    }
    render() {
        
        const loop = data => data.map((item) => { 
            // const DEMAND_STATUS = {
            //     0:'saved', 
            //     1:'based',
            //     2:'unsaved',
            //     3:'deleted'
            // }
            const nodeClass = classNames({
                ['scroll-' + item.key]: true,
                // [DEMAND_STATUS[item.DEMAND_STATUS]]: true,
                'unsaved': item.DEMAND_STATUS === 0, 
                'based': item.DEMAND_STATUS === 1 || [1,5,6,8,9,10,16,31,19,45,96].includes(item.REQUIRED_NUM), 
                'saved': item.DEMAND_STATUS === 2, 
                'deleted': item.DEMAND_STATUS === 3 || [7,34,43].includes(item.REQUIRED_NUM)
            })
            const tag= item.NODE_TYPE!=2?item.sub_head+' ':''
            if (item.children && item.children.length) {
              return <TreeNode 
                {...item} key={item.key} title={`${tag} ${item.CONTENT || '-'}`}
                className={nodeClass} disableExpand={false}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode 
                {...item} key={item.key} title={`${tag} ${item.CONTENT || '-'}`}
                className={nodeClass} disableExpand={false} isLeaf={item.leafStatus== 1}/>;
        });
        return <div className="left-tree left-content">
            <div id="demand-tree" className="demand-tree">
                <p style={{padding:'10px 5px 0'}}><SysIcon name="root" style={{marginRight:'5px'}}/>{window.localStorage.getItem("fileName")}</p>
                <Tree className="itemDetail-tree" 
                    showLine
                    selectedKeys={this.props.selectedNodeKeys}
                    onSelect={this.props.onTreeNodeSelect.bind(this)}
                    toggleSelect={false} 
                    forceExpandAll={false}
                    // expandedKeys={this.props.expandedKeys} // 当你需要的时候开启
                    defaultExpandedKeys={this.state.expandedKeys}>
                    {loop(this.props.treeData)}
                </Tree>
            </div>
            
        </div>
    }
}
