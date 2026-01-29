<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:36:03
 * @Description:
-->
<template>
  <unit-card :cardTitle="title">
    <div class="content-spin">
      <div class="echart-block">
        <div id="alarm_finish"></div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';
import { nearLyThirtyDaysTicketTrend } from '@/api/sludgeProperty.js';
import { genChart, mutiLineOption } from '../model/chart';
export default {
  name: 'OrderFinish',
  components: {
    UnitCard
  },
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
    return {
      cardTitle: '近30日每日办结工单趋势'
    };
  },
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { status, resultData } = await nearLyThirtyDaysTicketTrend();
      if (status === 'complete') {
        this.handleChart(resultData);
      }
    },
    handleChart(pointData) {
      let data = [
        { name: '创建工单数', data: [] },
        { name: '办结工单数', data: [] }
      ];
      let xData = [];
      xData = pointData.xAxis;
      pointData.handleData?.forEach(item => {
        if (item.dataTag === 'create') data[0].data = item.yAxis;
        if (item.dataTag === 'done') data[1].data = item.yAxis;
      });
      let opt = mutiLineOption(null, data, xData);
      genChart('alarm_finish', opt, false);
    }
  }
};
</script>

<style lang="less" scoped>
.content-spin {
  width: 100%;
  padding: 8px;
  height: 100%;
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

    #alarm_finish {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
