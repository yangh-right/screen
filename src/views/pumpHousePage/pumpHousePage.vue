<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="iframeBox">
        <iframe v-if="svgPreviewUrl" :src="svgPreviewUrl" title=""></iframe>
      </div>
    </div>
    <div class="mask">
      <div class="result-card">
        <div class="result-name">判断结论：</div>
        <div class="point-box">
          <div v-for="item in pointsResult" :key="item.pointName" class="point-info">
            <div class="point-name">{{ item.pointName }}</div>
            <div class="point-time">
              未来 <span>{{ item.pointTime }}</span> 小时
            </div>
            <div :class="['point-status', 'status' + item.pointType]">{{ item.pointStatus }}</div>
          </div>
        </div>
      </div>
      <div class="point-card">
        <div v-for="(item, i) in pointsArr" :key="i" class="point-item">
          <div class="point-name">{{ item.pointName }}</div>
          <div class="point-filed">{{ item.inWater }}</div>
          <div class="point-filed">{{ item.outWater }}</div>
        </div>
      </div>
    </div>
    <div class="left-side-wrap">
      <slide-panel :showStage="showStage" ref="left" />
    </div>
    <div class="right-side-wrap">
      <think-panel :showStage="showStage" ref="right" />
    </div>
    <!-- 沿程分析 -->
    <div class="technological-process">
      <technological-process title="沿程水质数据" :waterPlantId="waterPlantId"></technological-process>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import storage from '@/common/js/tool/storage';
import SlidePanel from './model/SlidePanel.vue';
import ThinkPanel from './model/ThinkPanel.vue';
import TechnologicalProcess from './components/TechnologicalProcess.vue';
import { getSvgListByCondition } from '@/api/mainPage';
import { predictionConclusion, middleRealData } from '@/api/pumpHousePage.js';

export default {
  name: 'pumpHousePage',
  components: {
    SlidePanel,
    ThinkPanel,
    TechnologicalProcess
  },
  data() {
    return {
      showStage: false,
      svgPreviewUrl: undefined,
      pointsResult: [],
      pointsArr: [
        {
          pointName: '实时水质数据',
          inWater: '进水',
          outWater: '出水',
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
          this.getConclusion();
          this.getRealData();
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
          if (item.type === 'other') {
            this.svgPreviewUrl = item.previewUrl + `&token=${token}&parent=${window.origin}`;
          }
        });
      }
    },
    //获取判断结论数据
    async getConclusion() {
      const { status, resultData } = await predictionConclusion({ waterPlantId: this.waterPlantId });
      if (status === 'complete') {
        // 解析异常结论
        if (resultData.abnormalConclusion) {
          let abnormalLines = resultData.abnormalConclusion.trim().split('\n');
          abnormalLines.forEach(line => {
            let keyword = '未来';
            let pointName = line.substring(0, line.indexOf(keyword));
            let regex = /(\d+)小时/;
            let matches = line.match(regex);
            let pointTime = matches[1];
            this.pointsResult.push({
              pointName: pointName,
              pointTime: pointTime,
              pointStatus: '有厂超标风险',
              pointType: 2
            });
          });
        }
        // 解析正常结论
        if (resultData.normalConclusion) {
          this.pointsResult.push({
            pointName: resultData.normalConclusion.slice(0, 4),
            pointTime: '24',
            pointStatus: '趋势平稳',
            pointType: 1
          });
        }
      }
    },
    //获取实时水质数据
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
          if (item.pointName === '实时水质数据') return;
          item.inWater = arr[0][item.pointName] || arr[0][item.pointName] == '0' ? arr[0][item.pointName] : '--';
          item.outWater = arr[1][item.pointName] || arr[1][item.pointName] == '0' ? arr[1][item.pointName] : '--';
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
            display: flex;
            align-items: center;
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
            display: flex;
            align-items: center;

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
