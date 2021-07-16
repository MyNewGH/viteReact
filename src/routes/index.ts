import loadable from '@loadable/component';
import { RouteConfig } from 'react-router-config';
const routesConfig: RouteConfig[] = [
  {
    path: '/home',
    exact: true,
    component: loadable(() => import('@pages/home'))
  }
];
export default routesConfig;
