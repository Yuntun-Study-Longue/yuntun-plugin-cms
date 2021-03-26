import React, { Component } from 'react'

class Page extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    componentDidMount() {
        console.log(document.getElementById("extension-node"))
    }
    render() {
        return <p>登录页面</p>
    }
}

export default Page