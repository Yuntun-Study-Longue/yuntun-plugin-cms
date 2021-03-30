import React, {Component} from 'react'
import './index.scss'
import Tabs from 'sub-antd/lib/tabs'
const TabPane = Tabs.TabPane
function SysTabTitle(props){
    return (
        <div 
            style={{width:120}} 
            className="text-ellipsis" 
            title={props.title}
        >
            {props.title}
        </div>
    )
}
function SysTabPane(props){
    return (
        <div>
            {props.children}
        </div>
    )
}
class SysTabs extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeKey:'0',
            isShow:true
        }
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this)
    }
    onChange=(key)=>{
        this.setState({activeKey:key})
    }
    onTabClick=()=>{
        this.setState({isShow:false},()=>{
            this.setState({isShow:true})
        })
    }
    render(){
        const children = this.props.children.length?this.props.children:[this.props.children];
        return (
            <Tabs 
                {...this.props}
                type="card" 
                activeKey={this.state.activeKey} 
                onChange={this.onChange} 
                onTabClick={this.onTabClick}
            >
                {children.map((item,index)=>{
                    return (
                        <TabPane tab={<SysTabTitle title={item.props.title}/>} key={index} disabled={item.props.disabled}>
                            { 
                                this.state.isShow && this.state.activeKey === index.toString() 
                                && item.props.children
                            }
                        </TabPane>
                    )
                })}
            </Tabs>
        )
    }
}
SysTabs.TabPane = SysTabPane;
export default SysTabs