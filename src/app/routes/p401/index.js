import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'assets/css/base.css';
import './index.scss';
import LogoLayout from 'components/sysLayout/logoLayout';
export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRelogin:false
        }
    }
    loginAgain=()=>{
        this.setState({showRelogin:true})
    }
    render(){
        return (
            <LogoLayout>
                <div className="p401">
                    <div className="login-timeout"></div>
                    <p className="login-timeout-tips">
                        对不起，您操作超时或未登录，无法访问该页面
                    </p>
                    <span className="relogin-btn" onClick={this.loginAgain}>重新登录</span>
                    <div className="relogin-mask" style={{display:this.state.showRelogin?'block':'none'}}>
                        <Relogin/>
                    </div>
                </div>
            </LogoLayout>
        )
    }
}
class Relogin extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            passwd: '',
            showErrorMsg:false
        }
    }
    relogin=()=>{
        const {username,passwd} = this.state;
        if(username && passwd){
            this.setState({showErrorMsg:false})
        }else{
            this.setState({showErrorMsg:true});
            return 
        }
        
        const form = new FormData();
        form.append('grant_type', 'password');
        form.append('username', username);
        form.append('password', passwd);
        form.append('client_id', 'client_1'); 
        form.append('client_secret', '123456');
        axios.post('/sysware/oauth/token', form).then(res => {
            Cookies.set('Authorization', res.data.token_type + ' ' + res.data.access_token);
            Cookies.set('access_token', res.data.access_token);
            location.pathname = localStorage.getItem('reloginToPath');
        }).catch((err)=>{
            if(err)this.setState({showErrorMsg:true})
        });
    }
    render(){
        return (
            <div className="relogin">
                <div className="relogin-input-wrap">
                    <i className="fl relogin-user"></i>
                    <input
                        type="text"
                        className="fl relogin-input"
                        value={this.state.username}
                        onChange={(e) => {
                            this.setState({ username: e.target.value });
                        }}
                    />
                </div>
                <div className="relogin-input-wrap">
                    <i className="fl relogin-pass"></i>
                    <input
                        type="text"
                        className="fl relogin-input"
                        onFocus={(e) => (e.target.type = "password")}
                        value={this.state.passwd} 
                        onChange={(e)=>{this.setState({passwd:e.target.value})}}
                    />
                </div>
                <div className="error-msg">{this.state.showErrorMsg?'用户名或密码错误':''}</div>
                <a className="login-btn" onClick={this.relogin}>
                    登 录
                </a>
            </div>
        );
    }
}
