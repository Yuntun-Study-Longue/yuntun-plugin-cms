import React, { Component } from 'react'
import 'assets/css/base.css'
import 'assets/css/main.scss'
import './index.scss'
import 'assets/svgIcons/iconfont'
import 'assets/svgIcons/iconfontBtn'
import axios from 'axios';
import Cookies from 'js-cookie';
import Dropdown from 'sub-antd/lib/dropdown'
import Menu from 'sub-antd/lib/menu'
import SysIcon from 'components/sysIcon'
class SysHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            userName:''
        }
    }
    componentDidMount(){
        axios.get('sysware/api/user/getUserInfo')
            .then((res)=>{
                if(res.data.code === 200){
                    this.setState({userName:res.data.data.userName})
                }
            }).catch((err)=>{console.error(err)})
    }
    onItemClick=(e)=>{
        if(e.key === 'logout'){
            axios.get(`/sysware/api/user/doLogout?tokenId=${Cookies.get('access_token')}`)
            .then((res)=>{
                if(res.data.code === 200){
                    location.pathname = 'login.html'
                }
            }).catch((err)=>{console.error(err)})
        }
    }
    render() {
        const menu = (
            <Menu onClick={this.onItemClick} style={{minWidth:100}}>
                <Menu.Item key='mine'><SysIcon name="mine" style={{marginRight:5}}/>用户信息</Menu.Item>
                <Menu.Item key='logout'><SysIcon name="logout" style={{marginRight:5}}/>退出</Menu.Item>
            </Menu>
        );
        return (
            <div className='header-wrap'>
                <div className='header-left fl'>
                    <i className='header-logo fl' ></i>
                    {/* <div className='header-split fl'></div> */}
                    <span className='header-title fl'>SYSWARE · 需求管理系统</span>
                </div>
                <div className='header-user fr'>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <span style={{cursor:'pointer'}}>{this.state.userName}<SysIcon name="arrow-bottom" style={{fontSize:10}} /></span>
                    </Dropdown>
                </div>
            </div>
        )
    }
}

export default SysHeader
