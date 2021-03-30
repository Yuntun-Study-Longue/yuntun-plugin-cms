import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
const FormItem = Form.Item;
export default class HistoryRecordInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const hisTitle = this.props.baseData.hisTitle;
        return (
            <Form inline>
                {this.props.baseData.details.map((item,index)=>{
                    let showValue = [];
                    if(hisTitle.indexOf('新增')!==-1){
                        if(!item.operteItemId){
                            showValue=['已添加：',<br />,item.newValue];
                        }else{
                            showValue=item.newValue;
                        }
                    }else if(hisTitle.indexOf('修改')!==-1){
                        showValue=['修改前：',<br/>,item.oldValue,<br/>,'修改后：',<br/>,item.newValue];
                    }
                    return <FormItem key={index} label={item.attrName} {...fourColLayout}>{showValue}</FormItem>
                })}
            </Form>
        )
    }
}