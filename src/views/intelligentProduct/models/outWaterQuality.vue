<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description: 出水水质监控组件
-->
<template>
  <unit-card cardTitle="出水水质">
    <point-tab v-if="pointsArr.length > 0" :tabs="pointsArr" :tabValue="currentPoint" @tabChange="handlePointChange">
    </point-tab>
    <div :class="[pointsArr.length > 0 ? 'echart-con' : 'echart-block']">
      <div class="pool-select">
        <radio-button v-model="line" :options="timeOptions" @change="handleTimeChange"> </radio-button>
      </div>
      <line-chart :options="chartOptions" ref="inChart" />
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { queryPointHistoryData } from '@/api/energyAnalyse';
import lineChart from '@/components/chart/Chart.vue';
import RadioButton from '@/views/smartProduct/components/RadioButton.vue';
import { getOutWaterQualityOption as getOption } from './data';
import pointTab from '@/components/pointTab.vue';

const TIME_FORMATS = {
  day: {
    format: 'HH:mm',
    startTime: { days: 1, hour: 8 },
    timePeriod: 'HOURS'
  },
  month: {
    format: 'DD日',
    startTime: { month: 'start', days: 1, hour: 8 },
    timePeriod: 'DAYS'
  },
  year: {
    format: 'MM月',
    startTime: { year: 'start', days: 1, hour: 8 },
    timePeriod: 'MONTHS'
  }
};

export default {
  name: 'OutWaterQuality',
  components: {
    lineChart,
    RadioButton,
    pointTab,
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
      timeOptions: [
        { value: 'day', label: '日' },
        { value: 'month', label: '月' },
        { value: 'year', label: '年' }
      ],
      line: 'day',
      pointsArr: [],
      currentPoint: '',
      chartData: null
    };
  },

  computed: {
    chartOptions() {
      if (!this.chartData || !this.chartData.dataAndTimeList?.length) {
        return getOption({ empty: true });
      }

      const { unit, dataAndTimeList, cb = 0, gb = 0 } = this.chartData;
      const timeFormat = TIME_FORMATS[this.line]?.format || 'HH:mm';

      const xData = dataAndTimeList.map(item => moment(item.date).format(timeFormat));

      // 根据时间维度选择使用的数值字段
      const valueField = ['month', 'year'].includes(this.line) ? 'avgPv' : 'pv';
      const data = dataAndTimeList.map(val => val[valueField]);
      const option = getOption({
        xData,
        yAxisName: unit || 'mg/L',
        cb,
        gb,
        data
      });

      return option;
    }
  },

  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.fetchChartData();
        }
      },
      immediate: true
    }
  },

  methods: {
    getTimeRange() {
      const now = moment();
      const timeConfig = TIME_FORMATS[this.line];
      let startTime = now.clone();

      if (timeConfig) {
        if (timeConfig.startTime.year === 'start') {
          startTime.startOf('year');
        } else if (timeConfig.startTime.month === 'start') {
          startTime.startOf('month');
        }

        if (timeConfig.startTime.days) {
          startTime.subtract(timeConfig.startTime.days, 'days');
        }

        startTime.set({
          hour: timeConfig.startTime.hour || 0,
          minute: 0,
          second: 0
        });
      }

      return {
        startDateTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endDateTime: now.format('YYYY-MM-DD HH:mm:ss'),
        timePeriod: timeConfig?.timePeriod || 'HOURS'
      };
    },

    async fetchChartData() {
      if (!this.waterPlantId) return;

      try {
        const params = {
          ...this.getTimeRange(),
          waterPlantId: this.waterPlantId,
          configCode: 'outflow'
        };
        const { resultData, status } = await queryPointHistoryData(params);
        if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
          this.pointsArr = resultData;
          this.handlePointChange(this.pointsArr[0]);
        } else {
          this.pointsArr = [];
          this.currentPoint = '';
          this.chartData = null;
        }
      } catch (error) {
        console.error('获取出水水质数据失败:', error);
        this.chartData = null;
      }
    },

    handlePointChange(data) {
      if (!data) return;

      this.currentPoint = data.pointMemo;
      this.chartData = data;
    },

    handleTimeChange() {
      this.fetchChartData();
    }
  }
};
</script>

<style lang="less" scoped>
.echart-block {
  width: 100%;
  height: 100%;
  position: relative;
}
.echart-con {
  width: 100%;
  height: calc(100% - 52px);
  position: relative;
}

.pool-select {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 1000;
  cursor: pointer;
}
</style>
