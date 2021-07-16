import loadable from '@loadable/component';
import { RouteConfig } from 'react-router-config';
import Login from '@pages/login';
const routesConfig: RouteConfig[] = [
  {
    path: '/home',
    exact: true,
    component: loadable(() => import('@pages/home'))
  },
  {
    path: '/login',
    exact: true,
    component: Login
  }
];
export default routesConfig;
