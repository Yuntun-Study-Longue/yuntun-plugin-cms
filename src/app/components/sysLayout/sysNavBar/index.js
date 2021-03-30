import React, { Component } from 'react'
import './index.scss'
import Popover from 'sub-antd/lib/popover';
import SysMenu from 'components/sysLayout/sysNavBar/sysMenu'
import SysIcon from 'components/sysIcon'
class SysNavBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible:false,
        }
    }
    gotoNewPage=(e)=>{
        this.setState({
            visible:false,
        })
        localStorage.setItem(e.keyPath[0],e.item.props.children.props.children);
    }
    handleVisibleChange=(visible)=>{
        this.setState({ visible });
    }
    render() {
        const pathname = location.pathname.slice(1);
        return (
            <div className="navBar-wrap">
                <Popover
                    overlayClassName="sys-popover"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                    placement="bottomLeft"
                    trigger="click"
                    arrowPointAtCenter={true}
                    content={<SysMenu gotoNewPage={this.gotoNewPage} />}
                >
                    <i className="navBar-menu fl"><SysIcon name="menu"/></i>
                </Popover>
                <span className="navBar-main-menu fl">{localStorage.getItem(pathname)?localStorage.getItem(pathname):'需求管理'}</span>
            </div>
        );
    }
}

export default SysNavBar
