import React, { Component } from 'react';
import Table from 'sub-antd/lib/table';
import DropDownTool from 'components/toolbar/DropDownTool/DropDownTool';
import {halfFourColLayout,fourColLayout,fourColLayoutFn} from "components/layout/formLayout";
import Menu from 'sub-antd/lib/menu';
import { Form } from 'antd';
import Input from 'sub-antd/lib/input';
import Select from 'sub-antd/lib/select';
import Tooltip from 'sub-antd/lib/tooltip';
import DatePicker from 'sub-antd/lib/date-picker';
import SysUpload from 'components/sysUpload/SysUpload';
import SysUserSelect from 'components/sysUserSelect/SysUserSelect';
import qs from 'querystring';
import Cookies from 'js-cookie';
import classNames from 'classnames';
import { Main_Table_Viewer_Requirement_Fullpage } from 'components/columnConf/columnConf';
import { logger, isBtnShowOrNot } from '../Utils';
import SysLayout from 'components/sysLayout/sysLayout'
import SysButton from 'components/sysButton'
import SysIcon from 'components/sysIcon'
import './main.scss'

class MainViewTable extends Component {
    static defaultProps = {
        lzlimit: 100,
        pageOfficeHost: '',
        selectedRowKeys: ['3'],
        controlIcons: ['add-child-title', 'add-peer-title', 'add-title', 'add-content', 'add-title-content', 'delete', 'cut', 'copy', 'paste', 'upgrade', 'downgrade', 'locking', 'unlocking', 'import', 'export', 'relate', 'unrelate', 'refresh'],
        viewAttrRela: [{id: 800, viewId: "1600", attrId: 9, attrType: 0, orderNum: null, width: "", name: "条目ID",...{}}],
        onChange: () => {},
        onAddTitleOrContent: () => {},
        onDelItem: () => {},
        onCutNode: () => {},
        onCopyNode: () => {},
        handlePasteTargetNode: () => {},
        onChangeLockStat: () => {},
        onChangeGrade: () => {},
        onShowContentEdit: () => {},
        onSaveContent: () => {},
        onSavePageContent: (documentId, itemId) => { console.log(documentId, itemId, '==') }
    }
    constructor(props) {
        super(props)
        this.state = {
            selectionTableW: 0,
            tabH: document.body.clientHeight - 198,
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            columns: [],
            timer: null,
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
      if (JSON.stringify(this.state.columns) !== JSON.stringify(nextState.columns) ) {
        this.getCalculateTableW();
      }
    }
    componentDidMount() {
      const EDIT_TYPE = qs.parse(location.search.replace('?', '')).edit_type || '0';
      this.props.onRef(this);
      this.generateColumns(this.props);
      if (EDIT_TYPE === '1' || EDIT_TYPE === '2') {
        const intervalId = this.props.onExclusiveKeepAlive();
        this.setState({ timer: intervalId });
      }
    }
    componentWillUnmount() {
      if (this.state.timer) clearInterval(this.state.timer);
    }
    createPageOfficeLink(
      uri ='http://localhost:8080/sysware/pageoffice/word',
      params = { documentId:10, itemId:10 },
      option = { width: 1100, height: 600 }
    ) {
      const visitLink = `javascript:POBrowser.openWindowModeless('${uri}${params? '?' + qs.stringify(params) : ''}', "${option? 'width=' + option.width + 'px;' + 'height=' + option.height + 'px;' :'width=1200px;height=800px;'}");`
      return visitLink
    }
    generateColumns(props) {
      const commonColStyle = {
        width: '80px',
        fontSize: 16,
      }

      this.setState({
        desc: '',
        columns: [
        {
          key: 'czf-001',
          title: '',
          width: '80px',
          // fixed: true,
          dataIndex: 'clipStat',
          render: (text, record, index) => {
            let statusText = ''
            const EDIT_TYPE = qs.parse(location.search.replace('?', '')).edit_type || '0';
            switch (text) {
              case 'cut': return statusText =<div style={commonColStyle}><SysButton style={{width: '30px'}} icon='cut' /></div> ;
              case 'copy-shallow':return statusText = <div style={commonColStyle}><SysButton style={{width: '30px'}} icon='copy' /></div>
              case 'copy-deep':return statusText =<div style={commonColStyle}><SysButton style={{width: '30px'}} icon='copy' /></div>;
              case 'lockwithchild':
              case 'lock':return statusText = record.LOCK_NAME && EDIT_TYPE === '1' ? <Tooltip placement="topLeft" title={`加锁人：${record.LOCK_NAME}`}>
                  <div style={commonColStyle}>
                    <SysButton style={{width: '30px'}} icon='locking' />
                  </div>
                </Tooltip> : <div style={commonColStyle}>
                  { EDIT_TYPE === '0' && <SysIcon name='locking' style={{width: '30px'}}/> }
                </div>;
              case 'lockwithchild cut':
              case 'lock cut': return record.LOCK_NAME && EDIT_TYPE === '1' ? <Tooltip placement="topLeft" title={`加锁人：${record.LOCK_NAME}`}>
                <div style={commonColStyle}>
                  <SysIcon name='locking' style={{width: '30px'}}/>
                  <SysIcon name='cut' style={{width: '30px'}}/>
                </div>
                </Tooltip> : <div style={commonColStyle}>
                  { EDIT_TYPE === '0' && <SysIcon name='locking' style={{width: '30px'}}/> }
                  <SysIcon name='cut' style={{width: '30px'}}/>
                </div> ;
              case 'lockwithchild copy-shallow':
              case 'lockwithchild copy-deep':
              case 'lock copy-shallow': 
              case 'lock copy-deep': return record.LOCK_NAME && EDIT_TYPE === '1' ? <Tooltip placement="topLeft" title={`加锁人：${record.LOCK_NAME}`}>
                <div style={commonColStyle}>
                <SysIcon name='locking' style={{width: '30px'}}/>
                <SysIcon name='copy' style={{width: '30px'}}/>
              </div>
              </Tooltip>: <div style={commonColStyle}>
                { EDIT_TYPE === '0' && <SysIcon name='locking' style={{width: '30px'}}/> }
                <SysIcon name='copy' style={{width: '30px'}}/>
              </div> ;
              default: statusText = <div style={commonColStyle}></div>
            }
            return statusText
          }
        }, 
          ...props.viewAttrRela.map(column => {
            const EDIT_TYPE = qs.parse(location.search.replace('?', '')).edit_type || '0';
            // console.log(column.attrCode, column.width, '==== column')
            return {
              title: ['变更指示符'].includes(column.attrCode) ? '' : column.attrCode,
              key: column.attrId,
              dataIndex: column.attrId,
              width: ['变更指示符'].includes(column.attrCode) ? '8px' : ~~column.width + 'px' ,
              className: ['变更指示符'].includes(column.attrCode) ? 'status-td' : 'name-td',
              render: (text, record, index) => {
                const columnWrapStyle = {
                  width: ['变更指示符'].includes(column.attrCode) ? '8px' : 'auto', //~~column.width + 'px',
                  paddingLeft: ['变更指示符'].includes(column.attrCode) ? 0 : '7px'
                }
                const { getFieldProps } = this.props.form
                let renderEle = <div>{text}</div>
                switch (column.attrCode) {
                  case '变更指示符':
                    renderEle = <div className={classNames("status", { 
                      'unsaved': record.DEMAND_STATUS === 0, 
                      'based': record.DEMAND_STATUS === 1 || [1,5,6,8,9,10,16,31,19,45,96].includes(record.REQUIRED_NUM), 
                      'saved': record.DEMAND_STATUS === 2, 
                      'deleted': record.DEMAND_STATUS === 3 || [7,34,43].includes(record.REQUIRED_NUM) })} style={columnWrapStyle}></div>
                    break;
                  case '条目ID':
                    if(!record.ID){
                      renderEle = <div id={'subhead-'+record.sub_head} style={columnWrapStyle}></div>;
                      break;
                    }
                    renderEle = <div title={record.ID+'-'+record.RN} style={columnWrapStyle}>{record.REQUIRED_NUM}
                      <span id={'subhead-'+record.sub_head}></span>
                    </div>
                    break;
                  case '条目内容':
                    window.onSavePageContent = (documentId, itemId) => this.props.onSavePageContent(documentId, itemId, column.attrId)
                    if(!record.ID || !record[column.attrId]){
                      return <div></div>;
                    }
                    let textVal = record[column.attrId].toString().split('@_@')[1];
                    let num=record.NODE_TYPE!=2?record.sub_head+' ':'';
                    let title = num+(textVal || '')
                    renderEle = <div className="table-edit" style={columnWrapStyle}>
                      {
                        !record[`IS_${column.attrId}_EDIT`] ? (
                          record.NODE_TYPE === 0 || record.NODE_TYPE === 1 ? <div className="edit-header" title={text}>{title}</div> :
                          record.NODE_TYPE === 2 ? <div className="edit-content" dangerouslySetInnerHTML={{ __html: record.BODY || '-' }}></div> : 
                          record.NODE_TYPE === 3 || record.NODE_TYPE === 4 ? [
                            <div title={text}>{title}</div>,
                            <div className="edit-content" dangerouslySetInnerHTML={{ __html: record.BODY }}></div>
                          ] :
                          <div className="edit-content" dangerouslySetInnerHTML={{ __html: record.BODY }}></div> 
                        ) : 
                        (
                          record.NODE_TYPE === 0 || record.NODE_TYPE === 1 ? [
                            // <div title={text} style={{marginRight: 10, float: 'left'}}>{num}</div>,
                            <Form.Item {...fourColLayout} label={num} labelCol={{span: 1}}>
                              <Input type='text' size='small'
                                {...getFieldProps(`${column.attrId}`, { 
                                initialValue: textVal || '',
                                rules: [ 
                                  // { required: true, message: '请输入名称' },
                                  { max: 500, message: '请控制内容长度不超过500个字' },
                              ]
                              })}  
                              onBlur={this.props.onSaveContent.bind(this, record.ID, column.attrId, [], null, column.attrType, 'sync')} />
                            </Form.Item>
                          ] : 
                          record.NODE_TYPE === 3 || record.NODE_TYPE === 4 ? [
                            // <div title={text} style={{marginRight: 10}}>{title}</div>,
                            <Form.Item {...fourColLayout} label={num} labelCol={{span: 1}}>
                              <Input type='text' size='small'
                                {...getFieldProps(`${column.attrId}`, { 
                                initialValue: textVal || '',
                              })} onBlur={this.props.onSaveContent.bind(this, record.ID, column.attrId, [], null, column.attrType, 'sync')} />
                            </Form.Item>,
                            <div className="edit-content" dangerouslySetInnerHTML={{ __html: record.BODY }}></div> 
                          ] : []
                        )
                      }
                      { 
                      EDIT_TYPE !== '0' && ( record.NODE_TYPE === 3 || record.NODE_TYPE === 4 ) ? <span className={classNames("icon-dropdown", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })}>
                          <DropDownTool trigger={['hover']} overlay={(
                          <Menu>
                            <Menu.Item key="0">
                              <a href="#" onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId)}>编辑标题</a>
                            </Menu.Item>
                            <Menu.Item key="1">
                              <a href={this.createPageOfficeLink(
                                `http://${this.props.pageOfficeHost}/sysware/pageoffice/word`,
                                { access_token: Cookies.get('access_token'), documentId: record.DOCUMENT_ID, itemId: record.ID }
                              )}>编辑正文</a>
                            </Menu.Item>
                        </Menu>)}  
                        title={<span title='编辑' className={classNames("icon-dropdown-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} style={{ margin: 0 }}></span>} />
                        </span> : 
                        // access_token:   
                        EDIT_TYPE !== '0' ? (record.NODE_TYPE === 2 ? <a href={this.createPageOfficeLink(
                          `http://${this.props.pageOfficeHost}/sysware/pageoffice/word`,
                          { access_token: Cookies.get('access_token'), documentId: record.DOCUMENT_ID, itemId: record.ID }
                        )}><span title='编辑正文' className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })}></span></a> : <span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId)}></span>
                        ): ''}
                    </div>
                    break;
                  default: 
                    if (!record[column.attrId]) {
                      renderEle = <div title={text} style={columnWrapStyle}></div>
                      break;
                    }
                    let [id, text] = record[column.attrId].toString().split('@_@')
                    if (record[`IS_${column.attrId}_EDIT`]) {
                      switch (column.attrType) {
                        case 0:
                          title = '文本'
                          renderEle = <div className="table-edit" style={columnWrapStyle}>
                            <Form.Item {...fourColLayout}>
                              <Input maxLength='51' type='text' size='small'
                                {...getFieldProps(`${column.attrId}`, { 
                                initialValue: text || '',
                                rules: [
                                  { max: 50, message: '请控制内容长度不超过50个字' },
                                ]
                              })} onBlur={this.props.onSaveContent.bind(this, record.ID, column.attrId, [], '', column.attrType, 'sync')} />
                            </Form.Item>
                          </div>
                          break;
                        case 1:
                          title = '长文本'
                          console.log(text, id, 'changwenben')
                          renderEle = <div className="table-edit" style={columnWrapStyle}>
                            <Input type="textarea" maxLength='501'  {...getFieldProps(`${column.attrId}`, { 
                              initialValue: text,
                              rules: [
                                { max: 500, message: '请控制内容长度不超过500个字' },
                              ],
                              onChange: (e) => this.setState({ desc: e.target.value }),
                            })} onBlur={() => this.props.onSaveContent(record.ID, column.attrId, [], '', column.attrType)} />
                            <p className="form-description-tip">还可输入{500-(text || this.state.desc ).length>0?500-(text ||this.state.desc ).length:'0'}字</p>
                            { EDIT_TYPE !== '0' ? <span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={() => {
                              this.props.onShowContentEdit(record.ID, column.attrId)
                            }}></span>:''}
                          </div>
                          break;
                        case 2:
                          title = '文件'
                          console.log(id, text, '=== id text 1')
                          renderEle = <div className="table-edit" style={columnWrapStyle}>
                            <Form.Item>
                              <SysUpload onChange={() => this.props.onSaveContent(record.ID, column.attrId, [], '', column.attrType) } field={column.attrId} value={id} label={text} getFieldProps={getFieldProps}/>
                              {EDIT_TYPE !== '0'?<span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId)}></span>:''}
                            </Form.Item>
                          </div>
                          break;
                        case 3:
                          title = '日期'
                          renderEle = <div className="table-edit" style={columnWrapStyle}>
                            <DatePicker format="yyyy-MM-dd" allowClear={false} size="small" {...getFieldProps(`${column.attrId}`, { 
                              initialValue: text,
                              getValueFromEvent: (date, dateString) => dateString,
                              onChange: (value, datastring) => {
                                this.props.onSaveContent(record.ID, column.attrId, record.ATTR_DATA, datastring)
                                return datastring
                              },
                            })} />
                            {EDIT_TYPE !== '0'?<span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId)}></span>:''}
                          </div>
                          break;
                        case 4:
                          title = '用户'
                          renderEle = <div className="table-edit" style={columnWrapStyle}>
                            <SysUserSelect onOk={() => this.props.onSaveContent(record.ID, column.attrId, [], '', column.attrType)} field={column.attrId} value={id} label={text} getFieldProps={getFieldProps}/>
                            {EDIT_TYPE !== '0'?<span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId)}></span>:''}
                          </div>
                          break;
                        case 5:
                        case 6:
                          let title = '枚举'
                          let initId = +id
                          if (!record.ATTR_DATA.length) {
                            renderEle = <div title={title}>{(text ? text : title + ':ATTR_DATA 异常')}</div>
                          }
                          else {
                            renderEle = <div className="table-edit" style={columnWrapStyle}>
                              <Form.Item>
                                {console.log(column, '=== column')}
                                <Select multiple={column.multiType === 0 ? false : true} size='small' style={{width: ~~column.width - 40 }}
                                  {...getFieldProps(`${column.attrId}`, { 
                                  initialValue: initId || record.ATTR_DATA[0].ID,
                                })} autoFocus onBlur={this.props.onSaveContent.bind(this, record.ID, column.attrId, record.ATTR_DATA, null)} >
                                  {record.ATTR_DATA.map(item => {
                                    return <Select.Option value={item.ID}>{item.NAME}</Select.Option>
                                  })}
                                </Select>
                              </Form.Item>
                              {EDIT_TYPE !== '0'?<span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId)}></span>:''}
                            </div>
                          }
                          break;
                        default:
                          console.log('wzz')
                          break;
                      }
                    }
                    else {
                      if (!text) {
                        renderEle = <div key='no' className="table-edit" style={columnWrapStyle}>
                          <div title={text}>{'-'}</div>
                          {EDIT_TYPE !== '0'?<span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId, 'select')}></span>:''}
                        </div>
                      }
                      else {
                        renderEle = <div key='yes' className="table-edit" style={columnWrapStyle}>
                          <div title={text}>{text}</div>
                          {EDIT_TYPE !== '0'?<span className={classNames("icon-edit show-edit", { 'hover': EDIT_TYPE !== '1' ? !!record[`IS_${column.attrId}_EDIT_SHOW`] : !record.LOCK_FLAG ? false : this.props.currentUser.loginName === record.LOCK_NAME && !!record[`IS_${column.attrId}_EDIT_SHOW`] })} onClick={this.props.onShowContentEdit.bind(this, record.ID, column.attrId, 'select')}></span>:''}
                        </div>
                      }
                    }
                  break;
                }

                return <div style={columnWrapStyle}
                    onMouseEnter={this.props.onShowEditBtn.bind(this,record.ID, column.attrId, true)}
                    onMouseLeave={this.props.onShowEditBtn.bind(this,record.ID, column.attrId, false)}
                  >{renderEle}</div>
              }
            }
          })]
      }, () => {
        this.getCalculateTableW()
      })
    }
    getCalculateTableW() {
      console.log( this.state.columns, '=== this.state.columns' )
      this.setState({ selectionTableW: this.state.columns.reduce((prev, next) => {

        return prev += ~~(next.width.replace('px', '')); 
      }, 0)})
    }
    UNSAFE_componentWillReceiveProps(nextProp, nextState) {
      if (JSON.stringify(this.props.viewAttrRela) !== JSON.stringify(nextProp.viewAttrRela)) {
        this.generateColumns(nextProp)
      }
    }
    onHeaderHasSelectionResize(index, width) {
      let selectionTableW = this.state.selectionTableW;
      let selectionColumns = this.state.columns.map((col, i) => {
        // if (i + 1 === index && width > 60) {
        //   selectionTableW += width - col.width;
        //   col.width = width;
        // }
        return col; 
      });
      this.setState({
        columns: selectionColumns,
        selectionTableW,
      });
    }

    itemHref(e){  
      switch (e.key) {
        case '0':
          this.props.onAddTitleOrContent(0)
          break;
        case '1':
          this.props.onAddTitleOrContent(1)
          break;   
        default:
          break;
      } 
    }

    itemTextHref(e){  
      switch (e.key) {
        case '0':
          this.props.onAddTitleOrContent(3)
          break;
        case '1':
          this.props.onAddTitleOrContent(4)
          break; 
        default:
          break;
      } 
    }
    itemCopyHref(e){  
      switch (e.key) {
        case '0':
          this.props.onCopyNode('shallow')
          break;
        case '1':
          this.props.onCopyNode('deep')
          break; 
        default:
          break;
      } 
    }
    itemPasteHref(e){  
      switch (e.key) {
        case '0':
          this.props.onPasteTargetNode('shallow') 
          break;
        case '1':
          this.props.onPasteTargetNode('deep') 
          break; 
        default:
          break;
      } 
    } 

    //锁定
    itemUnlockingHref(e){ 
      switch (e.key) {
        case '0':
          this.props.onChangeLockStat('lock')  
          break;
        case '1':
          this.props.onChangeLockStat('lockwithchild')
          break; 
        default:
          break;
      } 
    }


    importLayout(e){ 
      switch (e.key) {
        case '0': 
          this.props.onChangeLockStat('lock')  //后期需更换
          break;
        case '1':
          this.props.onChangeLockStat('lockwithchild') //后期需更换
          break; 
        default:
          break;
      } 
    }
    render() {
        const EDIT_TYPE = qs.parse(location.search.replace('?', '')).edit_type || '0';
        const rowSelection = {
            selectedRowKeys:this.props.selectedRowKeys,
            onChange: this.props.onTableRowSelect.bind(this),
        };
        return <div className="demand-manage-item-detail">
            {  
                this.props.controlIcons && <div className={classNames("opeation-icon-line", { "opeation-disabled": EDIT_TYPE === '0' })}>
                    {/* { this.props.controlIcons.includes('add-title') && this.props.itemAddType === 1 ?  
                    <SysButton.Dropdown icon="add-title" 
                    onItemClick={(e) => this.itemHref(e)}
                    title="新增标题"
                    disabled={this.props.selectedRowKeys.length > 1}
                    >
                     {[
                         {title:'新增标题'},
                         {title:'新增下级标题', disabled: this.props.selectedRows[0] ? isBtnShowOrNot('新增下级标题')({ itemCount: this.props.selectedRows.length, editType: EDIT_TYPE, itemType: this.props.selectedRows[0].NODE_TYPE, items: this.props.selectedRows }) : true },
                     ]}
                   </SysButton.Dropdown> : '' } */}
                  { this.props.controlIcons.includes('add-peer-title') && this.props.itemAddType === 1 && <SysButton title="新增标题" icon="add-peer-title" onClick={this.props.onAddTitleOrContent.bind(this, 0)} />}
                  { this.props.controlIcons.includes('add-child-title') && this.props.itemAddType === 1 && <SysButton title="新增下级标题" icon="add-child-title" onClick={this.props.onAddTitleOrContent.bind(this, 1)} disabled={this.props.selectedRows[0] ? isBtnShowOrNot('新增下级标题')({ itemCount: this.props.selectedRows.length, editType: EDIT_TYPE, itemType: this.props.selectedRows[0].NODE_TYPE, items: this.props.selectedRows, itemLevel: this.props.selectedRows[0].HIERARCHY }) : true }/>}
                  { this.props.controlIcons.includes('add-content') && this.props.itemAddType === 1 &&
                  <SysButton title="新增正文" icon="add-content" 
                  onClick={this.props.onAddTitleOrContent.bind(this, 2)} 
                  disabled={this.props.selectedRowKeys.length > 1}
                  />}
                  {/* { this.props.controlIcons.includes('add-title-content') && this.props.itemAddType === 2 ?  
                  <SysButton.Dropdown icon="add-title-content"
                  onItemClick={(e) => this.itemTextHref(e)}
                  disabled={this.props.selectedRowKeys.length > 1}
                  title="新增标题+正文"  >
                    {[
                        {title:'新增标题+正文'},
                        {title:'新增下级标题+正文'}, 
                    ]}
                  </SysButton.Dropdown>  : '' } */}
                  { this.props.controlIcons.includes('add-peer-title') && this.props.itemAddType === 2 && <SysButton title="新增标题+正文" icon="add-peer-title" onClick={this.props.onAddTitleOrContent.bind(this, 3)} disabled={this.props.selectedRowKeys.length > 1}/>}
                  { this.props.controlIcons.includes('add-child-title') && this.props.itemAddType === 2 && <SysButton title="新增下级标题+正文" icon="add-child-title" onClick={this.props.onAddTitleOrContent.bind(this, 4)} disabled={this.props.selectedRowKeys.length > 1}/>}
                   <span className='iconLineWhite' style={{marginLeft:'8px',marginRight:'8px'}}></span>
                    { this.props.controlIcons.includes('delete') ? <SysButton title="删除" icon="delete" onClick={this.props.onDelItem.bind(this)} disabled={this.props.selectedRows[0] ? isBtnShowOrNot('删除')({ items: this.props.selectedRows, editType: EDIT_TYPE, currentUser: this.props.currentUser }) : true} /> : '' }
                    <span className='iconLineWhite' style={{marginRight:'8px'}}></span>
                    { this.props.controlIcons.includes('cut') ? <SysButton title="剪切" icon="cut" onClick={this.props.onCutNode.bind(this)} /> : '' }
                    { this.props.controlIcons.includes('copy') ?   
                    <SysButton.Dropdown icon="copy"
                    onItemClick={(e) => this.itemCopyHref(e)}
                    title="复制"  >
                     {[
                         {title:'复制'},
                         {title:'复制（带层级结构）'}, 
                     ]}
                 </SysButton.Dropdown>  : '' }
                    { this.props.controlIcons.includes('paste') ?   
                     <SysButton.Dropdown icon="paste"
                      onItemClick={(e) => this.itemPasteHref(e)}
                      title="粘贴"  >
                        {[
                            {title:'粘贴'},
                            {title:'粘贴至下级'}, 
                        ]}
                    </SysButton.Dropdown>  : '' }
                    <span className='iconLineWhite' style={{marginLeft:'8px',marginRight:'8px'}}></span>
                    { this.props.controlIcons.includes('upgrade') ? <SysButton disabled={ this.props.selectedRows[0] ? isBtnShowOrNot('升级')({ itemCount: this.props.selectedRows.length, itemType: this.props.selectedRows[0].NODE_TYPE, itemLevel: this.props.selectedRows[0].HIERARCHY }) : true} title="升级" icon="downgrade" onClick={this.props.onChangeGrade.bind(this, 'up')} /> : '' }
                    { this.props.controlIcons.includes('downgrade') ? <SysButton disabled={this.props.selectedRows[0] ? isBtnShowOrNot('降级')({ itemCount: this.props.selectedRows.length, itemType: this.props.selectedRows[0].NODE_TYPE, itemLevel: this.props.selectedRows[0].HIERARCHY }) : true} title="降级" icon="upgrade" onClick={this.props.onChangeGrade.bind(this, 'down')} /> : '' }
                    <span className='iconLineWhite' style={{ marginRight:'8px'}}></span>
                    { this.props.controlIcons.includes('locking') ? 
                    <SysButton.Dropdown icon="locking"
                    disabled={EDIT_TYPE === '2' || (this.props.selectedRowKeys.length ? EDIT_TYPE === '1'&& this.props.selectedRows[0].LOCK_FLAG && this.props.selectedRows[0].LOCK_NAME!==this.props.currentUser.loginName : true) }
                    onItemClick={(e) => this.itemUnlockingHref(e)}
                    title="锁定"  >
                     {[
                         {title:'锁定'},
                         {title:'带层级结构锁定'}, 
                     ]}
                    </SysButton.Dropdown> : '' }
                    { this.props.controlIcons.includes('unlocking') ? 
                    <SysButton title="解锁" 
                    disabled={EDIT_TYPE === '2'||this.props.selectedRows.filter(item=>!["lock", "lockwithchild"].includes(item.clipStat)).length>0||this.props.selectedRows.filter(item=>item.LOCK_NAME!==this.props.currentUser.userName).length>0} 
                    icon="unlocking" 
                    onClick={this.props.onChangeLockStat.bind(this, 'unlock')} /> : '' }
                    <span className='iconLineWhite' style={{ marginRight:'8px'}}></span> 
                    { this.props.controlIcons.includes('relate') ? <SysButton title="建立关联" icon="relate" /> : '' }
                    { this.props.controlIcons.includes('unrelate') ? <SysButton title="取消关联" icon="unrelate" /> : '' }
                    <span className='iconLineWhite' style={{ marginRight:'8px'}}></span>
                    { this.props.controlIcons.includes('import') ?  
                    // <SysButton title="导入" icon="import" /> 
                    <SysButton.Dropdown icon="import" onItemClick={(e) => this.props.importLayout(e)} title='导入' >
                        {[
                            { title: '从文档导入条目', key: 0 },
                            { title: '从组织需求库导入条目', key: 1 }, 
                        ]}
                    </SysButton.Dropdown>
                    : '' }
                    { this.props.controlIcons.includes('export') ? <SysButton title="导出" icon="export" onClick={this.props.isShowExportModal} /> : '' }
                    <span className='iconLineWhite' style={{ marginRight:'8px'}}></span>
                    {/* { this.props.controlIcons.includes('export') ? <SysButton title="导出" icon="export" /> : '' } */}
                    { this.props.controlIcons.includes('refresh') ? <SysButton title="刷新" icon="refresh" /> : '' }
                    <span className='iconLineWhite'></span>
                    <SysButton title="条目历史记录" icon="history-version" onClick={this.props.onClickHistoryItem.bind(this, this.props.selectedRowKeys)}/>
                </div> 
            }
            <Form inline>
              { this.state.columns.length !== 1 && <Table 
                  pagination={false} 
                  scroll={{ x: this.state.selectionTableW + (this.state.columns.length - 4 )*16, y:this.state.tabH }}
                  rowSelection={rowSelection}
                  columns={this.state.columns} 
                  dataSource={this.props.dataSource} 
                  resizable
                  rowKey="ID"  
                  className="demand-smaller-table noHoverBg"
                  // style={{ width: this.state.selectionTableW }}
                  onHeaderResize={this.onHeaderHasSelectionResize.bind(this)}
                  size="small"
                  rowClassName={(record, index)=> 'scroll-'+record.ID }
              />}
            </Form>
        </div>
    }
}
// MainViewTable = Form.create()(MainViewTable)
export default MainViewTable
