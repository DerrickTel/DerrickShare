import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter, Switch, Route, RouteProps,
} from 'react-router-dom';
import { Spin } from 'antd';
import WW from '@/pages/home';
import routeList from '../../config/route/index';

import MyRoute from './myRoute';

interface MyRoute extends RouteProps {
  children?: ChildNode;
  title?: string;
}
// pages
const Home = lazy(() => import('@/pages/home'));
const NotFound = lazy(() => import('@/pages/notFound'));

// const renderRoute = (routes, path) => routes.map((route) => [...renderRoute(route.routes || [], route.path), (
//   <Route
//     key={`${path || ''}${route.path}`}
//     path={`${path || ''}${route.path}`}
//     render={(props: any) => (
//       <route.component {...props} routes={route.routes} />
//     )}
//   />
// )]);
const renderRoute = (routes, path) => routes.map((route) => (
  <Route
    key={`${path || ''}${route.path}`}
    path={`${path || ''}${route.path}`}
    render={(props: any) => (
      <route.component {...props} routes={route.routes} />
    )}
  />
));

const Application = () => (
  <BrowserRouter
    basename="/"
  >
    <Suspense fallback={<Spin />}>
      <Switch>
        {/* <MyRoute title="首页" exact path="/" component={Home} />

        <MyRoute title="页面不见啦" path="*" component={NotFound} /> */}
        {renderRoute(routeList, '')}
      </Switch>
    </Suspense>
  </BrowserRouter>
);
export default Application;
