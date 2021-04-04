import React, { Component } from 'react'
import SysHeader from './sysHeader'
import SysNavBar from './sysNavBar'
function SysLayout (props){
    return (
        <div style={{height:'100vh'}}>
            <SysHeader/>
            {!props.withoutNavBar && <SysNavBar/>}
            <div style={{height:`calc(100% - ${props.withoutNavBar?40:80}px)`}}>
                {props.children}
            </div>
        </div>
    )
}
export default SysLayout
