import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from 'components/header/Header';
import Button from 'sub-antd/lib/button';

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleClose(){
        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {  
            window.location.href="about:blank";  
            window.close();
        } else {  
            window.opener = null;  
            window.open("", "_self");  
            window.close();  
        }
    }
    render(){
        return (
            <div >
                <Header />
                <div className="wrap">
                    <div className="clearfix" style={{paddingTop:150}}>
                        <img className="fl" src={require("assets/images/system/img_403.png")} width="243" height="292" style={{marginLeft:292}} />
                        <div className="fl" style={{marginLeft:156}}>
                            <h1 style={{color:"#999", fontSize:72}}>403</h1>
                            <p style={{color:"#999", fontSize:18,marginBottom:37}}>抱歉，你无权限访问该页面</p>
                            <Button size="large" type="primary" onClick={this.handleClose.bind(this)}>关闭</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
