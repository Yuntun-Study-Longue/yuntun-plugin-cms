import React, { Component } from 'react'
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overrided)
    '//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js', // icon-shoppingcart, icon-python
    '//at.alicdn.com/t/font_2266493_ubutliz296k.js' // alichs icons
  ],
});

const links = [
  {
    label: 'Home',
    url: '/',
    icon: 'stop-fill',
  },
  {
    label: 'Login',
    url: '/login',
    icon: 'facebook',
  },
  {
    label: 'Doc List',
    url: '/docList',
    icon: 'add',
  },
  {
    label: 'Fundamental Data Management',
    url: '/fundamentalDataManagement',
    icon: 'service-fill',
  },
  {
    label: 'Requirement Management',
    url: '/requirementManagement',
    icon: 'usercenter',
  },
  {
    label: 'Requirement Management Config',
    url: '/requirementManagementConfig',
    icon: 'usercenter',
  },
  {
    label: 'Requriement Full Page',
    url: '/requriementFullPage',
    icon: 'usercenter',
  },
  {
    label: 'History Record',
    url: '/historyRecord',
    icon: 'usercenter',
  },
  {
    label: 'Requirement Document Config',
    url: '/requirementDocumentConfig',
    icon: 'usercenter',
  },
]

class SiderMenu extends Component {
  componentDidMount() {}
  onClick = item => window.open(item.key, '_self')

  render() {
    return (
      <Menu theme="dark">
        {links.map(link => (
          <Menu.Item key={link.url}>
            {link.icon && <IconFont type={`icon-${link.icon}`} />}
            <Link to={link.url} style={{display: this.props.isCollapsed ? 'block' : 'inline'}}>{link.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    )
  }
}

export default connect(
  state => ({
    isCollapsed: state.layout.isCollapsed
  }),
  null
)(SiderMenu)