import React from 'react';
import {
  Layout, Menu, Breadcrumb, Card,
} from 'antd';
import { Switch, Route } from 'react-router-dom';

const {
  Header, Footer, Sider, Content,
} = Layout;

const { SubMenu } = Menu;

const renderRoute = (routes, path) => routes.map((route) => [...renderRoute(route.routes || [], route.path), (
  <Route
    key={`${path || ''}${route.path}`}
    path={`${path || ''}${route.path}`}
    render={(props: any) => (
      <route.component {...props} routes={route.routes} />
    )}
  />
)]);

export default (props) => {
  console.log(props.routes);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            Option 1
          </Menu.Item>
          <Menu.Item key="2">
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" />
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <Card>
            <Switch>
              {/* {props.routes.map((route, index) => (
              // Render more <Route>s with the same paths as
              // above, but different components this time.
                <Route
                  key={route.path}
                  path={route.path}
                  children={<route.component />}
                />
              ))} */}
              {renderRoute(props.routes, '')}
            </Switch>
          </Card>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};
