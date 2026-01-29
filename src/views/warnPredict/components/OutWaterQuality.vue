<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-13 13:40:54
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="echart-block">
        <div id="alarm_out"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { alarmRecentTrend } from '@/api/warnPredict';
import { genChart, mutiLineOption } from '../model/chart';
import moment from 'moment';
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
    }
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { status, resultData } = await alarmRecentTrend([this.waterPlantId]);
      if (status === 'complete') {
        this.handleChart(resultData);
      }
    },
    handleChart(pointData) {
      let data = [
        { name: '报警数量', data: [] },
        { name: '报警处理数量', data: [] }
      ];
      let xData = [];
      pointData.recentDays?.forEach(item => {
        xData.push(moment(item).format('M月D日'));
      });
      data[0].data = pointData.all;
      data[1].data = pointData.deal;
      let unit = null;
      let opt = mutiLineOption(unit, data, xData);
      let a = opt.yAxis;
      opt.yAxis = [a, a];
      opt.series[1].yAxisIndex = 1;
      genChart('alarm_out', opt, false);
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
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

      #alarm_out {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
