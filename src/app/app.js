import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { Layout, Icon, Button } from 'antd'
import SiderMenu from './SiderMenu'
import Routes from "./routes";
import { toggleSiderMenu } from "../modules/layout";
import './app.css';

const { Sider, Content, Header } = Layout

const App = ({ toggleSiderMenu, history }) => (
  <Layout className="app">
    <Header className="app__header">
      <h2 className="app__logo">
        <Icon type="ant-design" /> IDP-Ant Design
      </h2>
    </Header>

    <Layout className="app__content">
      <Sider breakpoint="sm" collapsible 
      onCollapse={ collapsed => toggleSiderMenu(collapsed) }>
        <SiderMenu />
      </Sider>
      <Layout>
        <Content>
          <Routes />
        </Content>
      </Layout>
    </Layout>
    
  </Layout>
);

const mapStateToProps = state => ({
  isCollapsed: state.layout.isCollapsed
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleSiderMenu }, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
