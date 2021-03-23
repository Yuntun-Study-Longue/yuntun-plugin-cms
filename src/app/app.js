import React from 'react';
import { Layout, Icon } from 'antd'
import SiderMenu from './SiderMenu'
import Routes from "./routes";
import './app.css';

const { Sider, Content, Header } = Layout

const App = () => (
  <Layout className="app">
    <Header className="app__header">
      <h2 className="app__logo">
        <Icon type="ant-design" /> Razzle-Ant Design
      </h2>
    </Header>

    <Layout className="app__content">
      <Sider breakpoint="sm" collapsible>
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

export default App;
