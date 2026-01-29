<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-18 09:51:21
 * @Description:
-->
<template>
  <unit-card cardTitle="沿程预测">
    <div slot="headerRight">
      <line-radio @change="lineChange" :options="poolList" v-model="line"></line-radio>
    </div>
    <div class="card-inner">
      <radio-button @change="handlePointChange" :options="tabs" v-model="currentPoint" />
      <div class="chart">
        <line-chart :options="option" ref="chart1" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getAlongWayOption as getOption } from './data';
import { queryProcessPoint } from '@/api/energyAnalyse';
import LineRadio from '../components/RadioButton.vue';

export default {
  name: 'alongWay',
  components: {
    LineRadio,
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
      option: getOption({ empty: true }),
      line: 'screen_process_s',
      poolList: [
        { value: 'screen_process_s', label: '南池' },
        { value: 'screen_process_n', label: '北池' }
      ],
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
          pointConfigCode: this.line,
          waterPlantId: this.waterPlantId
        };

        const { resultData, status } = await queryProcessPoint(params);
        if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
          this.tabs = resultData.map(item => ({
            ...item,
            value: item.pointName,
            label: item.pointName
          }));
          this.handlePointChange(this.tabs[0].value);
        } else {
          this.resetData();
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        this.resetData();
      }
    },
    lineChange(data) {
      this.line = data;
      this.fetchData();
    },
    handlePointChange(value) {
      if (!value) return;

      const data = this.tabs.find(item => item.value === value);
      if (data) {
        this.currentPoint = data.value;
        this.chartData = data;

        // 获取数据
        const { unit, processPointBuilderList = [] } = data;
        let xData = processPointBuilderList.map(item => item.placeName);
        let isEmpty = !xData.length;
        if (isEmpty) {
          this.option = getOption({ empty: true });
          return;
        }
        let option = getOption({
          xData,
          yAxisName: unit || 'mg/L'
        });
        option.series[0].data = processPointBuilderList.map(item => item.simulateValue);
        this.option = option;
      }
    },
    resetData() {
      this.tabs = [];
      this.currentPoint = '';
      this.chartData = null;
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
