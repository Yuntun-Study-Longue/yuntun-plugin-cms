
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from 'sub-antd/lib/row';
import Col from 'sub-antd/lib/col';

// import Left from './Left.js';
import './Container.scss';


export default class Container extends Component {
    static defaultProps = {
        span: 4,
        dragable: true,
    }
    constructor(props) {
        super(props);
        this.state = {
            conH: 200,
            selectTreeId: ''
        }
    }
    componentDidMount() {
        const h = document.documentElement.clientHeight || document.body.clientHeight;
        this.setState({ conH: h-40-40 });
    }
    
    render() {
        return <div>
            <Row gutter={12} id="box">
                <Col span={this.props.span} id="left" style={{position:'relative',padding:'0'}}>
                    <div className="left-tree left-content">
                        <div style={{height:(this.state.conH-27)+'px',overflowY:'auto',width:'100%'}}>
                            {this.props.siderBar}
                        </div>
                    </div>
                    {
                        this.props.dragable && <div id="resize" className="drag-resize">
                            <span></span>
                        </div>
                    }
                </Col>
                <Col span={24 - this.props.span} id="right" style={{paddingRight:'0',overflow:'hidden',height:this.props.conH+'px',
                position:'absolute',right:'0',top:'0'
            }}>
                {this.props.children}
                </Col>
            </Row>
        </div>
    }
}
Container.propTypes = {
    conH: PropTypes.number,
    span: PropTypes.number,
    siderBar: PropTypes.element,
    dragable: PropTypes.bool,
}