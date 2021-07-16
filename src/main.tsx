import React from 'react';
import ReactDOM from 'react-dom';
import '@assets/css/init.css';
import App from './App';
import { Provider } from 'use-http';
import { IncomingOptions } from 'use-http/dist/cjs/types';
import { Toast } from 'antd-mobile';

const globalOptions: IncomingOptions = {
  interceptors: {
    request: ({ options }) => {
      // options.headers = {
      //   // Authorization: 'Bearer your token'
      // };
      return options;
    },
    response: ({ response }) => {
      const { data } = response;
      if (data?.result?.status === -1) {
        Toast.info(data.result.msg);
      }
      return Promise.resolve(response);
    }
  }
};
const apiUrl = process.env.API_URL;
ReactDOM.render(
  <React.StrictMode>
    <Provider options={globalOptions} url={apiUrl}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
