import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
                <div className="wrap">
                    <div className="clearfix" style={{paddingTop:150}}>
                        <img className="fl" src={require("assets/images/system/img_404.png")} width="434" height="350" style={{marginLeft:150}} />
                        <div className="fl" style={{marginLeft:200}}>
                            <h1 style={{color:"#999", fontSize:72}}>404</h1>
                            <p style={{color:"#999", fontSize:18,marginBottom:20}}>抱歉，您访问的页面不存在</p>
                            <Button size="large" type="primary" onClick={this.handleClose.bind(this)}>关闭</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
