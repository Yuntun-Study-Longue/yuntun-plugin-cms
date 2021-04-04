import React, { Component } from 'react';
import './header.css'

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div id="uiframe-top">
            <div id="uiframe-header" className="newFramehead">
                <div className="head-left fl">
                    <span className="new-logo new-in-block">需求管理系统</span>
                </div>
                <div className="head-right fr"></div>
            </div>
        </div>
    }
}