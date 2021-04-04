import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import './main.scss';
import axios from 'axios';
import Cookies from 'js-cookie';
// import EnumSelect from './EnumSelect/EnumSelect';
import SysTransfer from './sysTransfer/Transfer';
import { FilterSetting, ColumnSetting } from 'components/toolbar/toolInfo';
import ViewerTree from './ViewerTree/ViewerTree';
import AclCheckGroup from './AclCheckGroup'
import qs from 'querystring'

class Storybook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewAttrRela: [],
            conditionGroup: [],
        }
    }
    onColumnSettingChange(viewAttrRela) {
        this.setState({ viewAttrRela });
    }
    onFilterSettingChange(conditionGroup) {
        this.setState({ conditionGroup });
    }
    redirectPageOfficeLink(
        uri = '/sysware/pageoffice/docCreateWord',
        params = { documentId:10, itemId:10 },
        option = { width: 1200, height: 800 }
    ) {
        this.submitRequest('/sysware/pageoffice/pageofficeUrl', null, (pageOfficeHost) => {
            // console.log(`${pageOfficeHost}${uri}${params? '?' + qs.stringify(params) : ''}`, '====')
            location.href = `javascript:POBrowser.openWindowModeless('http://${pageOfficeHost}${uri}${params? '?' + qs.stringify(params) : ''}', "${option? 'width=' + option.width + 'px;' + 'height=' + option.height + 'px;' :'width=1200px;height=800px;'}");`
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
        return <div>
            <button onClick={() => {
                this.redirectPageOfficeLink(
                    `/sysware/pageoffice/openpdf`,
                    { fileId: 'a02a0e8a5201475496ce600ca4f20b66_11252', access_token: Cookies.get('access_token') }
                );
            }}>pd预览</button>
            <div style={{ width: '100%', float: 'left' }}>
                <SysTransfer />
            </div>
            {/* <div style={{ width: '50%', float: 'left' }}>
                <ColumnSetting onChange={this.onColumnSettingChange.bind(this)}/>
            </div>
            <div style={{ width: '50%', float: 'left' }}>
                <FilterSetting viewAttrRela={this.state.viewAttrRela} onChange={this.onFilterSettingChange.bind(this)}/>
            </div> */}
            {/* <div style={{ width: '100%', float: 'left'}}>
                <ViewerTree />
            </div> */}
             {/* <div style={{ width: '100%', float: 'left'}}>
                <AclCheckGroup aclEnums={['无', '读取', '修改', '删除', '管理', '继承']} aclValues={[1<<1, 1<<2, 1<<3, 1<<4]} showValueList={[1<<1, 1<<2, 1<<3, 1<<4]}/>
             </div> */}
        </div>
    }
}

ReactDOM.render(
    <Storybook />,
    document.getElementById('app')
);