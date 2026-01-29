<template>
  <unit-card cardTitle="出水达标率">
    <div class="gauge-container">
      <div class="dashboard-header">
        <div class="header-left">出水达标率</div>
        <div class="header-right">100 <span class="header-unit">%</span></div>
      </div>
      <div class="progress-container">
        <div class="gauge-card" v-for="(item, index) in gaugeData" :key="index">
          <div class="gauge-chart" :id="`gauge-chart-${index}`">
            <line-chart :options="item.option" ref="gaugeChart" />
            <div :class="['gauge-value', `gauge-value-${index}`]">
              {{ item.value }}<span class="gauge-value-unit">%</span>
            </div>
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
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import * as echarts from 'echarts';
import lineChart from '@/components/chart/Chart.vue';
import { getOutWaterRateOption as getOption } from './data';
export default {
  name: 'outWaterRate',
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
      baseGaugeData: [
        {
          title: '累计达到',
          subtitle: '准Ⅲ类天数',
          startColor: '#34DDFF',
          endColor: '#38B0FF'
        },
        {
          title: '当年累计达到',
          subtitle: '准Ⅲ类天数',
          startColor: '#481A74',
          endColor: '#38FFFF'
        }
      ],
      newQualityData: {}
    };
  },
  created() {
    this.calculateRunDays();
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
      console.log('000 ', this.newQualityData);
      return [
        {
          ...this.baseGaugeData[0],
          value: this.newQualityData.quasiClassThreeRate,
          days: this.newQualityData.quasiClassThree,
          option: getOption({
            ...this.baseGaugeData[0],
            value: this.newQualityData.quasiClassThreeRate,
            days: this.newQualityData.quasiClassThree
          })
        },
        {
          ...this.baseGaugeData[1],
          value: this.newQualityData.quasiClassThreeRateThisYear,
          days: this.newQualityData.quasiClassThreeThisYear,
          option: getOption({
            ...this.baseGaugeData[1],
            value: this.newQualityData.quasiClassThreeRateThisYear,
            days: this.newQualityData.quasiClassThreeThisYear
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
      this.newQualityData = {
        'quasiClassThree': totalDays + 1,
        'quasiClassThreeRate': 100,
        'quasiClassThreeRateThisYear': 100,
        'quasiClassThreeThisYear': yearDays + 1
      }
    },
    initCharts() {
      let gaugeData = [
        {
          title: '累计达到',
          subtitle: '准Ⅲ类天数',
          value: this.qualityData.quasiClassThreeRate,
          days: this.qualityData.quasiClassThree,
          startColor: '#34DDFF',
          endColor: '#0058D4',
          option: {}
        },
        {
          title: '当年累计达到',
          subtitle: '准Ⅲ类天数',
          value: this.qualityData.quasiClassThreeRateThisYear,
          days: this.qualityData.quasiClassThreeThisYear,
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
  }
};
</script>

<style lang="less" scoped>
.gauge-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 6px 0 6px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px 0 60px;
  box-sizing: border-box;
  background: url('~@/assets/img/smartProduct/outlet_water_compliance_rate.png') no-repeat;
  background-size: 100% 100%;
  .header-left {
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: #cee6ff;
    letter-spacing: 0;
  }
  .header-right {
    font-family: MiSans-Medium, sans-serif;
    font-weight: 500;
    font-size: 24px;
    color: #eff4ff;
    letter-spacing: 0;
    text-align: center;
  }
  .header-unit {
    font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
  }
}

.progress-container {
  flex: 1;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gauge-card {
  width: calc(50% - 22px);
  height: 245px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('~@/assets/img/smartProduct/card245_small.png') no-repeat;
  background-size: 100% 100%;
}

.gauge-chart {
  width: 100%;
  height: 140px;
  margin-top: 4px;
  position: relative;
}

.gauge-value {
  width: 70px;
  height: 70px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 100;
  font-family: MiSans-Medium, sans-serif;
  font-weight: 500;
  font-size: 24px;
  color: #eff5ff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  .gauge-value-unit {
    font-size: 16px;
    color: #cee6ff;
  }
}
.gauge-value-0 {
  background: url('~@/assets/img/smartProduct/blue.png') no-repeat;
  background-size: 100% 100%;
}
.gauge-value-1 {
  background: url('~@/assets/img/smartProduct/cyan.png') no-repeat;
  background-size: 100% 100%;
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
