import React from 'react'
import './index.scss'
export default function index(props) {
    return (
        <div className={props.className}>
            <div className="logoHeader">
                <i className="fl logoHeader-logo"></i>
                <span className="fl en-info">SYSWARE</span>
                <span className="fl zh-info">需求管理系统</span>
            </div>
            <div style={{height:'calc(100vh - 100px)'}}>
                {props.children}
            </div>
        </div>
    )
}
