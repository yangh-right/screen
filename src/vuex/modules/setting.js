/*
 * @Author: wangyr
 * @Date: 2024-06-15 10:01:37
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-17 10:07:28
 * @Description:
 */
export default {
  namespaced: true,
  state: {
    pumpData: {},
    waterPlantId: ''
  },
  getters: {},
  mutations: {
    setWaterPlantId(state, waterPlantId) {
      state.waterPlantId = waterPlantId;
    }
  },
  actions: {
    setWaterPlantId({ commit }, data) {
      commit('setWaterPlantId', data);
    }
  }
};
