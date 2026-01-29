<!--
 * @Author: your name
 * @Date: 2022-01-12 11:17:58
 * @LastEditTime: 2024-09-26 10:02:22
 * @LastEditors: wangyr
 * @Description: 天气组件
-->
<template>
  <div class="weatherModule" ref="container">
    <div class="weatherModule-container">
      <a-icon type="poweroff" @click="loginOut" style="margin-left: 8px" />
    </div>
  </div>
</template>

<script>
import weatherIcons from '@/common/js/tool/weatherIcons.js';
import { getTemp, getWeather } from '@api/mainPage';
import store from '@/vuex/index';
export default {
  name: 'WeatherModule',
  data() {
    return {
      address: undefined,
      weather: {
        type: '晴',
        url: require('@/assets/img/weather/' + weatherIcons['晴'] + '.png'),
        temperature: `26°C~37°C`,
        now: '31°C'
      }
    };
  },
  mounted() {},
  methods: {
    loginOut() {
      store.dispatch('account/setMenuTrees', []);
      store.commit('account/setLogout');
    }
  }
};
</script>

<style lang="less" scoped>
.weatherModule {
  height: 65%;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  top: 20px;
  left: -12px;
  z-index: 9999;

  .weatherModule-location {
    margin-right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      width: 22px;
      height: 24px;
      background: url('~@assets/img/ic_location.png') no-repeat 0 0/100%;
    }

    span {
      display: flex;
      margin-left: 10px;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      letter-spacing: 0;
      font-family: YouSheBiaoTiHei, sans-serif;
      font-size: 22px;
      color: #ffffff;
      text-shadow: 0 2px 4px #32d0ffa8;
    }

    span::after {
      display: inline-block;
      content: '';
      width: 1px;
      height: 20px;
      margin-left: 8px;
      background-color: #6c8097;
    }
  }

  .weatherModule-content {
    margin-left: 0px;
    width: 320px;
    height: 100px;
  }

  .weatherModule-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-weight: 500;
    font-size: 20px;
    color: #a7bad1;
    letter-spacing: 0;

    img {
      width: 40px;
      height: 40px;
    }
    .temperature-box {
      display: flex;
      // flex-direction: column;
      align-items: center;
      margin-left: 8px;
      // align-items: flex-start;

      .now {
        font-weight: 500;
        letter-spacing: 0;
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 24px;
        color: #ffffff;
        text-shadow: 0 2px 4px #32d0ffa8;
      }
      .tmp {
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #eaf5faad;
        margin-right: 6px;
      }
      .du {
        font-family: Aliba, sans-serif;

        font-weight: 500;
        font-size: 20px;
        color: #f6fcff;
      }
    }
  }
}
/deep/.ant-divider {
  height: 20px !important;
  margin: 0 12px !important;
  color: #eaf5faad;
}
</style>
