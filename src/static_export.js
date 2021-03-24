import { renderApp } from './renderApp';

export const render = async (req, res) => {
  const { html } = await renderApp(req, res);
  res.json({ html });
};
export const routes = () => {
  return [
    '/', 
    '/login',
    '/docList',
    '/fundamentalDataManagement',
    '/requirementManagement',
    '/requriementFullPage',
    '/historyRecord',
    '/requirementDocumentConfig'
  ];
};