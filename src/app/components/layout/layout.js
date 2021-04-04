
import React from 'react';

//引用sub-antd组件
import Header from 'components/header/Header';
import Row from 'sub-antd/lib/row';
import Col from 'sub-antd/lib/col';

//引入自定义全局样式
import 'assets/css/main.scss'

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height:0
        }
    }

    UNSAFE_componentWillMount() {

        let wh = this.getWinHeight();
        
        //初始化左边菜单的高度
        this.setState({
            height: wh - 42 
        });
      
    }
    getWinHeight() {
        let wH = document.documentElement.clientHeight || document.body.clientHeight;
        return wH;
    }
    
    render() {
        return (
            <div className="demand-management">
                <Row>
                    <Col span={24}>
                    <Header />
                    </Col>
                </Row>
        
                <Row>
                    <Col span={24}>
                        {
                            this.props.children
                        }
                    </Col>
                </Row>
        
            </div>
        );
    }
}