import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Framemenu from 'components/framemenu/Framemenu';
import Layout from 'components/layout/layout';
import Container from 'components/container/Container';
import SelectTree from 'components/selectTree/SelectTree';
import Cookies from 'js-cookie';
import axios from 'axios';
import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import ModalTool from 'components/toolbar/ModalTool/ModalTool';
import DropDownTool from 'components/toolbar/DropDownTool/DropDownTool';
import { logger, isBtnShowOrNot } from '../storybook/ViewerTree/Utils';
import { FilterSetting, ColumnSetting } from 'components/toolbar/toolInfo';
import {ViewAdd, ViewEdit, ViewExport} from 'components/baseInfo/infoType';
import Menu from 'sub-antd/lib/menu';
import dot from 'dot-object';
import qs from 'querystring';
import ViewerTree from '../storybook/ViewerTree/ViewerTree';
// import RightVertical from './rightVertical/rightVertical';
import SysLayout from 'components/sysLayout/sysLayout'
import SysButton from 'components/sysButton'
import Select from 'sub-antd/lib/select';
import './main.scss';
const Option = Select.Option;

class Page extends Component {
    unlisten = null
    constructor(props) {
        super(props);
        console.log(props,qs.parse(location.search.replace('?', '')).pageTypes,'###################')
        this.state = {
            conH: 200,
            selectTreeId: '',
            userviews: [],
            relas: [],
            group: [],
            titleLevel: 0,
            // defaultViewData: {
            //   relas: [],
            //   group: [],
            //   titleLevel: 0,
            // },
            docId: qs.parse(location.search.replace('?', '')).id,
            viewId: 0,
            itemQuery: {
              "itemId":"",
              "operate":"1",
              "parentId":"0",//当前条目的父id
              "size":100,
              "totalCount":100,
              "documentId":qs.parse(location.search.replace('?', '')).id,//文档id
              "viewparam": {}
            },
            itemAddType: 1,
            viewData: {},
            modalType: 'filter',
            isShowFilterSetting: false,
            isShowColumnSetting: false,
            isShowEditViewInfo: false,
            isShowAddViewInfo: false, 
            isShowExportModal: false,
            projectPaths:'',
            shouldResetFilter: false,
            currentView: {},
            backup_viewparam: [],
            fileName:'',
            editStatusText:'',
            currentUser: {},
            pageType:1 // 1 需求管理  空 需求信息架构管理
        } 
    }
    checkViewModified() {
      Modal.confirm({
        title: '提示',
        content: '如果继续操作，对当前视图所做的更改会丢失。确定要继续吗？',
        onOk() {
          console.log('yes')
        },
        onCancel() {},
      });
    }
    componentDidMount() {
        const h = document.documentElement.clientHeight || document.body.clientHeight;
        this.setState({ conH: h-40-40 });
        this.fetchUserViewList(this.state.docId, 0, () => {
          this.setState({ backup_viewparam: this.state.viewparam })
        })
        this.getUserInfo()

        let editStatusKey=qs.parse(location.search.replace('?', '')).edit_type;
        if(editStatusKey==0){
          this.setState({
            editStatusText:'查看'
          })
        }else if(editStatusKey==1){
          this.setState({
            editStatusText:'共享编辑'
          })
        }else{
          this.setState({
            editStatusText:'独占编辑'
          })
        }
        // window.onbeforeunload= (e)=>{
        //   e = e || window.event;
        //   if (e) {
        //   e.returnValue = '关闭提示';
        //   }
    
        //   this.checkViewModified()//调用自己的方法
    
        //   // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        //   return '关闭提示';
        // };
    }
    resetViewSetting=()=> {
      Modal.confirm({
        title: '确定撤销对视图设置的更改吗？',  
        onOk: () => {
          this.fetchViewAllInfo(this.state.viewId) //确认按钮的回调方法，在下面
      } 
    }); 
      // this.setState({ viewData: this.state.defaultViewData });
      // this.fetchViewDetail(this.state.viewId);
    }
    resetDefaultView() {
      // if (1) {
      //   return message.success('重置为默认视图成功')
      // }
      axios.get(`/sysware/api/view/rest?id=${this.state.viewId}`).then(res => {
        if (res.data.code === 200) {
          this.fetchUserViewList(this.state.docId, 0)
          message.success('重置为默认视图成功')
        }
        else{
          message.error(res.data.message);
        }
      })
    }
    fetchViewDetail(callbackFn) {
      axios.get(`/sysware/api/view/queryDetail?id=${this.state.viewId}`).then(res => {
        if (res.data.code === 200) {
          this.setState({ viewData: res.data.data }, () => {  
            callbackFn && callbackFn()
          } ); 
          // this.fetchUserViewList(this.state.docId, 0)
          // message.success("获取用户列");
        }
        else{
          message.error(res.data.message);
        }
      })
    }
    fetchViewAllInfo(viewId, callbackFn) {
      const qsStr = viewId ? qs.stringify({ viewId, id: this.state.docId}) : qs.stringify({ id: this.state.docId});
      axios.get(`/sysware/api/view/viewAllInfo?${qsStr}`,{headers:{
        'pageTypes': qs.parse(location.search.replace('?', '')).pageTypes?qs.parse(location.search.replace('?', '')).pageTypes:''
      }}).then(res => {
        if (res.data.code === 200) {
          this.setState({ viewData: res.data.data }, () =>{
            const { viewId, titleLevel, relas, group, view: currentView, itemAddType ,projectPaths} = this.state.viewData;
            // console.log( this.state.viewData, '==== itemAddType ',itemAddType );
            const viewparam = { viewId, titleLevel, group, relas };
            const itemQuery = { ...this.state.itemQuery, viewparam };
            this.setState({ itemAddType,currentView,itemQuery, viewparam, viewId, titleLevel, relas: relas.map(item => ({ ...item, viewId: this.state.viewId, attrId: item.attrId || item.id })) || [],group,fileName:this.state.viewData.fileName,
            projectPaths:projectPaths.map(item => ({ ...item}))}, () => callbackFn && callbackFn())
            this.handleChangeView(viewId);
          });   
          // window.localStorage.setItem("path", this.state.viewData.higherlevel,)  
          window.localStorage.setItem("fileName", this.state.viewData.fileName,) 
        }
        else{
          message.error(res.data.message);
        }
      })
    }
    handleChangeView(viewId) {
      const qsStr = viewId ? '?' + qs.stringify({ viewId }) : qs.stringify({});
      axios.get(`/sysware/api/view/change${qsStr}`).then(res => {
        if (res.data.code === 200) {
          console.log(this.state.viewData, '=== viewData')
          if (this.state.backup_viewparam.length) {
            message.success('切换视图成功');
          }
          else if (JSON.stringify(this.state.backup_viewparam) !== JSON.stringify(this.state.viewparam)) {
            this.setState({ backup_viewparam: this.state.viewparam })
          }
        }
        else{
          message.error(res.data.message);
        }
      })
    }
    fetchUserViewList(docId, type, callbackFn) {
      axios.get(`/sysware/api/view/list?docId=${docId}&type=${type}`).then(res => {
        if (res.data.code === 200) {
          this.setState({ userviews: res.data.data }, () => this.fetchViewAllInfo(null, callbackFn)); 
        }
        else{
          message.error(res.data.message);
        }
      })
    }
    fetchRelaList(viewId) {
      axios.get(`/sysware/api/viewRela/relaList?viewId=${viewId}`).then(res => {
        if (res.data.code === 200) {
          this.setState({ relas: res.data.data }); 
        }
        else{
          message.error(res.data.message);
        }
      })
    }
    onDefaultLevelChange(titleLevel) {
      const viewparam = { ...this.state.viewparam, titleLevel }
      delete viewparam.viewId
      const itemQuery = { ...this.state.itemQuery, viewparam };
      this.setState({ viewparam, titleLevel, itemQuery })
    }
    handleClose(){
        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {  
            window.location.href="about:blank";  
            window.close(); 
        } else {
            window.opener = null;  
            window.open("", "_self");  
            window.close();  
        }
    }
    selectTree(selectTreeId) {
      this.setState({ selectTreeId });
    }
    saveFilterSetting(callbackFn) {
      this.child.props.form.validateFields((errors, values) => {
          if (!!errors) {
              console.log('Errors in form!!!', errors);
              return;
          }
          let conditionGroup = values.data;
          dot.object(conditionGroup)
          window.conditionGroup = values;

          const viewparam = { ...this.state.viewparam, group: conditionGroup.conditionGroup }
          delete viewparam.viewId
          const itemQuery = { ...this.state.itemQuery, viewparam };
          this.setState({ itemQuery, viewparam, group: conditionGroup.conditionGroup, isShowFilterSetting: false }, () => console.log(this.state.group));
      });

      callbackFn && callbackFn()
    }
    resetFilterSetting(isReset) {
      this.setState({ shouldResetFilter: isReset });
    }
    saveColumnSetting(callbackFn) {
      // 验证必有项目是否缺少
      if (1) { 
        console.log(this.state.relas, '=== validate')
        // 如果缺少，则还原默认值relas： defaultViewData.relas，并提示报错信息  
      } 
      // 如果不缺少，则执行回调
      this.child.props.form.validateFields((errors, values) => { 
        if (!!errors) {  
          for (const errorskey in errors) {
            if (Object.hasOwnProperty.call(errors, errorskey)) {
              const elementError = errors[errorskey];
              message.warn(elementError.errors.lastItem.message)
            }
          }
          console.log('Errors in form!!!', errors);
          return;
        } 
        let warnText = true;
        for (const key in this.state.relas) {
          if (Object.hasOwnProperty.call(this.state.relas, key)) {
            const element = this.state.relas[key];
            if (element.attrCode === '条目内容') {
              this.setState({
                relas:
                  this.state.relas.map(item => ({ ...item, width: values[item.id] }))
              }, () => {
                console.log(this.state.relas, '=== relas')
                const viewparam = { ...this.state.viewparam, relas: this.state.relas }
                delete viewparam.viewId
                const itemQuery = { ...this.state.itemQuery, viewparam };
                this.setState({ itemQuery, viewparam, isShowColumnSetting: false })
                callbackFn && callbackFn()
              })
              warnText = false
            }
          }
        }
        if (warnText) {
          message.warn('显示列必须包含【数据类型为正文的属性名称】！')
        } 
      })
    }
    saveAsNewView() {
      this.child.props.form.validateFields((errors, values) => {
        if (!!errors) {
          console.log('Errors in form!!!', errors);
          return;
        }
        const submitViewData = {
          viewId: this.state.viewId,
          docId: this.state.docId,
          defaultLevel: this.state.titleLevel,
          conditionGroup: this.state.group,
          viewAttrRela: this.state.relas.map(item => ({ ...item, viewId: this.state.viewId, attrId: item.attrId || item.id })),
          view: values,
        }
        this.submitRequest('/sysware/api/view/saveAs', submitViewData, () => {
          this.fetchUserViewList(this.state.docId, 0, () => this.setState({ backup_viewparam: this.state.viewparam }))
          this.closeModal()
        });
      })
    }
    getUserInfo() {
      this.submitRequest('/sysware/api/user/getUserInfo', null, (currentUser) => {
          console.log(currentUser, '=== currentUser')
          this.setState({ currentUser })
      }, 'GET');
    }
    submitRequest(url, data, callbackFn, method = 'post') {
      axios({ method, url, data }).then(res => {
        if (res.data.code === 200) {
          // message.success('保存成功！');
          // message.success('保存成功！');
          this.closeModal();
          callbackFn && callbackFn(res.data.data)
        }
      })
    }
    saveCurrentView() {
      const submitViewData = {
        viewId: this.state.viewId,
        docId: this.state.docId,
        defaultLevel: this.state.titleLevel,
        conditionGroup: this.state.group,
        viewAttrRela: this.state.relas.map(item => ({ ...item, viewId: this.state.viewId, attrId: item.attrId || item.id })),
      }
      this.submitRequest('/sysware/api/view/modifyView', submitViewData, () => {
        this.closeModal();
        this.setState({ backup_viewparam: this.state.viewparam })
      });
    }
    onClickSaveAs() {
      this.setState({ isShowAddViewInfo: true });
    }
    handleClickHistoryItem=(selectedRowKeys)=> {
      if (selectedRowKeys.length !== 1) return message.warn('请选择一项条目')
      location.href = `/item_history_record.html?docId=${selectedRowKeys[0]}`;
      window.localStorage.setItem('itemDocumentId',qs.parse(location.search.replace('?', '')).id)
    }
    isShowColumnSetting=()=>{
      this.setState({ isShowColumnSetting: true });
    }
    isShowFilterSetting=()=>{
      this.setState({ isShowFilterSetting: true });
    }
    isShowExportModal=()=>{
      this.setState({ isShowExportModal: true });
    }
    saveEditView() {
      this.child.props.form.validateFields((errors, values) => {
        if (!!errors) {
          console.log('Errors in form!!!', errors);
          return;
        }
        // let sameName=this.state.userviews.filter(item => item.name===values.name )
        if(0){
          message.warn('视图名称已存在，不能重复！')
        } else{
          const submitViewData = {
            id: this.state.viewId,
            ...values
          }
          // this.submitRequest('/sysware/api/view/modify', submitViewData, this.closeModal.bind(this));
          this.submitRequest('/sysware/api/view/modify', submitViewData, () => {
            this.fetchUserViewList(this.state.docId, 0)
            this.closeModal()
          }); 
        }
        
      });
      
    }
    redirectPageOfficeLink(
      uri = '/sysware/pageoffice/docCreateWord',
      params = { documentId:10, itemId:10 },
      option = { width: 1200, height: 800 }
    ) {
      this.submitRequest('/sysware/pageoffice/pageofficeUrl', null, (pageOfficeHost) => {
        // console.log(`${pageOfficeHost}${uri}${params? '?' + qs.stringify(params) : ''}`, '====')
        setTimeout(() => message.success('导出成功！'), 1000)
        location.href = `javascript:POBrowser.openWindowModeless('http://${pageOfficeHost}${uri}${params? '?' + qs.stringify(params) : ''}', "${option? 'width=' + option.width + 'px;' + 'height=' + option.height + 'px;' :'width=1200px;height=800px;'}");`
        
      }, 'GET');
    }
    generateDoc() {
      this.child.props.form.validateFields((errors, values) => {
        if (!!errors) {
          console.log('Errors in form!!!', errors);
          return;
        }
        const submitData = {
          access_token: Cookies.get('access_token'),
          exportInfoJson: values,
          itemQuery: this.state.itemQuery
        }
        this.submitRequest('/sysware/pageoffice/validateWordCreate', submitData, (flag) => {
          this.redirectPageOfficeLink('/sysware/pageoffice/docCreateWord', { flag })
        });
      });
    }
    deleteView() {
      // if (1) {
      //   return message.success('删除视图成功')
      // }
      axios.get(`/sysware/api/view/del?viewId=${this.state.viewId}`).then(res => {
        if (res.data.code === 200) {
          this.fetchUserViewList(this.state.docId, 0)
          message.success('删除视图成功')
        }
        else{
          message.error(res.data.message);
        }
      })
    }
    onColumnSettingChange(relas) {
      this.setState({ relas: relas.map(item => ({ ...item, viewId: this.state.viewId, attrId: item.attrId || item.id })) });
    }
    closeModal() {
      this.setState({ isShowColumnSetting: false, isShowFilterSetting: false, isShowAddViewInfo: false, isShowEditViewInfo: false, isShowExportModal: false });
    }
    itemLayout=(e)=>{  
      const that = this
      switch (e.key) {
        case '0':
          Modal.confirm({
            title: '提示',
            content: '当前视图的显示列、过滤条件和显示级别将重置为默认设置。确定恢复吗？',
            onOk() {
              that.resetDefaultView()
            },
            onCancel() {},
          });
          break;
        case '1':
          Modal.confirm({
            title: '提示',
            content: '删除的视图无法恢复。确定删除吗？',
            onOk() {
              that.deleteView() 
            },
            onCancel() {},
          });
          break; 
        case '2':
          this.fetchViewDetail(() => this.setState({ isShowEditViewInfo: true })) 
          break; 
        default:
          break;
      } 
    } 
    //编辑状态下拉选择
    editStatus(e){  
      if (e.key == '1' || e.key == '2') {
        axios.get(`/sysware/api/document/lockDocu?documentId=${this.state.docId}&editType=${e.key}`).then(res => {
            if (res.data.code === 200) {
                window.location.href = `requirement_fullpage.html?id=${this.state.docId}&edit_type=${e.key}`;
            }
            else {
                message.error(res.data.message);
            }
        })
        this.setState({
          editStatusText: e.key == '1' ? '共享编辑' : '独占编辑'
        }) 
    } else {
      window.location.href = `requirement_fullpage.html?id=${this.state.docId}&edit_type=${e.key}`;

         if(e.key == '0'){
          this.setState({
            editStatusText:'查看'
          })
         }else if(e.key == '1'){
          this.setState({
            editStatusText:'共享编辑'
          })
         }
    }
    }


