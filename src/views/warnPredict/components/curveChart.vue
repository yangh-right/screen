<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2025-02-14 10:44:57
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}曲线</div>
    </div>
    <div class="point-btns">
      <a-select
        ref="structureSelect"
        placeholder="请选择"
        @change="selectPoint"
        mode="multiple"
        :maxTagTextLength="4"
        :maxTagCount="2"
        v-model="curPoints"
        class="select__block"
        dropdownClassName="select__list"
      >
        <a-select-option :value="item.name" v-for="item in pointList" :key="item.name">{{ item.name }}</a-select-option>
      </a-select>
    </div>
    <div class="content-spin">
      <div class="echart-block">
        <div :id="curveId" class="curve"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getModelHistoryData, getPointStandardList } from '@/api/warnPredict';
import { genChart, mutiLineOption } from '../model/chart';
import moment from 'moment';
const warnLines = [
  { name: '过程段内控线', type: 3 },
  { name: '出水内控线', type: 3 }
];
export default {
  name: 'OutWaterQuality',
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    alarmInfo: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    curveId() {
      return `${this.title}_curve`;
    }
  },
  data() {
    return {
      isSelectHover: false,
      date: [moment().startOf('day'), moment()],
      curPoints: [],
      pointList: [],
      xData: []
    };
  },
  watch: {
    alarmInfo: {
      handler(val) {
        this.date = [moment(val.startTime).subtract(12, 'hours'), moment(val.startTime).add(12, 'hours')];
        this.getData();
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    async getData() {
      if (this.alarmInfo.pumpHouseId && this.alarmInfo.expertDecisionType) {
        // 获取设备id
        const devicePointsMap = {};
        let conditionExpressionValue = this.alarmInfo.expertProcessControl?.conditionExpressionValue;
        conditionExpressionValue = conditionExpressionValue ? JSON.parse(conditionExpressionValue) : {};
        Object.keys(conditionExpressionValue).forEach(key => {
          if (key.includes('_p') && conditionExpressionValue[key].includes('_')) {
            let data = conditionExpressionValue[key].split('_');
            if (!devicePointsMap[data[0]]) {
              devicePointsMap[data[0]] = [];
            }
            devicePointsMap[data[0]].push(data[1]);
          }
        });
        let deviceIds = Object.keys(devicePointsMap);

        let params1 = {
          waterPlantId: this.alarmInfo.pumpHouseId,
          queryType: 'day',
          pointName: this.title,
          startTime: this.date?.[0].format('YYYY-MM-DD HH:mm:ss') || '',
          endTime: this.date?.[1].format('YYYY-MM-DD HH:mm:ss') || ''
        };
        let params2 = {
          waterPlantId: this.alarmInfo.pumpHouseId,
          pointName: this.title,
          typeList: [3, 4]
        };
        let res = await Promise.allSettled([getModelHistoryData(params1), getPointStandardList(params2)]);

        this.getStructureData(res[0].value || {}, deviceIds);
        this.getPointLine(res[1].value || {});

        let newPoints = this.pointList.filter(item => this.curPoints.includes(item.name));
        let avDevices = this.pointList?.filter(item => deviceIds.includes(item.deviceId));
        this.curPoints = newPoints.length
          ? newPoints.map(item => item.name)
          : avDevices.length
          ? [avDevices?.[0]?.name]
          : [];
        // 默认选中内控线设备
        warnLines.forEach(item => {
          if (!this.curPoints.includes(item.name)) {
            this.curPoints.push(item.name);
          }
        });
        this.selectPoint();
      }
    },
    async getStructureData(res, deviceIds) {
      const { resultData, status } = res;
      if (status === 'complete') {
        this.pointList = [];
        let avDevices = resultData?.filter(item => deviceIds.includes(item.deviceId));
        let chartItem = avDevices.length ? avDevices[0] : resultData?.[0] || {};
        this.xData = chartItem?.dataAndTimeList?.map(item => item.date) || [];
        resultData?.forEach(item => {
          this.pointList.push({
            name: item.deviceName,
            deviceId: item.deviceId,
            type: 'line',
            unit: chartItem?.unit,
            legend: { icon: 'rect', name: item.deviceName },
            smooth: true,
            data: item.dataAndTimeList?.map(item => item.pv)
          });
        });
      }
    },
    async getPointLine(res) {
      const { resultData, status } = res;
      if (status === 'complete') {
        warnLines.forEach((item, index) => {
          this.pointList.push({
            name: item.name,
            lineStyle: {
              type: 'dashed'
            },
            deviceId: '',
            legend: {
              icon: 'path://M234.666667 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2zM473.6 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2zM934.4 490.666667h-136.533333a25.6 25.6 0 1 0 0 51.2h136.533333a25.6 25.6 0 1 0 0-51.2zM712.533333 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2z',
              name: item.name
            },
            type: 'line',
            smooth: true,
            data: this.xData.map(xData => resultData?.[index]?.warnMax || null)
          });
        });
      }
    },
    selectPoint() {
      this.handleChart();
    },
    handleChart() {
      let pointData = this.pointList.filter(item => this.curPoints.includes(item.name));
      let unit = null;
      let data = [];
      pointData.forEach((item, i) => {
        data.push(item);
        if (i === 0) {
          unit = item.unit;
        }
      });
      let opt = mutiLineOption(unit, data, this.xData);
      genChart(this.curveId, opt, false);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .select__block {
  width: 100% !important;
  height: 28px;
  .ant-select-selection {
    background-color: transparent !important;
    border: 1px solid #40a9ff !important;
  }
  .ant-select-selection__choice {
    color: #d8f7ff !important;
    background-color: #013d71;
    border: 1px solid #013d91 !important;
  }
  .ant-select-selection__choice__remove {
    color: #d8f7ff !important;
  }
  .ant-select-selection__placeholder {
    font-size: 16px;
    line-height: 26px;
    color: #d8f7ff !important;
  }
}
.point-btns {
  padding: 4px 12px 0 22px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.content {
  width: 100%;
  height: 50% !important;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
    height: 24px;
    background: url('~@/assets/img/hz/predict-stitle.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .content-spin {
    width: 100%;
    padding: 8px;
    height: calc(100% - 50px);
    position: relative;

    .chart-btns {
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .point-btn {
        width: calc(25% - 6px);
        height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .echart-block {
      width: 100%;
      height: 100%;

      .curve {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
