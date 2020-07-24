import escapeStringRegexp from 'escape-string-regexp';
import React from 'react';

import { renderToString } from 'react-dom/server'

import { Provider } from 'react-redux'
import configureStore from '../../redux/configureStore'
import App from '../../components/App'
import {loadInitialValue} from "../../util";
import {Route, StaticRouter} from "react-router-dom";


const renderMiddleware = () => (req, res) => {
  let html = req.html;
  let sources = [];
  let trend = [];
  loadInitialValue(1,req.query.domain).then(data => {
    sources = data.sources;
    trend = data.trend;
    return data.news
  }).then(
    initialData => {
    const initialState = {
      isFetching: false,
      news: initialData.articles,
      sources: sources,
      trend,
      viewNews: null
    };
    const store = configureStore(initialState);
    let htmlContent = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={{}}>
          <Route
            path="/"
            render={matchProps => (
              <App {...matchProps} />
            )}
          />
        </StaticRouter>
      </Provider>
    );
    const htmlReplacements = {
      HTML_CONTENT: htmlContent,
      REDUX_STATE: JSON.stringify(initialState)
    };

    Object.keys(htmlReplacements).forEach(key => {
      const value = htmlReplacements[key];
      html = html.replace(
        new RegExp('__' + escapeStringRegexp(key) + '__', 'g'),
        value
      );
    });
    res.send(html);
  }).catch(e => res.send(e));
};

export default renderMiddleware;