    render(){  
      const EDIT_TYPE = qs.parse(location.search.replace('?', '')).edit_type || '0';
      const pathsArr=[]; 
      const projectPaths=(data)=>{  
        for (let i = 0; i < data.length; i++) { 
          if(qs.parse(location.search.replace('?', '')).pageTypes){
            if(data[i].parentId==0){
              if(data[i].aclValue==1){
                pathsArr.push(<span  style={{float:'left'}}><font style={{margin:'0 5px'}}>/</font>{data[i].name}</span>)   
              }else{
                pathsArr.push(<a href={`requirement_management.html?id=${data[i].id}`}>{data[i].name}</a>)  
              }
            }
            if(data[i].children){
              pathsArr.push(<span><font style={{margin:'0 5px'}}>/</font><a href={`requirement_management.html?id=${data[i].children[i].id}`}>{data[i].children[i].name}</a></span>) 
              projectPaths(data[i].children)
            }
          }else{
            if(data[i].parentId==0){
              pathsArr.push(<a href={`requirement_management_config.html?id=${data[i].id}`}>{data[i].name}</a>)  
            }
            if(data[i].children){
              pathsArr.push(<span><font style={{margin:'0 5px'}}>/</font><a href={`requirement_management_config.html?id=${data[i].children[i].id}`}>{data[i].children[i].name}</a></span>) 
              projectPaths(data[i].children)
            } 
          }
        } 
      //   for(let item in data){
      //     if(qs.parse(location.search.replace('?', '')).pageTypes){
      //       pathsArr.push(<a href={`requirement_management.html?id=17650`}>{data[item].name}</a>)
      //     }else{
      //       pathsArr.push(<a href={`requirement_management_config.html?id=17650`}>{data[item].name}</a>)
      //     }
      //     if(data[item].children){ 
      //         data[item].children.map((item)=>{     
      //           console.log(item,'itemitemitemitem') 
      //           // if(qs.parse(location.search.replace('?', '')).pageTypes){ 
      //           //   pathsArr.push(<span><font style={{margin:'0 5px'}}>/</font><a href={`requirement_management.html?id=17650`}>{item.name}</a></span>)
                
      //           // }else{
      //           //   pathsArr.push(<span><font style={{margin:'0 5px'}}>/</font><a href={`requirement_management_config.html?id=17650`}>{item.name}</a></span>)
      //           // }                       
      //         }) 
      //     }  
      // } 
      return pathsArr;
      }

        return (
            <SysLayout>
                <div id='breadCrumbs' className='breadCrumbs'>
                  <label>
                     <font style={{margin:'0 10px',color:'#fff',float:'left'}}>|</font><span title="" dir="rtl" className='projectPaths' >{projectPaths(this.state.projectPaths)}</span>
                    </label>
                     
                  <SysButton.Dropdown 
                    onItemClick={(e) => this.editStatus(e)} 
                    >
                     {[
                         {title:'查看'},
                         {title:'共享编辑', disabled: isBtnShowOrNot('共享编辑')({ editType: EDIT_TYPE, editUser: [], currentUser: this.state.currentUser })}, 
                         {title:'独占编辑', disabled: isBtnShowOrNot('独占编辑')({ editType: EDIT_TYPE, editUser: [], currentUser: this.state.currentUser })},   
                     ]}
                   </SysButton.Dropdown>
                   <a style={{float:'right'}} href="#">{this.state.editStatusText}</a>
                </div>

                <div style={{ width: '100%', float: 'left'}}>
                    <ViewerTree 
                      viewId={this.state.viewId} 
                      currentView={this.state.currentView}
                      itemQuery={this.state.itemQuery}
                      itemAddType={this.state.itemAddType}
                      titleLevel={this.state.titleLevel}
                      viewparam={this.state.viewparam}
                      viewAttrRela={this.state.relas}
                      backup_viewparam={this.state.backup_viewparam}
                      fetchViewAllInfo={this.fetchViewAllInfo.bind(this)}
                      userviews={this.state.userviews}
                      saveCurrentView={this.saveCurrentView.bind(this)}
                      resetViewSetting={this.resetViewSetting.bind(this)}
                      onClickSaveAs={this.onClickSaveAs.bind(this)}
                      onClickHistoryItem={this.handleClickHistoryItem}
                      itemLayout={this.itemLayout}
                      onDefaultLevelChange={this.onDefaultLevelChange.bind(this)}
                      docId={this.state.docId}
                      isShowColumnSetting={this.isShowColumnSetting}
                      isShowFilterSetting={this.isShowFilterSetting}
                      isShowExportModal={this.isShowExportModal}
                      />
                </div>
                
                { this.state.isShowFilterSetting ? <ModalTool save={this.saveFilterSetting.bind(this)} reset={this.resetFilterSetting.bind(this)} closeModal={this.closeModal.bind(this)} title='设置过滤条件' buttonList={['ok', 'reset', 'cancel']}>
                  <FilterSetting viewAttrRela={this.state.relas} conditionGroup={this.state.group} onRef={ ref => this.child = ref } shouldResetFilter={this.state.shouldResetFilter} resetFilterSetting={this.resetFilterSetting.bind(this)}/>
                </ModalTool>: null}
                { this.state.isShowColumnSetting ? <ModalTool width={900} save={this.saveColumnSetting.bind(this)} closeModal={this.closeModal.bind(this)} title='设置显示列' buttonList={['ok', 'cancel']}>
                  <ColumnSetting onRef={(ref) => this.child = ref} isShowColumnSetting={this.state.isShowColumnSetting} viewId={this.state.viewId} viewAttrRela={this.state.relas} onChange={this.onColumnSettingChange.bind(this)}/>
                </ModalTool>: null}
                { this.state.isShowAddViewInfo ? <ModalTool save={this.saveAsNewView.bind(this)} closeModal={this.closeModal.bind(this)} title='新增' buttonList={['ok', 'cancel']}>
                  <ViewAdd onRef={(ref) => this.child = ref} />
                </ModalTool>: null}
                { this.state.isShowEditViewInfo ? <ModalTool save={this.saveEditView.bind(this)} closeModal={this.closeModal.bind(this)} title='编辑' buttonList={['ok', 'cancel']}>
                  <ViewEdit onRef={(ref) => this.child = ref} baseData={this.state.viewData} />
                </ModalTool>: null}
                { this.state.isShowExportModal ? <ModalTool save={this.generateDoc.bind(this)} closeModal={this.closeModal.bind(this)} title='导出文档' buttonList={['ok', 'cancel']} >
                  <ViewExport onRef={(ref) => this.child = ref } />
                </ModalTool>: null}
            </SysLayout>
        )
    }
}

export default Page