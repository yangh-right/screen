<!--
 * @Author: 史磊
 * @Date: 2022-09-02 11:02:23
 * @LastEditTime: 2025-03-05 17:18:02
 * @LastEditors: wangyr
 * @Description:
 * @FilePath: \ergongscreen\src\App.vue
-->
<template>
  <!-- 这里输入设计稿的尺寸大小 -->
  <v-scale-screen width="1920" height="1200" :fullScreen="true">
    <a-config-provider :locale="locale">
      <div id="mainPage" style="width: 100%; height: 100%">
        <TopHeaderModule v-if="comFlag" :getThemeTxt="themeText" />
        <transition v-if="!comFlag" name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
        <content-wrapper v-if="comFlag">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </content-wrapper>
        <BotTabModule v-if="comFlag" />
        <chatbots v-if="comFlag" />
      </div>
    </a-config-provider>
  </v-scale-screen>
</template>

<script>
import store from '@/vuex/index';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { getProductDetailByCode } from '@/api/api.js';
import TopHeaderModule from '@/views/utils/topHeaderModule';
import BotTabModule from '@/views/utils/botTabModule';
import { checkToken } from '@/api/api.js';
import ContentWrapper from '@/views/utils/ContentWrapper';
import chatbots from '@/views/utils/chatbots';

export default {
  name: 'App',
  components: {
    TopHeaderModule,
    BotTabModule,
    chatbots,
    ContentWrapper
  },
  data() {
    return {
      locale: zhCN,
      comFlag: false,
      timer: null,
      themeText: '永康污水厂智慧管理平台'
    };
  },
  mounted() {
    this.$store.commit('resize/setScaleValue');
    window.addEventListener('resize', () => {
      this.$store.commit('resize/setScaleValue');
    });
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.path !== '/login' && to.path !== '/welcome') {
          clearInterval(this.timer);
          this.timer = null;
          this.timer = setInterval(this.checkToken, 60000);
          this.comFlag = true;
        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.comFlag = false;
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getCompanyName();
  },
  methods: {
    async checkToken() {
      let ifOver = await checkToken();
      if (!ifOver.success) {
        store.commit('account/setLogout');
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    //头部公司名称
    async getCompanyName() {
      const { resultData, success } = await getProductDetailByCode('water_purification_big_screen');
      if (success) {
        document.title = resultData.name;
        this.$store.commit('account/setCompanyName', resultData.name);
      }
    }
  }
};
</script>

<style lang="less">
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: rgb(6, 25, 63);
}
#mainPage {
  background-color: rgb(6, 25, 63);
}

/* chrome & safari 浏览器 重置滚动条样式 */
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  background: rgba(0, 16, 40, 0.7);
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background: rgba(160, 201, 255, 0.3);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(0, 16, 40, 0.7);
}

::-webkit-scrollbar-corner {
  background-color: rgba(0, 16, 40, 0.7);
}

/* IE 浏览器 重置滚动条样式 */
body {
  overflow: hidden;
  scrollbar-face-color: rgba(160, 201, 255, 0.3); /* 滚动条颜色 */
  scrollbar-shadow-color: rgba(0, 16, 40, 0.7); /* 滚动条的边框 */
  scrollbar-track-color: rgba(0, 16, 40, 0.7); /* 浏览器滚动条背景色 */
  scrollbar-arrow-color: rgba(160, 201, 255, 0.3); /* 上下箭头颜色 */
}
</style>
