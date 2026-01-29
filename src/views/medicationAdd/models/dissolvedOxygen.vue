<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description:
-->
<template>
  <unit-card cardTitle="加药泵运行状况">
    <div class="echart-block">
      <line-chart :options="option" ref="inChart" />
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { doControl } from '@/api/smartProduct';
import { todayTicketCreateOrDoneTrend } from '@/api/sludgeProperty.js';
import lineChart from '@/components/chart/Chart.vue';
import { getDissolvedOxygenOption as getOption } from './data';
export default {
  name: 'dissolvedOxygen',
  components: {
    lineChart,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    line: {
      type: Number,
      default: 0
    },
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
    line() {
      this.handleChart();
    },
    waterPlantId: {
      handler(val) {
        if (val) {
          this.handleChart();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.handleChart();
  },
  methods: {
    async handleChart() {
      let params = {
        endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        line: this.line,
        queryType: 'hours',
        startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        waterPlantId: this.waterPlantId
      };
      const { resultData, status } = await doControl(params);
      if (status === 'complete') {
        let xData = resultData?.[0]?.dataAndTimeList?.map(item => item.date?.slice(11, 16)) || [];
        let isEmpty = !xData.length;
        if (isEmpty) {
          this.option = getOption({ empty: true });
          return;
        }
        let option = getOption({
          xData,
          yAxisName: resultData?.[0]?.unit || 'mg/L'
        });
        let pointList = ['middleDo', 'finalDO', 'DO'];
        pointList.forEach((item, index) => {
          let curPoint = resultData?.find(point => point.pointName === item);
          if (curPoint) {
            option.series[index].data = curPoint.dataAndTimeList?.map(val => val.pv) || [];
          }
        });
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
