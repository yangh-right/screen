<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description: 水处理量统计图表
-->
<template>
  <unit-card cardTitle="处理水量">
    <div class="water-treatment">
      <div class="statistics">
        <div class="stat-item">
          <div class="label">昨日处理量</div>
          <div class="value">{{ yesterdayAmount }} <span class="unit">m³</span></div>
        </div>
        <div class="stat-item">
          <div class="label">今日处理量</div>
          <div class="value">{{ realTimeTraffic }} <span class="unit">m³</span></div>
        </div>
      </div>
      <div class="chart-container">
        <line-chart :options="option" ref="treatmentChart" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { waterStatistics } from '@/api/mainPage.js';
import { getEnergyData } from '@/api/energyAnalyse.js';
import lineChart from '@/components/chart/Chart.vue';
import { getWaterTreatmentOption as getOption } from './data';

export default {
  name: 'waterTreatment',
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
      yesterdayAmount: '',
      realTimeTraffic: '',
      option: getOption({ empty: true, industryData: [] })
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initWaterStatistics();
          this.fetchData();
        }
      },
      immediate: true
    }
  },
  methods: {
    async initWaterStatistics() {
      let { resultData, status } = await waterStatistics(this.waterPlantId);
      if (status === 'complete') {
        this.loadRate = parseFloat(resultData?.loadRate).toFixed(1);
        this.realTimeTraffic = resultData?.todayFlowPv;
        this.yesterdayAmount = resultData?.yesterdayFlowPv;
      }
    },
    async fetchData() {
      try {
        let params = {
          dateType: 'day',
          statType: 0,
          deviceIdList: [],
          waterPlantId: this.waterPlantId,
          startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD')
        };
        const { status, resultData } = await getEnergyData(params);
        if (status === 'complete') {
          this.updateChart(resultData);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },
    updateChart(data) {
      let xData = data.map(item => item.date.slice(-5));
      let seriesData = data.map(item => item.flowPv);

      let option = getOption({
        xData,
        yAxisName: data?.[0]?.unit || 'm³',
        industryData: seriesData
      });
      this.option = option;
    }
  }
};
</script>

<style lang="less" scoped>
.water-treatment {
  width: 100%;
  height: 100%;

  .statistics {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 0 16px;

    .stat-item {
      .label {
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        color: #bfd5ff;
        font-size: 16px;
        margin-bottom: 8px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: -10px;
          top: 10px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #4fef15;
        }
      }

      .value {
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #eff5ff;
        letter-spacing: 0;
        display: flex;
        align-items: center;
        .unit {
          font-weight: 400;
          font-size: 16px;
          color: #d1e0ff;
          letter-spacing: 0;
          margin-left: 4px;
        }
      }
    }
  }

  .chart-container {
    height: calc(100% - 80px);
  }
}
</style>
