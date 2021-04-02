import React, { Component } from 'react'
import './index.scss'
// import Dropdown from 'sub-antd/lib/dropdown'
// import Menu from 'sub-antd/lib/menu'
import { Menu, Dropdown } from 'antd';
import SysIcon from 'components/sysIcon'

const findIndex = (name, enums = ['无', '读取', '修改', '删除', '管理', '继承'] || []) => {
  if (['上移', '下移'].includes(name)) return 4;
  else if (['新增'].includes(name)) return 2;
  return enums.findIndex(item => item === name)
}
function SysButton (props){
  let disabled = props.disabled || false;
  if (props.aclValues) {
    if (props.aclValues.length) {
      disabled = !props.aclValues.includes(1 << findIndex(props.title));
    }
  }
    return (
        <button 
            title={props.title}
            className={`sys-btn ${props.className} ${props.disabled||disabled?"sys-btn-disabled":""}`}
            disabled={props.disabled||disabled} 
            onClick={props.onClick}
        >
            {props.icon&&<SysIcon name={props.icon}/>}
            {props.children&&
                (
                    <span style={{fontSize:14}}>{props.children}</span>
                )
            }
        </button>
    )
}
function SysDropDown (props){
    let disabled = props.disabled || false;
    if (props.aclValues) {
        if (props.aclValues.length) {
        disabled = !props.aclValues.includes(1 << findIndex(props.title));
        }
    }
    const menu = (
        <Menu onClick={props.onItemClick}>
            { props.children &&
                props.children.map((item,index)=>{
                return <Menu.Item key={index} disabled={item.disabled || disabled}> {item.title}</Menu.Item>
                })
            }
        </Menu>
    );
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <SysButton  {...props}><SysIcon name="arrow-bottom" style={{fontSize:10,position:'absolute',top:5}}/></SysButton>
        </Dropdown>
    )
}
SysButton.Dropdown = SysDropDown;
export default SysButton