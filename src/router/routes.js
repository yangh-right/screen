import VueRouter from 'vue-router';
import NotFound from '../views/404.vue';
import login from '../views/Login'; // 登录
import WelcomePage from '../views/welcomePage';
import Application from '@/components/Application/index.vue';

// 解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;

// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

const routes = [
  {
    path: '/',
    redirect: {
      path: '/login'
    }
  },
  {
    path: '/login',
    component: login,
    name: 'login'
  },
  {
    path: '/welcome',
    component: WelcomePage,
    name: 'welcome'
  },
  {
    path: '/productionCockpit',
    component: Application,
    redirect: {
      path: '/mainPage'
    },
    children: []
  },
  {
    path: '/404',
    component: NotFound,
    name: 'NotFound'
  }
];

const router = new VueRouter({
  routes: routes
});

export default router;
