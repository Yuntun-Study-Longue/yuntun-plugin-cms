import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import qs from 'querystring';
import axios from 'axios';
import Cookies from 'js-cookie';
import Layout from 'components/layout/layout';
// import LRLayout from 'components/layout/LRLayout';
import Table from 'sub-antd/lib/table';

import SysLayout from 'components/sysLayout/sysLayout'
import LRLayout from 'components/sysLayout/LRLayout'
import SysTable from 'components/sysTable'
import columns from '../columns/historyRecord' 
import SysBreadCrumbsNav from '../../../../components/sysBreadCrumbsNav'
// import HistoryRecordInfo from 'components/baseInfo/infoType/HistoryRecordInfo';
import SysButton from 'components/sysButton'
import HistoryRecordInfo from '../forms/historyRecordInfo'
import './main.scss';
class App extends Component {
    constructor(props) {
        super(props); 
        this.state={  
            selectedRowKeys:[], //行 id
            selectedRows:[],  //行数据
            type:1, 
        }
    }
   
    selectChange=(selectedRowKeys,selectedRows)=>{ 
        this.setState({selectedRowKeys,selectedRows})
    }
    render(){ 
       
        return (
               <SysLayout withoutNavBar>
                 <div id='breadCrumbs' className='opeation-icon'>
                 <a href='javascript:window.history.back(-1)'>
                    <SysButton title="返回" icon="return" />
                </a>
                  <span><font style={{margin:'0 10px 0 2px',color:'#fff'}}>|</font>{window.localStorage.getItem("fileName")} </span>
                  {/* <label>当前文档：xxxxxxxxxxxxxxxxxxxxxx系统需求规格说明书</label>  */}
                </div>
                <LRLayout draggable style={{height:'calc(100% - 40px)'}}>
                    {{
                        left:(
                            <LRLayout.LeftPanel>
                                <SysTable 
                                    style={{height:'100%'}}
                                    dataUrl={`/sysware/api/his/list?type=1&documentId=${window.localStorage.getItem("itemDocumentId")}&itemId=${qs.parse(location.search.replace('?', '')).docId}`}
                                    number pagination minWidth={470}
                                    columns={columns}
                                    selectChange={this.selectChange}
                                />
                            </LRLayout.LeftPanel>
                        ),
                        right:(  
                            this.state.selectedRowKeys.length === 1 && 
                            // <HistoryRecordInfo/> 
                                <HistoryRecordInfo 
                                    baseId={this.state.selectedRowKeys}
                                    baseData={this.state.selectedRows[0]}
                                    typeNum={this.state.type}
                                /> 
                        )
                    }}
                </LRLayout>
            </SysLayout> 
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);