import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import Popover from 'sub-antd/lib/popover';
import Icon from 'sub-antd/lib/icon';
import message from 'sub-antd/lib/message';
import Tree from 'sub-antd/lib/tree';
const TreeNode = Tree.TreeNode;

import './viewerTree.scss';

export default class viewerTree extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
        // this.getTree();
    }
    render() {
        return (
            <p>fdsjfalkdjfklaj</p>
        )
    }
}