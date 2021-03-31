import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import message from 'sub-antd/lib/message';
import Table from 'sub-antd/lib/table';
import Pagination from 'sub-antd/lib/pagination';
import ModalDocument from './model/Modal.js';
import {BaseInfoAdd, DocTypeAdd, DocTypeEdit,DocAdd,DocConfigAdd,DocConfigImport
} from 'components/baseInfo/infoType';
import './table.css'

export default class SyswareTable extends Component {
  static defaultProps = {
    needPagination: false
  } 
    constructor(props) {
        super(props);
        this.state = {
          modalTitle: '新增',
          showAddModal:false,
          showEditModal:false,
          selectedRowKeys:[],
          dataSource:[],
          currentPage:1,
          pageSize:5,
          total:0,
          selectItem: {},
        }
    }
    componentDidMount() {
      this.props.onRef && this.props.onRef(this);
        if(this.props.selectTreeId){
          this.getList(1);
        }
        setTimeout(() => {
          $(".demand-file-table .ant-table-body").css("minHeight", this.props.tableH-33+'px');
        }, 30);
      }
      UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.shouldRefreshTable != nextProps.shouldRefreshTable) {
          this.getList(1,nextProps.selectTreeId);
        }
        if(this.props.selectTreeId!=nextProps.selectTreeId){
          this.setState({
            selectedRowKeys:[]
          })
          this.getList(1,nextProps.selectTreeId);
        }
        if(this.props.tableH!=nextProps.tableH){
          $(".demand-file-table .ant-table-body").css("minHeight", nextProps.tableH-33+'px');
        }
        if(JSON.stringify(nextProps.updatedItem) !== JSON.stringify(this.props.updatedItem) ) {
          const newDataSource = this.state.dataSource.map(item => {
            if (item.id === nextProps.updatedItem.id) return {...item, ...nextProps.updatedItem}
            return item;
          })
          this.setState({dataSource: newDataSource});
        }
      }
      getList(current,id){
        if (!this.props.listOption) {
          console.log('listOption missing');
          return
        }
        let selectTreeId=id || this.props.selectTreeId;
        const Authorization = Cookies.get('Authorization');
        let Url = this.props.listOption.uri + (this.props.listOption.queryBuilder ? this.props.listOption.queryBuilder(): '');
        if(this.props.needPagination){
          Url+=`&currentPage=${current}&pageSize=${this.state.pageSize}`;
        }
        axios.get(Url,{ headers: { 'Authorization': Authorization}}).then(res => {
          let data=res.data.data.resultSet || res.data.data || [];
          this.setState({
            dataSource:data,
            currentPage:current,
            total:res.data.data.recordtotal || 0
          })
        }).catch(error => {
  
          })
      }
      getRowData(record, index){
        this.props.onSelectItem(record);
      }
      onSelectChange(selectedRowKeys) {
        console.log(selectedRowKeys)
        this.setState({ selectedRowKeys });
      }
      onShowSizeChange(current, pageSize) {
        this.setState({
          pageSize
        },()=>{
          this.getList(current);
        });
        
      }
      setModal(isShow, modalTitle){
        if(!this.props.selectTreeId){
          message.warning("请选择项目或文件夹");
          return false;
        }
        if(modalTitle === '编辑' && isShow) {
          if(this.state.selectedRowKeys.length!=1){
            message.warning("请选择一条数据");
            return false;
          }
        }
        switch (modalTitle) {
          case '新增': this.setState({ modalTitle, showAddModal:isShow }); break;
          case '编辑': this.setState({ modalTitle, showEditModal:isShow }); break;
          case '导入组织级扩展属性':this.setState({ modalTitle, showImportModal:isShow }); break;
          default: this.setState({ modalTitle,showAddModal:isShow,showEditModal:isShow,showImportModal:isShow}); break;
        }
      } 
      calcModalSize(){
        let modelSize = 0;
        switch(this.props.modalType){
          case 'fdm_doctype_modal':
            modelSize = 466;
            break;
          case 'rm_doc_config_modal':
          case 'fdm_baseinfo_modal':
          case 'rm_doc_modal':
            modelSize = 736;
            break;
          default:
            modelSize = 466;
            break;
        }
        return modelSize;
      }
      del(){
        if(this.state.selectedRowKeys.length!=1){
          message.warning("请选择一条数据");
          return false;
        }
        const delItem = this.state.dataSource.find(item => this.state.selectedRowKeys.includes(item.id));
        const Url = this.props.delOption.uri + this.props.delOption.queryBuilder(delItem);
        axios.defaults.method = this.props.delOption.method || 'get';
        axios(Url, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
          if (res.data.code === 200 || !res.data.code) {
            message.success("删除成功");
            if(this.state.dataSource.length==1 && this.state.currentPage>1){
              this.getList(this.state.currentPage/1-1);
            }
            else{
              this.getList(this.state.currentPage);
            }
            this.setState({
              selectedRowKeys:[]
            })
          }
          else{
            message.error(res.data.message);
          }
        }).catch(error => {
  
        })
      }
      move(opea){
        if(this.state.selectedRowKeys.length!=1){
          message.warning("请选择一条数据");
          return false;
        }
        let moveItem = this.state.dataSource.find(item => this.state.selectedRowKeys.includes(item.id));
        moveItem = {...moveItem, opea};
        if (this.props.moveOption) {
          const params = this.props.moveOption.paramsBuilder(moveItem);
          axios.post(this.props.moveOption.uri, params, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (res.data.code === 200||!res.data.code) {
              if(opea=='up'){
                message.success("上移成功");
              }
              else{
                message.success("下移成功");
              }
              this.getList(this.state.currentPage)
            }
            else{
              message.error(res.data.message);
            }
          }).catch(error => {
    
          })
        }
        else if (this.props.upOption && this.props.downOption) {
          const moveItem = this.state.dataSource.find(item => this.state.selectedRowKeys.includes(item.id));
          let Url = opea=='up' ? this.props.upOption.uri + this.props.upOption.queryBuilder(moveItem) : this.props.downOption.uri + this.props.downOption.queryBuilder(moveItem);
          axios.get(Url, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (res.data.code === 200||!res.data.code) {
              if(opea=='up'){
                message.success("上移成功");
              }
              else{
                message.success("下移成功");
              }
              this.getList(this.state.currentPage)
            }
            else{
              message.error(res.data.message);
            }
          }).catch(error => {
    
          })
        }
        
      }
      add(saveAndAdd) {
        this.child.props.form.validateFields((errors, values) => {
          values = values.scope? {...values, scope: values.scope.reduce((prev, next) => prev += ~~next, 0)} : values;
          if (!!errors) {
              console.log('Errors in form!!!', errors);
              return;
          }
          const params = this.props.addOption.paramsBuilder ? this.props.addOption.paramsBuilder(values) : values;
          axios.post(this.props.addOption.uri, params, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
              this.setState({
                  loading:false
              });
              if (res.data.code === 200 || !res.data.code) { 
                  message.success("新增成功");
                  this.getList(1);
                  if(saveAndAdd){
                    this.child.saveAndAdd();
                  }else{
                    this.setModal(false);
                  }
              }
              else{
                  message.error(res.data.message);
              }
          }).catch(error => {
              this.setState({
                  loading:false
              });
          })
        })
      }
      save() {
        this.child.props.form.validateFields((errors, values) => {
          if (!!errors) {
              console.log('Errors in form!!!', errors);
              return;
          }
          const selectItem = this.state.dataSource.find(item => this.state.selectedRowKeys.includes(item.id));
          const params = this.props.modifyOption.paramsBuilder ? this.props.modifyOption.paramsBuilder({ ...selectItem, ...values }) : { ...selectItem, ...values };
          axios.put(this.props.modifyOption.uri, params, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
              this.setState({
                  loading:false
              });
              if (!res.data.code) { 
                  message.success("保存成功");
                  this.getList(1);
                  this.setModal(false);
              }
              else{
                  message.error(res.data.message);
              }
          }).catch(error => {
              this.setState({
                  loading:false
              });
          })
        })
      }
      import(){
        let orgAttrIds = this.child.table.state.selectedRowKeys;
        const params =  this.props.importOption.paramsBuilder(orgAttrIds);
        axios.post(this.props.importOption.uri, params, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (res.data.code === 200) { 
                message.success("导入成功");
                this.getList(1);
                this.setModal(false);
            }
            else{
                message.error(res.data.message);
            }
        }).catch(error => {
        })
      }
      render() {
    const rowSelection = {
        selectedRowKeys:this.state.selectedRowKeys,
        onChange: this.onSelectChange.bind(this),
      };
    return <div style={{width:'100%',overflow:'hidden'}}>
      {
        this.props.controlIcons && <div className="opeation-icon">
          {this.props.controlIcons.includes('add') ? <span title="新增" className="icon icon-add" onClick={this.setModal.bind(this,true,'新增')}></span> : '' }
          {this.props.controlIcons.includes('edit') ? <span title="编辑" className="icon icon-edit" onClick={this.setModal.bind(this,true,'编辑')}></span>: '' }
          {this.props.controlIcons.includes('del') ?<span title="删除" className="icon icon-del" onClick={this.del.bind(this)}></span>: '' }
          {this.props.controlIcons.includes('import') ? <span title="导入组织级扩展属性" className="icon icon-import" onClick={this.setModal.bind(this,true,'导入组织级扩展属性')}></span>: '' }
          {this.props.controlIcons.includes('moveup') ?<span title="上移" className="icon icon-move-up" onClick={this.move.bind(this,'up')}></span>: '' }
          {this.props.controlIcons.includes('movedown') ?<span title="下移" className="icon icon-move-down" onClick={this.move.bind(this,'down')}></span>: '' }
        </div>
      }
    <div className="demand-file-table" style={{height:this.props.tableH+'px'}}>
        <Table bordered columns={this.props.columns} dataSource={this.state.dataSource}
        pagination={false} rowSelection={rowSelection} scroll={{y:this.props.tableH-33}}
        rowKey={record => record.id} className="demand-smaller-table"
        onRowClick={this.getRowData.bind(this)}
        size="small" />
    </div>
    <div style={{height:'34px',paddingTop:'5px'}}>
    {
        this.state.dataSource.length>0 && this.props.needPagination &&
        <Pagination showQuickJumper showSizeChanger pageSize={this.state.pageSize}
    size='small' current={this.state.currentPage}
    onShowSizeChange={this.onShowSizeChange.bind(this)} total={this.state.total}
    onChange={this.getList.bind(this)} pageSizeOptions={['5','10', '20', '30']}
    />
    }
    </div>
    { this.state.showAddModal && <ModalDocument title={this.state.modalTitle} type={this.props.modalType} closeModal={this.setModal.bind(this)}
        width = {this.calcModalSize.bind(this)()}
        success={this.getList.bind(this)}
        save={(saveAndAdd) => this.add(saveAndAdd)}
        selectTreeId={this.props.selectTreeId}>
          {
            this.props.modalType === 'fdm_baseinfo_modal' ? <BaseInfoAdd onRef={(ref) => this.child = ref} baseData={{}}/> :
            this.props.modalType === 'fdm_doctype_modal' ? <DocTypeAdd onRef={(ref) => this.child = ref} baseData={{}} /> : 
            this.props.modalType === 'rm_doc_modal' ? <DocAdd onRef={(ref) => this.child = ref} baseData={{}} /> : 
            this.props.modalType === 'rm_doc_config_modal' ? <DocConfigAdd onRef={(ref) => this.child = ref} baseData={{}} /> : ''
          }
      </ModalDocument>}
      { this.state.showEditModal && <ModalDocument title={this.state.modalTitle} type={this.props.modalType} closeModal={this.setModal.bind(this)}
        success={this.getList.bind(this)}
        save={this.save.bind(this)}
        selectTreeId={this.props.selectTreeId}>
          {
            this.props.modalType === 'fdm_doctype_modal' ? <DocTypeEdit onRef={(ref) => this.child = ref} baseData={this.state.dataSource.find(item => this.state.selectedRowKeys.includes(item.id))} /> : ''
          }
      </ModalDocument>}
      { this.state.showImportModal && <ModalDocument title={this.state.modalTitle} type={this.props.modalType} closeModal={this.setModal.bind(this)}
        width = {736}
        success={this.getList.bind(this)}
        save={this.import.bind(this)}
        selectTreeId={this.props.selectTreeId}>
          {
            <DocConfigImport onRef={(ref) => this.child = ref} baseData={this.state.dataSource.find(item => this.state.selectedRowKeys.includes(item.id))} />
          }
      </ModalDocument>}
    </div>

    }
}
SyswareTable.propTypes = {
  needPagination: PropTypes.bool,
}