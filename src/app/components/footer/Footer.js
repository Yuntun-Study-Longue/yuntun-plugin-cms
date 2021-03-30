import React, { Component } from 'react';
import './footer.css'

export default class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="login6-bg-bottom">
        <label>SYSWARE Co.,LTD.版本</label>
        <a style={{color:"white"}} href="http://192.168.5.202:8182/sysware/about/gotoAboutList.action" target="_blank" />
    </div>
    }
}