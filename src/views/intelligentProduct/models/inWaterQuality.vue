<template>
  <unit-card cardTitle="进水水质">
    <div class="header-box">
      <div v-for="(item, index) in runDays" :key="index" class="dashboard-header">
        <div class="header-left">{{ item.label }}</div>
        <div class="header-right">{{ item.value }} <span class="header-unit">天</span></div>
      </div>
    </div>
    <div class="gauge-container">
      <div class="gauge-card" v-for="(item, index) in gaugeData" :key="index">
        <div class="gauge-chart" :id="`gauge-chart-${index}`">
          <line-chart :options="item.option" ref="gaugeChart" />
          <div class="gauge-value">{{ item.value }}%</div>
        </div>
        <div class="gauge-info">
          <div class="gauge-title">
            {{ item.title }}
          </div>
          <div class="gauge-subtitle">{{ item.subtitle }}</div>
        </div>
        <div class="gauge-days">{{ item.days }}天</div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import * as echarts from 'echarts';
import lineChart from '@/components/chart/Chart.vue';
import { getInWaterQualityOption as getOption } from './data';
export default {
  name: 'GaugeCharts',
  components: {
    lineChart,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    },
    qualityData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      runDays: [
        {
          label: '累计运行',
          value: 0
        },
        {
          label: '当年累计运行',
          value: 0
        }
      ],
      baseGaugeData: [
        {
          title: '累计按',
          subtitle: '设计水质运行',
          startColor: '#34DDFF',
          endColor: '#0058D4'
        },
        {
          title: '当年累计按',
          subtitle: '设计水质运行',
          startColor: '#481A74',
          endColor: '#CDC1FF'
        }
      ],
      newQualityData: {}
    };
  },
  computed: {
    gaugeData() {
      // if (!Object.keys(this.qualityData).length) {
      //   return this.baseGaugeData.map(item => ({
      //     ...item,
      //     value: 0,
      //     days: 0,
      //     option: getOption({ ...item, value: 0, days: 0 })
      //   }));
      // }

      return [
        {
          ...this.baseGaugeData[0],
          value: this.newQualityData.inflowStandardRate,
          days: this.newQualityData.inflowStandard,
          option: getOption({
            ...this.baseGaugeData[0],
            value: this.newQualityData.inflowStandardRate,
            days: this.newQualityData.inflowStandard
          })
        },
        {
          ...this.baseGaugeData[1],
          value: this.newQualityData.inflowStandardRateThisYear,
          days: this.newQualityData.inflowStandardThisYear,
          option: getOption({
            ...this.baseGaugeData[1],
            value: this.newQualityData.inflowStandardRateThisYear,
            days: this.newQualityData.inflowStandardThisYear
          })
        }
      ];
    }
  },
  watch: {
    // qualityData: {
    //   handler() {
    //     this.$nextTick(() => {
    //       if (this.$refs.gaugeChart && Array.isArray(this.$refs.gaugeChart)) {
    //         this.$refs.gaugeChart.forEach(chart => {
    //           if (chart && typeof chart.refresh === 'function') {
    //             chart.refresh();
    //           }
    //         });
    //       }
    //     });
    //   },
    //   deep: true
    // }
  },
  methods: {
    calculateRunDays() {
      const startDate = moment('2026-01-01');
      const currentDate = moment();
      const startOfYear = moment().startOf('year');

      // 计算从2026-01-01到现在的天数
      const totalDays = currentDate.diff(startDate, 'days');

      // 计算从当年1月1日到现在的天数
      const yearDays = currentDate.diff(startOfYear, 'days');

      this.runDays[0].value = totalDays + 1;
      this.runDays[1].value = yearDays + 1;
      this.newQualityData = {
        'inflowStandard': totalDays + 1,
        'inflowStandardRate': 100,
        'inflowStandardRateThisYear': 100,
        'inflowStandardThisYear': yearDays + 1
      }
    },
    initCharts() {
      let gaugeData = [
        {
          title: '累计',
          subtitle: '正常负荷',
          value: this.qualityData.inflowStandardRate,
          days: this.qualityData.inflowStandard,
          startColor: '#34DDFF',
          endColor: '#0058D4',
          option: {}
        },
        {
          title: '当年累计',
          subtitle: '正常负荷',
          value: this.qualityData.inflowStandardRateThisYear,
          days: this.qualityData.inflowStandardThisYear,
          startColor: '#481A74',
          endColor: '#CDC1FF',
          option: {}
        }
      ];
      gaugeData.forEach((item, index) => {
        item.option = getOption({
          ...item
        });
      });
      this.gaugeData = gaugeData;
    }
  },
  created() {
    this.calculateRunDays();
  }
};
</script>

<style lang="less" scoped>
.header-box {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  padding: 0px 6px 0 6px;
  margin: 4px 0;
}
.dashboard-header {
  width: calc(50% - 9px);
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 0 24px;
  box-sizing: border-box;
  background: url('~@/assets/img/smartProduct/outlet_water_compliance_rate.png') no-repeat;
  background-size: 100% 100%;
  .header-left {
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #cee6ff;
    letter-spacing: 0;
  }
  .header-right {
    font-family: MiSans-Medium, sans-serif;
    font-weight: 500;
    font-size: 18px;
    color: #eff4ff;
    letter-spacing: 0;
    text-align: center;
  }
  .header-unit {
    font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
  }
}
.gauge-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 12px 6px 0 6px;
}

.gauge-card {
  width: calc(50% - 9px);
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('~@/assets/img/smartProduct/card319_large.png') no-repeat;
  background-size: 100% 100%;

  &:first-child {
    .gauge-chart {
      background: url('~@/assets/img/smartProduct/dashboard__blue.png') no-repeat center center;
    }
  }
  &:last-child {
    .gauge-chart {
      background: url('~@/assets/img/smartProduct/dashboard__purple.png') no-repeat center center;
    }
  }
}

.gauge-chart {
  width: 100%;
  height: 171px;
  margin-top: 22px;
  position: relative;
}

.gauge-value {
  font-family: MiSans-Medium, sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #eff5ff;
  letter-spacing: 0;
  text-align: center;
  position: absolute;
  bottom: 42px;
  left: 50%;
  transform: translateX(-50%);
}

.gauge-info {
  margin-top: 6px;
  font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #bfd5ff;
  letter-spacing: 0;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    transform: translateY(-50%);
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #4fef15;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -20px;
    transform: translateY(-50%);
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #4fef15;
  }
}
.gauge-title {
  margin-bottom: 4px;
}

.gauge-days {
  margin-top: 4px;
  padding: 6px 0;
  width: 90%;
  background: url('~@/assets/img/smartProduct/days.png') no-repeat;
  background-size: 100% 100%;
  font-family: MiSans-Medium, sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #eff4ff;
  letter-spacing: 0;
  text-align: center;
}
</style>
