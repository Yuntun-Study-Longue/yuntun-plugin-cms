import React, { Component } from 'react'
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Radio from 'sub-antd/lib/radio';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import { twoColLayout, fourColLayout, halfFourColLayout } from "components/sysLayout/formLayout";
import axios from 'axios'
import qs from 'querystring';
import Cookies from 'js-cookie'
import Upload from 'sub-antd/lib/upload';
import message from 'sub-antd/lib/message';

import SysLayout from "components/sysLayout/sysLayout"
import SysButton from 'components/sysButton'
import SysIcon from 'components/sysIcon'
import SysModal from 'components/sysModal'
import Tabs from 'sub-antd/lib/tabs';
const TabPane = Tabs.TabPane;
import "../main.scss";
import { CheckboxGroup } from 'sub-antd';
export default class DocumentTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importType: 0,   // 导入方式  0本地 1 模板库导入 2导入条目文档 3.文档模型
      fileId: '',
      fileName: '',
      id: '',
      fileList: [],//上传文件集合  
      fileNum: 0,  //文件个数
    }
    this.onGetRandom = ''
  }
  componentDidMount() {
    // this.docTempList()
    { this.props.docModal === 1 ? '' : this.docTempList() }
    // let onGetRandom = this.getRandom()
    // this.setState({
    //   onGetRandom
    // })
    this.onGetRandom = this.getRandom()
  }

  getRandom = () => {
    let len = len || 32;
    let str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";//想要随机的字符 
    let maxPos = str.length;
    var tempFlagId = '';
    for (var i = 0; i < len; i++) {
      tempFlagId += str.charAt(Math.floor(Math.random() * maxPos));
    }
    return tempFlagId;
  }
  docTempList = () => {
    axios.get(`/sysware/api/documentTemplate/list?documentId=${qs.parse(location.search.replace('?', '')).id}`)
      .then((res) => {
        if (res.data.data) {
          console.log(res.data)
          if (res.data.data.importType == this.state.importType) {
            this.setState({
              fileId: res.data.data.fileId,
              fileName: res.data.data.fileName,
              id: res.data.data.id,
              fileList: [{
                uid: res.data.data.fileId,
                name: res.data.data.fileName,
                status: 'done',
              }]
            });
          }

        }
      })
  }
  getInitialState() {
    this.setState({
      importType: 0 
    },()=>{
      { this.props.docModal === 1 ? '' : this.docTempList() }
    })
  }
  onRadioChange = (e) => {
    this.setState({
      importType: e.target.value,
    }, () => {
      axios.get(`sysware/api/documentTemplate/changeSource?importType=${this.state.importType}&documentId=${this.props.docModal === 1 ? '' : qs.parse(location.search.replace('?', '')).id}&tempFlag=${this.onGetRandom}`).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data; 
          if (data.fileId) {
            this.setState({
              fileId: data.fileId,
              fileName: data.fileName,
              id: data.id,
              fileList: [{
                uid: data.fileId,
                name: data.fileName,
              }]
            })
          } else {
            this.setState({
              fileName: '',
              fileId: '',
              fileList: []
            })
          }
        }
      }).catch(error => {
        console.log(error);
      })
    });
  }
  beforeUpload = (file) => {
    const isDOC = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isDOC) {
      SysModal.error('只允许上传.doc、.docx格式的文件!');
    }
    // let fileArr = [];
    // else {
    //   fileArr.push(file);
    //   this.setState({
    //     fileList: fileArr
    //   })
    // }
    return isDOC;
  }
  createPageOfficeLink = (
    uri = 'http://localhost:8080/sysware/pageoffice/word',
    option = { width: 1100, height: 600 }
  ) => {
    const visitLink = `javascript:POBrowser.openWindowModeless('${uri}', "${option ? 'width=' + option.width + 'px;' + 'height=' + option.height + 'px;' : 'width=1200px;height=800px;'}");`
    return visitLink
  }
  onUploadPropsChange=(info) => { 
    console.log(info,'info')  
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); 
    fileList = fileList.map(file => {
      console.log(file.response,'file.response')
      const fileRes = file.response;
      if (fileRes) { 
        { this.props.docModal == 1 ? this.props.onGetRandom(this.onGetRandom) : '' }
        this.setState({
          fileId: fileRes.data.id,
          fileName: fileRes.data.filename,
          id:fileRes.data.id,
          fileNum: this.state.fileNum + 1,
          // fileList: info.fileList,
        }, () => { 
          { this.props.docModal == 1 ? this.props.fileNum(this.state.fileNum)  : '' }
          { this.props.docModal == 1 ? this.props.onGetRandom(this.onGetRandom) : '' }
          { this.props.docModal == 1 ? '' : this.docTempList() }
        })
        message.success('上传成功！');
      }else if (info.file.status === 'error') {
        console.log(info.file.response.message)
        message.error(`${info.file.name}上传失败！`);
      }
      return file;
    });

    this.setState({ fileList }); 
 
    // if (info.file.status === 'done') {
    //   let fileList = [...info.fileList];
    //   fileList = fileList.slice(-1);
    //   const fileRes = info.file.response;
    //   if (fileRes.code === 200) {
    //     console.log(fileRes,'fileRes') 
    //     { this.props.docModal == 1 ? this.props.onGetRandom(this.onGetRandom) : '' }
    //     this.setState({
    //       fileId: fileRes.data.id,
    //       fileName: fileRes.data.filename,
    //       id:fileRes.data.id,
    //       fileNum: this.state.fileNum + 1,
    //       fileList: info.fileList,
    //     }, () => { 
    //       { this.props.docModal == 1 ? this.props.fileNum(this.state.fileNum)  : '' }
    //       { this.props.docModal == 1 ? this.props.onGetRandom(this.onGetRandom) : '' }
    //       { this.props.docModal == 1 ? '' : this.docTempList() }
    //     })
    //   }
    //   message.success('上传成功！');
    // } else if (info.file.status === 'error') {
    //   console.log(info.file.response.message)
    //   message.error(`${info.file.name}上传失败！`);
    // }
  }
  onRemove= (file) => {
    SysModal.confirm("确定删除所选文件吗？", () => {
      axios.get(`/sysware/api/documentTemplate/delFile?fileId=${this.props.docModal === 1 ? '' : this.state.fileId}&id=${this.state.id}`)
        .then((res) => {
          if (res.status === 200) {
            SysModal.success("删除成功");
            this.upload.handleRemove(file);
            this.setState({
              fileId: '',
              fileName: '',
              fileList: [],
              id:'',
              fileNum: this.state.fileNum - 1,
            }, () => {
              console.log(this.state.fileNum, 'this.state.fileNum')
              { this.props.docModal == 1 ? this.props.fileNum(this.state.fileNum)  : '' }
              { this.props.docModal == 1 ? this.props.onGetRandom(this.onGetRandom) : '' }
              { this.props.docModal == 1 ? '' : this.docTempList() }
            })
          } else {
            SysModal.error(res.data.message);
          }
        });
    })
  }
  render() {
    var paramData = {
      importType: this.state.importType,
      documentId: this.props.docModal == 1 ? '' : qs.parse(location.search.replace('?', '')).id,
      oldFileId: this.state.fileId,
      id: this.state.id,
      tempFlag: this.onGetRandom
    };
  
    const UploadProps={
      name: "file",
      action: "/sysware/api/documentTemplate/uploadFile",
      data: paramData,
      headers: {
        authorization: Cookies.get("Authorization"),
      }, 
      onChange: this.onUploadPropsChange,
      onRemove:this.onRemove,
      fileList: this.state.fileList,
      showIcon: true,
    };

    return (
      <div style={{ marginTop: '20px' }}>
        <p style={this.props.docModal == 1 ?
          { display: 'block' } : { display: 'none' }} className='docTipsText'
          title={this.props.docStep == 1 ? '说明：请确保用于导入条目的文档与文档模板的样式一致。否则，会造成导入的条目与人工新增的条目及导出文档的样式不同。样式不一致的解决方案：1、将用于导入条目的文档作为文档模板，并对文档模板进行设置（参见设置文档模板向导页）。2、导入条目前，在本地打开用于导入条目的文档，并将文档模板的样式导入该文档。'
            : '说明：文档模板为条目内容提供标准样式，并用于标准文档的导出，因此须在执行上述操作前设置。'}>
          {this.props.docStep == 1 ? '说明：请确保用于导入条目的文档与文档模板的样式一致。否则，会造成导入的条目与人工新增的条目及导出文档的样式不同。样式不一致的解决方案：1、将用于导入条目的文档作为文档模板，并对文档模板进行设置（参见设置文档模板向导页）。2、导入条目前，在本地打开用于导入条目的文档，并将文档模板的样式导入该文档。'
            : '说明：文档模板为条目内容提供标准样式，并用于标准文档的导出，因此须在执行上述操作前设置。'}
        </p>
        <Form inline style={{ position: 'relative' }}>
          <FormItem label={this.props.docStep == 2 ? '模板来源' : '导入方式：'} {...fourColLayout} >
            <RadioGroup >
              {/* <div dangerouslySetInnerHTML={{__html: this.RadioGroup}} /> */}
              {/* {this.RadioGroup}  */}
              {this.props.docModal === 1 ? this.props.docStep == 1 ?
                <RadioGroup onChange={this.onRadioChange} value={this.state.importType}>
                  <Radio key="0" value={0}>从本地文档导入条目</Radio>
                  <Radio key="1" value={1}>从文档结构模板库导入条目</Radio>
                </RadioGroup> :
                <RadioGroup onChange={this.onRadioChange} value={this.state.importType}>
                  <Radio key="0" value={0}>导入条目的文档</Radio>
                  <Radio key="1" value={1}>文档模型</Radio>
                  <Radio key="2" value={2}>本地上传</Radio>
                  <Radio key="3" value={3}>文档模板库</Radio>
                </RadioGroup>
                :
                <RadioGroup onChange={this.onRadioChange} value={this.state.importType}>
                  <Radio key="0" value={0}>导入条目的文档</Radio>
                  <Radio key="1" value={1}>文档模型</Radio>
                  <Radio key="2" value={2}>本地上传</Radio>
                  <Radio key="3" value={3}>文档模板库</Radio>
                </RadioGroup>
              }
            </RadioGroup>
          </FormItem>
          <FormItem label={<span>{this.props.docModal == 1 ? this.props.docStep == 1 ? '本地文档' : '文档模板' : '正文模板'}{this.props.docStep == 2 ? <tooltip
            title='说明：请设置文档模板的样式、封面等元素，并在文档模板的适当位置插入名称为PO_mainfile的书签，以便在导出文档时，将条目信息自动插入书签所在位置。'>
            <i><SysIcon style={{color:'#6398b4',fontSize:'12px',verticalAlign:'middle',margin:'0 2px'}} name="tips" /></i></tooltip> : ''}</span>} {...fourColLayout}  >
            <span style={{ width: '500px' }} >
              <Upload {...UploadProps} ref={(el) => this.upload = el}   
                // limitSize={1} limitCallBack={files => { console.log(files); }} 
                beforeUpload={this.beforeUpload} 
                style={{ float: 'left' }} >
                <SysButton title="上传" icon="upload" />
              </Upload>
            </span> 
            <div className={this.state.fileId ? 'editBtn-have' : 'editBtn'}>
              <SysButton title="编辑" icon="edit" onClick={() => window.location.href = this.createPageOfficeLink(
                `http://${this.props.pageOfficeHost}/sysware/pageoffice/documentWord?fileId=${this.state.id}_${qs.parse(location.search.replace('?', '')).id ? qs.parse(location.search.replace('?', '')).id : this.onGetRandom}&access_token=${Cookies.get('access_token')}`
              )}> </SysButton>
            </div>
          </FormItem>
        </Form>
      </div>
    )
  }
}
