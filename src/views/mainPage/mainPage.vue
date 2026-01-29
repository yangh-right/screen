<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="iframeBox">
        <mapCmp ref="leafletMap" v-if="showMap" :currentMapCenter="mapCenter" :currentMapZoom="11"/>
      </div>
    </div>
    <div class="mask">
      <div class="point-card" v-if="showContent">
        <div v-for="(item, i) in pointsArr" :key="i" class="point-item">
          <img :src="item.imgUrl" :alt="item.label" />
          <div class="info">
            <div class="name">{{ item.label }}</div>
            <div class="value">
              {{ item.value }} <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="['side-ico', showStage ? 'side-down' : 'side-up']"
      @click="showStage = !showStage"
      v-if="showContent"
    ></div>
    <div class="left-side-wrap" v-if="showContent">
      <left-panel :showStage="showStage" ref="left" />
    </div>
    <div class="right-side-wrap" v-if="showContent">
      <right-panel-new :showStage="showStage" ref="right" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LeftPanel from './model/leftPanel.vue';
import RightPanelNew from './model/rightPanelNew.vue';
import mapCmp from '@/views/mapBox/index.vue';
import { overviewIndex, getSysParamByCode } from '@/api/mainPage';

export default {
  name: 'main-page',
  components: {
    'left-panel': LeftPanel,
    'right-panel-new': RightPanelNew,
    mapCmp
  },
  data() {
    return {
      showStage: false,
      showMap: false,
      showContent: false,
      MapKey: '',
      mapCenter: [120.096682, 28.976899],
      pointsArr: [
        {
          imgUrl: require('@/assets/img/hz/t-water.png'),
          label: '处理规模',
          key: 'processingScale',
          value: 0,
          unit: '万吨/天'
        },
        {
          imgUrl: require('@/assets/img/hz/t-people.png'),
          label: '服务人口',
          key: 'servicePopulation',
          value: 0,
          unit: '万人'
        },
        {
          imgUrl: require('@/assets/img/hz/t-map.png'),
          label: '服务面积',
          key: 'serviceArea',
          value: 0,
          unit: 'k㎡ '
        },
        {
          imgUrl: require('@/assets/img/hz/t-online.png'),
          label: '当班人数',
          key: 'numberOnDuty',
          value: 0,
          unit: '人'
        },
        {
          imgUrl: require('@/assets/img/hz/t-set.png'),
          label: '出厂合格率',
          key: 'outgoingQualificationRate',
          value: 0,
          unit: '%'
        }
      ],
      deviceList: [
        {
          name: '厌氧池',
          value: 1.48,
          top: 20,
          left: 20
        }
      ]
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showStage = true;
    });
  },
  async created() {
    // 优先加载地图
    this.showMap = true;

    // 延迟加载其他内容
    await this.$nextTick();
    // 等待地图加载完成后再显示其他内容
    setTimeout(() => {
      this.showContent = true;
      // 内容显示后再显示面板
      setTimeout(() => {
        this.showStage = true;
      }, 500);
    }, 1000);
  },
  methods: {
    getMapKey() {
      getSysParamByCode('map_ak').then(res => {
        if (res.resultData) {
          this.MapKey = res.resultData;
        } else {
          this.MapKey = 'von6gavZwV5cKgkppBVYjSkIWad9BwA2';
        }
      });
    },
    async initData() {
      try {
        const { status, resultData } = await overviewIndex(this.waterPlantId);
        if (status === 'complete') {
          this.pointsArr.forEach(item => {
            item.value = resultData[item.key];
          });
        }
      } catch (error) {
        console.error('初始化数据失败:', error);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.showStage = false;
    this.showContent = false;
    setTimeout(() => {
      next();
    }, 800);
  }
};
</script>

<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  position: relative;

  .side-ico {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 8%;
    right: 21px;
    z-index: 1000;
    cursor: pointer;
  }
  .side-down {
    background: url(~@assets/img/slide_down.png) no-repeat;
    background-size: 100% 100%;
  }
  .side-up {
    background: url(~@assets/img/slide_up.png) no-repeat;
    background-size: 100% 100%;
  }

  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    background-image: radial-gradient(rgba(128, 174, 255, 0) 0, rgba(1, 9, 23, 0.6) 65%, rgba(1, 9, 23, 0.57) 100%);

    .point-card {
      width: 880px;
      height: 166px;
      position: absolute;
      top: 8%;
      left: 50%;
      margin-left: -440px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .point-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 12px;

        &:last-child {
          margin-right: 0px;
        }
        .info {
          .name {
            font-family: PingFangSC, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #d9f7ff;
            letter-spacing: 0;
            text-shadow: 0 1px 4px #11a7ff42;
          }
          .value {
            font-family: YouSheBiaoTiHei, sans-serif;
            font-size: 24px;
            letter-spacing: 0;
            text-shadow: 0 2px 4px #339cff96;
            background-image: linear-gradient(to bottom, #fafdff, #77c3fb);
            -webkit-background-clip: text;
            color: transparent;
          }
          .unit {
            font-family: MicrosoftYaHei, sans-serif;
            font-size: 12px;
            color: #d9f7ff;
            letter-spacing: 0;
            text-shadow: 0 1px 4px #1e597c47;
          }
        }
      }
    }
  }

  // 中间组态
  .center-side-wrap {
    position: fixed;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
    bottom: 0;
    right: 0;
    top: 0;

    .iframeBox,
    .iframeBox > iframe {
      width: 100%;
      height: 100%;
    }
    .iframeBox {
      background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
      background-size: 100% 100%;
    }
    .bg-iframe {
      width: 70%;
      height: 60%;
      margin-top: 15%;
      margin-left: 13%;
      position: relative;
      background: url('~@/assets/img/hz/bg-iframe.png') no-repeat;
      background-size: 100% 100%;

      .device-box {
        width: 129px;
        height: 72px;
        background: url('~@/assets/img/hz/p-popup.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }

  // 组态右侧
  .right-side-wrap {
    z-index: 999;
    position: absolute;
    width: 476px;
    height: calc(100% - 132px);
    top: 0%;
    right: -16px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
  // 组态右侧
  .left-side-wrap {
    z-index: 999;
    position: fixed;
    width: 476px;
    height: calc(100% - 132px);
    top: 8%;
    left: 16px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
}
</style>
