<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description:
-->
<template>
  <unit-card cardTitle="出水水质">
    <div class="echart-block">
      <line-chart :options="option" ref="inChart" />
    </div>
  </unit-card>
</template>

<script>
import { getOutletWater } from '@/api/smartProduct';
import lineChart from '@/components/chart/Chart.vue';
import { getOutQualityOption as getOption } from './data';
export default {
  name: 'outQuality',
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
      immediate: true,
    }
  },
  mounted() {
  },
  methods: {
    async handleChart() {
      const { resultData, status } = await getOutletWater(this.waterPlantId);
      if (status === 'complete') {
        let pointData = resultData?.[0] || {};
        let { unit, dataAndTimeList = [] } = pointData;
        let xData = dataAndTimeList?.map(item => item.date?.slice(11, 16)) || [];
        let isEmpty = !xData.length;
        if (isEmpty) {
          this.option = getOption({ empty: true });
          return;
        }
        let option = getOption({
          xData,
          yAxisName: unit || 'mg/L'
        });
        option.series[0].data = dataAndTimeList?.map(val => val.pv) || [];
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
