import React from 'react'
import './index.scss';
export default function SysToolBar(props) {
    return (
        <div className="sysToolBar">
            {props.children}
        </div>
    )
}
