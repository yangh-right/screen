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
          <div class="point-filed">{{ item.pointNumber }}</div>
        </div>
      </div>
    </div>
    <div class="left-side-wrap">
      <slide-panel :showStage="showStage" ref="left" />
    </div>
    <div class="right-side-wrap">
      <think-panel :showStage="showStage" ref="right" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import storage from '@/common/js/tool/storage';
import SlidePanel from './model/SlidePanel.vue';
import ThinkPanel from './model/ThinkPanel.vue';
import { getSvgListByCondition } from '@/api/mainPage';
import { statusStatistics } from '@/api/deviceManager';
import moment from 'moment';

export default {
  name: 'pumpHousePage',
  components: {
    SlidePanel,
    ThinkPanel
  },
  data() {
    return {
      showStage: false,
      svgPreviewUrl: undefined,
      pointsArr: [
        {
          pointName: '设备状态',
          pointNumber: '设备个数',
          pointUnit: ''
        },
        {
          pointName: '在线',
          code: 'online',
          pointNumber: 0
        },
        {
          pointName: '离线',
          code: 'offline',
          pointNumber: 0
        },
        {
          pointName: '正常',
          code: 'normal',
          pointNumber: 0
        },
        {
          pointName: '故障',
          code: 'breakdown',
          pointNumber: 0
        },
        {
          pointName: '停机',
          code: 'shutDown',
          pointNumber: 0
        },
        {
          pointName: '维修',
          code: 'repair',
          pointNumber: 0
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
    },
    async initData() {
      let data = {
        queryType: 'month',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        waterPlantId: this.waterPlantId
      };
      const { status, resultData } = await statusStatistics(data);
      if (status === 'complete') {
        this.pointsArr.forEach(item => {
          item.code ? (item.pointNumber = `${resultData[item.code]}台`) : (item.pointNumber = '设备个数');
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
      width: 906px;
      height: 93.3px;
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

  .technological-process {
    width: 914px;
    height: 236px;
    position: absolute;
    bottom: 4%;
    left: 50%;
    margin-left: -457px;
    padding: 0 12px;
    box-sizing: border-box;
    z-index: 999;
  }
}
</style>
