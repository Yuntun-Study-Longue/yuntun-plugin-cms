import React, { Component } from 'react';
import Row from 'sub-antd/lib/row';
import Col from 'sub-antd/lib/col';
import Form from 'sub-antd/lib/form';
import {twoColLayout, fourColLayout, halfFourColLayout, halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn} from "components/layout/formLayout";
import TreeSelect from 'sub-antd/lib/tree-select';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Table from 'sub-antd/lib/table';
import columnConf from 'components/columnConf/columnConf';
import Button from 'sub-antd/lib/button';
import Upload from 'sub-antd/lib/upload';
import message from "sub-antd/lib/message";
import qs from 'querystring';
import SysButton from 'components/sysButton'
const InputGroup = Input.Group;
import './main.scss';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;

class ColumnSetting extends Component {
    static defaultProps = {
        viewId: 1,
        listOption: {
            uri: '/sysware/api/viewRela/attrList',
            queryBuilder: (params) => params ? `?${qs.stringify(params)}` : ''
        },
        showListOption: {
            uri: '/sysware/api/viewRela/relaList',
            queryBuilder: params => params ? `?${qs.stringify(params)}` : ''
        },
        onChange: (result) => {
            console.log(this);
            const viewAttrRela = result.map(item => ({ ...item, viewId: this.props.viewId, attrId: item.id }) )
            console.log(viewAttrRela, '=== viewAttrRela')
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            isloading: true,
            query: {
                viewId: this.props.viewId,
                docId: qs.parse(location.search.replace('?', '')).id,
                name: ''
            },
            selectedRowKeys: [],
            unselectedRowKeys: [],
            dataSource: [], //待选列数据
            selectItems: [],
            cancelItems: [],
            targetSource: [], //显示列数据
        };
    }
    componentWillReceiveProps(nextProp, nextState) {
        if (this.props.viewId !== nextProp.viewId) {
            this.setState({ viewId: nextProp.viewId })
        }
    }
    onChangeSearch=(e)=> { 
        const query = { ...this.state.query, name: e};
        this.setState({ query }, () => this.fetchUnselectedList(this.state.query))
    }
    handleClear=()=> {
        const query = { ...this.state.query, name:''};
        this.setState({ query }, () => this.fetchUnselectedList(this.state.query))
      } 

