import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from "react-loadable";

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ "./Home"),
  loading: () => null,
  modules: ["home"]
});

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ "./Login"),
  loading: () => null,
  modules: ["login"]
});

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
  </Switch>
);