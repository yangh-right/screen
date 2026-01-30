<template>
  <unit-card cardTitle="千吨水电耗曲线">
    <template #headerRight>
      <div class="date-tabs">
        <div v-for="tab in tabs" :key="tab.value" :class="['tab-item', { active: currentTab === tab.value }]"
          @click="handleTabChange(tab.value)">
          {{ tab.label }}
        </div>
      </div>
    </template>
    <div class="card-inner">
      <div class="unit" v-show="hasData">kWh/m³</div>
      <div class="chart-box" v-show="hasData">
        <chart ref="energyChart" :key="String(hasData)" :options="option"></chart>
      </div>
      <div class="chart-box no-data" v-show="!hasData">
        暂无数据
      </div>
    </div>
  </unit-card>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment';
import { getEnergyData } from '@/api/energyAnalyse';

export default {
  name: 'lightStatus',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    Chart: () => import('@/components/chart/Chart.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentTab: 'day',
      tabs: [
        { label: '日', value: 'hour' },
        { label: '月', value: 'day' },
        { label: '年', value: 'month' }
      ],
      option: {
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: []
      }
    };
  },
  computed: {
    hasData() {
      return this.option.series && this.option.series.length > 0 && this.option.series[0].data.length > 0;
    }
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
  methods: {
    handleTabChange(val) {
      this.currentTab = val;
      this.initData();
    },
    async initData() {
      if (!this.waterPlantId) return;
      // 稍微延迟，等待大屏布局完全稳定（处理 scale 缩放等）
      await new Promise(resolve => setTimeout(resolve, 300));

      let startDate, endDate;
      const now = moment();

      if (this.currentTab === 'hour') {
        startDate = now.format('YYYY-MM-DD');
        endDate = now.format('YYYY-MM-DD');
      } else if (this.currentTab === 'day') {
        startDate = now.clone().startOf('month').format('YYYY-MM-DD');
        endDate = now.format('YYYY-MM-DD');
      } else if (this.currentTab === 'month') {
        startDate = now.clone().startOf('year').format('YYYY-MM-DD');
        endDate = now.format('YYYY-MM-DD');
      }

      const params = {
        dateType: this.currentTab,
        deviceIdList: [],
        startDate,
        endDate,
        ratioFlag: true,
        statType: 0,
        waterPlantIdList: [this.waterPlantId]
      };

      try {
        const { status, resultData } = await getEnergyData(params);
        if (status === 'complete') {
          this.renderChart(resultData || []);
        }
      } catch (error) {
        console.error('获取能耗数据失败:', error);
      }
    },
    renderChart(data) {
      const xData = data.map(item => {
        const dateStr = item.date || item.dateTime || '';
        if (this.currentTab === 'hour') {
          return dateStr.includes(' ') ? dateStr.split(' ')[1].slice(0, 5) : dateStr;
        }
        if (this.currentTab === 'day') return dateStr.split('-').slice(1).join('-'); // 取月-日
        return dateStr; // 年月
      });
      const yData = data.map(item => item.energy);

      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: 'transparent',
          textStyle: { color: '#fff' }
        },
        legend: {
          show: true,
          right: '5%',
          top: '0%',
          textStyle: { color: '#bac9e7', fontSize: 12 },
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
          axisLabel: { color: '#bac9e7', fontSize: 12, rotate: xData.length > 12 ? 30 : 0 },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisLabel: { color: '#bac9e7', fontSize: 12 },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } }
        },
        series: [{
          name: '千吨水电耗曲线',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#ff6b6b'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
              { offset: 1, color: 'rgba(255, 107, 107, 0)' }
            ])
          },
          data: yData,
          itemStyle: {
            color: '#ff6b6b',
            borderColor: '#fff',
            borderWidth: 2
          }
        }]
      };
    }
  }
};
</script>

<style lang="less" scoped>
.date-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;

  .tab-item {
    padding: 2px 10px;
    font-size: 14px;
    color: #bac9e7;
    cursor: pointer;
    border-right: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-right: none;
    }

    &.active {
      background: #1890ff;
      color: #fff;
    }
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;

  .unit {
    font-size: 12px;
    color: #bac9e7;
    margin-bottom: 5px;
  }

  .chart-box {
    flex: 1;
    min-height: 0;

    &.no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bac9e7;
      font-size: 14px;
    }
  }
}
</style>
