import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from "react-loadable";

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "home" */ "./Home"),
  loading: () => null,
  modules: ["home"]
});

const DocList = Loadable({
  loader: () => import(/* webpackChunkName: "doc-list" */ "./DocList"),
  loading: () => null,
  modules: ["doc-list"]
});

const FundamentalDataManagement = Loadable({
  loader: () => import(/* webpackChunkName: "fundamental-data-management" */ "./FundamentalDataManagement"),
  loading: () => null,
  modules: ["fundamental-data-management"]
});

const HistoryRecord = Loadable({
  loader: () => import(/* webpackChunkName: "history-record" */ "./HistoryRecord"),
  loading: () => null,
  modules: ["history-record"]
});

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ "./Login"),
  loading: () => null,
  modules: ["login"]
});

const RequirementDocumentConfig = Loadable({
  loader: () => import(/* webpackChunkName: "requirement-document-config" */ "./RequirementDocumentConfig"),
  loading: () => null,
  modules: ["requirement-document-config"]
});

const RequirementManagement = Loadable({
  loader: () => import(/* webpackChunkName: "requirement-management" */ "./RequirementManagement"),
  loading: () => null,
  modules: ["requirement-management"]
});

const RequriementFullPage = Loadable({
  loader: () => import(/* webpackChunkName: "requirement-full-page" */ "./RequriementFullPage"),
  loading: () => null,
  modules: ["requirement-full-page"]
});

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/docList" component={DocList} />
    <Route exact path="/fundamentalDataManagement" component={FundamentalDataManagement} />
    <Route exact path="/requirementManagement" component={RequirementManagement} />
    <Route exact path="/requriementFullPage" component={RequriementFullPage} />
    <Route exact path="/historyRecord" component={HistoryRecord} />
    <Route exact path="/requirementDocumentConfig" component={RequirementDocumentConfig} />
  </Switch>
);