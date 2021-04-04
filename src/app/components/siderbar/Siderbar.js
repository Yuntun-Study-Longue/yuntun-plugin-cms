import React, { Component } from 'react';
import './Siderbar.scss'

export default class Siderbar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="left-tree left-content">
            {this.props.children}
        </div>
    }
}