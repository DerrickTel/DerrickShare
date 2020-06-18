import { RouteProps, Route } from 'react-router-dom';
import React from 'react';
import { Helmet } from 'react-helmet';

interface MyRoute extends RouteProps {
  children?: ChildNode;
  title?: string;
}

export default ({
  title,
  ...rest
}: MyRoute) => (
  <>
    <Helmet>
      <title>{title || 'Derrick'}</title>
    </Helmet>
    <Route
      {...rest}
      render={(props: MyRoute) => (
        <>
          {props.title || 'Derrick'}
          {props.children}
        </>
      )}
    />
  </>
);
