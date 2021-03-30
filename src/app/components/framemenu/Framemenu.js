import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Framemenu.css';

class SubMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { menuSwitchOn: false };
    }
    render() {
        return <div>
            <dd onClick={ e => {
                e.nativeEvent.stopImmediatePropagation() // 阻止事件冒泡, 阻止div里的点击这个动作层层上传，不让这次点击被document监听到
                this.setState({ menuSwitchOn: !this.state.menuSwitchOn })
            }}><i className="fl drop-down"></i>{this.props.treeNode.name}</dd>
            <ul className="myMenu-nav-2" style={this.state.menuSwitchOn ? {display: "block"} : { display: "none"}}>
                {
                    this.props.treeNode.subMenuList? this.props.treeNode.subMenuList.map(item => {
                        return <li key={item.id}><a href={item.url}>{item.name}</a></li>
                    }) : <dd key={item.id}>
                        <i className="drop-right fl flhide"></i>
                        <a href="#">{treeNode.name}</a>
                    </dd>
                }
            </ul>
        </div>
    }
}
SubMenu.propTypes = {
    treeNode: PropTypes.object,
}

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = { menuTree: props.menuTree };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps) !== JSON.stringify(this.props)
    }
    render() {
        return <div>
            {this.props.menuTree.map(treeNode => {
                return treeNode.subMenuList ? <SubMenu key={treeNode.id} treeNode={treeNode} /> : <dd key={treeNode.id}>
                    <i className="drop-right fl flhide"></i>
                    <a href="#">{treeNode.name}</a>
                </dd>}
            )}
        </div>
    }
}
Menu.propTypes = {
    menuTree: PropTypes.array,
}

export default class Framemenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuSwitchOn: false,
            menuTree: []
        }
    }
    hideAllMenu = () => {
        this.setState({ menuSwitchOn: false })
    }
    showAllMenu = (event) => {
        this.stopPropagation(event);
        this.setState({ menuSwitchOn: !this.state.menuSwitchOn })
    }
    stopPropagation(e) {
        e.nativeEvent.stopImmediatePropagation();
    }
    componentDidMount() {
        document.addEventListener('click', this.hideAllMenu);
        // const Authorization = Cookies.get('Authorization');
        axios.get("/sysware/api/menu/queryMenu").then(res => {
            this.setState({ menuTree: res.data.data });
            // console.log(res.data.data)
        })
    }
    render() {
        return <div id="uiframe-myplace-nav" className="newFrameMenu">
            <div className="myMenu">
                <div className="myMenu-functions fl">
                    <a href="javascript:void(0)" className="myMenu-btn fl" onClick={this.showAllMenu}></a>
                    <dl className={this.state.menuSwitchOn ? "myMenu-nav-1" : "myMenu-nav-1 myMenu-nav-1-collapse" }>
                        <Menu menuTree={this.state.menuTree} />
                    </dl>
                <span id="navMenuNameOrg" className="myMenu-btn-info fl">{this.props.menuName || '仪表板'}</span>
                </div>
            </div>
        </div>
    }
}
Framemenu.propTypes = {
    menuName: PropTypes.string
}