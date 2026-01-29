<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="echart-block">
        <pie-chart ref="medicineChart" :options="option"> </pie-chart>
        <div class="pie-bg">
          <div class="count-total">{{ allCost }}</div>
          <div class="count-label">总计(kg)</div>
          <div class="points-list">
            <div v-for="(item, i) in pointsArr" :key="item.name" class="point-tab">
              <div class="label">
                <span class="ico-react" :style="{ background: colors[i] }"></span>{{ item.name || '--' }}
              </div>
              <div class="value">{{ item.rate || '--' }}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-block">
        <dv-scroll-board :config="config" ref="scrollBoard" style="width: 150px; height: 210px"></dv-scroll-board>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getDrugCostByTime, getCostConsumption } from '@/api/energyAnalyse.js';

export default {
  name: 'MedicineAlasysis',
  components: {
    PieChart: () => import('@/components/chart/PieChart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    parameter: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      colors: ['#5CCDFF', '#68FFB8', '#FFE87C', '#7590FF', '#99D8FF', '#3cb9b4', '#11bbd7'],
      pointsArr: [],
      option: {},
      allCost: 0,
      config: {
        header: ['名称', '累计消耗'],
        data: [],
        columnWidth: [],
        rowNum: 4,
        headerHeight: 30,
        align: ['center', 'center']
      }
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      let params = {
        waterPlantId: this.parameter.waterPlantId,
        startTime: this.parameter.startTime + ' 00:00:00',
        endTime: this.parameter.endTime + ' 23:59:59',
        dateType: 'MONTH'
      };
      const { status, resultData } = await getDrugCostByTime(params);

      if (status === 'complete') {
        this.allCost = resultData.allCost;
        this.initChart(resultData);
      }
    },
    initChart(val) {
      this.allCost = val.reduce((total, item) => total + item.totalQuantity, 0); // 计算数组的总和

      let data = val.map(item => {
        return {
          rate: ((item.totalQuantity / this.allCost) * 100).toFixed(2),
          value: item.totalQuantity,
          name: item.materielName,
          itemStyle: {
            normal: {
              borderRadius: 0,
              borderColor: 'rgba(17, 62, 124, 1)',
              borderWidth: 4
            }
          }
        };
      });
      this.pointsArr = data.filter(item => item.name !== '');
      var a = 0;
      for (var i = 0; i < data.length; i++) {
        a += data[i].value;
      }
      data.push({
        value: a,
        name: '',
        itemStyle: {
          normal: {
            color: 'none'
          }
        }
      });
      let option = {
        // backgroundColor: "#021421",
        color: this.colors,
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          borderColor: 'transparent',
          backgroundColor: 'rgba(0, 16, 35, 0.7)',
          borderRadius: 4,
          textStyle: {
            color: '#A7BAD1',
            align: 'left',
            fontSize: 12
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(168, 191, 221, 0.2)',
              width: 'auto'
            }
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            startAngle: -180,
            hoverAnimation: false,
            radius: ['98%', '85%'],
            center: ['50%', '50%'],
            data: data,
            label: {
              show: false,
              color: 'rgba(63,255,234,0)'
            },
            labelLine: { show: false }
          }
        ]
      };
      this.option = option;
      this.config.data = this.pointsArr.map(item => [item.name, `${item.value}kg`]);
      this.$refs['scrollBoard'] && this.$refs['scrollBoard'].updateRows(this.config.data);
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;

  height: calc(100% - 34px);
  position: relative;
  padding-top: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .echart-block {
    width: 248px;
    height: 200px;
    text-align: center;
    position: relative;

    .pie-bg {
      width: 159px;
      position: absolute;
      top: 22px;
      left: 50%;
      margin-left: -80px;

      .count-total {
        width: 100%;
        height: 74px;
        background: url('~@/assets/img/hz/medi-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        padding-top: 28px;
        box-sizing: border-box;
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 24px;
        color: #ffffff;
      }
      .count-label {
        font-family: PingFangSC, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #b9c3d8;
        letter-spacing: 1.17px;
        text-align: center;
      }
      .points-list {
        width: 250px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 28px;
        margin-left: -30px;

        .point-tab {
          width: calc(50% - 4px);
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            font-family: MiSans-Normal, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #a3cae8;
            letter-spacing: 0;
            .ico-react {
              display: inline-block;
              width: 6px;
              height: 6px;
              border-radius: 1.76px;
              margin-right: 6px;
            }
          }
          .value {
            font-family: MiSans-Normal, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #f4f8ff;
            letter-spacing: 0;
            text-align: center;
          }
        }
      }
    }
  }
  .table-block {
    width: 162px;
    height: 218px;
    margin-left: 12px;
    padding-top: 12px;
    // padding-right: 12px;
    box-sizing: border-box;

    /deep/.dv-scroll-board .header {
      background: url('~@/assets/img/hz/table-row.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .header .header-item {
      padding: 0 !important;
    }
    /deep/.dv-scroll-board .rows .row-item {
      height: 30px !important;
      line-height: 30px !important;
      margin-top: 8px;
      background: url('~@/assets/img/hz/table-row.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .rows .ceil {
      padding: 0 !important;
    }
  }
}
</style>
