<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-01-03 15:58:55
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-01-14 11:34:32
-->
<!--
 * @Author: duyibo
 * @Date: 2023-12-05 16:01:13
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-17 16:21:03
 * @Description:
-->
<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="iframeBox">
        <div class="arm"></div>
      </div>
    </div>
    <div class="left-side-wrap">
      <slide-panel :showStage="showStage" :parameter="parameter" :waterPlantId="waterPlantId" ref="left" />
    </div>
    <div class="right-side-wrap">
      <think-panel :showStage="showStage" :parameter="parameter" :waterPlantId="waterPlantId" ref="right" />
    </div>
    <div class="mainDeviceModal mainDeviceOnline" v-if="visible">
      <unit-card cardTitle="回放" :showTime="false" :showCloseBtn="true" @close="closeModal">
        <video-back :waterPlantId="waterPlantId" :queryTime="queryTime"></video-back>
      </unit-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
import storage from '@/common/js/tool/storage';
import SlidePanel from './model/SlidePanel.vue';
import ThinkPanel from './model/ThinkPanel.vue';
import VideoBack from './components/videoBack.vue';
import { getSvgListByCondition } from '@/api/mainPage';
import { heatmapData, heatmapData1 } from './components/data.js';
export default {
  name: 'pumpHousePage',
  components: {
    SlidePanel,
    ThinkPanel,
    VideoBack,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  provide: function () {
    return {
      openVideoModal: this.openVideoModal
    };
  },
  data() {
    return {
      showStage: false,
      svgPreviewUrl: undefined,
      heatmapData,
      heatmapData1,
      pointsResult: [
        {
          pointName: '出水TN',
          pointTime: '3',
          pointStatus: '趋势平稳',
          pointType: 1
        },
        {
          pointName: '出水氨氮',
          pointTime: '2',
          pointStatus: '有超厂标风险',
          pointType: 2
        },
        {
          pointName: '出水TP',
          pointTime: '3',
          pointStatus: '趋势平稳',
          pointType: 1
        },
        {
          pointName: '出水氨氮',
          pointTime: '2',
          pointStatus: '有超厂标风险',
          pointType: 2
        }
      ],
      pointsArr: [
        {
          pointName: '预测2小时后水质',
          inWater: '实时进水',
          outWater: '实时出水',
          pointUnit: ''
        },
        {
          pointName: '水量m3/h',
          inWater: '4427.62',
          outWater: '4427.62',
          pointUnit: 'm3/h'
        },
        {
          pointName: 'CODmg/L',
          inWater: '10.5',
          outWater: '10.5',
          pointUnit: 'mg/L'
        },
        {
          pointName: '氨氮mg/L',
          inWater: '26.17',
          outWater: '26.17',
          pointUnit: 'mg/L'
        },
        {
          pointName: 'TNmg/L',
          inWater: '66.79',
          outWater: '66.79',
          pointUnit: 'mg/L'
        },
        {
          pointName: 'TPmg/L',
          inWater: '45.66',
          outWater: '45.66',
          pointUnit: 'mg/L'
        },
        {
          pointName: 'SSmg/L',
          inWater: '57.43',
          outWater: '57.43',
          pointUnit: 'mg/L'
        }
      ],
      deviceList: [
        {
          name: '厌氧池',
          value: 1.48,
          top: 20,
          left: 20
        }
      ],
      visible: false,
      queryTime: []
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId']),
    parameter() {
      return {
        waterPlantId: this.waterPlantId,
        dateType: 'MONTH',
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        startTime: moment().startOf('month').format('YYYY-MM-DD')
      };
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
    openVideoModal(data) {
      this.visible = true;
      this.queryTime = [
        moment(data).subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        moment(data).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      ];
    },
    closeModal() {
      this.visible = false;
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

    .result-card {
      width: 914px;
      height: 92px;
      position: absolute;
      top: 10%;
      left: 50%;
      margin-left: -457px;
      background: url('~@/assets/img/hz/result-bg.png') no-repeat;
      background-size: 100% 100%;
      padding: 8px 90px 8px 120px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .result-name {
        width: 110px;
        font-family: PingFangSC, sans-serif;
        font-weight: 500;
        font-size: 21px;
        color: #ffffff;
        letter-spacing: 0.26px;
        text-align: center;
      }
      .point-box {
        width: calc(100% - 130px);
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;

        .point-info {
          width: calc(50% - 10px);
          display: flex;
          justify-content: flex-start;
          .point-name {
            color: #fdc207;
            font-size: 16px;
            font-family: PingFangSC, sans-serif;
            font-weight: 400;
            line-height: 20px;
            letter-spacing: 0.2px;
            text-align: right;
            margin-right: 4px;
          }
          .point-time {
            color: #ffffff;
            font-size: 16px;
            font-family: PingFangSC, sans-serif;
            font-weight: 400;
            line-height: 20px;
            letter-spacing: 0.2px;
            text-align: right;
            margin-right: 10px;

            span {
              color: #fdc207;
              font-size: 16px;
              font-family: PingFangSC, sans-serif;
              font-weight: 400;
              line-height: 20px;
              letter-spacing: 0.2px;
            }
          }
          .point-status {
            font-family: PingFangSC, sans-serif;
            font-weight: 500;
            font-size: 16px;
            letter-spacing: 0.2px;
            text-align: center;
          }
          .status1 {
            color: #00ce65;
          }
          .status2 {
            color: #ff7272;
          }
        }
      }
    }
    .point-card {
      width: 906px;
      height: 133px;
      position: absolute;
      top: 19%;
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
    // position: fixed;
    // left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
    // bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    // align-content: end;
    // align-items: end;
    top: 0px;
    background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
    background-size: 100% 100%;

    position: relative;
    .thermodynamic {
      position: absolute;
      top: 110px;
      width: 944px;
      height: 630px;
      z-index: 10;
    }
    .iframeBox > iframe {
      width: 100%;
      height: 100%;
    }
    .iframeBox {
      background: url('~@/assets/img/mechanical_bg.png') bottom no-repeat;
      background-size: 100% 90%;

      width: 43%;
      height: 100%;
      .arm {
        background: url('~@/assets/img/mechanical_arm.gif') no-repeat;
        background-size: 87% 74%;
        background-position: 134px 132px;
        width: 100%;
        height: 100%;
      }
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

  .technological-process {
    width: 914px;
    height: 300px;
    position: absolute;
    bottom: 4%;
    left: 50%;
    margin-left: -457px;
    padding: 0 12px;
    box-sizing: border-box;
    z-index: 999;
    background: rgba(71, 116, 203, 0.2);
  }
  .mainDeviceModal {
    position: absolute;
    top: 15%;
    transform: translateX(-50%);
    left: 50%;
    width: 3500px;
    height: 2000px;
    z-index: 1000;
    box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.5);
    background: #03172738;

    background-image: linear-gradient(90deg, rgba(8, 20, 45, 0.7) 0%, rgba(1, 11, 33, 0.82) 100%);
    .main-device-box {
      padding: 0 10px;
      width: 100%;
      height: calc(100% - 100px);

      .video-con {
        height: 100%;
        width: 100%;
      }
    }
    .title {
      align-items: center;
      padding: 0 30px 0 112.5px;
      height: 100px !important;
      display: flex;
      background-size: 100% 100%;
      justify-content: space-between;
      .text {
        line-height: normal;
        color: transparent;
        -webkit-background-clip: text;
        background-image: linear-gradient(0deg, #5cacff, #ffffff 70%, #ffffff);
        font-family: YouSheBiaoTiHei, sans-serif;
        font-weight: 600;
        font-size: 58px;
        /deep/ .area-select {
        }
        /deep/.ant-radio-wrapper {
          font-size: 40px;
          color: transparent;
          -webkit-background-clip: text;
          background-image: linear-gradient(0deg, #5cacff, #ffffff 70%, #ffffff);
          font-family: YouSheBiaoTiHei, sans-serif;
          .ant-radio-inner {
            width: 40px;
            height: 40px;
          }
          .ant-radio-inner::after {
            top: 6px;
            left: 6px;
            border-radius: 26px;
            width: 26px;
            height: 26px;
          }
        }
      }
      /deep/ .area-select {
        width: 278px;
        transform: scale(1.3);
        transform-origin: left bottom;
        height: 40px;
        position: relative;
        top: -13px;
        .ant-select-selection--multiple {
          background: #00295294;
          height: 42px;
          box-shadow: inset 0 0 14px 3px #47a3ff80;
        }
        .ant-select-selection--multiple .ant-select-selection__choice {
          background: #2d97e4;
          color: #d9ecff;
          font-size: 28px;
          height: 30px;
          line-height: 28px;
          padding-right: 32px;
        }
        .ant-select-selection__choice__remove {
          line-height: 0;
          font-size: 28px;
        }
        .ant-select-selection--multiple .ant-select-selection__choice__remove {
          font-size: 28px;
          color: #d9ecff;
        }
        .ant-select-search__field__placeholder {
          height: 30px;
          font-size: 24px;
        }
      }
    }
  }
  .mainDeviceOnline {
    position: absolute;
    top: 20%;
    left: 50%;
    width: 750px;
    height: 600px;
  }
}
</style>
