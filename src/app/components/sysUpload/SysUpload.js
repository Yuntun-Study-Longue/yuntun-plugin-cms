import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Upload from 'sub-antd/lib/upload'
import Button from 'sub-antd/lib/button'
import Input from 'sub-antd/lib/input'
import SysModal from 'components/sysModal'
import SysButton from 'components/sysButton'

class SysUpload extends Component {
    defaultProps = {
        onChange: () => {}
    }
    constructor(props){
        super(props);
        this.state={
            action:this.props.action?this.props.action:"/sysware/api/filesSys/uploadFile",
            data:this.props.paramsBuilder?this.props.paramsBuilder():{},
            fileId:this.props.value?this.props.value.split(','):[],
            fileName:this.props.label?this.props.label.split(','):[],
            securityLevel:this.props.hasSecurityLevel
                &&this.props.baseData.securityLevel
                ?this.props.baseData.securityLevel.split(','):[],
            securityLevelName:this.props.hasSecurityLevel
                &&this.props.baseData.securityLevelName
                ?this.props.baseData.securityLevelName.split(','):[],
            enable:this.props.hasSecurityLevel
                &&this.props.baseData.enable
                ?this.props.baseData.enable.split(','):[],
            securityLevelList:[]
        }
    }
    componentDidMount(){
        if(this.hasSecurityLevel){
            axios.get('/sysware/api/docFile/securityTypeList').then(res=>{
                if(res.data.code = 200){
                    this.setState({
                        securityLevelList:res.data.data
                    })
                }
            }).catch(err=>console.error(err))
        }
    }
    get hasSecurityLevel(){
        return this.props.hasSecurityLevel
    }
    getFileIndex(file){
        return file.index?file.index:this.state.fileId.indexOf(file.response.data[0].id)
    }
    getSecurityLevelNameById(id){
        const security = this.state.securityLevelList.filter(item=>item.securityId === id)
        return security[0].securityName;
    }
    render() {
        const upLoadProps = {
            name: "file",
            action: this.state.action,
            data:this.state.data,
            headers: {
                authorization: Cookies.get("Authorization"),
            },
            onChange: (info) => {
                if (info.file.status === "done") {
                    const fileRes = info.file.response;
                    if (fileRes.code === 200) {
                        this.setState(
                            {
                                fileId: [
                                    ...this.state.fileId,
                                    fileRes.data[0].id,
                                ],
                                fileName: [
                                    ...this.state.fileName,
                                    fileRes.data[0].filename,
                                ],
                                securityLevel:this.hasSecurityLevel
                                ?[...this.state.securityLevel,this.state.securityLevelList[0].securityId]:null,
                                securityLevelName:this.hasSecurityLevel
                                ?[...this.state.securityLevelName,this.state.securityLevelList[0].securityName]:null,
                                enable:this.hasSecurityLevel
                                ?[...this.state.enable,1]:null
                            },
                            this.props.onChange
                        );
                    }
                } else if (info.file.status === "error") {
                    console.log(`${info.file.name} 上传失败。`);
                }
            },
            onRemove: (file) => {
                SysModal.confirm("确定删除文件嘛？",()=>{
                    axios.get(`sysware/api/filesSys/deleteFile?file_id=${file.uid?file.uid:file.response.data[0].id}`)
                        .then((res) => {
                            if (res.data.code === 200) {
                                SysModal.success("删除成功");
                                this.upload.handleRemove(file);
                                const vIndex = this.getFileIndex(file);
                                this.state.fileId.splice(vIndex, 1);
                                this.state.fileName.splice(vIndex, 1);
                                if(this.hasSecurityLevel){
                                    this.state.securityLevel.splice(vIndex, 1);
                                    this.state.securityLevelName.splice(vIndex, 1);
                                    this.state.enable.splice(vIndex, 1);
                                }
                                this.setState(
                                    {
                                        fileId: [...this.state.fileId],
                                        fileName: [...this.state.fileName],
                                        securityLevel:this.hasSecurityLevel
                                        ?[...this.state.securityLevel]:null,
                                        securityLevelName:this.hasSecurityLevel
                                        ?[...this.state.securityLevelName]:null,
                                        enable:this.hasSecurityLevel
                                        ?[...this.state.enable]:null,
                                    },
                                    this.props.onChange
                                );
                            } else {
                                SysModal.error(res.data.message);
                            }
                        });
                })
            },
            defaultFileList:this.state.fileId.map((item,index)=>{
                return {
                    uid:item,
                    name:this.hasSecurityLevel&&this.state.enable[index] === '1'
                    ?this.state.fileName[index]
                    : Array.isArray(this.state.securityLevelName) ?
                        `【${this.state.securityLevelName[index]}】${this.state.fileName[index]}` : this.state.fileName[index],
                    status: "done",
                    enable:this.hasSecurityLevel&&this.state.enable[index] === '1',
                    index:''+index
                }
            }),
            listType: this.hasSecurityLevel&&'select',
            showIcon:false,
            selectList: this.hasSecurityLevel&&
                this.state.securityLevelList.map((item)=>{
                    return {
                        name: item.securityName,
                        value: item.securityId,
                    }
                })
            ,
            selectChange:(file, value)=>{
                const vIndex = this.getFileIndex(file);
                this.state.securityLevel.splice(vIndex, 1,value);
                this.state.securityLevelName.splice(vIndex, 1,this.getSecurityLevelNameById(value));
                this.setState(
                    {
                        securityLevel:[...this.state.securityLevel],
                        securityLevelName:[...this.state.securityLevelName],
                    },
                    this.props.onChange
                );
            },
            selectValues:this.hasSecurityLevel&&
                this.state.securityLevel.map((item,index)=>{
                    return {
                        value:item,
                        selectId:this.state.fileId[index]
                    }
                })
            ,
            selectWidth: 100
        };
        return (
            <div>
                <Upload key="upload" disabled={this.state.fileId.length >=5} {...upLoadProps} ref={(el)=>this.upload=el}> 
                    <SysButton title="上传" icon="upload" disabled={this.state.fileId.length >=5}/>
                </Upload>
                <Input key="fileId" type="hidden" {...this.props.getFieldProps(`${this.props.field}.key`,{
                    initialValue:this.state.fileId.join(',')
                })}/>
                <Input key="fileName" type="hidden" {...this.props.getFieldProps(`${this.props.field}.label`,{
                    initialValue:this.state.fileName.join(',')
                })}/>
                { this.props.hasSecurityLevel &&
                    [
                        <Input key="securityLevel" type="hidden" {...this.props.getFieldProps(`${this.props.field}.securityLevel`,{
                            initialValue:this.state.securityLevel.join(',')
                        })}/>,
                        <Input key="securityLevelName" type="hidden" {...this.props.getFieldProps(`${this.props.field}.securityLevelName`,{
                            initialValue:this.state.securityLevelName.join(',')
                        })}/>,
                        <Input key="enable" type="hidden" {...this.props.getFieldProps(`${this.props.field}.enable`,{
                            initialValue:this.state.enable.join(',')
                        })}/>
                    ]
                }
            </div>  
        )
    }
}
export default SysUpload;