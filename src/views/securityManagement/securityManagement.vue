<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="iframeBox">
        <iframe :src="svgPreviewUrl" title="" v-if="svgPreviewUrl"></iframe>
      </div>
    </div>
    <div class="mask">
      <div class="point-card">
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
    <div class="left-side-wrap">
      <left-panel :showStage="showStage" ref="left" />
    </div>
    <div class="right-side-wrap">
      <right-panel :showStage="showStage" ref="right" />
    </div>
  </div>
</template>

<script>
import storage from '@/common/js/tool/storage';
import LeftPanel from './model/leftPanel.vue';
import RightPanel from './model/rightPanel.vue';
import { getSvgListByCondition } from '@/api/mainPage';

export default {
  name: 'main-page',
  components: {
    'left-panel': LeftPanel,
    'right-panel': RightPanel
  },
  data() {
    return {
      showStage: false,
      svgPreviewUrl: undefined,
      pointsArr: [
        {
          imgUrl: require('@/assets/img/hz/menu-bg-icon6.png'),
          label: '安全运行天数',
          value: '365',
          unit: ''
        },
        {
          imgUrl: require('@/assets/img/hz/menu-bg-icon5.png'),
          label: '安全事故发生率',
          value: '0',
          unit: ''
        },
        {
          imgUrl: require('@/assets/img/hz/menu-bg-icon4.png'),
          label: '安全大检查次数',
          value: '3',
          unit: '次 '
        },
        {
          imgUrl: require('@/assets/img/hz/menu-bg-icon3.png'),
          label: '违章、违纪次数',
          value: '0',
          unit: '次'
        },
        {
          imgUrl: require('@/assets/img/hz/menu-bg-icon2.png'),
          label: '巡视工作完成率',
          value: '100',
          unit: '%'
        },
        {
          imgUrl: require('@/assets/img/hz/menu-bg-icon1.png'),
          label: '安全工作计划完成率',
          value: '100',
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showStage = true;
    });
  },
  created() {
    this.getUrlMap();
  },
  methods: {
    async getUrlMap() {
      let { resultData, status } = await getSvgListByCondition({ currentPage: 1, pageSize: 99 });
      if (status === 'complete') {
        let user = JSON.parse(storage.get('user_info'));
        let token = user.accessToken.replace('Bearer ', '');
        resultData.forEach(item => {
          if (item.type === 'aerial_view') {
            this.svgPreviewUrl = item.previewUrl + `&token=${token}&parent=${window.origin}`;
          }
        });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.showStage = false;
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
      width: 900px;
      height: 166px;
      margin-top: 20px;
      position: absolute;
      top: 8%;
      left: 50%;
      margin-left: -440px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .point-item {
        display: flex;
        height: 155px;
        padding-top: 15px;
        width: 165px;
        align-items: center;
        margin-right: 12px;
        flex-direction: column;
        background-image: url('~@/assets/img/hz/menu-bg-icon0.png');

        &:last-child {
          margin-right: 0px;
        }
        .info {
          text-align: center;
          .name {
            font-family: PingFangSC, sans-serif;
            font-weight: 400;
            margin-top: 5px;
            font-size: 14px;
            color: #d9f7ff;
            letter-spacing: 0;
            text-shadow: 0 1px 4px #11a7ff42;
          }
          .value {
            font-family: YouSheBiaoTiHei, sans-serif;
            font-size: 28px;
            letter-spacing: 0;
            text-shadow: 0 2px 4px #339cff96;
            background-image: linear-gradient(to bottom, #fafdff, #77c3fb);
            -webkit-background-clip: text;
            color: transparent;
          }
          .unit {
            font-family: MicrosoftYaHei, sans-serif;
            font-size: 24px;
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
    background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    .iframeBox > iframe {
      width: 100%;
      height: 100%;
    }
    .iframeBox {
      padding-top: 200px;
      width: 52%;
      height: 100%;
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
