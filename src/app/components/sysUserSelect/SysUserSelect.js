import React, { Component } from 'react';
import Input from 'sub-antd/lib/input';
import Button from 'sub-antd/lib/button';
import Modal from 'sub-antd/lib/modal';
import UserSelect from './UserSelect/UserSelect'
import SysMemberSelect from 'components/sysMemberSelect'
class SysUserSelect extends Component {
    defaultProps = {
        onOk: () => {}
    }
    constructor(props){
        super(props);
        this.state={
            showModal:false,
            userIds:this.props.value?this.props.value.split(','):[],
            userNames:this.props.label?this.props.label.split(','):[]
        }
    }
    popModal=()=>{
        this.setState({
            showModal:true
        })
    }
    handleOk=()=>{
        const userIds = [];
        const userNames = [];
        this.userSelect.$shuttle.state.rightDataSource.forEach((item)=>{
            userIds.push(item.userId);
            userNames.push(item.userName);
        })
        this.setState({
            userIds:[...userIds],
            userNames:[...userNames],
            showModal:false
        }, this.props.onOk)
    }
    render() {
        return (
            <div>
                <Input 
                    type="text" 
                    readOnly 
                    value={this.state.userNames.join(',')}
                    addonAfter={<span style={{cursor:"pointer"}} onClick={this.popModal}>选择</span>} 
                    {...this.props.getFieldProps(`${this.props.field}.label`,{
                        initialValue:this.state.userNames.join(',')
                    })}
                />
                <Input type="hidden" {...this.props.getFieldProps(`${this.props.field}.key`,{
                    initialValue:this.state.userIds.join(',')
                })}/>
                {
                    this.state.showModal
                    &&
                    <Modal  
                        key={this.props.field}
                        title='选择用户' 
                        visible={true}
                        width={736}
                        onOk={this.handleOk}
                        onCancel={()=>this.setState({showModal:false})}
                    >
                        <SysMemberSelect ref={(el)=>this.userSelect=el}/>
                    </Modal>
                }
            </div>
        );
    }
}
export default SysUserSelect;
