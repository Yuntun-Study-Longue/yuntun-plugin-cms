import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import Popover from 'sub-antd/lib/popover';
import Icon from 'sub-antd/lib/icon';
import message from 'sub-antd/lib/message';
import Tree from 'sub-antd/lib/tree';
const TreeNode = Tree.TreeNode;

import ModalDocument from './modal/Modal';
import './selectTree.scss';



export default class SelectTree extends Component {
  static defaultProps = {
    checkRequired: true
  } 
    constructor(props) {
        super(props);
        this.state = {
            showModal:false,
            expandedKeys:[],
            checkArr:[],
            selectId:'',
            nodeType:'',
            treeData: [],
            autoExpandParent: true,
        }
    }
    componentDidMount(){
      this.getTree();
    }
    getTree(){
      if (!this.props.listOption) {
        console.log('listOption missing');
        return
      }
      // let selectTreeId=id || this.props.selectTreeId;
      const Url = this.props.listOption.uri + (this.props.listOption.queryBuilder ? this.props.listOption.queryBuilder() : '');
      axios.get(Url, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
        if (!res.data.code) {
          let data=res.data.data || [];
            this.setState({
              treeData:data,
              expandedKeys: [...this.state.expandedKeys, this.state.checkArr[0] ]
            })
        }
      }).catch(error => {

      })
    }
    onExpand(expandedKeys, {expanded: bool, node}) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        })
    }
    
    onCheck(info,e) {
        let checkKey=info.checked; 
        console.log(checkKey, '==== checkKey');
        this.setState({
          checkArr:checkKey,
        })
    }
    onSelect(info) {
        this.setState({
          selectId:info[0],
          checkArr:info
        });
        this.props.selectTree(info[0]);
    }
    setModal(isShow,type){
      if(this.state.checkArr.length>1){
        message.warning("请选择一条数据");
        return false;
      }
      this.setState({
        showModal:isShow,
        nodeType:type
      })
    }
    delTree(){
      if(this.state.checkArr.length!=1){
        message.warning("请选择一条数据");
        return false;
      }
      if (!this.props.delOption) {
        console.log('delOption missing');
        return
      }
      const Url = this.props.delOption.uri + ( this.props.delOption.queryBuilder ? this.props.delOption.queryBuilder() : `?id=${this.state.checkArr[0]}`);
      axios.delete(Url, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
        if (res.data.code==200) {
          message.success("删除成功");
          this.getTree();
          this.setState({
            checkArr:[]
          })
        }
        else{
          message.error(res.data.message);
        }
      }).catch(error => {

      })
    }
    move(opea){
      if(this.state.checkArr.length!=1){
        message.warning("请选择一条数据");
        return false;
      }

      if (this.props.moveOption) {
        const params = this.props.moveOption.paramsBuilder({ id: this.state.checkArr[0], sortStr: opea });
        axios.post(this.props.moveOption.uri, params,  { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
          if (res.data.code==200) {
            if(opea=='up'){
              message.success("上移成功");
            }
            else{
              message.success("下移成功");
            }
            this.getTree();
          }
          else{
            message.error(res.data.message);
          }
        }).catch(error => {
  
        })
      }
    }
    render() {
        const loop = (data) => data.map((item) => {
            if (item.children && item.children.length>0) {
              return <TreeNode title={item.name} key={item.id} className={item.nodeType}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.name}  key={item.id} className={item.nodeType} isLeaf={item.leafStatus== (1 || 'YES')} />;
          });
          let content1=(
            <div>
              <p onClick={this.setModal.bind(this,true,'PROJECT')}>新增项目</p>
              <p onClick={this.setModal.bind(this,true,'FOLDER')}>新增文件夹</p>
            </div>
          );
        return (
            <div className="left-tree left-content">
                <div className="opeation-icon">
                   
                  {this.props.controlIcons && this.props.controlIcons.includes('add') ?<Popover placement="bottomLeft" content={content1} trigger="click" overlayClassName="demand-mamagement-add-down">
                    <span title="新增" className="icon icon-add icon-down"><Icon type="caret-down"  /></span>
                  </Popover> : ''
                  }
                  {this.props.controlIcons && this.props.controlIcons.includes('del') ? <span title="删除" className="icon icon-del" onClick={this.delTree.bind(this)}></span> : ''}
                  {this.props.controlIcons && this.props.controlIcons.includes('moveup') ?<span title="上移" className="icon icon-move-up" onClick={this.move.bind(this,'up')}></span> : ''}
                  {this.props.controlIcons && this.props.controlIcons.includes('movedown') ? <span title="下移" className="icon icon-move-down" onClick={this.move.bind(this,'down')}></span> : ''}
                </div>
                <div style={{height:(this.props.conH-27)+'px',overflowY:'auto',width:'100%'}}>
                {/* checkedKeys={ {checked: this.state.checkArr, halfChecked: []} }
                checkStrictly */}
                  <Tree className="check-tree" toggleSelect={false}
                  checkable={this.props.checkRequired}
                   checkStrictly
                  checkedKeys={ {checked: this.state.checkArr, halfChecked: []} }
                  onCheck={this.onCheck.bind(this)} 
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onSelect={this.onSelect.bind(this)}
                  onExpand={this.onExpand.bind(this)}>
                  {
                    loop(this.state.treeData)
                  }
                  </Tree>
                </div>
                { this.state.showModal && <ModalDocument 
                closeModal={this.setModal.bind(this)}
                success={this.getTree.bind(this)}
                parentId={this.state.checkArr[0] || '0'}
                nodeType={this.state.nodeType}
                 />}
            </div>
        )
    }
}
SelectTree.propTypes = {
  checkRequired: PropTypes.bool,
}