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

const RequirementManagementConfig = Loadable({
  loader: () => import(/* webpackChunkName: "requirement-management-config" */ "./RequirementManagement"),
  loading: () => null,
  modules: ["requirement-management-config"]
});

const RequriementFullPage = Loadable({
  loader: () => import(/* webpackChunkName: "requirement-full-page" */ "./RequriementFullPage"),
  loading: () => null,
  modules: ["requirement-full-page"]
});

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login.html" component={Login} />
    <Route exact path="/doclist.html" component={DocList} />
    <Route exact path="/fundamental_data_management.html" component={FundamentalDataManagement} />
    <Route exact path="/requirement_management.html" render={props => <RequirementManagement {...props} needAuth={true} />} />
    <Route exact path="/requirement_management_config.html" component={RequirementManagementConfig} />
    <Route exact path="/requirement_fullpage.html" component={RequriementFullPage} />
    <Route exact path="/doc_history_record.html" component={HistoryRecord} />
    <Route exact path="/requirement_document_config.html" component={RequirementDocumentConfig} />
  </Switch>
);