import React, { Component } from 'react';
import { Form } from 'antd';
const FormItem = Form.Item;
import {halfFourColLayout,fourColLayout,halfFourColLayoutFn,fourColLayoutFn} from "components/sysLayout/formLayout";
import { type, scope, changeitem, selectType, createhistory,extendType } from './enumtype';
import SysTable from 'components/sysTable'
import columns from '../../fundamentalDataManagement/columns/enum_attr'
export default function DocConfigInfo (props){
    console.log(props)
    return (
      
        <Form inline> 
            <FormItem label='名称：' {...halfFourColLayout}>{props.baseData.attrCode}</FormItem>
            <FormItem label='作用范围：' {...halfFourColLayout}>{scope(props.baseData.scope)}</FormItem>
            <FormItem label='内置/扩展' {...halfFourColLayout}>{extendType(props.baseData.extendType)}</FormItem>
            <FormItem label='触发条目变更：' {...halfFourColLayout}>{changeitem(props.baseData.changeItem)}</FormItem>
            <FormItem label='数据类型：' {...halfFourColLayout}>{type(props.baseData.attrType)}</FormItem>
            <FormItem label='生成历史记录：' {...halfFourColLayout}>{createhistory(props.baseData.createHistory)}</FormItem>
            <FormItem label='选择方式：' {...halfFourColLayoutFn(
                [5,6].includes( props.baseData.attrType)?{}:{display:'none'}
            )}>{selectType(props.baseData.multiType)}</FormItem>
            <FormItem label='枚举值：' {...fourColLayoutFn(
                [5,6].includes( props.baseData.attrType)?{}:{display:'none'}
            )}>
                { props.baseData.docuExtends ? 
                    <div style={{height:162}}>
                        <SysTable 
                            style={{height:'100%'}}
                            dataSource={props.baseData.docuExtends}
                            number 
                            columns={columns}
                        />
                    </div>: ''
                }
            </FormItem>
            <FormItem label='描述：' {...fourColLayout}>{props.baseData.describe}</FormItem>
        </Form>
    )
}
