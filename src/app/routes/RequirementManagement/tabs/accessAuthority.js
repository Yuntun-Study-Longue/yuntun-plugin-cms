import React, { Component } from 'react'
import axios from 'axios';
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'  //按钮组件
import SysTable from 'components/sysTable'
import SysModal from 'components/sysModal'
import columns from '../columns/accessAuthority'
import PermissionsAdd from '../forms/permissionsAdd'
import AclCheckGroup from 'components/AclCheckGroup' 
import Tooltip from 'sub-antd/lib/tooltip';

export default class AccessAuthority extends Component {
    constructor(props){
        super(props);
        this.state={
            srcType:this.props.srcType?this.props.srcType:0, //srcType=0 时 objectId为产品id 
            selectId:this.props.selectId, //左侧导航id
            selectRows:[], 
            roleIdParams:'',  //角色
            userIdParams:'',  //人员
            dataUrl:'',
            selectKeys:[],
            StatusChangeValue:[],
            btnDisabledFn(){} 
        }  
        this.hasAuthPubKey = document.getElementById('Auth-PubKey')
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) { 
        this.props.selectId!== nextProps.selectId
        && this.setState({
            selectId:nextProps.selectId,
            dataUrl:nextProps.selectId?`/sysware/api/member-acl/queryAll?objectId=${nextProps.selectId}&srcType=${this.state.srcType}`:''
        })
    }
    componentDidMount(){
        this.setState({
            dataUrl:this.state.selectId?`/sysware/api/member-acl/queryAll?objectId=${this.state.selectId}&srcType=${this.state.srcType}`:''
        }) 
    }
    selectChange=(selectKeys,selectRows)=>{ 
        this.setState({selectKeys,selectRows}) 
    }
    //添加
    add=(e)=>{
        const nodeType = {
            0:{name:'选择角色',type:'role'},
            1:{name:'选择用户',type:'user'}
        } 
        SysModal.add({ 
            title:nodeType[e.key].name,
            width:e.key == 0?376:736,
            style:{top:e.key == 0?250:100},
            url:`/sysware/api/member-acl/add`,
            content:<PermissionsAdd onRef={(el)=>this.$addForm=el} nodeType={nodeType[e.key].type} />,
            form:()=>this.$addForm,
            table:()=>this.$table,
            paramsBuilder:()=>({ 
                objectId:this.state.selectId,
                srcType:this.state.srcType,
            })
        })
    } 
    //删除
    delete(){
        this.$table.delete('/sysware/api/member-acl/delete')
    }
    //上下移动
    move(opea){  
        this.$table.move('/sysware/api/member-acl/move',opea)
    }
    // 更新为父代权限
    reset=()=>{ 
        let resetDataUrl=this.props.selectId?`/sysware/api/member-acl/reset?id=${this.props.selectId}&srcType=${this.state.srcType}`:''
        axios.get(resetDataUrl).then(res=>{ 
             if(res.data.code==200){
               this.setState({
                      dataUrl:this.props.selectId?`/sysware/api/member-acl/queryAll?objectId=${this.props.selectId}&srcType=${this.state.srcType}&stamp=${new Date().getTime()}`:''
               })
             }
        },rej=>{
            console.log(rej)
        }).catch(error=>{
            console.log(error);
        })      
    }

