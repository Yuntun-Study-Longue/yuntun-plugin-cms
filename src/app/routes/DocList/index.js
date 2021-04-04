import React, { Component } from 'react'
import SysLayout from 'components/sysLayout/sysLayout'
// import LRLayout from 'components/sysLayout/LRLayout'
// import SysTable from 'components/sysTable'
// import SysToolBar from 'components/sysToolBar' 
import SysButton from 'components/sysButton'
// import qs from 'querystring';
import SysTabs from 'components/sysTabs'
import message from 'sub-antd/lib/message'
const TabPane = SysTabs.TabPane
// import columns from './columns/docList' 
import GetDocListInfo from './tabs/getDocListInfo'
import './main.scss'
import axios from 'axios';

class Page extends Component {
    constructor(props){
        super(props);
        this.state={
            pageOfficeHost: '',
        } 
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
        return ( 
            <SysLayout withoutNavBar>
                <div id='breadCrumbs' className='opeation-icon'>
                    <a href='javascript:window.history.back(-1)'>
                         <SysButton title="返回" icon="return" />
                     </a>
                     <span><font style={{margin:'0 10px 0 2px',color:'#fff'}}>|</font>{window.localStorage.getItem("fileName")}</span>
                </div>
                <SysTabs style={{ height: "calc(100% - 40px)" }}>
                    <TabPane title="文档清单"     >
                        {/* <GetDocListInfo pageOfficeHost={this.state.pageOfficeHost}  /> */}
                        <p>jflasjfljalfj</p>
                    </TabPane>
                    <TabPane title="基线清单" >基线清单内容 </TabPane> 
                </SysTabs>
            {/* //     
            //         
            //     
            //     
            //         <TabPane title="文档清单"     >
            //             <GetDocListInfo pageOfficeHost={this.state.pageOfficeHost}  />
            //         </TabPane> 
            //         <TabPane title="基线清单" >基线清单内容 </TabPane> 
            //     </SysTabs>  */}
            </SysLayout>
        )
    }
}


export default Page