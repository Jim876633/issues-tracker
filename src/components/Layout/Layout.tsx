import { labelData } from '@src/constants/labels';
import { useIssuesContext } from '@src/context/useIssuesContext';
import { LabelOptionEnum, LabelTabEnum } from '@src/enums/labelEnum';
import { Menu } from 'antd';
import Layout, { Content, Footer, Header } from 'antd/es/layout/layout';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import styled from './Layout.module.scss';

export const LayoutElement = () => {
  const { selectTab } = useIssuesContext();
  const pathname = useLocation().pathname;

  const navClickHandler = ({ key }: MenuInfo) => {
    switch (key) {
      case LabelTabEnum.ALL:
        selectTab(LabelOptionEnum.ALL);
        break;
      case LabelTabEnum.OPEN:
        selectTab(LabelOptionEnum.OPEN);
        break;
      case LabelTabEnum.IN_PROGRESS:
        selectTab(LabelOptionEnum.IN_PROGRESS);
        break;
      case LabelTabEnum.DONE:
        selectTab(LabelOptionEnum.DONE);
        break;
    }
  };

  return (
    <>
      <Layout className={styled.container}>
        <Header>
          <div className="logo" />
          {pathname.includes('detail') ? (
            ''
          ) : (
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['0']}
              onClick={navClickHandler}
              items={labelData.map((label, i) => {
                return {
                  key: i,
                  label,
                };
              })}
            />
          )}
        </Header>
        <Content className={styled.content}>
          <Breadcrumb />
          <div className={styled.content_inner}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Issue tracker ©2023 Created by Jim Huang
        </Footer>
      </Layout>
    </>
  );
};
