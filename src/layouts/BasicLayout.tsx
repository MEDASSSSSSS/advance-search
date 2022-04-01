/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import type { Dispatch } from 'umi';
import { Link, useIntl } from 'umi';
import { Result,  ConfigProvider, Empty } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './BasicLayout.less';
import { useHistory } from 'react-router-dom';



const noMatch = <Result status={403} title="403" subTitle="抱歉，您暂无该页面权限" />;
export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};
/**
 * use Authorized check all menu item
 */

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef<MenuDataItem[]>([]);
  const history = useHistory();

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () => ({
      authority: () => {
        const userTagsInfo = sessionStorage.getItem('userTagsInfo');
        if (!userTagsInfo) return false;
        const { data, success } = JSON.parse(userTagsInfo);
        if (!success) return false;
        return true;
        // return data.some((tag: any) => tag.code === 'task-center-admin');
      },
    }),
    [],
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (
      <ConfigProvider
        locale={zhCN}
      >
        <ProLayout
          {...props}
          {...settings}
          layout="top"
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuProps={{
            theme: 'light',
            style: {
              display: authorized!.authority() ? 'block' : 'none',
            },
          }}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (
              menuItemProps.isUrl ||
              !menuItemProps.path ||
              location.pathname === menuItemProps.path
            ) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          subMenuItemRender={(menuItemProps, defaultDom) => {
            return defaultDom;
          }}
          breadcrumbRender={(routers = []) => [...routers]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          postMenuData={(menuData) => {
            menuDataRef.current = menuData || [];
            return menuData || [];
          }}
          onEmptied
        >
            {children}
        </ProLayout>
      </ConfigProvider>
  );
};

export default BasicLayout;

