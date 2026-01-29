/*
 * @Author: wangyr
 * @Date: 2024-02-21 14:08:11
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-09 13:30:46
 * @Description:
 */
import router from './routes';
import store from '../vuex';
import storage from '@/common/js/tool/storage';
import { loginToken } from '@/api/api.js';
import { getMenuList } from '@/api/mainPage.js';

/**
 * 路由加载之前请求添加 menu
 * 如何解决 addRoutes 刷新后失效
 */

const filterRoutes = ['/login']; // 需要过滤掉的路由

router.beforeEach(async (to, from, next) => {
  const urlToken = to.query.token;

  if (urlToken && to.path === '/login') {
    await handleLogin(urlToken, next);
  } else {
    await handleRouteFiltering(to, next);
  }
});

router.afterEach(() => {});

// 处理登录逻辑
async function handleLogin(urlToken, next) {
  storage.remove('user_info');
  let data = await loginToken({ headers: { Authorization: `Bearer ${urlToken}` } });

  if (data && data.token) {
    document.cookie = '';
    store.commit('account/setLogin', JSON.stringify({ ...data, accessToken: `Bearer ${data.token}` }));
    store.commit('account/set_token', `Bearer ${urlToken}`);
    next({ path: '/welcome' });
  } else {
    store.commit('account/setLogout');
    next({ path: '/' });
  }
}

// 处理路由过滤和跳转
async function handleRouteFiltering(to, next) {
  if (filterRoutes.includes(to.path)) {
    if (storage.get('user_info')) storage.remove('user_info');
    next();
    return;
  }

  if (!store.state.account.menuTrees.length) {
    const userInfo = JSON.parse(storage.get('user_info')) ?? '';
    if (userInfo.accessToken) {
      await onFilterRoutes(to, next);
    } else {
      next({ path: '/login', replace: true });
    }
  } else {
    next();
  }
}

// 路由拼接
function loadView(view) {
  return () => import(`@/views/${view}`);
}

// 路由过滤和跳转
async function onFilterRoutes(to, next) {
  const res = await getMenuList({ codes: ['water_purification_big_screen'] });
  let { status, resultData } = res;

  if (status === 'complete') {
    store.dispatch('account/setMenuTrees', resultData.menuTrees);
    let routes = [];
    await filterASyncRoutes(resultData.menuTrees, routes); // 路由过滤
    routes.forEach(item => {
      router.options.routes.push(item);
      router.addRoute(item);
    });
    next({ ...to, replace: true });
  } else {
    store.commit('account/setLogout');
    next({ path: '/' });
  }
}

// 路由过滤   遍历路由 转换为组件对象和路径
function filterASyncRoutes(data, routes = []) {
  data.forEach(item => {
    if (item.children && item.children.length === 0) {
      item.component = loadView(item.component);
      routes.push(item);
    }
    if (item.children && item.children.length > 0) {
      filterASyncRoutes(item.children, routes);
    }
    // 单独处理智慧生产
    if (item.name === '智慧生产') {
      let tempItem = JSON.parse(JSON.stringify(item));
      tempItem.children = [];
      tempItem.component = loadView(tempItem.component);
      routes.push(tempItem);
    }
  });
}
