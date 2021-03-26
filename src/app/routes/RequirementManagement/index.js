import React, { Component } from 'react'

class Page extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    componentDidMount() {
        const AuthEle = document.createElement('input');
        AuthEle.id = 'Auth';
        AuthEle.value = 'fdjasldfjasldjf'
        document.getElementById("extension-node").appendChild(AuthEle);
        console.log(document.getElementById("extension-node"))
    }
    componentWillUnmount() {
        document.getElementById("extension-node").removeChild(
            document.getElementById("Auth")
        );
    }
    render() {
        return <p>需求管理列表</p>
    }
}

export default Page