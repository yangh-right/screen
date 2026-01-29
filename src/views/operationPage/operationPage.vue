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
          <div class="point-name">{{ item.pointName }}</div>
          <div class="point-filed">{{ item.inWater }}</div>
          <div class="point-filed">{{ item.outWater }}</div>
        </div>
      </div>
    </div>
    <div class="maskDown">
      <div class="point-card">
        <div v-for="(item, i) in productArr" :key="i" class="point-item">
          <div class="point-name">{{ item.pointName + item.pointUnit }}</div>
          <div class="point-filed">{{ item.realPv || '--' }}</div>
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
import { mapState } from 'vuex';
import storage from '@/common/js/tool/storage';
import LeftPanel from './model/leftPanel.vue';
import RightPanel from './model/rightPanel.vue';
import { getSvgListByCondition } from '@/api/mainPage';
import { middleRealData } from '@/api/pumpHousePage.js';
import { productionPerformanceIndex } from '@/api/operationPage.js';

export default {
  name: 'operationPage',
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
          pointName: '',
          inWater: '进水',
          outWater: '出水',
          pointUnit: ''
        }
      ],
      productArr: [
        {
          pointName: '',
          realPv: '实际值',
          controlValue: '厂标',
          pointUnit: ''
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
          this.getRealData();
        }
      }
    }
  },
  created() {
    this.getUrlMap();
    this.getProduction();
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
    //获取实时进出水
    async getRealData() {
      const { status, resultData } = await middleRealData(this.waterPlantId);
      if (status === 'complete') {
        let { deviceValues, pointNames } = resultData;
        pointNames.forEach(item => this.pointsArr.push({ pointName: item }));
        let arr = [];
        for (let key in deviceValues) {
          let obj = { deviceName: key };
          deviceValues[key].forEach(item => {
            obj[item.deviceName] = item.value;
          });
          arr.push(obj);
        }
        this.pointsArr.forEach(item => {
          if (item.pointName === '') return;
          item.inWater = arr[0][item.pointName] || arr[0][item.pointName] == '0' ? arr[0][item.pointName] : '--';
          item.outWater = arr[1][item.pointName] || arr[1][item.pointName] == '0' ? arr[1][item.pointName] : '--';
        });
      }
    },
    //获取指标
    async getProduction() {
      const { status, resultData } = await productionPerformanceIndex(this.waterPlantId);
      if (status === 'complete') {
        if (resultData.length === 0) {
          this.productArr = [];
          return;
        }
        resultData.forEach(item => {
          this.productArr.push({
            pointName: item.pointMemoAlias,
            realPv: item.realPv,
            controlValue: item.controlValue,
            pointUnit: '(' + item.pointUnit + ')'
          });
        });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showStage = true;
    });
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
  .point-card {
    width: 906px;
    height: 135px;
    position: absolute;
    top: 10%;
    left: 50%;
    margin-left: -453px;
    background: url('~@/assets/img/hz/point-table.png') no-repeat;
    background-size: 100% 100%;
    padding: 8px 8px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    .point-item {
      min-width: 114px;
      height: 100%;
      text-align: center;
      flex: 1 0 114px;

      .point-name {
        height: 40px;
        line-height: 36px;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #e9faff;
        text-align: center;
      }
      .point-filed {
        height: 34px;
        line-height: 34px;
        font-family: Aliba, sans-serif;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
        background: linear-gradient(to bottom, #ffffff, #9fd7ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .point-unit {
        height: 32px;
        line-height: 34px;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #e9faff;
        text-align: center;
      }
      &:first-child {
        .point-filed {
          height: 34px;
          line-height: 34px;
          font-family: Aliba, sans-serif;
          font-size: 16px;
          color: #add8e4;
          text-align: center;
        }
      }
    }
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
  }
  .maskDown {
    position: absolute;
    left: 0;
    top: 73%;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
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
      padding-top: 100px;
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
