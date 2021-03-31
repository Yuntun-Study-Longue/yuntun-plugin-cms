import React, { Component } from "react";
import { Form } from 'antd';
const FormItem = Form.Item;
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";
import axios from 'axios';
import Cookies from 'js-cookie';

export default class RightVerticalInfo extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProp, nextState) {
        return (
            JSON.stringify(nextProp.baseData.detailArrData) !==
            JSON.stringify(this.props.baseData.detailArrData)
        );
    }
    render() {
        return (
            <Form inline>
                {this.props.baseData.detailArrData && this.props.baseData.detailArrData.map((item,index)=>{
                    let formLayout = item.formType === '1' || item.formType === '2'?fourColLayout:halfFourColLayout;
                    let showValue = item.value;
                    if(item.formType === '2'){
                        showValue = (
                            <ul style={{maxHeight:150}}>
                                {showValue && showValue.split(',').map((itemVal,index)=>{
                                    console.log(item.baseDataId)
                                    return(
                                        <li 
                                            key={index} 
                                            style={{border:'none',padding:3}}
                                        >
                                            <a href={`/sysware/api/filesSys/downloadFile?file_id=${item.baseDataId.split(',')[index]}`}> {itemVal}</a>
                                        </li>
                                    ) 
                                })}
                            </ul>
                        )
                    }
                    return <FormItem key={index} label={item.name} {...formLayout}>{showValue}</FormItem>;
                })}
            </Form>
        );
    }
}
