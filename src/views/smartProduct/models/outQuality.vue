<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description:
-->
<template>
  <unit-card cardTitle="出水水质">
    <div class="card-inner">
      <radio-button @change="pointChange" :options="tabs" v-model="tabValue" />
      <div class="chart">
        <line-chart :options="option" ref="inChart" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { queryPointHistoryData } from '@/api/energyAnalyse';
import lineChart from '@/components/chart/Chart.vue';
import { getOutQualityOption as getOption } from './data';
export default {
  name: 'outQuality',
  components: {
    lineChart,
    RadioButton: () => import('@/components/RadioButton.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curPoint: {},
      tabs: [],
      tabValue: '',
      option: getOption({ empty: true })
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  mounted() { },
  methods: {
    pointChange() {
      this.curPoint = this.tabValue ? this.tabs.find(item => item.value === this.tabValue) || {} : {};
      this.handleChart();
    },
    async initData() {
      const params = {
        configCode: 'bio_reactor_main_pipe_precise_aeration',
        timePeriod: 'HOURS',
        endDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        startDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD 08:00:00'),
        waterPlantId: this.waterPlantId
      };
      const { resultData, status } = await queryPointHistoryData(params);
      if (status === 'complete') {
        this.tabs = resultData || [];
        this.tabs.forEach((item, index) => {
          item.value = item.pointName;
          item.label = item.pointMemo;
        });
        this.curPoint = resultData?.[0] || {};
        this.tabValue = this.tabs?.[0]?.value || '';
        this.handleChart();
      }
    },
    async handleChart() {
      let { unit, dataAndTimeList = [], cb, pointMemo } = this.curPoint;
      let xData = dataAndTimeList?.map(item => item.date?.slice(11, 16)) || [];
      let isEmpty = !xData.length;
      if (isEmpty) {
        this.option = getOption({ empty: true });
        return;
      }
      cb = cb ? Number(cb) : undefined;
      let yData = dataAndTimeList?.map(val => val.pv) || [];
      let dataMax = Math.max(...yData.filter(item => item != undefined));
      let option = getOption({
        xData,
        cb,
        yMax: cb > dataMax ? cb : undefined,
        yAxisName: unit || 'mg/L'
      });
      option.series[0].data = yData;
      option.series[0].name = pointMemo || '';
      this.option = option;
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 10px 0px 0;
  display: flex;
  flex-direction: column;

  .chart {
    flex: 1;
    overflow: hidden;
  }
}
</style>
