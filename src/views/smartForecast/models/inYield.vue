<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description:
-->
<template>
  <unit-card cardTitle="进水水量预测">
    <div class="echart-block">
      <line-chart :options="option" ref="inChart" />
    </div>
  </unit-card>
</template>

<script>
import { getForecastAndHistory } from '@/api/smartProduct';
import lineChart from '@/components/chart/Chart.vue';
import { getInYieldOption as getOption, getXData } from './data';
export default {
  name: 'inYield',
  components: {
    lineChart,
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
      option: getOption({ empty: true })
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.handleChart();
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    async handleChart() {
      const { resultData, status } = await getForecastAndHistory(this.waterPlantId, 'base_InstantaneousFlow');
      if (status === 'complete') {
        let pointData = resultData?.[0] || {};
        let { unit, subChartVO = {} } = pointData;
        let xData = subChartVO.xList || [];
        let isEmpty = !xData.length;
        if (isEmpty) {
          this.option = getOption({ empty: true });
          return;
        }
        let xList = getXData(xData);
        let xOption = xList.data;
        let yData = subChartVO.preYList || [];
        if (xList.index > -1) {
          yData = yData.slice(0, xList.index);
        }
        if (!yData?.[0] && yData?.[0] !== 0) {
          yData = yData.slice(1);
          xOption = xOption.slice(1);
        }
        let option = getOption({
          xData: xOption,
          yAxisName: unit || 'm³/h'
        });
        option.series[0].data = yData;
        this.option = option;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.echart-block {
  width: 100%;
  height: 100%;
}
</style>
