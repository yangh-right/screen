/*
 * @Author: wangyr
 * @Date: 2024-02-21 14:08:11
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-02-22 10:50:25
 * @Description:
 */
import { Base64 } from 'js-base64';
import storage from '@/common/js/tool/storage';
import { ACCESS_TOKEN, USER_INFO } from '../mutation-types';
import router from '@/router/routes';
const SET_TOKEN = 'set_token';
const SET_USER = 'set_user';
const SET_PERMISSIONS = 'set_permissions';
const SET_ROLES = 'set_roles';

const state = {
  roles: [],
  permissions: [],
  token: storage.get(ACCESS_TOKEN, ''),
  user: storage.get(USER_INFO) ?? {},
  menuTrees: [],
  companyName: ''
};

const getters = {
  token: state => state.token,
  roles: state => state.roles,
  permissions: state => state.permissions,
  user: state => state.user
};

const mutations = {
  [SET_TOKEN]: (state, token) => {
    state.token = token;
    storage.set('token', token);
  },
  setLogin: (state, data) => {
    storage.set(USER_INFO, data);
    Object.assign(state.user, JSON.parse(data));
  },
  setLogout: state => {
    storage.set('token', '');
    router.replace({
      path: '/login'
    });
  },
  [SET_PERMISSIONS]: (state, permissions) => {
    state.permissions = [...permissions];
  },
  [SET_ROLES]: (state, roles) => {
    state.roles = [...roles];
  },
  setMenuTrees: (state, data) => {
    state.menuTrees = data;
  },
  setCompanyName: (state, data) => {
    state.companyName = data;
  }
};

const actions = {
  setMenuTrees({ commit }, data) {
    commit('setMenuTrees', data);
  }
};
export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
};