    //更改权限状态
    onStatusChange=(value)=>{ 
        // console.log((value&16) == 16);
       if(value){ 
        // this.setState({
        //     StatusChangeValue:value
        // }) 
        let StatusChangeUrl=`/sysware/api/member-acl/updateValue?id=${this.state.selectRows[0].id}&aclValue=${value}`
        axios.get(StatusChangeUrl).then(res=>{ 
            if(res.data.code==200){
                SysModal.success('授权成功！')
            }
       },rej=>{
           console.log(rej)
       }).catch(error=>{
           console.log(error);
       }) 
       }
       typeof this.props.checkedValues === 'function' && this.props.checkedValues(value)
    //    this.props.checkedValues(value)
    }
    btnDisabled=(btnDisabledFn)=>{
        this.setState({btnDisabledFn})
    }
    render() {
        const aclValue={
            // title: "权限",
            title:<div>权限&nbsp;
                <Tooltip placement='right' 
                    title={
                        // this.hasAuthPubKey?
                        this.state.srcType==1?
                        <div style={{width:'400px'}}>
                            <p>1、无：当前文档对于相关用户或角色下用户不可见（遵循拒绝优先原则，忽略相关用户或角色下用户在其它角色下具有的权限）；</p>
                            <p>2、读取：相关用户或角色下用户可以查看当前文档内容；</p>
                            <p>3、修改：相关用户或角色下用户可以编辑当前文档内容；</p>
                            <p>4、删除：相关用户或角色下用户可以删除文档，并同时具备文档的读取和修改权限；</p>
                            <p>5、管理：相关用户或角色下用户可以维护当前文档的访问权限，并同时默认具有该文档的读取、编辑、删除权限，且可以取消“删除”权限；</p>
                            <p>6、继承：相关用户或角色下用户对于当前文档的权限继承自所属需求信息架构节点；</p>
                            <p>7、未设置权限的用户无法看到当前文档；</p>
                            8、当前用户或角色下用户对所选文档具有“删除”权限，且具有目标需求信息架构节点的“修改”权限时，可将所选文档移动至目标节点下。
                        </div>
                        :<div style={{width:'400px'}}>
                            <p>1、无：当前需求信息架构节点对于相关用户或角色下用户不可见（遵循拒绝优先原则，忽略相关用户或角色下用户在其它角色下具有的权限）；</p>
                            <p>2、读取：当前需求信息架构节点对于相关用户或角色下用户可见；</p>
                            <p>3、修改：相关用户或角色下用户可以编辑当前需求信息架构节点的基本信息、新增子节点、新增需求文件；</p>
                            <p>4、删除：相关用户或角色下用户可以对当前需求信息架构节点执行删除操作，并同时具备该节点的读取和修改权限；</p>
                            <p>5、管理：相关用户或角色下用户可以维护当前需求信息架构节点的访问权限，并同时默认具备该节点的读取、修改、删除权限，且可以取消“删除”权限；</p>
                            <p>6、继承：继承父节点对应用户或角色的权限设置；</p>
                            <p>7、未设置权限的用户无法看到当前需求信息架构节点；</p>
                            8、当前用户或角色下用户对所选节点具有“删除”权限，且对目标节点具有“修改”权限时，可将所选节点移动至目标节点下。
                        </div> 
                    }
                >
                    <span><SysButton  icon="warning" /></span>
                </Tooltip>  
          </div>,

            // width: 150,
            dataIndex: "aclValue",
            key:'aclValue',
            nowrap: true,
            render: (text, record, index) => {
                return <AclCheckGroup onChange={this.onStatusChange} aclEnums={['无', '读取', '修改', '删除', '管理', '继承']} checkedValues={record.valueList} aclValues={record.valueList} showValueList={record.showValueList} canextend={record.canextend}/>
            },
        }
        return (
            <div style={{height:'100%'}}>
            <SysToolBar> 
                <SysButton.Dropdown icon="add" title="新增" onItemClick={(e)=>this.add(e)}>
                    {[
                        {title:'新增角色'},
                        {title:'新增人员'}
                    ]}
                </SysButton.Dropdown>
                <SysButton title="删除" icon="delete" 
                    onClick={()=>this.delete()}
                    disabled={this.state.btnDisabledFn('multiple')}
                />
                <SysButton title="上移" icon="moveup" 
                    onClick={()=>this.move('up')}
                    disabled={this.state.btnDisabledFn('up')}
                />
                <SysButton title="下移" icon="movedown" 
                    onClick={()=>this.move('down')}
                    disabled={this.state.btnDisabledFn('down')}
                />
                <SysButton title='更新为父代权限' icon='refresh' 
                   onClick={()=>this.reset()}
                   disabled={this.props.selectRow.parentId === "0"}
                />  
            </SysToolBar>
            <SysTable 
                ref={(el)=>this.$table=el}
                dataUrl={this.state.dataUrl}
                number minWidth={610}
                columns={[...columns,aclValue]}
                selectChange={this.selectChange}
                btnDisabled={this.btnDisabled}
                onError={this.props.onError}
            />
        </div>
           
        )
    }
}
