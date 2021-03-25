import React, { Component } from 'react'
import { Prompt } from 'react-router-dom';

class Page extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    componentDidMount() {
    
    }
    render() {
        return <div>
            <p>需求文档条目列表</p>
            <Prompt
                when={true}
                message={location =>
                `该页面状态未保存，确定离开前往 ${location.pathname}吗？`
                }
            />
        </div>
    }
}

export default Page