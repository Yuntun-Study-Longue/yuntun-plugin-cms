import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import axios from 'axios'
import Table from 'sub-antd/lib/table'
import Pagination from 'sub-antd/lib/pagination'
import SysModal from "components/sysModal"

class SysTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataUrl:this.props.dataSource?'':this.props.dataUrl,
            dataSource:this.props.dataSource || [],
            pageNum:1,
            pageSize:this.props.pagination?10:10000,
            total:0,
            selectedRowKeys:[],
            selectedRows:[],
            loading:false
        }
        this.scrollTop = 0;
        
    }
    shouldComponentUpdate(nextProp, nextState){
        return JSON.stringify(this.state) !== JSON.stringify(nextState)
    }
    componentWillReceiveProps(nextProps, nextState) {
        nextProps.dataUrl && this.props.dataUrl!== nextProps.dataUrl
        && this.setState({dataUrl:nextProps.dataUrl},()=>this.load());
        nextProps.dataSource && JSON.stringify(this.props.dataSource) !== JSON.stringify(nextProps.dataSource)
        && this.localLoad(nextProps.dataSource);
    }
    componentDidMount(){
        if(this.state.dataUrl){
            this.load();
        }
    }
    localLoad(dataSource){
        this.setState({dataSource})
    }
    load(defaultKeys=[],cb){
        this.setState({loading:true});
        axios.get(this.state.dataUrl,{params:{pageNum:this.state.pageNum,pageSize:this.state.pageSize}}).then(res => {
            const data=res.data.data;
            const dataSource = data.resultSet !== undefined
                ?data.recordtotal>0?data.resultSet:[]
                :data||[]
            this.setState({
                dataSource,
                total:data.recordtotal||0,
                //选中值操作
                selectedRowKeys:defaultKeys,
                selectedRows:dataSource.filter((item)=>defaultKeys.includes(item.id))
            },()=>{
                this.setState({loading:false});
                //按钮控制
                typeof this.props.btnDisabled === 'function' && this.props.btnDisabled(this.btnDisabled);
                //触发selectChange
                typeof this.props.selectChange === 'function'&& this.props.selectChange(this.state.selectedRowKeys,this.state.selectedRows);
                //滚动条定位
                this.focusSelectRow(defaultKeys)
                //加载数据完成的回调
                typeof cb === 'function' && cb();
            })
        }).catch(error => {
            this.setState({loading:false}, () => typeof this.props.onError === 'function' &&this.props.onError())
        })
    }
    focusSelectRow=(defaultKeys)=>{
        const that = this;
        const tableBody = $('.ant-table-body',ReactDOM.findDOMNode(this));//滚动元素
        const tableBodyHeight = tableBody.height();//滚动元素高度
        const defaultKeysIndex = this.getRowIndexById(defaultKeys[0])+1;//选中元素下标
        const selectRowTop = 41*defaultKeysIndex;//选中元素距离顶部距离
        const selectRowTopToBody = selectRowTop == 0?0:selectRowTop-this.scrollTop;//选中元素视口顶部距离
        //滚动距离
        let scrollDelta = selectRowTopToBody/41 >= 1
            ?selectRowTopToBody-tableBodyHeight > 0 ?selectRowTopToBody-tableBodyHeight:0
            :selectRowTopToBody-41;
        // console.log('选中行距第一行距离',selectRowTop)
        // console.log('已滚动距离',this.scrollTop)
        // console.log('选中行距视口距离',selectRowTopToBody)
        // console.log('相对滚动距离',scrollDelta)
        tableBody.scrollTop(this.scrollTop+scrollDelta);
        //this.scrollTop = this.scrollTop+scrollDelta
        tableBody.off('scroll');
        tableBody.on('scroll',function(){
            that.scrollTop = $(this).scrollTop()
        })
    }
    delete(url,paramsBuilder){
        const selectItems = this.state.selectedRows;
        const params = typeof paramsBuilder === 'function'?paramsBuilder(selectItems):{id:this.state.selectedRowKeys.join(',')};
        axios.get(url,{params}).then((res)=>{
            if (res.data.code === 200 || !res.data.code) {
                SysModal.success("删除成功!");
                //清空选中值
                this.load([])
            }
        }).catch(error => {})
    }
    move(url,opea,paramsBuilder){
        if(this.state.selectedRowKeys.length!=1){
            SysModal.error("请选择一条数据!");
            return false;
        }
        const selectItem = this.state.selectedRows[0];
        const params = typeof paramsBuilder === 'function'?paramsBuilder(selectItem):{id:selectItem.id,sortStr:opea};
        axios.post(url,params).then((res)=>{
            if (res.data.code === 200 || !res.data.code) {
                if(opea=='up'){
                    SysModal.success("上移成功!");
                }else{
                    SysModal.success("下移成功!");
                }
                //保持选中值
                this.load(this.state.selectedRowKeys);
            }
        }).catch(error => {})
    }
    onChange=(pageNum)=>{
        this.setState({
            pageNum
        },()=>this.load())
    }
    onShowSizeChange=(pageNum,pageSize)=>{
        this.setState({
            pageNum,
            pageSize
        },()=>this.load())
    }
    getRowIndexById(id){
        return this.state.dataSource.findIndex(item=>item.id === id)
    }
    btnDisabled=(oper)=>{
        const selectRowsLength = this.state.selectedRowKeys.length;
        const operFn = {
            'single':()=>{
                return selectRowsLength !== 1
            },
            'multiple':()=>{
                return selectRowsLength === 0
            },
            'up':()=>{
                return selectRowsLength === 1?
                this.getRowIndexById(this.state.selectedRowKeys[0]) <= 0
                :true
            },
            'down':()=>{
                return selectRowsLength === 1?
                this.getRowIndexById(this.state.selectedRowKeys[0]) >= this.state.dataSource.length - 1
                :true
            }
        }
        return operFn[oper]()
    }
    render() {
        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedRows
                },()=>{
                    typeof this.props.btnDisabled === 'function'
                    && this.props.btnDisabled(this.btnDisabled);
                })
                typeof this.props.selectChange === 'function'&&this.props.selectChange(selectedRowKeys,selectedRows)
            }
        }
        const number = {
            title: <div style={{width:35,textAlign:'center'}}>序号</div>,
            width:55,
            dataIndex: "number",
            nowrap: true,
            render: (text, record, index) => {
                return <div title={index + 1} style={{textAlign:'center'}}>{index + 1}</div>;
            }
        }
        return (
            <div className="sys-table-wrap" style={{...this.props.style}}>
                <div className="sys-table" style={{height:`${this.props.pagination?'calc(100% - 48px)':'100%'}`}}>
                    <Table 
                        {...this.props}
                        dataSource={this.state.dataSource} 
                        rowKey={record=>record[this.props.rowKey||'id']}
                        rowSelection={this.props.single?null:rowSelection}
                        pagination={false}
                        loading={this.state.loading}
                        columns={this.props.number?[number,...this.props.columns]:this.props.columns}
                        scroll={{
                            x:this.props.minWidth?this.props.minWidth:false,
                            y:this.state.dataSource.length>0 && `calc(100% - 40px)`
                        }}
                    />
                </div>
                    {
                        this.props.pagination &&
                        <div className="sys-table-pagination">
                            <Pagination 
                                current={this.state.pageNum}
                                pageSize={this.state.pageSize}
                                showQuickJumper
                                showSizeChanger
                                pageSizeOptions={['10', '20', '30', '40']}
                                onChange={this.onChange} 
                                onShowSizeChange={this.onShowSizeChange}
                                total={this.state.total} 
                            />
                        </div>
                    }
            </div>
        )
    }
}
export default SysTable
