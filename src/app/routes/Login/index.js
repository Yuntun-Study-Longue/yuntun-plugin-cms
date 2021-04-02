import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
import LogoLayout from 'components/sysLayout/logoLayout';

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            passwd: '',
            needremember: false,
            showErrorMsg:false
        }
    }
    componentDidMount() {
        //当cookie 中保存了用户名说明是记住用户名的
        const userName=Cookies.get('userName');
        if(userName){
            //对于记住用户名的处理
            this.setState({
                username:userName,
                needremember:true
            });
        }
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
    loginSuccess() {
        this.props.history.push('/requirement_management.html')
        // if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {  
        //     window.location.href="requirement_management.html";  
        // } else {
        //     window.opener = null;  
        //     window.open("requirement_management.html", "_self");  
        // }
    }

    render(){
        return (
            <LogoLayout className='main-body'>
                <div className="login6-bg-right">
                    <div className="llogin6-ogin-input login6-up">
                        <input
                            type="text"
                            autoComplete="off"
                            className="login6-user"
                            name="loginName"
                            id="login_name"
                            maxLength="16"
                            value={this.state.username}
                            onChange={(e) => {
                                this.setState({ username: e.target.value });
                            }}
                        />
                    </div>
                    <div className="login6-login-input login6-down">
                        <input
                            type="text"
                            className="login6-pass"
                            id="passWord"
                            maxLength="20"
                            name="loginPassword"
                            onFocus={(e) => (e.target.type = "password")}
                            value={this.state.passwd}
                            onChange={(e) => {
                                this.setState({ passwd: e.target.value });
                            }}
                        />
                    </div>
                    <div className="login6-login-point">{this.state.showErrorMsg?'用户名或密码错误':''}</div>
                    <div
                        className="login6-login-btn"
                        onClick={(e) => {
                            const {
                                username,
                                passwd,
                                needremember,
                            } = this.state;
                            if (username && passwd) {
                                this.setState({showErrorMsg:false})
                            }else{
                                this.setState({showErrorMsg:true})
                                return 
                            }

                            const form = new FormData();
                            form.append("grant_type", "password");
                            form.append("username", username);
                            form.append("password", passwd);
                            form.append("client_id", "client_1");
                            form.append("client_secret", "123456");

                            axios
                                .post("/sysware/oauth/token", form)
                                .then((res) => {
                                    Cookies.set(
                                        "Authorization",
                                        res.data.token_type +
                                            " " +
                                            res.data.access_token
                                    );
                                    Cookies.set(
                                        "access_token",
                                        res.data.access_token
                                    );
                                    if (needremember) {
                                        Cookies.set("userName", username);
                                    } else {
                                        Cookies.remove("userName");
                                    }
                                    this.loginSuccess();
                                }).catch((err)=>{
                                    if(err)this.setState({showErrorMsg:true})
                                });
                        }}
                    >
                        <button
                            style={{ border: "none" }}
                            className="not-ie-submit"
                        ></button>
                    </div>
                    <div className="login6-remember-user">
                        <input
                            type="checkbox"
                            className="fl"
                            checked={this.state.needremember}
                            onChange={(e) =>
                                this.setState({
                                    needremember: e.target.checked,
                                })
                            }
                        />
                        <span className="fl">记住我的用户名</span>
                    </div>
                </div>
                <div className="login6-bg-bottom">
                    <label>SYSWARE Co.,LTD.版本</label>
                    <a
                        style={{ color: "white" }}
                        href="http://192.168.5.202:8182/sysware/about/gotoAboutList.action"
                        target="_blank"
                    />
                </div>
            </LogoLayout>
        );
    }
}

export default Page