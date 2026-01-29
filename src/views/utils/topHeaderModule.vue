<template>
  <div class="topHeaderModule">
    <div class="map-title">
      <div class="map-title-header">
        <div class="title-wrapper">
          <gradientShadowText :text="companyName"></gradientShadowText>
        </div>
        <a-dropdown placement="bottomCenter" :trigger="['hover']">
          <span></span>
          <a-menu v-if="false" slot="overlay" :selectedKeys="[waterPlantId]" @click="changeSort">
            <a-menu-item v-for="item in factoryList" :key="item.id">{{ item.stationName }}</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="left-menu">
        <div v-for="(item, index) in TabData" :key="index" class="list"
          @click="handleBotChange(item.type, item.checkedPath ? item.checkedPath : item.path, item)">
          <a-dropdown overlayClassName="fee-menu" :trigger="['click', 'hover']" v-if="item.children.length"
            @visibleChange="visibleChange($event, index)" :placement="placements">
            <div class="ant-dropdown-link">
              <p :class="[curIndex == item.type ? 'selected' : '', 'menu__name']">
                <gradientShadowText :text="item.name"></gradientShadowText>
              </p>
              <!-- <span class="checkedName">{{ item.checkedName }}</span> -->
            </div>
            <a-menu slot="overlay" mode="horizontal" :selectedKeys="[selectedKey]">
              <a-menu-item v-for="sub in item.children" :key="sub.path">
                <div class="menu-nav" @click="handleBotChange(item.type, sub.path, sub, item.children.length)">
                  {{ sub.name }}
                </div>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <p v-else :class="[curIndex == item.type ? 'selected' : '', 'menu__name']">
            <gradientShadowText :text="item.name"></gradientShadowText>
          </p>
        </div>
      </div>
      <div class="weather">
        <weather-module />
        <time-module />
      </div>
    </div>
  </div>
</template>

