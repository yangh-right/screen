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
          <img class="icon" :src="item.imgUrl" :alt="item.label" />
          <div class="info">
            <div class="name">{{ item.label }}</div>
            <div class="value">
              {{ item.value }} <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-wrap">
      <device-fault-order title="物资统计" :class="[showStage ? 'three' : 'threeOut', 'inwater-module']" />
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
import DeviceFaultOrder from './components/DeviceFaultOrder.vue';
import LeftPanel from './model/leftPanel.vue';
import RightPanel from './model/rightPanel.vue';
import { getSvgListByCondition, getCountAnalysis } from '@/api/mainPage';

export default {
  name: 'materialManage',
  components: {
    DeviceFaultOrder,
    'left-panel': LeftPanel,
    'right-panel': RightPanel
  },
  data() {
    return {
      showStage: false,
      svgPreviewUrl: undefined,
      pointsArr: [
        {
          imgUrl: require('@/assets/img/materialManage/in_depot.png'),
          label: '入库单量',
          value: '0'
        },
        {
          imgUrl: require('@/assets/img/materialManage/out_depot.png'),
          label: '出库单量',
          value: '0'
        },
        {
          imgUrl: require('@/assets/img/materialManage/plan.png'),
          label: '需求计划',
          value: '0'
        },
        {
          imgUrl: require('@/assets/img/materialManage/in_depot_del.png'),
          label: '入库作废',
          value: '0'
        },
        {
          imgUrl: require('@/assets/img/materialManage/out_depot_del.png'),
          label: '出库作废',
          value: '0'
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
    this.initData();
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
    },
    async initData() {
      const { status, resultData } = await getCountAnalysis();
      if (status === 'complete') {
        let inCountY = resultData?.depotInMainCountDataList.find(v => v.status === '已入库').count || 0;
        let inCountN = resultData?.depotInMainCountDataList.find(v => v.status === '已作废').count || 0;
        let needCount = resultData?.depotOutMainCountDataList.find(v => v.status === '审核中').count || 0;
        let outCountY = resultData?.depotOutMainCountDataList.find(v => v.status === '已出库').count || 0;
        let outCountN = resultData?.depotOutMainCountDataList.find(v => v.status === '已作废').count || 0;
        this.pointsArr = [
          {
            imgUrl: require('@/assets/img/materialManage/in_depot.png'),
            label: '入库单量',
            value: inCountY
          },
          {
            imgUrl: require('@/assets/img/materialManage/out_depot.png'),
            label: '出库单量',
            value: outCountY
          },
          {
            imgUrl: require('@/assets/img/materialManage/plan.png'),
            label: '需求计划',
            value: needCount
          },
          {
            imgUrl: require('@/assets/img/materialManage/in_depot_del.png'),
            label: '入库作废',
            value: inCountN
          },
          {
            imgUrl: require('@/assets/img/materialManage/out_depot_del.png'),
            label: '出库作废',
            value: outCountN
          }
        ];
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
  .bottom-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 48px;
    width: calc(100% - 1000px);
    height: 260px;
    z-index: 999;
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
        .icon {
          width: 64px;
        }
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
            background-image: linear-gradient(to bottom, #fafdff, #c6dff1);
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
    background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    .iframeBox > iframe {
      width: 100%;
      height: 100%;
    }
    .iframeBox {
      padding-top: 80px;
      width: 52%;
      height: 930px;
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
