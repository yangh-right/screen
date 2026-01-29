<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-08 16:43:45
 * @Description:
-->
<template>
  <unit-card cardTitle="回用水量">
    <div class="card-inner">
      <div class="chart">
        <line-chart :options="option" ref="chart1" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getReuseWaterOption as getOption } from './data';
import { queryWaterReuse } from '@/api/energyAnalyse';
import moment from 'moment';
export default {
  name: 'reuseWater',
  components: {
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
      option: getOption({ empty: true }),
      line: 'screen_process_s',
      tabs: [],
      currentPoint: ''
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.fetchData();
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchData() {
      if (!this.waterPlantId) return;

      try {
        const params = {
          queryType: 'month',
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          startTime: moment().subtract(10, 'days').format('YYYY-MM-DD 00:00:00'),
          waterPlantId: this.waterPlantId
        };

        const { resultData, status } = await queryWaterReuse(params);
        if (status === 'complete') {
          let xData = resultData.map(timeItem => moment(timeItem.reuseDate).format('MM-DD'));
          let isEmpty = !xData.length;
          if (isEmpty) {
            this.option = getOption({ empty: true });
            return;
          }
          let option = getOption({
            xData,
            yAxisName: 'm³'
          });
          option.series[0].data = resultData.map(timeItem => timeItem.reuseAmount);
          this.option = option;
        } else {
          this.resetData();
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        this.resetData();
      }
    },
    resetData() {
      this.option = getOption({ empty: true });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .card-title__right {
  right: 23px !important;
}
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
