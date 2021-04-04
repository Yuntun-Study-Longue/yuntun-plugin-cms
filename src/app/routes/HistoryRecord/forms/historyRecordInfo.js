import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import axios from 'axios';
const FormItem = Form.Item;
export default class HistoryRecordInfo extends Component {
    constructor(props) {
        super(props); 
    }
    componentDidMount(){
        this.getRecordInfo();
    }
    getRecordInfo(){
        axios.get(`/sysware/api/his/detial?type=${this.props.typeNum}&hisId=${this.props.baseId}`).then(res => {
            let data=res.data.data.resultSet || res.data.data || [];
            this.setState({
              dataSource:data,
            })
        }).catch(error => {
    
        })
    }
    render() {
        const twoColLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            style: { width: "100%" },
        };
        const baseDataInfo=this.props.baseData;
        return (
            <div style={{height:'100%',width:'100%',overflow:'auto'}}>
            <Form inline style={{minWidth:360}}>   
                {baseDataInfo.details.map((item,index)=>{
                    let showValue = [];  
                    //0添加 1修改 2 删除 3复制粘贴 4剪切粘贴  6 升级 7 降级  5 上下移动(弃用)
                   switch (item.operateType) {
                       case 0:  //0 添加
                           showValue = item.oldValue;
                           break;
                       case 1:  //1 修改
                           showValue = ['修改前：', <br />, item.oldValue, <br />, '修改后：', <br />, item.newValue];
                           break;
                       case 2:  //2 删除
                           showValue = ['已删除：跟踪至',<br />,item.oldValue]; 
                           break;
                       case 3:  //3 复制粘贴
                           item.attrName == "条目类型" ? showValue = [item.oldValue] : showValue = ['已添加：', <br />, item.oldValue];
                           break;
                       case 4:  //4 剪切粘贴
                           item.attrName == "条目类型" ? showValue = [item.oldValue] : showValue = ['已添加：', <br />, item.oldValue];
                           break;
                       case 6:  //6 升级
                           item.attrName == "条目类型" ? showValue = [item.oldValue] : showValue = ['已添加：', <br />, item.oldValue];
                           break;
                       case 7:  //7 降级
                           item.attrName == "条目类型" ? showValue = [item.oldValue] : showValue = ['已添加：', <br />, item.oldValue];
                           break;
                       default:
                           break;
                    }
                    return <FormItem key={index} label={item.attrName} {...twoColLayout}>{showValue}</FormItem>
                })}
            </Form>
            </div>
        )
    }
}