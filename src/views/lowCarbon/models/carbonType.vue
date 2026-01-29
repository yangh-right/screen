<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-18 09:51:21
 * @Description:
-->
<template>
  <unit-card cardTitle="碳减排">
    <div class="card-inner">
      <div class="carbon-total">
        <span class="header-label">碳排放总量：</span>
        <span class="header-value">{{ total }}t<i>CO₂e</i></span>
      </div>
      <div class="chart">
        <pie-chart :options="option" />
        <pie-chart3
          :showTooltip="false"
          class="pie3"
          chartId="carbonReductionChart"
          :option="option"
          :chartView="chartView"
          @handleClick="carbonReductionChart"
          ref="pieChart"
        >
        </pie-chart3>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getCarbonReductionOption as getOption, carbonData } from './data';
export default {
  name: 'carbonType',
  components: {
    PieChart: () => import('@/components/chart/PieChart.vue'),
    PieChart3: () => import('@/components/chart3d/PieChart.vue'),
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
      chartView: {
        internalDiameterRatio: 0.9, // 透明的空心占比
        distance: 180, // 视角到主体的距离
        alpha: 48, // 旋转角度
        pieHeight: 4, //立体的高度
        opacity: 1 // 饼或者环的透明度
      },
      option: getOption({ empty: true }),
      total: 0
    };
  },

  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      this.total = carbonData.reduce((prev, next) => {
        return prev + next.total;
      }, 0);
      let data = carbonData.map(item => {
        return {
          name: item.name,
          value: item.total
        };
      });
      let option = getOption({
        data
      });
      this.option = option;

      setTimeout(() => {
        this.$refs.pieChart?.drawLine();
      }, 1000);
    },
    carbonReductionChart(data) {
      let carbonInfo = carbonData.find(item => item.name == data.name);
      this.$emit('carbonReductionChart', carbonInfo);
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 10px 0px 0;
  display: flex;
  flex-direction: column;
  .carbon-total {
    width: 273px;
    height: 55px;
    margin: 0 auto;
    background: url('~@/assets/img/smartProduct/fir_group_9.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    .header-label {
      color: #bac9e7;
      font-size: 18px;
      font-family: Aliba, sans-serif;
      font-weight: 400;
      margin-right: 4px;
    }
    .header-value {
      color: #ffffff;
      font-size: 18px;
      font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
      vertical-align: baseline;
      i {
        font-style: normal;
        color: #bac9e7;
        font-size: 14px;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        margin-left: 3px;
      }
    }
  }
  .chart {
    flex: 1;
    overflow: hidden;
    position: relative;
    background: url('~@/assets/img/smartProduct/pie-bg.png') 50% 71px no-repeat;
    background-size: 52% 62%;
    background-position: center;

    .bg {
      position: absolute;
      bottom: 110px;
      left: 122px;
      top: 20px;
      z-index: -1;
      width: 100%;
      transform: translateX(-50%);
      animation: blink 1.5s ease-in-out infinite;
    }
    .pie3 {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 5px;
    }
  }
}
</style>
