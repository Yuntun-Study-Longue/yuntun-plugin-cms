
import React, { Component } from 'react'

export default [
    {
        title: "名称",
        width:200,
        dataIndex: "name",
        key:'name',
        nowrap: true,
        render: (text, record, index) => {
            return <div title={text}>{text}</div>;
        },
    },
    {
        title: "类型",
        width:150,
        dataIndex: "aclType",
        key:'aclType',
        nowrap: true,
        render: (text, record, index) => { 
            return (
                <span>
                  {record.aclType === '0'||record.aclType === 0 ? '人员' : '角色'} 
                </span>
              );
          }  
    },
    
];
