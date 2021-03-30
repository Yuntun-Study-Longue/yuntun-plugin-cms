import React, { Component } from 'react';
import axios from 'axios'
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import SysModal from 'components/sysModal'
import Loadable from 'react-loadable';
function Loading(){
    return (
        <div>Loading</div>
    )
}
class SysDetailPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'plain',
            baseData:{}
        }
    }
    componentDidMount() {
        this.fetchDetail(this.props.detailUrl);
    }
    componentWillReceiveProps(nextProp, nextState) {
        this.props.detailUrl !== nextProp.detailUrl
        && this.fetchDetail(nextProp.detailUrl)
    }
    fetchDetail(url) {
        axios.get(url).then(res => {
            this.setState({
                mode: 'plain',
                baseData:res.data.data
            });
        })
    }
    edit=()=>{
        this.setState({
            mode:'modify'
        })
    }
    save=()=>{
        this.$modify.save((data)=>{
            SysModal.success('保存成功！')
            this.props.onSave && this.props.onSave(data)
            if(this.props.remoteUpdate){
                this.fetchDetail(this.props.detailUrl);
            }else{
                this.setState({
                    mode:'plain',
                    baseData:data
                })
            }
        })
    }
    importComp(path){
        return Loadable({
            loader: () => import(`pages/system/${path}`),// eslint-disable-line
            loading:Loading
        });
    }
    render() {
        const PlainComp = this.importComp(this.props.plain);
        const ModifyComp = this.props.modify&&this.importComp(this.props.modify);
        return (
            <div style={{height:'100%'}} className="sys-detail-panel">
                {
                    this.props.modify && 
                    <SysToolBar>
                        {/* <SysButton title="编辑" icon="edit" onClick={this.edit} className={`${this.state.mode === 'modify'&& 'hidediv'}`} aclValues={this.state.baseData?this.state.baseData.valueList:[]}>
                        </SysButton> */}
                        <SysButton title="编辑" icon="edit" onClick={this.edit} className={`${this.state.mode === 'modify'&& 'hidediv'}`} disabled={this.props.editBtnDisabled}>
                        </SysButton>
                        <SysButton title="保存" icon="save" onClick={this.save} className={`${this.state.mode === 'plain'&& 'hidediv'}`}>
                        </SysButton>
                    </SysToolBar>
                }
                <div style={{height:`${this.props.modify?'calc(100% - 40px)':'100%'}`,overflow:'auto'}}>
                    {   
                        this.props.modify?
                            this.state.mode === 'plain'
                            ?<PlainComp baseData={this.state.baseData}/>
                            :<ModifyComp onRef={el=>this.$modify=el} baseData={this.state.baseData}/>
                        :<PlainComp baseData={this.state.baseData}/>
                    }
                </div>
            </div>
        )
    }
}

export default SysDetailPanel