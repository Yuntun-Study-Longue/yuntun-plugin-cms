import React, { Component } from "react";
import { Form } from 'antd';
const FormItem = Form.Item;
import {halfFourColLayout,fourColLayout} from "components/layout/formLayout";

function ReqDocInfo (props){
    return (
        <Form inline>
            {props.baseData.length && props.baseData.map((item,index)=>{
                let formLayout = item.formType === '1' || item.formType === '2'?fourColLayout:halfFourColLayout;
                let showValue = item.value;
                if(item.formType === '2'){
                    showValue = (
                        <ul style={{maxHeight:150}}>
                            {showValue && showValue.split(',').map((itemVal,index)=>{
                                return(
                                    <li 
                                        key={index} 
                                        style={{border:'none',padding:3}}
                                    >
                                        <a href={`/sysware/api/filesSys/downloadFile?file_id=${item.baseDataId.split(',')[index]}`}>【{item.securityLevelName.split(',')[index]}】{itemVal}</a>
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
export default ReqDocInfo