import React, { Component } from 'react'
import SysTable from 'components/sysTable'

function TypeTips(){
    const columns = [
        {
            title: "数据类型",
            width:100,
            dataIndex: "name",
            nowrap: true,
        },
        {
            title: "描述",
            width:350,
            dataIndex: "des",
            nowrap: true,
        },
        {
            title: "数量上限",
            width:100,
            dataIndex: "count",
            nowrap: true,
        },
    ];
    const dataSource = [
        {name:'枚举',des:'支持自定义选项，选择模式为“单选”或“多选”。',count:50},
        {name:'文本',des:'字数上限50字。',count:20},
        {name:'长文本',des:'字数上限500字。',count:20},
        {name:'文件',des:'支持多文件上传。文件数量上限：5个',count:10},
        {name:'日期',des:'显示：YYYY-MM-DD，默认当前日期。',count:10},
        {name:'用户',des:'支持选择多个系统用户，默认当前用户。',count:10},
    ]
    return (
        <SysTable 
            rowKey="name"
            style={{height:286}}
            dataSource={dataSource}
            number single
            columns={columns}
        />
    )
}
export default TypeTips
