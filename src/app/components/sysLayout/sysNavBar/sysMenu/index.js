import React, { Component } from "react";
import axios from 'axios';
import Menu from 'sub-antd/lib/menu';
const SubMenu = Menu.SubMenu;
class SysMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            menuTree:[]
        }
    }
    handleClick = (e)=>{
        if(typeof (this.props.gotoNewPage) === 'function'){
            this.props.gotoNewPage(e)
        }
    }
    componentDidMount(){
        axios.get("/sysware/api/menu/queryMenu").then(res => {
            this.setState({ menuTree: res.data.data });
        })
    }
    render() {
        return (
            <Menu
                onClick={this.handleClick}
                style={{ width: 200 }}
                mode="inline"
            >
                {this.state.menuTree.map((fmenu,findex)=>{
                    if(fmenu.leaf){
                        return <Menu.Item key={fmenu.url?fmenu.url:fmenu.name}>{fmenu.name}</Menu.Item>;
                    }else{
                        return <SubMenu key={fmenu.url?fmenu.url:fmenu.name} title={fmenu.name}>
                            {fmenu.subMenuList&&fmenu.subMenuList.map((smenu,sindex)=>{
                                return <Menu.Item key={smenu.url?smenu.url:smenu.name}><a href={smenu.url}>{smenu.name}</a></Menu.Item>;
                            })}
                        </SubMenu>
                    }
                })}
            </Menu>
        );
    }
}
export default SysMenu;
