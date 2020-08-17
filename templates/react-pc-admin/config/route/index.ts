import { lazy } from 'react';

import Test from '@/pages/test';

export default [
  {
    path: '/',
    component: lazy(() => import('@/layouts/BasicLayout')),
    routes: [
      {
        path: '/test',
        // component: lazy(() => import('@/pages/test')),
        component: Test,
        routes: [
          {
            path: '/ww',
            // component: lazy(() => import('@/pages/test')),
            component: lazy(() => import('@/pages/home')),
          },
        ],
      },
      {
        path: '*',
        component: lazy(() => import('@/pages/notFound')),
      },
    ],
  },
  {
    path: '*',
    component: lazy(() => import('@/pages/notFound')),
  },
];
