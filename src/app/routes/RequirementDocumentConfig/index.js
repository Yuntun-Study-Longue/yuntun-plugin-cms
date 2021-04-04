import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";
import qs from "querystring";
import "./main.scss";
import SysBreadCrumbsNav from "../../../components/sysBreadCrumbsNav";
import axios from 'axios';

//GAIBAN
import SysLayout from "components/sysLayout/sysLayout"
import SysButton from 'components/sysButton'
import SysTabs from 'components/sysTabs'
const TabPane = SysTabs.TabPane;
import TabPaneData from "./tabs/tabPaneData";
import DocumentTemplate from './tabs/documentTemplate'
import TabPaneTransfer from './tabs/tabPaneTransfer'
import message from 'sub-antd/lib/message'

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectTreeId: 1,
            restoredId: null,
            baseData: {}, 
            pageOfficeHost: '',
        };
    }

    componentDidMount() {
        this.getPageOfficeHost(); 
    }

    getPageOfficeHost() {
        this.submitRequest('/sysware/pageoffice/pageofficeUrl', null, (pageOfficeHost) => {
            this.setState({ pageOfficeHost })
        }, 'GET');
    }
    submitRequest(url, data, callbackFn, method = 'post') {
        axios({ method, url, data }).then(res => {
            if (res.data.code === 200) {
            callbackFn && callbackFn(res.data.data)
            }
            else{
            message.error(res.data.message);
            }
        })
    }
    render() {
        let queryMatch = qs.parse(location.search);
        return (
            <SysLayout withoutNavBar>
                <div id="breadCrumbs" className="opeation-icon"> 
                    <a href='javascript:window.history.back(-1)'>
                        <SysButton title="返回" icon="return" />
                    </a>
                    <span><font style={{margin:'0 10px 0 2px',color:'#fff'}}>|</font>{window.localStorage.getItem("fileName")}</span>
                    {/* <SysBreadCrumbsNav paths={this.state.paths} /> */}
                </div>
                <SysTabs style={{ height: "calc(100% - 40px)" }}>
                    <TabPane title="属性">
                        <TabPaneData />
                    </TabPane>
                    <TabPane title="文档模板">
                      < DocumentTemplate pageOfficeHost={this.state.pageOfficeHost}/>
                    </TabPane>
                    <TabPane title="导出属性">
                        <TabPaneTransfer />
                    </TabPane>
                </SysTabs>
            </SysLayout>
        );
    }
}

export default Page
