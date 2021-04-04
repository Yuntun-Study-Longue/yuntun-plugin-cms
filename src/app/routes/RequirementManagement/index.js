import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import SysLayout from 'components/sysLayout/sysLayout'
import LRLayout from 'components/sysLayout/LRLayout'
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import SysModal from 'components/sysModal'
import SysTree from 'components/SysTree'
import SysTabs from 'components/sysTabs'
import axios from 'axios';
import message from 'sub-antd/lib/message';
import SysDetailPanel from 'components/sysDetailPanel'
import ProductAdd from './forms/productAdd'
import ProductMove from './forms/productMove'
import ReqDoc from './tabs/reqDoc'
import AccessAuthority from './tabs/accessAuthority'
import qs from 'querystring';
const TabPane = SysTabs.TabPane

class Page extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectRows:[],
            currentUser: {},
            btnDisabledFn(){},
        }
    }
    createAuthEle({ id, value }) {
        const AuthEle = document.createElement('input');
        AuthEle.id = id;
        AuthEle.setAttribute("value", value)
        AuthEle.hidden = true
        if (!document.getElementById(id)) {
            document.getElementById("extension-node").appendChild(AuthEle);
        }
    }
    destoryAuthEle() {
        document.getElementById("extension-node").removeChild(document.getElementById("Auth-PubKey"));
        document.getElementById("extension-node").removeChild(document.getElementById("Auth-Params"));
    }
    componentDidMount() {
        this.getUserInfo();
        if (this.props.needAuth) {
            this.createAuthEle({ id: 'Auth-PubKey', value: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHEg+yeHXNR+DE/AtcxLfQYa/VWMZybfKCERjtIvY4w6jNdzO7DZymcXXSK8k5EXs3jNckmaUPocGtplUWS+b/ZfZLFNrgEQHRIbT/OT7fj6swiSGLBkrdE8UoXP9eRwS9WTqA0aVimtQOAYwl5hRkCdow5vIUdmKOmXXVBC9czwIDAQAB' })
            this.createAuthEle({ id: 'Auth-Params', value: '123' })
            console.log(document.getElementById("extension-node"))
        }
    }
    componentWillUnmount() {
        if (this.props.needAuth) {
            this.destoryAuthEle()
        }
    }
    add(e){
        const nodeType = {
            0:{name:'新增项目',type:'PROJECT'},
            1:{name:'新增文件夹',type:'FOLDER'}
        }
        SysModal.addAndNext({
            title:nodeType[e.key].name,
            width:460,
            url:`/sysware/api/project/save`,
            content:<ProductAdd onRef={(el)=>this.$addForm=el}/>,
            form:()=>this.$addForm,
            table:()=>this.$tree,
            paramsBuilder:()=>({
                nodeType:nodeType[e.key].type,
                parentId:this.state.selectRows[0]?this.state.selectRows[0].id:0
            })
        })
    }
    delete(){
        this.$tree.delete('/sysware/api/project/delete')
    }
    moveTo(){
        SysModal.add({
            title:'选择移动位置',
            url:'/sysware/api/project/moveTo',
            width:460,
            content:<ProductMove onRef={(el)=>this.$moveForm=el} currentIds={this.state.selectRows.map(item=>item.id)}/>,
            form:()=>this.$moveForm,
            paramsBuilder:()=>{
                return {moveType:0}
            },
            onOk:()=>{
                this.onSave();
            }
        })
    }
    move(opea){
        this.$tree.move('/sysware/api/project/updateSort',opea)
    }
    onSelect=(selectRows)=>{
        this.setState({selectRows})
    } 
    getCheckedValues=(res)=>{
		alert(res)
		this.setState({
            checkedValues:res
        },()=>{
            console.log('object11111')
        }) 
	}
    treeLoad=(selectIds)=>{
        this.$tree.load(selectIds)
    }
    onSave=()=>{ 
        this.$tree.load([this.state.selectRows[0].id])
    }
    getUserInfo() {
        this.submitRequest('/sysware/api/user/getUserInfo', null, (currentUser) => {
            // console.log(currentUser, '=== currentUser')
            this.setState({ currentUser })
        }, 'GET');
    }
    submitRequest(url, data, callbackFn, method = 'post') { 
        axios({ method, url, data }).then(res => {
            if (res.data.code === 200) {
                // message.success('保存成功');
                callbackFn && callbackFn(res.data.data)
              }
              else {
                message.error(res.data.message);
            }
        })
        return 
    }
    btnDisabled = (btnDisabledFn) => {
        this.setState({ btnDisabledFn })
    }
    render(){
        return (
            <SysLayout>
                <LRLayout id="requirementManagement" draggable closable>
                    {{
                        left:(
                            <LRLayout.LeftPanel>
                                <SysToolBar>
                                    <SysButton.Dropdown icon="add" title='新增' 
                                        onItemClick={(e)=>this.add(e)} 
                                        aclValues={this.state.selectRows[0]?this.state.selectRows[0].valueList:[]}
                                        disabled={this.state.selectRows.length !== 1 && document.getElementById('Auth-PubKey')}
                                    >
                                        {[
                                            {title:'新增项目'},
                                            {title:'新增文件夹'}
                                        ]}
                                    </SysButton.Dropdown>
                                    <SysButton title="删除" icon="delete" 
                                        onClick={()=>this.delete()}
                                        aclValues={this.state.selectRows[0]?this.state.selectRows[0].valueList:[]}
                                        disabled={this.state.btnDisabledFn('multiple')}
                                    />
                                    <SysButton title="移动至" icon="adjust-category" 
                                        //aclValues={this.state.selectRows[0]?this.state.selectRows[0].valueList:[]}
                                        onClick={() => this.moveTo()}
                                        disabled={this.state.btnDisabledFn('multiple')||(this.state.selectRows[0]?!(this.state.selectRows[0].valueList.includes(8)):true)}
                                    />
                                    <SysButton title="上移" icon="moveup" 
                                        onClick={()=>this.move('up')}
                                        aclValues={this.state.selectRows[0]?this.state.selectRows[0].valueList:[]}
                                        disabled={this.state.btnDisabledFn('up')}
                                    />
                                    <SysButton title="下移" icon="movedown" 
                                        onClick={()=>this.move('down')}
                                        aclValues={this.state.selectRows[0]?this.state.selectRows[0].valueList:[]}
                                        disabled={this.state.btnDisabledFn('down')}
                                    />
                                </SysToolBar>
                                <SysTree 
                                    expandedLevel={3}
                                    ref={(el)=>this.$tree=el}
                                    dataUrl="/sysware/api/project/list"
                                    onSelect={this.onSelect}
                                    style={{height:'calc(100% - 40px)'}}
                                    btnDisabled={this.btnDisabled} 
                                    // selectedKeys={['3e12d3a5722d47488ff363f4cfc820c4']}
                                    selectedKeys={[qs.parse(location.search.replace('?', '')).id ?qs.parse(location.search.replace('?', '')).id:'']}
                                />
                            </LRLayout.LeftPanel>
                        ),
                        right:(  
                            this.state.selectRows.length === 1 ?
                                (this.state.selectRows[0].aclValue !== 1 ?
                                    <SysTabs onRef={ ref => this.$tab = ref }>
                                        <TabPane title="需求文档">
                                            <ReqDoc 
                                                selectId={this.state.selectRows[0] ? this.state.selectRows[0].id : ''} 
                                                currentUser={this.state.currentUser} 
                                                treeLoad={this.treeLoad}
                                                pageTypes={document.getElementById('Auth-PubKey')}
                                            />
                                        </TabPane>
                                        <TabPane title="基本信息">
                                            <SysDetailPanel
                                                detailUrl={`/sysware/api/project/queryDetail?id=${this.state.selectRows[0].id}`}
                                                plain="requirementManagement/forms/selectTreeInfo"
                                                modify="requirementManagement/forms/selectTreeInfoEdit"
                                                editBtnDisabled={!(this.state.selectRows[0].aclValue & 4)}
                                                onSave={this.onSave}
                                            />
                                        </TabPane>
                                        {
                                            <TabPane title="访问权限" disabled={this.state.selectRows[0] ? this.state.selectRows[0].showMemberAcl === 0:false}>
                                                <AccessAuthority onError={() => this.$tab.onChange('0')} selectId={this.state.selectRows[0]?this.state.selectRows[0].id:''} selectRow={this.state.selectRows[0]?this.state.selectRows[0]:{}} />
                                            </TabPane>
                                        }
                                    </SysTabs> : ''
                                ) : '' 
                        )
                    }}
                </LRLayout>
            </SysLayout>
        )
    }
}

export default Page