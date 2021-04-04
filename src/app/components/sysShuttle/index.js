import React, { Component } from "react";
import "./index.scss";
import Button from "sub-antd/lib/button";
import SysTable from "components/sysTable";
import SysIcon from "components/sysIcon";
class SysShuttle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightDataSource: this.props.rightDataSource ? this.props.rightDataSource: [],
            leftKeys: [],
            leftRows: [],
            rightKeys: [],
            rightRows: [],
        };
        this.rowKey = this.props.rowKey||'id'
    }
    selectChangeLeft = (leftKeys, leftRows) => {
        this.setState({leftKeys, leftRows})
    };
    selectChangeRight = (rightKeys, rightRows) => {
        this.setState({rightKeys, rightRows});
    };
    moveToRightAll = () =>{
        this.setState({rightDataSource:this.$tableLeft.state.dataSource})
    }
    moveToRight = () =>{
        if(this.state.rightDataSource.length === 0){
            this.setState({
                rightDataSource:this.state.leftRows
            })
            return
        }
        const rightDataIds = this.state.rightDataSource.map(item=>item[this.rowKey])
        const newDataSource = this.state.leftRows.filter((item)=>{
            return !rightDataIds.includes(item[this.rowKey])
        })
        console.log(rightDataIds)
        console.log(newDataSource)
        this.setState({
            rightDataSource:[...this.state.rightDataSource,...newDataSource]
        })
    }
    removeAll = () => {
        this.setState({rightDataSource:[]})
    }
    remove = () => {
        const newDataSource = this.state.rightDataSource.filter(item=>!this.state.rightKeys.includes(item[this.rowKey]))
        this.setState({rightDataSource:newDataSource})
    }
    render() {
        return (
            <div className="sys-shuttle" style={{ ...this.props.style }}>
                <div className="sys-shuttle-left fl">
                    <div className="tool-bar">待选用户</div>
                    <SysTable
                        ref={(el) => (this.$tableLeft = el)}
                        rowKey={this.rowKey}
                        dataUrl={this.props.dataUrl}
                        columns={this.props.leftColumns}
                        selectChange={this.selectChangeLeft}
                        btnDisabled={this.btnDisabledLeft}
                    />
                </div>
                <div className="sys-shuttle-center fl">
                    <div className="sys-shuttle-operation">
                        <Button
                            type="ghost"
                            size="small"
                            onClick={this.moveToRightAll}
                        ><SysIcon name="double-right"/></Button>
                        <Button
                            type="ghost"
                            size="small"
                            onClick={this.moveToRight}
                        ><SysIcon name="right"/></Button>
                        <Button 
                            type="ghost" 
                            size="small" 
                            onClick={this.remove}
                        ><SysIcon name="left"/></Button>
                        <Button
                            type="ghost"
                            size="small"
                            onClick={this.removeAll}
                        ><SysIcon name="double-left"/></Button>
                    </div>
                </div>
                <div className="sys-shuttle-right fl">
                    <div className="tool-bar">已选用户</div>
                    <SysTable
                        rowKey={this.rowKey}
                        dataSource={this.state.rightDataSource}
                        columns={this.props.rightColumns}
                        selectChange={this.selectChangeRight}
                    />
                </div>
            </div>
        );
    }
}
export default SysShuttle;
