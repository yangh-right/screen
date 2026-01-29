<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-18 09:51:21
 * @Description:
-->
<template>
  <unit-card cardTitle="进水水质预测">
    <div class="card-inner">
      <radio-button @change="pointChange" :options="tabs" v-model="tabValue" />
      <div class="chart">
        <line-chart :options="option" ref="chart1" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getInQualityOption as getOption, getXData } from './data';
import { getForecastAndHistory } from '@/api/smartProduct';

export default {
  name: 'inQuality',
  components: {
    RadioButton: () => import('@/components/RadioButton.vue'),
    LineChart: () => import('@/components/chart/Chart.vue'),
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
      option: getOption({ empty: true }),
      tabs: [],
      tabValue: ''
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
  created() {},
  mounted() {},
  methods: {
    pointChange() {
      this.curPoint = this.tabValue ? this.tabs.find(item => item.value === this.tabValue) || {} : {};
      this.handleChart();
    },
    async initData() {
      const { resultData, status } = await getForecastAndHistory(this.waterPlantId, 'inflow');
      if (status === 'complete') {
        this.tabs = resultData || [];
        this.tabs.forEach((item, index) => {
          item.value = item.pointName;
          item.label = item.pointName;
        });
        this.curPoint = resultData?.[0] || {};
        this.tabValue = this.tabs?.[0]?.value || '';
        this.handleChart();
      }
    },
    async handleChart() {
      let { unit, subChartVO = {} } = this.curPoint;
      let xData = subChartVO.xList || [];
      let isEmpty = !xData.length;
      if (isEmpty) {
        this.option = getOption({ empty: true });
        return;
      }
      let xList = getXData(xData);
      let yData = subChartVO.preYList || [];
      if (xList.index > -1) {
        yData = yData.slice(0, xList.index);
      }
      let xOption = xList.data;
      if (!yData?.[0] && yData?.[0] !== 0) {
        yData = yData.slice(1);
        xOption = xOption.slice(1);
      }
      let option = getOption({
        xData: xOption,
        yAxisName: unit || 'mg/L'
      });
      option.series[0].data = yData;
      if (this.tabValue === 'COD') {
        let data = subChartVO.preYList.filter(item => item != '') || [];
        let max = Math.floor(Math.max(...data));
        let min = Math.floor(Math.min(...data));
        option.yAxis[0].min = min > 20 ? min - 20 : 0;
        option.yAxis[0].max = max + 20;
      }
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