<script>
import storage from '@/common/js/tool/storage';
import { isArray } from 'lodash-es';
import gradientShadowText from '@/components/gradientShadowText';
import TimeModule from '@/views/utils/timeModule.vue';
import WeatherModule from '@/views/utils/weatherModule.vue';
import { getWaterPlants } from '@/api/mainPage';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'TopHeaderModule',
  components: {
    WeatherModule,
    TimeModule,
    gradientShadowText
  },
  props: {
    getThemeTxt: {
      type: String,
      required: false,
      default: () => {
        return '永康污水厂智慧管理平台';
      }
    }
  },
  data() {
    return {
      curIndex: 0,
      placements: 'bottomRight',
      showFlag: true,
      TabData: [],
      subMenuList: [],
      factoryList: [],
      waterPlantId: '',
      factoryName: '',
      selectedKey: ''
    };
  },
  computed: {
    ...mapState('account', ['menuTrees', 'companyName'])
  },
  watch: {
    $route(to, from) {
      this.handlerType();
    },
    menuTrees: {
      immediate: true,
      deep: true,
      handler(val) {
        this.subMenuList = [];
        if (val.length > 0) {
          this.TabData = val;
          this.TabData.forEach((item, i) => {
            item['type'] = i;
            if (item.children && item.children.length) {
              item['checkedName'] = item.children[0].name;
              item['checkedPath'] = item.children[0].path;
              this.subMenuList.push(...item.children);
            }
          });
          if (storage.get('user_info')) {
            this.getFactoryList();
          }
          this.handlerType();
        }
      }
    }
  },
  methods: {
    ...mapMutations('video', ['setHideVideo']),
    getPurificationUrl(token) {
      const baseUrl =
        process.env.NODE_ENV === 'development'
          ? process.env.VUE_APP_HOST
          : `${window.location.protocol}//${window.location.host}`;
      return `${baseUrl}/water_purification/#/productionCockpit?token=${token}`;
    },
    visibleChange(visible, index) {
      // 智慧安全和智能巡检页面都有视频，下拉菜单打开时需要隐藏视频
      if ((this.$route.path.includes('smartSafe') || this.$route.path.includes('intelligenInspection')) && index < 4) {
        this.setHideVideo(visible);
      }
    },
    // 设备列表
    async getFactoryList() {
      const { status, resultData } = await getWaterPlants();
      // 选择第一项
      if (status === 'complete' && isArray(resultData) && resultData.length > 0) {
        this.factoryList = resultData;
        this.waterPlantId = this.factoryList[0].id;
        this.factoryName = this.factoryList[0].stationName;
        this.$store.dispatch('setting/setWaterPlantId', this.waterPlantId);
      }
    },
    changeSort(e) {
      this.factoryList.forEach((item, index) => {
        if (item.id === e.key) {
          this.waterPlantId = item.id;
          this.factoryName = item.stationName;
        }
      });
      this.$store.dispatch('setting/setWaterPlantId', this.waterPlantId);
    },
    // 底部导航切换
    handleBotChange(val, path, data, length) {
      if (path.includes('purificationPlatform')) {
        let user = JSON.parse(storage.get('user_info'));
        let token = user.accessToken.replace('Bearer ', '');
        let url = this.getPurificationUrl(token);
        window.open(url);
        return;
      }
      // if (path.includes('digitalTwin')) {
      //   window.open('DigitwinFactory://');
      //   return;
      // }
      if (length) {
        let obj = this.subMenuList.find(item => item.path === path);
        this.TabData.forEach(item => {
          if (item.type === val) {
            item.checkedName = obj.name;
            item.checkedPath = obj.path;
          }
        });
      }
      // 智慧生产
      if (data?.name === '智慧生产') {
        this.curIndex = val;
        this.selectedKey = data.path;
        this.$router.push(data.path);
        return;
      }
      this.curIndex = val;
      this.selectedKey = path;
      this.$router.push(path);
    },
    handlerType() {
      const path = this.$route.path;
      this.curIndex = '0';
      let allMenu = [...this.TabData];
      allMenu.forEach(item => {
        if (path === item.path) {
          this.curIndex = item.type;
        } else if (item?.children?.length) {
          item.children.forEach(sub => {
            if (path === sub.path) {
              this.curIndex = item.type;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.fee-menus {
  .ant-dropdown-menu {
    left: 36px !important;
  }
}

.fee-menu {
  .ant-dropdown-menu {
    left: 0px !important;
  }
}

.fee-menu,
.fee-menus {
  min-width: 140px !important;
  width: 140px !important;

  .ant-dropdown-menu {
    top: 2px !important;
    min-width: 144px !important;
    width: 144px !important;
    background: url(~@assets/img/summaryOverview/fir_medium.png) no-repeat;
    background-size: 100% 100%;
    padding: 0 !important;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: url(~@assets/img/summaryOverview/fir_upward.png) no-repeat;
      background-size: 100% 100%;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 4px;
      background: url(~@assets/img/summaryOverview/fir_downward.png) no-repeat;
      background-size: 100% 100%;
    }

    .ant-dropdown-menu-item,
    .ant-dropdown-menu-submenu {
      font-size: 18px !important;
      font-family: YouSheBiaoTiHei, sans-serif;
      text-align: center;

      >.menu-nav {
        display: block;
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 18px;
        color: #7aaed4;
      }
    }

    .ant-dropdown-menu-item {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 1px;
        background: url(~@assets/img/summaryOverview/fir_split_lines.png) no-repeat center center;
      }

      &:last-child::after {
        display: none;
      }
    }

    .ant-dropdown-menu-submenu-title {
      >.menu-nav {
        display: block;
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 18px;
        color: #7aaed4;
      }
    }

    background-color: rgba(18, 61, 132, 0.3);
  }

  .ant-dropdown-menu-item:hover {
    >.menu-nav {
      color: #ffffff;
    }

    background: url(~@assets/img/summaryOverview/fir_dropdown_checked.png) no-repeat center center;
  }

  .ant-dropdown-menu-item-selected {
    >.menu-nav {
      color: #ffffff !important;
    }

    color: #ffffff !important;
    background: url(~@assets/img/summaryOverview/fir_dropdown_checked.png) no-repeat center center;
  }
}

.topHeaderModule {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90px;
  z-index: 5;

  .map-title {
    z-index: 5;
    width: 100%;
    height: 98px;
    position: relative;
    background-image: linear-gradient(180deg, #0b2446 8%, rgba(11, 36, 70, 0.2) 100%);

    .weather {
      width: 60px;
      height: 100%;
      position: absolute;
      right: 18px;
      top: -6px;
    }

    &-header {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      background: url('~@/assets/img/top.png') no-repeat;
      background-size: 100% 100%;

      .title-wrapper {
        width: 646px;
        text-align: center;
        padding-top: 8px;
      }
    }
  }

  .left-menu {
    width: calc(100% - 757px);
    position: absolute;
    display: flex;
    top: 20px;
    left: 642px;
    z-index: 9999;

    .list {
      cursor: pointer;
      position: relative;
      margin-right: 24px;

      &:nth-last-child(1) {
        margin-right: 0;
      }

      .menu__name {
        width: 144px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        background: url('~@/assets/img/hz/l-menu.png') no-repeat;
        background-size: 100% 100%;

        /deep/ .gradient-shadow {
          .text {
            font-family: PangMenZhengDao-3, sans-serif;
            font-weight: 600;
            font-size: 21px;
            letter-spacing: 0;
            text-shadow: 0 3px 2px #00000080;
          }

          .text:before {
            letter-spacing: 0;
            color: #76a1f7;
            -webkit-mask: linear-gradient(to top, #76a1f7 28%, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 79%);
          }
        }

        &.selected {
          /deep/ .gradient-shadow {
            .text:before {
              color: #92b4fa;
              -webkit-mask: linear-gradient(to top, #86abf5 28%, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 79%);
            }
          }
        }
      }

      .checkedName {
        position: absolute;
        bottom: 8px;
        right: 28px;
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 16px;
        color: #c8e0e7;
        letter-spacing: 2px;
        opacity: 0.8;
        z-index: 0;
        animation: myAnimations 1s;
      }

      p.selected {
        color: #fff8ef;
        background: url('~@/assets/img/hz/la-menu.png') no-repeat;
        background-size: 100% 100%;
      }

      @keyframes myAnimation {
        0% {
          opacity: 0.5;
          transform: translateX(-6%);
        }

        100% {
          opacity: 1;
          transform: translateX(0%);
        }
      }

      @keyframes myAnimations {
        0% {
          opacity: 0.2;
          transform: translateX(6%);
        }

        100% {
          opacity: 0.8;
          transform: translateX(0%);
        }
      }

      .text-box1 {
        position: relative;
        margin-top: 10px;
        width: 226px;
        height: 50px;
        background: url('~@/assets/img/hz/l-menu.png') no-repeat;
        background-size: 100% 100%;

        .show {
          display: flex;
          flex-direction: column;
          vertical-align: middle;
          align-items: center;
          text-align: center;
          cursor: pointer;
          padding-right: 30px;
          padding-bottom: 5px;

          p {
            width: 226px;
            height: 50px;
            font-family: YouSheBiaoTiHei, sans-serif;
            font-size: 22px;
            color: #fff8ef;
            letter-spacing: 2px;
            text-align: center;
            z-index: 99;
            animation: myAnimation 1s;
          }
        }

        .unconspicuous {
          position: absolute;
          bottom: 8px;
          right: 30px;

          p {
            font-family: YouSheBiaoTiHei, sans-serif;
            font-size: 18px;
            color: #c8e0e7;
            letter-spacing: 2px;
            text-align: center;
            opacity: 0.8;
            animation: myAnimations 1s;
          }
        }
      }
    }
  }

  .right-menu {
    position: absolute;
    display: flex;
    top: 20px;
    right: 20px;
    z-index: 9999;
    width: 36%;

    .list {
      display: flex;
      flex-direction: column;
      vertical-align: middle;
      align-items: center;
      text-align: center;
      cursor: pointer;
      position: relative;

      p {
        width: 218px;
        height: 52px;
        margin-top: 10px;
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 22px;
        color: #c8e0e7;
        letter-spacing: 2px;
        text-align: center;
        background: url('~@/assets/img/hz/r-menu.png') no-repeat;
        background-size: 100% 100%;
      }

      .checkedName {
        position: absolute;
        bottom: 8px;
        left: 28px;
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 16px;
        color: #c8e0e7;
        letter-spacing: 2px;
        opacity: 0.8;
        z-index: 0;
        animation: myAnimations 1s;
      }

      p.selected {
        color: #fff8ef;
        background: url('~@/assets/img/hz/ra-menu.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}

/deep/.ant-dropdown {
  min-width: none !important;
  width: 120px;
}
</style>
<style>
.ant-dropdown-menu {
  background: url(~@assets/img/station_active.png) no-repeat;
  background-size: 100% 100%;
  border-top: 1px solid #69a1cb;
  border-bottom: 1px solid #69a1cb;
  padding: 0 !important;
  background-color: rgba(18, 61, 132, 0.3) !important;
  overflow: hidden;
}
</style>
