import React from 'react'
import ReactDOM from 'react-dom'
import dva from 'dva';
import {ConfigProvider} from "antd"
import App from './App'
import './assets/css/init.css'
import createHistory from 'history/createBrowserHistory'

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