    componentDidMount() {
        this.props.onRef && this.props.onRef(this)
        this.fetchUnselectedList(this.state.query);
        // this.setState({ targetSource: this.props.viewAttrRela }, () => this.injectOrderNum());
        this.fetchShowList({ viewId: this.state.query.viewId })
    }
    fetchUnselectedList(params) {
        axios.get(this.props.listOption.uri + this.props.listOption.queryBuilder(params)).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({ dataSource: [...res.data.data, ...this.state.dataSource.filter(item => new RegExp(params.name).test(item.name) )] }, () => console.log(this.state.dataSource, '=== dataSource'));
            }
        })
    }
    fetchShowList(params) {
        axios.get(this.props.showListOption.uri + this.props.showListOption.queryBuilder(params)).then(res => {
            if (res.data.code == 200 || !res.data.code) {
                this.setState({ targetSource: res.data.data }, () => this.injectOrderNum());
            }
        })
    }
    injectOrderNum() {
        let max_id = this.state.targetSource.map(item => item.orderNum).reduce((prev, next) => Math.max(~~prev, ~~next), 0);
        const targetSource = this.state.targetSource.map(item => {
            if (!item.orderNum&&item.orderNum!==0) return { ...item, orderNum: ++max_id }

            return { ...item, orderNum: ~~item.orderNum }
        })
        // console.log(max_id, targetSource);
        this.setState({ targetSource }, () => this.props.onChange(targetSource));
    }
    onSelectSourceChange(selectedRowKeys) { //待选列选择的行
        const selectItems = this.state.dataSource.filter(o=>selectedRowKeys.includes(o.id))
        this.setState({ unselectedRowKeys:selectedRowKeys, selectItems });
    }
    onSelectTargetChange(selectedRowKeys) { //显示列选择的行
        const cancelItems = this.state.targetSource.filter(o=>selectedRowKeys.includes(o.id))
        this.setState({ selectedRowKeys: selectedRowKeys, cancelItems })
    }
    onClickReset() {
        this.fetchShowList({ viewId: this.state.query.viewId })
    }
    onClickAddRight() { 
        const ids = this.state.targetSource.map(item => item.id) 
        const targetSource = [...this.state.targetSource, ...this.state.selectItems.filter(item => !ids.includes(item.id)) ];
        // this.setState({ targetSource }, () => this.injectOrderNum());
        this.setState({ 
            unselectedRowKeys: [], 
            targetSource, 
            dataSource: this.state.dataSource.filter(o => !this.state.unselectedRowKeys.includes(o.id)) }, () => this.injectOrderNum());
    }
    onClickAddLeft() {
        const ids = this.state.dataSource.map(item => item.id)
        console.log(ids)
        const dataSource = [...this.state.dataSource, ...this.state.cancelItems.filter(item => !ids.includes(item.id))]
        this.setState({ 
            selectedRowKeys: [], 
            dataSource, 
            targetSource: this.state.targetSource.filter(o => !this.state.selectedRowKeys.includes(o.id)) }, () => this.injectOrderNum());
    }
    move(type){
        if(this.state.selectedRowKeys.length!=1){
          message.warning("请选择一条数据");
          return false;
        } 
        let moveItem = this.state.targetSource.find(item => this.state.selectedRowKeys.includes(item.id));
        const orderNums = this.state.targetSource.map( item => ~~item.orderNum );
        const prevNum = orderNums.filter( item => item < moveItem.orderNum).reduce((prev, next) => Math.max(prev, next), 0);
        const nextNum = orderNums.filter( item => item > moveItem.orderNum).reduce((prev, next) => Math.min(prev, next), Infinity);

        if (type === 'up') {
            if (!prevNum) return message.warn('第一个无法上移')
            const targetSource = this.state.targetSource.map(item => {
                if (item.orderNum === moveItem.orderNum) {
                    return {...item, orderNum: prevNum }
                }
                else if (item.orderNum === prevNum) {
                    return {...item, orderNum: moveItem.orderNum }
                }
                
                return item
            }).sort((a, b) => a.orderNum - b.orderNum)

            // console.log(targetSource, '=== targetSource');
            this.setState({ targetSource }, () => {
                let prevItem = this.state.targetSource.find(item => item.orderNum === prevNum);
                this.setState({ unselectedRowKeys: [prevItem.id] }, () => this.props.onChange(this.state.targetSource) );
                message.success("上移成功");
            })
        }

        else if (type === 'down') {
            if (!isFinite(nextNum)) return message.warn('最后一个无法下移')
            const targetSource = this.state.targetSource.map(item => {
                if (item.orderNum === moveItem.orderNum) {
                    return {...item, orderNum: nextNum }
                }
                else if (item.orderNum === nextNum) {
                    return {...item, orderNum: moveItem.orderNum }
                }

                return item
            }).sort((a, b) => a.orderNum - b.orderNum)
            // console.log(targetSource, '=== targetSource');
            this.setState({ targetSource }, () => {
                let nextItem = this.state.targetSource.find(item => item.orderNum === nextNum);
                this.setState({ unselectedRowKeys: [nextItem.id] }, () => this.props.onChange(this.state.targetSource));
                message.success("下移成功");
            })
        }
        // moveItem = {...moveItem, opea};
        // console.log(moveItem, '==== move item')
        
    }
    onRowAddLeftDoubleClick=(record, index, event)=>{  //添加到待选列
       this.onClickAddLeft() 
    }
    onRowAddRightDoubleClick=(record, index, event)=>{ //添加到显示列
        this.onClickAddRight() 
     }
    render() {
        const SourceRowSelection = {  //待选列选择的行
            selectedRowKeys:this.state.unselectedRowKeys,
            onChange: this.onSelectSourceChange.bind(this),
        };
        const TargetRowSelection = {  //显示列选择的行
            selectedRowKeys:this.state.selectedRowKeys,
            onChange: this.onSelectTargetChange.bind(this),
            getCheckboxProps: record => ({
                // [9,10,11].includes(record.attrId) ||
                disabled: ['条目ID', '条目内容'].includes(record.attrCode) ,    // 配置无法勾选的列
            }),
        }
        return (
            <Form inline style={{paddingBottom:10}}>
                <div className="sys-transfer">
                    <div className="tool-bar fl">
                        待选列:
                        <Input.Search 
                            style={{width:'calc(100% - 66px)',marginLeft:20}}
                            placeholder="输入名称过滤待选列" 
                            onClear={this.handleClear}  
                            clearIsBlur
                            onChange={this.onChangeSearch} 
                        />
                    </div> 
                    <div className="tool-bar fr">
                        导出属性:
                        <SysButton
                            title="上移"
                            icon="moveup"
                            onClick={this.move.bind(this,'up')} 
                            disabled={this.state.cancelItems[0]?this.state.cancelItems[0].orderNum === 0:false}
                        />
                        <SysButton
                            title="下移"
                            icon="movedown"
                            onClick={this.move.bind(this,'down')} 
                            disabled={this.state.cancelItems[0]?this.state.cancelItems[0].orderNum === this.state.targetSource.filter(record => !['条目ID', '条目内容'].includes(record.attrCode)).length + 1:false}
                        />
                    </div> 
                    <div className="sys-transfer-left fl">
                        <Table scroll={{y:339,x:300}} size="small"  
                            rowKey={ record => record.id } 
                            rowSelection={SourceRowSelection} 
                            columns={columnConf['Modal_Table_Unselectlist_Requirement_Fullpage']} 
                            dataSource={this.state.dataSource} 
                            pagination={false} 
                            rowClickMultSelect  
                            onRowDoubleClick={this.onRowAddRightDoubleClick} 
                        />
                    </div>
                    <div className="sys-transfer-center fl">
                        <div className="sys-transfer-operation">
                            <Button disabled={!this.state.unselectedRowKeys.length} type="ghost" size="small" onClick={this.onClickAddRight.bind(this)}>添加显示列</Button>
                            <Button disabled={!this.state.selectedRowKeys.length} type="ghost" size="small" onClick={this.onClickAddLeft.bind(this)}>移除显示列</Button>
                            <Button type="ghost" size="small" onClick={this.onClickReset.bind(this)} >重置默认列</Button>
                        </div>
                    </div>
                    <div className="sys-transfer-right fl">
                        <Table showHeader={true} scroll={{y:339,x:300}}  
                            size="small" 
                            rowKey={ record => record.id } 
                            rowSelection={TargetRowSelection} 
                            columns={columnConf['Modal_Table_Showlist_Requirement_Fullpage'](this.props.form)} 
                            onRowDoubleClick={this.onRowAddLeftDoubleClick} 
                            dataSource={this.state.targetSource} 
                            pagination={false} 
                            rowClickMultSelect   
                        />
                    </div>
                </div>
                {/* <div className='clearfix' style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{ width: '35%', float: 'left'}}>
                    <Table scroll={{y:330}} size="small" title={() => <InputGroup size="small">
                        <Col span="6">待选列:</Col>
                        <Col span="18"><Input.Search 
                        placeholder="输入名称过滤待选列" 
                        onClear={this.handleClear}  
                        clearIsBlur
                        onChange={this.onChangeSearch} /></Col>
                    </InputGroup>} rowKey={ record => record.id } rowSelection={SourceRowSelection} columns={columnConf['Modal_Table_Unselectlist_Requirement_Fullpage']} dataSource={this.state.dataSource} pagination={false} rowClickMultSelect  onRowDoubleClick={this.onRowAddRightDoubleClick} />
                    </div>
                    
                    <div style={{width: '15%', float: 'left', display: 'flex', justifyContent: 'center'}}>
                        <ul>
                            <li style={{margin: '15px 0', textAlign: 'center'}}><Button disabled={!this.state.unselectedRowKeys.length} type="ghost" size="small" onClick={this.onClickAddRight.bind(this)}>添加显示列</Button></li>
                            <li style={{margin: '15px 0', textAlign: 'center'}}><Button disabled={!this.state.selectedRowKeys.length} type="ghost" size="small" onClick={this.onClickAddLeft.bind(this)}>移除显示列</Button></li>
                            <li style={{margin: '15px 0', textAlign: 'center'}}><Button type="ghost" size="small" onClick={this.onClickReset.bind(this)} >重置默认列</Button></li>
                        </ul>
                    </div>
                   
                    <div style={{width:'50%', float: 'left'}}>
                        <Table showHeader={true} scroll={{y:330}} title={() => <InputGroup size="small">
                        <Col span="4">显示列:</Col>
                        <Col span="20">
                            <div className="opeation-icon">
                                {console.log(this.state.cancelItems[0], this.state.targetSource.length, '=== ')}
                                 <SysButton style={{marginTop:'0'}} title="上移" icon="moveup" onClick={this.move.bind(this,'up')} disabled={this.state.cancelItems[0]?this.state.cancelItems[0].orderNum === 0:false}/>
                                 <SysButton style={{marginTop:'0'}} title="上移" icon="movedown"  onClick={this.move.bind(this,'down')} disabled={this.state.cancelItems[0]?this.state.cancelItems[0].orderNum === this.state.targetSource.filter(record => !['条目ID', '条目内容'].includes(record.attrCode)).length + 1:false}/>
                            </div>
                        </Col>
                    </InputGroup>} size="small" rowKey={ record => record.id } rowSelection={TargetRowSelection} columns={columnConf['Modal_Table_Showlist_Requirement_Fullpage'](this.props.form)} onRowDoubleClick={this.onRowAddLeftDoubleClick} dataSource={this.state.targetSource} pagination={false} rowClickMultSelect   />
                    </div>
                </div> */}
            </Form>
            
        );
    }
}

ColumnSetting = Form.create()(ColumnSetting)

export default ColumnSetting