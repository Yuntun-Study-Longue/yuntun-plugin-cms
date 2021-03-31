import React, { Component } from 'react';
import SysTransfer from 'components/sysTransfer/Transfer';

export default class TabPaneTransfer extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <div>
                <div style={{width:200,height:40,lineHeight:'40px',textAlign:'right',paddingRight:10}} className="fl">
                    选择导出至文档的属性：
                </div>
                <div style={{ width: 800,margin:'10px 0 0 200px'}}>
                    <SysTransfer />
                </div>
            </div>
        ) 
    }
}