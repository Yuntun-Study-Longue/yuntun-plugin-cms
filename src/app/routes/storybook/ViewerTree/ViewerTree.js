import React, { Component } from 'react';
import Layout from 'components/layout/layout';
// import LRLayout from 'components/layout/LRLayout';
import MainViewTable from './MainViewTable/MainViewTable';
import SyncControlTree from './SyncControlTree/SyncControlTree';
import axios from 'axios';
import message from 'sub-antd/lib/message';
import { logger, generateReferenceRows, convertTableData2TreeData, convertTreeData2TableData, scrollContainer, reverseFindJointKey, generateExpandedKeys } from './Utils';
import qs from 'querystring';
import Modal from 'sub-antd/lib/modal';
import './ViewerTree.scss'
import SysLayout from 'components/sysLayout/sysLayout'
import SysButton from 'components/sysButton'
import Select from 'sub-antd/lib/select';
const Option = Select.Option;
import LRLayout from 'components/sysLayout/LRLayout'
import classNames from 'classnames';
import Tooltip from 'sub-antd/lib/tooltip';
import mockData from './Utils/mock'
export default class ViewerTree extends Component {
    static defaultProps = {
        viewId: "9600",
        viewAttrRela: [{id: 800, viewId: "1600", attrId: 9, attrType: 0, orderNum: null, width: "", name: "条目id",...{}}],
        viewparam: { group: [], relas: [], titleLevel: '', viewId: '9600' },
        itemQuery: {}
    }
    constructor(props) {
        super(props)
        this.state = {
            isRefresh: false, 
            selectedRows: [],
            selectedRowKeys: [],
            selectedNodeKeys: [],
            lzlimit: 100,
            dataSource: mockData,
            viewData: [],
            treeData: [],
            expandedKeys: [],
            clipboardData: [],
            pageOfficeHost: '',
            levelOptionLoading: false,
            levelOptions: [],
            currentUser: {},
            isSameView: true,
        }
    }
    componentDidMount() {
        this.getUserInfo();
        this.getPageOfficeHost();
        // this.submitRequest('/sysware/api/item/point', this.props.itemQuery, (res) => this.handleViewTableChange(res.data))
    }
    componentWillReceiveProps(nextProp, nextState) {
        if (this.props.viewId !== nextProp.viewId || JSON.stringify(this.props.viewparam) !== JSON.stringify(nextProp.viewparam)) {
            this.submitRequest('/sysware/api/item/point', nextProp.itemQuery, (res) => this.handleViewTableChange(res.data))
        }
        if (JSON.stringify(nextProp.backup_viewparam) === JSON.stringify(nextProp.viewparam)) {
            this.setState({ isSameView: true });
        }
        else {
            this.setState({ isSameView: false });
        }
    }    
    getLevelOptionsByMaxlevel(visible) {
        if (visible) {
            this.setState({ levelOptionLoading: true });
            this.submitRequest('/sysware/api/view/getMaxlevel' + '?documentId=' + qs.parse(location.search.replace('?', '')).id, null, (maxLevel) => {
                this.setState({ 
                    levelOptions: Array.from({ length: maxLevel + 1 }, (_, levelNum) => {
                        return !levelNum ? <Option key={levelNum} value={0}>显示全部级别</Option> : <Option key={levelNum} value={levelNum}>显示{levelNum}个级别</Option>
                    }), 
                    levelOptionLoading: false 
                })
            }, 'GET');
        }
        else {
            // const optionEle = !!this.props.titleLevel ? <Option value={0}>显示全部级别</Option> : <Option value={this.props.titleLevel}>显示{this.props.titleLevel}个级别</Option>
            // this.setState({
            //     levelOptions: [optionEle],
            // })
        }
    }
    getPageOfficeHost() {
        this.submitRequest('/sysware/pageoffice/pageofficeUrl', null, (pageOfficeHost) => {
            this.setState({ pageOfficeHost })
        }, 'GET');
    }
    getUserInfo() {
        this.submitRequest('/sysware/api/user/getUserInfo', null, (currentUser) => {
            this.setState({ currentUser })
        }, 'GET');
    }
    handleViewTableChange(dataSource, callback = () => {}) {
      // 锁定数据处理入口
      const _dataSource = dataSource.map( item => item.LOCK_FLAG ? {...item, clipStat: item.clipStat ? /^lock/.test(item.clipStat) ? item.clipStat : 'lock ' + item.clipStat : 'lock'} : item );
      this.setState({ dataSource: _dataSource, treeData: convertTableData2TreeData(_dataSource)(0, '0') }, 
            () => this.setState({ viewData: convertTreeData2TableData(this.state.treeData) }, callback) );
    }
    handleTableRowSelect(selectedRowKeys, selectedRows) {
        if (!selectedRowKeys.length) return this.setState({ selectedRows, selectedRowKeys })
        console.log(selectedRows[0], '=== selectedRows')
        this.setState({ 
            selectedRows,
            selectedRowKeys,
            selectedNodeKeys: [reverseFindJointKey(this.state.viewData)(selectedRows[0], selectedRows[0].nodeNum)], 
        }, () => {
            const expandedKeysSet = new Set([...this.state.expandedKeys, ...generateExpandedKeys(this.state.selectedNodeKeys)()])
            this.setState({ expandedKeys: [...expandedKeysSet] }, () => {
                logger('selectedRowKeys -> selectedNodeKeys', this.state.selectedRowKeys, this.state.selectedNodeKeys, this.state.expandedKeys)()
                scrollContainer('.left-tree .demand-tree ', `.scroll-${this.state.selectedNodeKeys[0]}`)('Tree Scroll')
            })
        })
    }
    handleTreeNodeSelect(selectedNodeKeys, e) {
        console.log(e.selectedNodes[0].props, '=== e.selectedNodes')
        this.setState({
            selectedNodeKeys, 
            selectedRowKeys: e.selectedNodes.map(item => item.props.ID),
            selectedRows: e.selectedNodes.map(item => item.props),
        }, () => {
            const expandedKeys = this.state.expandedKeys.includes(selectedNodeKeys[0]) ? this.state.expandedKeys.filter(item => !new RegExp(`^${selectedNodeKeys[0]}`).test(item)) : [...this.state.expandedKeys, ...selectedNodeKeys]
            this.setState({ expandedKeys }, () => {
                logger('selectedNodeKeys -> selectedRowKeys', this.state.selectedNodeKeys, this.state.selectedRowKeys)()
                const SelectEle = document.querySelector(`.demand-manage-item-detail .ant-table-body .scroll-${this.state.selectedRowKeys[0]}`)
                SelectEle && scrollContainer('.demand-manage-item-detail .ant-table-body ', `.scroll-${this.state.selectedRowKeys[0]}`)('Table Scroll')
            })
        })
    }
    handleCutNode() {
        let clipStat = 'cut'
        this.resetClipBoard(() => {
            const referenceRows = [...this.state.selectedRows, ...generateReferenceRows(this.state.dataSource)(this.state.selectedRowKeys)]
            this.setState({ clipboardData: referenceRows.map(o => ({...o, clipStat}) )}, () => {
                // 更新剪切板状态， clipStat: cut | copy-shallow | copy-deep
                const itemIds = this.state.clipboardData.map(o => o.ID)
                const dataSource = this.state.dataSource
                    .map( o => itemIds.includes(o.ID) ? {
                        ...o,
                        clipStat, 
                    } : o )
                this.handleViewTableChange(dataSource, () => this.resetSelect())
            })
        })
    }
    handleCopyNode(copyType = 'shallow' || 'deep') {
        let clipStat = `copy-${copyType}`
        this.resetClipBoard(() => {
            const referenceRows = copyType === 'shallow' ? this.state.selectedRows: [...this.state.selectedRows, ...generateReferenceRows(this.state.dataSource)(this.state.selectedRowKeys)]
            this.setState({ clipboardData: referenceRows.map(o => ({...o, clipStat}))}, () => {
                const itemIds = this.state.clipboardData.map(o => o.ID)
                const dataSource = this.state.dataSource
                    .map( o => itemIds.includes(o.ID) ? {
                        ...o,
                        clipStat, 
                    } : o )
                console.log(itemIds, dataSource.filter(o => o.clipStat))
                this.handleViewTableChange(dataSource, () => this.resetSelect())
            })
        })
    }
    // 独占文档心跳检测
    handleExclusiveKeepAlive() {
      const documentId = qs.parse(location.search.replace('?', '')).id;
      const editType = qs.parse(location.search.replace('?', '')).edit_type;
      return setInterval(() => {
        this.submitRequest('/sysware/api/document/lockDocu?' + qs.stringify({ documentId, editType }), null, () => {}, 'GET');
      }, 20000);
    }
    handlePasteTargetNode(pasteType = 'shallow' || 'deep', TargetId) {
        if (!this.state.clipboardData.length) return message.warn('请选择操作条目')
        // 剪切板状态， clipStat: cut | copy-shallow | copy-deep
        const typeEnum = {
            'copy-shallow': pasteType === 'shallow' && this.state.clipboardData.every(o => o.clipStat !== 'cut'),
            'copy-deep': pasteType === 'deep' && this.state.clipboardData.every(o => o.clipStat !== 'cut'),
            'cut-shallow': pasteType === 'shallow' && this.state.clipboardData.every(o => o.clipStat === 'cut'),
            'cut-deep': pasteType === 'deep' && this.state.clipboardData.every(o => o.clipStat === 'cut')
        } 
        const type = typeEnum['copy-shallow'] ? 0 : typeEnum['copy-deep'] ? 1 : typeEnum['cut-shallow'] ? 2 : typeEnum['cut-deep'] ? 3 : 4
        // console.log(this.state.clipboardData.filter(o => o.key), '=== this.state.clipboardData')
        let submitData = {
            itemIds: this.state.clipboardData.map(o => o.ID),
            parentIds: Array.from(new Set(this.state.clipboardData.filter(o => o.key).map(o => o.ID))),
            targetId: this.state.selectedRowKeys[0],
            type
        }
        console.log(submitData, '=== in submit', this.state.clipboardData)

        this.resetClipBoard(() => {
            this.submitRequest('/sysware/api/item/paste', submitData, item => {
                switch (type) {
                    case 0:
                        console.log('copy-shallow', item)
                    case 1:
                        console.log('copy-deep', item)
                        this.setState({ dataSource: [...this.state.dataSource, ...item].sort((a, b) => a.RANKING - b.RANKING)}, () => this.handleViewTableChange(this.state.dataSource))
                        break;
                    case 2:
                        console.log('cut-shallow', item)
                    case 3:
                        console.log('cut-deep', item)
                        this.setState({ 
                            dataSource: [...this.state.dataSource.filter(o => !submitData.itemIds.includes(o.ID)), ...item].sort((a, b) => a.RANKING - b.RANKING)}, 
                            () => this.handleViewTableChange(this.state.dataSource, () => this.resetClipBoard()))
                        break;
                    default: 
                        console.log(pasteType, 'in default', this.state.clipboardData)
                        break;
                }
            })
        });
    }
    handleChangeGrade(changeType = 'up' | 'down') {
        let submitData = {
            documentId: qs.parse(location.search.replace('?', '')).id,
            itemId: this.state.selectedRowKeys[0],
            type: changeType,
        }
        this.resetClipBoard(() => {
            this.submitRequest( '/sysware/api/item/changegrade', submitData, targetId => {
                this.setState({ dataSource: this.state.dataSource.map(item => {
                    if (item.ID === this.state.selectedRowKeys[0]) {
                        return {...item, PARENT_ID: targetId}
                    }
                    return item
                }) }, 
                () => this.handleViewTableChange(this.state.dataSource, () => this.resetSelect()))
            })
        });
    }
    handleChangeLockStat(changeType = 'lock' | 'unlock') {
      console.log(changeType)
        let submitData = {
            documentId: qs.parse(location.search.replace('?', '')).id,
            itemsIds: this.state.selectedRowKeys,
            type: changeType,
        }
        this.submitRequest( '/sysware/api/item/changelockstat', submitData, itemIds => {
            logger('change lock stat', itemIds)();
            const dataSource = this.state.dataSource
              .map( o => itemIds.includes(o.ID) ? {
                  ...o,
                  LOCK_FLAG: changeType !== 'unlock' ? 1 : 0,
                  LOCK_NAME: this.state.currentUser.loginName,
                  clipStat: changeType,
              } : o )
            this.handleViewTableChange(dataSource, () => this.resetSelect())
            // switch (changeType) {
            //   case 'lock':
            //     this.resetClipBoard(() => {
            //       // 更新剪切板状态， clipStat: lock
            //       const dataSource = this.state.dataSource
            //           .map( o => itemIds.includes(o.ID) ? {
            //               ...o,
            //               LOCK_FLAG: 1, 
            //           } : o )
            //       this.handleViewTableChange(dataSource, () => this.resetSelect())
            //     })
            //     break;
            //   default:
            //     break;
            // }
        })
    }
    handleAddTitleOrContent(nodeType) {
        // console.log(this.props.viewAttrRela, 'log')
        let submitData = {
            id: '',
            parentId: '0',
            nodeType,
            documentId: qs.parse(location.search.replace('?', '')).id,
            currentId: '',
            attrIds: this.props.viewAttrRela.map(o => o.attrId)
        }
        if (this.state.dataSource.length > 0 && this.state.selectedRowKeys.length) {
            if (this.state.selectedRowKeys.length !== 1) {
                return message.warn('请选择一个标题')
            }
            submitData = {
                id: "",
                parentId: this.state.selectedRows[0].PARENT_ID,//当前条目的父id
                nodeType, //0标题1子标题 2 正文3.标题+正文
                documentId: this.state.selectedRows[0].DOCUMENT_ID,//文档id
                currentId: this.state.selectedRows[0].ID,//当前选择的条目id不选传空
                attrIds: this.props.viewAttrRela.map(o => o.attrId),//扩展属性id
            }
            if (this.state.selectedRows[0].NODE_TYPE === 2) {
                if (nodeType !== 2) return message.warn('内容不能新增标题')
            }
        }
        this.resetClipBoard(() => {
            this.submitRequest('/sysware/api/item/save', submitData, item => {
                const dataSource = [...this.state.dataSource, item ]
                    .sort((a, b) => a.RANKING - b.RANKING)
                    .map( o => (
                        o.RANKING > item.RANKING ? // 新增操作会影响后面数据的排序
                        {
                        ...o, 
                        RN: ~~o.RN + 1,
                    } : o )) 
                message.success('新增成功！'); 
                this.handleViewTableChange(dataSource, () => {
                    const selectedRowKeys = this.state.viewData.filter(o => o.ID === item.ID).map(o => o.ID) 
                    const selectedRows = this.state.viewData.filter(o => o.ID === item.ID)
                    this.handleTableRowSelect(selectedRowKeys, selectedRows)
                })
            });
        });
    }
    resetSelect(callback = () => {}) {
        this.setState({
            selectedRows: [],
            selectedRowKeys: [],
            selectedNodeKeys: [],
        }, callback)
    }
    resetClipBoard(callback = () => {}) {
        this.setState({
            clipboardData: [],
            dataSource: this.state.dataSource.map(item => {
                item.clipStat && delete item.clipStat
                return item
            })
        }, callback)
    }
    handleDelItem() {
        if (this.state.selectedRowKeys.length < 1) {
            return message.warn('请至少选择一个条目！')
        }

        Modal.confirm({
            title: '提示',
            content: '所选条目及其子代条目将一起删除，且无法恢复。确定删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => this.submitRequest(`/sysware/api/item/delete?id=${this.state.selectedRowKeys}`, null, () => {
                const item = this.state.selectedRows;
                const itemId=item.map(itemId=>itemId.ID)
                const dataSource = this.state.dataSource
                    .filter(o =>!itemId.includes(o.ID))
                    .map( o => o.RANKING > item.RANKING ? {
                        ...o,
                        RN: ~~o.RN - 1, 
                    } : o )
                message.success('删除成功！');
                this.resetClipBoard(() => {
                    this.resetSelect()
                    this.handleViewTableChange(dataSource)
                })
            }, 'GET')
        });
    }
    handleShowContentEdit(ID, ATTR_ID, TYPE) {
        this.submitRequest(`/sysware/api/docu/queryEasyAttrValue?id=${ATTR_ID}`, null, data => {
            this.setState({
                viewData: this.state.viewData.map(item => {
                    if (item.ID === ID) {
                        return {...item, [`IS_${ATTR_ID}_EDIT`]: !item[`IS_${ATTR_ID}_EDIT`], [`IS_${ATTR_ID}_EDIT_SHOW`]: false, ATTR_DATA: data }
                    }
                    return item
                })
            })
        }, 'GET')
    }
    handleShowEditBtn(ID, ATTR_ID, STATUS = false) {
        this.setState({
            viewData: this.state.viewData.map( item => {
                if (item.ID === ID && !item[`IS_${ATTR_ID}_EDIT`]) {
                    return { ...item, [`IS_${ATTR_ID}_EDIT_SHOW`]: STATUS }
                }
                return item
            })
        })
    }
    handleSaveContent(ID, ATTR_ID, ATTR_DATA, ATTR_VALUE, ATTR_TYPE, SYNC_TYPE) {
        this.viewTable.props.form.validateFields((errors, values) => {
            if (!!errors) {
              console.log('Errors in form!!!', errors);
              return;
            }
            let submitValue = '@_@';
            let submitData = { "id":ID, "documentId":qs.parse(location.search.replace('?', '')).id }
            console.log(values[ATTR_ID], '==== values[ATTR_ID]')
            switch (ATTR_TYPE) {
                case 0:
                case 1:
                    submitValue = '@_@' + values[ATTR_ID]
                    break;
                case 2:
                case 4:
                    submitValue = values[ATTR_ID].key + '@_@' + values[ATTR_ID].label
                    break;
                default:
                    if (ATTR_VALUE) {
                        submitValue = '@_@' + ATTR_VALUE || values[ATTR_ID]
                    }
                    else {
                        const ATTR_VALUES = ATTR_DATA.filter(o => values[ATTR_ID].toString().split(',').includes(''+o.ID)).map(o => o.NAME).join(',');
                        submitValue = values[ATTR_ID] + '@_@' + ATTR_VALUES
                    }
                    break;
            }
            
            this.setState({
                dataSource: this.state.dataSource.map(item => {
                    if (item.ID === ID) {
                        if (SYNC_TYPE === 'sync') {
                            return { ...item, [ATTR_ID]: submitValue, CONTENT: values[ATTR_ID] }
                        }
                        return { ...item, [ATTR_ID]: submitValue }
                    }
                    return item
                })
            }, () => {
                submitData = { ...submitData, "values": [ { "attrId":ATTR_ID, "entityId":ID, "value":submitValue } ] }
                this.submitRequest(`/sysware/api/item/update`, submitData, dynaticVals => {
                    if (/是$/.test(submitValue) || dynaticVals) {
                        this.handleViewTableChange(this.state.dataSource.map(item => {
                            if (dynaticVals[1]) {
                                if (item.ENTITY_ID == dynaticVals[1].entityId) {
                                    return { ...item, [dynaticVals[1].attrId]: dynaticVals[1].value }
                                }
                            }
                            return item
                        }))
                    }
                    else this.handleViewTableChange(this.state.dataSource);
                });
            })
        })
    }
    handleSavePageContent(DOCUMENT_ID, ITEM_ID, ATTR_ID) {
        let submitData = qs.stringify({
            documentId: DOCUMENT_ID,
            itemId: ITEM_ID,
        })
        if (!submitData) return
        this.submitRequest( '/sysware/pageoffice/wordToHtml?' + submitData , null, data => {
            this.setState({ dataSource: this.state.dataSource.map(item => {
                if (item.DOCUMENT_ID == DOCUMENT_ID && item.ID == ITEM_ID) {
                    return { ...item, BODY: data.BODY, CONTENT: data.CONTENT }
                }
                return item
            })}, () => {
                console.log(this.state.dataSource)
                this.handleViewTableChange(this.state.dataSource)
            })
        }, 'GET')
    }
    submitRequest(url, data, callbackFn, method = 'post') { 
        axios({ method, url, data, headers: { 'Accept-Edit-Type': qs.parse(location.search.replace('?', '')).edit_type } }).then(res => {
            if (res.data.code === 200) {
                // message.success('保存成功');
                callbackFn && callbackFn(res.data.data)
              }
              else {
                message.error(res.data.message);
            }
        })
        return 
    }
    render() {
        return (
            // <Layout>
                <LRLayout 
                    id="fdmOuter"
                    draggable
                    closable
                    style={{ height: "calc(100vh - 80px)" }}
                    >
                    {{
                        left: (
                        <LRLayout.LeftPanel > 
                            <SyncControlTree
                            expandedKeys={this.state.expandedKeys}
                            selectedNodeKeys={this.state.selectedNodeKeys}
                            onTreeNodeSelect={this.handleTreeNodeSelect.bind(this)}
                            treeData={this.state.treeData} /> 
                        </LRLayout.LeftPanel>
                    ),
                    right: (
                        <div>
                            <div id='doc-table-controls' style={{ backgroundColor: '#fff' }}>
                                <div className='opeation-icon1' style={{ height: 'auto',position:'relative', backgroundColor: '#fff' }}>
                                    <Select size='small' className={classNames({'sameview': !this.state.isSameView})} defaultValue={~~this.props.viewId} value={~~this.props.viewId} style={{ width: 268,height: '32px'}} onChange={this.props.fetchViewAllInfo.bind(this)}>
                                        {
                                            this.props.userviews.map(view => <Option value={view.id}>{view.name} ({view.type === 0 ? '个人' : view.type === 1 ? '共享' : '内置'})</Option>)
                                        }
                                    </Select>
                                    <span className='iconLine'></span>
                                    <SysButton disabled={this.state.isSameView || this.props.currentView.type === 2} title="保存视图设置" icon="save" onClick={this.props.saveCurrentView.bind(this)} />
                                    <SysButton disabled={this.state.isSameView || this.props.currentView.type === 2} title="撤销视图设置" icon="version-rollback" onClick={this.props.resetViewSetting.bind(this)} />
                                    <SysButton title="另存为新视图" icon="save-as" onClick={this.props.onClickSaveAs.bind(this)} />
                                    <SysButton.Dropdown icon="set-layout"  onItemClick={(e) => this.props.itemLayout(e)} title='视图操作' >
                                        {[
                                            { title: '重置为默认设置', key: 0 },
                                            { title: '删除视图', key: 1, disabled: this.props.currentView.type === 2 },
                                            { title: '编辑视图基本信息', key: 2, disabled: this.props.currentView.type === 2 }
                                        ]}
                                    </SysButton.Dropdown>
                                    <span className='iconLine' style={{marginLeft:'8px'}} ></span>
                                    <SysButton title="设置显示列" icon="filter-col" onClick={this.props.isShowColumnSetting }/>
                                    <SysButton title="过滤" icon="filter" onClick={this.props.isShowFilterSetting} />
                                    <Select 
                                        onToggleShow={this.getLevelOptionsByMaxlevel.bind(this)}
                                        size='small' 
                                        async
                                        isloading={this.state.levelOptionLoading}  
                                        defaultValue={0} 
                                        value={~~this.props.titleLevel} 
                                        style={{ width: 126 }} 
                                        onChange={this.props.onDefaultLevelChange.bind(this)}>
                                            {this.state.levelOptions.length ? this.state.levelOptions : <Option value={~~this.props.titleLevel}>{~~this.props.titleLevel ? `显示${this.props.titleLevel}个级别` : '显示全部级别'}</Option>}
                                    </Select>
                                    <span className='iconLine'></span>
                                    <span style={{position:'absolute',left:'743px',top:' 47px'}}></span>

                                    <div style={{float:'right',marginTop: '2px'}}>
                                        <a href={'requirement_document_config.html' + (location.search ? location.search : '')}>
                                        <SysButton title="设置" icon="set" /> 
                                        </a>
                                        <a href={'doclist.html' + (location.search ? location.search : '')}>
                                        <SysButton title="文件清单" icon="filing" />
                                        </a>
                                        <a href={`doc_history_record.html?docId=${qs.parse(location.search.replace('?', '')).id}`}>
                                        <SysButton title="文档历史记录" icon="history-version" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <MainViewTable
                                onRef={ref => this.viewTable = ref}
                                dataSource={this.state.viewData.filter(item => item.SHOW_FLAG)}
                                isRefresh={this.state.isRefresh}
                                lzlimit={this.state.lzlimit}
                                selectedRowKeys={this.state.selectedRowKeys}
                                selectedRows={this.state.selectedRows}
                                onTableRowSelect={this.handleTableRowSelect.bind(this)}
                                onAddTitleOrContent={this.handleAddTitleOrContent.bind(this)}
                                onDelItem={this.handleDelItem.bind(this)}
                                onCutNode={this.handleCutNode.bind(this)}
                                onCopyNode={this.handleCopyNode.bind(this)}
                                onPasteTargetNode={this.handlePasteTargetNode.bind(this)}
                                onChangeLockStat={this.handleChangeLockStat.bind(this)}
                                onChangeGrade={this.handleChangeGrade.bind(this)}
                                onClickHistoryItem={this.props.onClickHistoryItem.bind(this)}
                                onChange={this.handleViewTableChange.bind(this)}
                                onShowEditBtn={this.handleShowEditBtn.bind(this)}
                                onShowContentEdit={this.handleShowContentEdit.bind(this)}
                                onSaveContent={this.handleSaveContent.bind(this)}
                                onSavePageContent={this.handleSavePageContent.bind(this)}
                                onExclusiveKeepAlive={this.handleExclusiveKeepAlive.bind(this)}
                                viewAttrRela={this.props.viewparam.relas}
                                itemAddType={this.props.itemAddType}
                                pageOfficeHost={this.state.pageOfficeHost}
                                currentUser={this.state.currentUser}
                                isShowExportModal={this.props.isShowExportModal} />
                        </div>
                        
                            )
                    }}
                </LRLayout>
            // </Layout>
        );
    }
}