<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-18 09:51:21
 * @Description:
-->
<template>
  <unit-card cardTitle="AI报警">
    <div class="card-inner">
      <div class="chart">
        <pie-chart :options="option" />
        <pie-chart3
          :showTooltip="false"
          class="pie3"
          chartId="carbonReductionChart"
          :option="option"
          :chartView="chartView"
          ref="pieChart"
        >
        </pie-chart3>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getCarbonReductionOption as getOption } from './data';
import moment from 'moment';
import { aiAlarmAnalysis } from '@/api/smartProduct';
export default {
  name: 'temperatureInfo',
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
      alarmTypeList: [],
      alarmTypeName: {},
      option: getOption({ empty: true })
    };
  },

  watch: {
    waterPlantId: {
      handler(newVal) {
        if (newVal) {
          this.initData(newVal);
        }
      },
      immediate: true
    }
  },
  async created() {
    await this.initData();
  },
  methods: {
    async initData() {
      let params = {
        status: 0,
        currentPage: 1,
        alarmTypeCodes: this.alarmTypeList.map(item => item.value),
        pageSize: 5,
        waterPlantId: this.waterPlantId,
        startTime: moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      let { status, resultData } = await aiAlarmAnalysis(params);
      if (status === 'complete') {
        let tableData = resultData || [];
        let tempData = tableData.map(item => {
          return {
            name: item.name,
            value: item.num
          };
        });
        console.log('0000', tempData);
        let option = getOption({
          data: tempData
        });
        this.option = option;

        setTimeout(() => {
          this.$refs.pieChart?.drawLine();
        }, 1000);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ch-icons {
  cursor: pointer;
  margin-top: 6px;
  .img-box {
    width: 40px;
    height: 26px;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    &--3d {
      background-image: url('~@/assets/img/smartProduct/fir_formation_6_backup_2.png');
    }

    &--2d {
      background-image: url('~@/assets/img/smartProduct/fir_formation_6_backup_3.png');
    }
  }
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
