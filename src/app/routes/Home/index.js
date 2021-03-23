import React from 'react';
import { Button } from 'antd';
import './style.css';

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <h1> Welcome to Razzle with Ant Design</h1>
        <Button type="primary"> Show Modal </Button>
        <p>
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default Home;
