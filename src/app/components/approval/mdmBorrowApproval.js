import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from '@/redux/approval/store'

import SingleApproval from './singleApproval'
import ManyApproval from './manyApproval'
import FinalApproval from './finalApproval'

import axios from "axios";

import message from 'sub-antd/lib/message';
import Modal from 'sub-antd/lib/modal';
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Select from 'sub-antd/lib/select';
import qs from 'qs';

const urlObj = qs.parse(window.location.search.split('?')[1]);

const Option = Select.Option;
const FormItem = Form.Item;
const CountDown = Input.CountDown;

import './approval.scss'

let inited = false;
let openBorrowApproval = function () {
}
//抛出一个接口，提供第三方调用自动生成html
//window.ApprovalUtil = {};
exports.openBorrowApproval = function (params) {
  if (!inited) {
    $('body').append('<div id="approval-container"></div>');
    ReactDOM.render(<Provider
      store={store}><SubmitApproval/></Provider>, document.getElementById("approval-container"));
    inited = true;
  }
  openBorrowApproval(params)
}

/**
 * 送审
 */
export default class SubmitApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: '借阅',
      visible: false,
      reason: "", //借阅原因
      submitData: [], //提交的数据
      params: "", //调用方提供的参数  //templateType审批类型 --objectId审批对象id
      processId: "",   //clone后的流程id
    }
  }

  componentDidMount() {
    openBorrowApproval = (params) => {
      params.openSuccess && params.openSuccess()
      this.setState({
        visible: true,
        modalTitle: params.modalTitle || '借阅',
        params
      });
    }
  }

  clearData() {
    this.state = {
      ...this.state,
      reason: "",
      submitData: [],
      processId: "",
    }
  }

  //mdm 获取借阅对象
  getBorrowApprovalId(borrowTime, borrowCause) {

    let data = {
      borrowId: this.state.params.borrowId,        //数据id
      borrowTime: borrowTime.toString(),   //借阅时间
      borrowCause: borrowCause  //借阅原因
    };
    return new Promise(resolve => {
      axios.post(globalInitConfig.mdm_url + `/mdm/api/personaldata/borrowrecord/start`, data).then(res => {
        resolve(this.state.params.objectId);
      }).catch(error => {
        console.log(error);
      });
    });
  }

  handleOk() {
    let closeFlag = true;
    let _this = this;
    this.cform.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        for (let key in errors) {
          this.state.submitData.forEach(item => {
            if (key.indexOf(item.activityId) !== -1) {
              closeFlag = false;
              return;
            }
          })
        }
        if (errors.msg) {   //校验送审附言
          closeFlag = false;
          return;
        }
      }
      //验证多选是否有搜索内容
      const submitData = this.state.submitData;
      for (let i = 0, len = submitData.length; i < len; i++) {
        if (submitData[i].isErr) {
          return;
        }
      }
      if (closeFlag) {
        //提交mdm
        this.getBorrowApprovalId(values.borrowDayNumber, values.reason).then(objectId => {
          let param = {};
          param["processInstanceId"] = this.state.processId;
          param["objectId"] = objectId; //审批对象id
          param["objectType"] = this.state.params.templateType;   //审批类型
          param["memo"] = this.state.params.title; //借阅知识
          submitData.forEach(item => {
            const key = item.activityId;
            let participateId = item.participateId;
            param[key] = participateId.constructor === Array ? function(){

              return participateId.map( item => {
                return item.value
              }).join(',')

            }() : participateId;
            if (item.roleId.length > 0) {
              param[key + "_role"] = item.roleId;
            }
            if (item.departmentId.length > 0) {
              param[key + "_dep"] = item.departmentId;
            }
            if (item.chargedUserId) {
              param[key + "_leader"] = item.chargedUserId;
            }
            param[key + "_checkbox_hidden"] = item.check ? "1" : "0";
          })
          axios.post(globalInitConfig.eap_url + `eap/api/approval/update-send.action`, param).then(res => {
            const data = res.data;
            if (200 === data.code) {
              this.clearData();
              this.setState({visible: false})
              this.state.params.success && this.state.params.success();
            }
          }).catch(error => {
            console.log(error);
          });


        });


      }


    })

  }

  updateData(obj) { //更新参数
    const submitData = this.state.submitData;
    let noData = true;
    for (let i = 0, len = submitData.length; i < len; i++) {
      let item = submitData[i];
      if (obj.activityId === item.activityId) {
        this.state.submitData[i] = obj;
        noData = false;
      }
    }
    if (noData) {
      this.state.submitData.push(obj);
    }
  }

  updateReason(value) {
    this.setState({
      reason : value,
      params : {
        ...this.state.params,
        borrowCause : value
      }
    });
  }

  updateRorrowDayNumber(value) {
    this.setState({
      params : {
        ...this.state.params,
        borrowTime : value
      }
    });
  }

  updateProcessId(processId) {
    this.setState({processId, submitData: []});
  }

  handleCancel() {
    this.clearData();
    this.setState({visible: false});
    this.state.params.cancel && this.state.params.cancel();
    //删除流程id
    if (this.state.processId.length === 0) {
      return;
    }
    axios.delete(globalInitConfig.eap_url + `eap/api/approval/process.action?processId=${this.state.processId}`).then(res => {

    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="container" style={{boxSizing: "border-box"}}>
        <Modal title={this.state.modalTitle}
               className="submit-approval-modal"
               visible={this.state.visible}
               onOk={() => this.handleOk()}
               onCancel={() => this.handleCancel()}
               width={860}
               maskClosable={false}
        >
          {
            this.state.visible ? <SubmitApprovalContent
              ref={node => this.cform = node}
              update={obj => this.updateData(obj)}
              updateReason={value => this.updateReason(value)}
              updateRorrowDayNumber={value => this.updateRorrowDayNumber(value)}
              title={this.state.title}
              params={this.state.params}
              updateProcessId={(value) => this.updateProcessId(value)}
            /> : null
          }
        </Modal>
      </div>
    )
  }
}

class SubmitApprovalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      process: "",    //选中的审批流程
      processList: [],    //审批流程list
      processInstanceId: "",  //clone出来的流程id，
      activities: [], //审批节点数据

      reason: props.params.borrowCause || "", //借阅原因
      // title:"",
      borrowDayNumber: props.params.borrowTime || "5",
      dayList: [{value: 5, name: "5天"}, {value: 10, name: "10天"}]
    }
  }

  componentDidMount() {
    this.getProcessList();
  }

  getProcessList() {

    const params = {
      templateType : this.props.params.templateType,
      limit : 999,
      objectId : this.props.params.objectId
    }

    //获取 审批流程
    axios.get(globalInitConfig.eap_url + `eap/approval/getApprovalProcessTemplateByType.action` , {
      params
    }).then(res => {
      const data = res.data;
      if (data.success) {
        let processList = [];
        const dataList = data.data;
        dataList.map(item => {
          processList.push({name: item.approvalProcessTemplateName, value: item.approvalProcessTemplateId});
        });
        this.setState({processList, process: dataList[0].approvalProcessTemplateId}, () => {
          //clone流程
          this.cloneProcess(this.state.process);
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  handleProcess(process) {
    this.deleteProcess();
    this.cloneProcess(process);
  }

  cloneProcess(process) {
    //默认展示审批流程下面第一条数据

    let param = {templateId: process};
    axios.post(globalInitConfig.eap_url + `eap/api/approval/process/clone.action`, param).then(res => {
      const data = res.data;
      if (200 == data.code) {
        const processInstanceId = data.data.processInstanceId;
        this.props.updateProcessId(processInstanceId);
        this.setState({processInstanceId, process}, () => {
          //调用渲染节点接口
          const {templateType, objectId} = this.props.params;
          let paramStr = `processInstanceId=${this.state.processInstanceId}&objectType=${templateType}&objectId=${objectId}`
          //单人审批 行
          axios.get(globalInitConfig.eap_url + `eap/api/approval/acitivty.action?${paramStr}`).then(res => {
            const data = res.data;
            if (200 === data.code) {
              const backData = data.data;
              const activities = backData.activities;
              this.setState({activities});
            }
          }).catch(error => {
            console.log(error);
          });
        });
      } else {
        message.error("审批流程不正确，无法送审，请联系管理员");
      }
    }).catch(error => {
      console.log(error);
    });
  }

  deleteProcess() {    //删除clone出来的流程id
    if (this.state.processInstanceId.length === 0) {
      return;
    }
    axios.delete(globalInitConfig.eap_url + `eap/api/approval/process.action?processId=${this.state.processInstanceId}`).then(res => {

    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const {getFieldProps} = this.props.form;
    const msg = getFieldProps("reason", {
      'initialValue': this.state.reason,
      rules: [
        {max: 200, message: '最多输入200个字符'},
      ],
      onChange:(e)=>{
        const reason = e.target.value;
        this.props.updateReason(reason);
        this.setState({
          reason : reason
        });
      }
    });
    const borrowDayNumber = getFieldProps("borrowDayNumber", {
      'initialValue': this.state.borrowDayNumber,
      onChange:(value)=>{

        this.props.updateRorrowDayNumber(value);
        this.setState({
          borrowDayNumber : value
        });
      }
    });
    const title = getFieldProps("title", {
      'initialValue': this.props.params.title
    });
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 14},
    };
    return (
      <Form horizontal>
        {/*ke定制*/}
        <FormItem
          {...formItemLayout}
          label="借阅知识："
        >
          <Input type="text" {...title} disabled style={{width: 376, marginRight: 10}}/>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="借阅时间："
        >
          <Select
            {...borrowDayNumber}
            style={{width: 376, marginRight: 10}}
          >
            {
              this.state.dayList.map((item, index) => {
                return <Option value={item.value} key={index}>{item.name}</Option>
              })
            }
          </Select>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="借阅原因："
        >
          <CountDown {...msg} type="textarea" maxTextareaLength={200} rows={4}/>
        </FormItem>
        {/*ke定制*/}
        <FormItem
          {...formItemLayout}
          label="审批流程："
        >
          <Select
            value={this.state.process}
            style={{width: 376, marginRight: 10}}
            onChange={(value) => this.handleProcess(value)}
          >
            {
              this.state.processList.map((item, index) => {
                return <Option value={item.value} key={index}>{item.name}</Option>
              })
            }
          </Select>
        </FormItem>
        {
          this.state.activities.map((item, index) => {
            if (item.activityType == "SINGLE_APPROVAL_ACTIVITY") {  //单人审核
              return <SingleApproval
                key={item.activityId}
                FormItem={FormItem}
                formItemLayout={formItemLayout}
                parentId="0"
                update={obj => this.props.update(obj)}
                dataSource={item}
                form={this.props.form}
              />
            } else if (item.activityType == "DECIDE_APPROVAL_ACTIVITY") {   //决审
              return <FinalApproval
                key={item.activityId}
                FormItem={FormItem}
                formItemLayout={formItemLayout}
                update={obj => this.props.update(obj)}
                dataSource={item}
                form={this.props.form}
              />
            } else { //多人审核和会审会签
              return <ManyApproval
                key={item.activityId}
                FormItem={FormItem}
                formItemLayout={formItemLayout}
                userIds={ item.attributes.participantId }
                selectbutVisible={ !item.attributes.participantId }
                parentId="0"
                update={obj => this.props.update(obj)}
                dataSource={item}
                form={this.props.form}
              />
            }
          })
        }
      </Form>
    )
  }
}

SubmitApprovalContent = Form.create()(SubmitApprovalContent);