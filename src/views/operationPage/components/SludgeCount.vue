<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="tips-header">
        <div class="filed">
          <div class="filed-info">
            <div class="value">{{ monthTotalSludge }}</div>
            <div class="label">本月污泥外运(kg)</div>
          </div>
        </div>
        <div class="filed">
          <div class="filed-info">
            <div class="value">{{ sludgeOfWater }}</div>
            <div class="label">吨水污泥外运(kg/m³)</div>
          </div>
        </div>
      </div>
      <div class="echarts-block">
        <mult-chart :options="option"></mult-chart>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import * as echarts from 'echarts';
import { getChemicalSludgeLine } from '@/api/mainPage.js';

export default {
  name: 'SludgeCount',
  components: {
    multChart: () => import('@/components/chart/Chart.vue')
  },
  data() {
    return {
      cardTitle: '污泥产量',
      option: {},
      monthTotalSludge: 0,
      sludgeOfWater: 0
    };
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    }
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
        waterPlantId: this.waterPlantId,
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        dateType: 'MONTH'
      };
      const { status, resultData } = await getChemicalSludgeLine(params);
      let dataAxis = [];
      let data = [];
      let sludgeOfWater = 0;
      let monthTotalSludge = 0;
      if (status === 'complete' && Array.isArray(resultData)) {
        resultData.forEach(v => {
          dataAxis.push(moment(v.outDepotDate).format('DD'));
          data.push(v.totalQuantity);
          sludgeOfWater += v.waterOfTotalQuantity;
          monthTotalSludge += v.totalQuantity;
        });

        this.sludgeOfWater = sludgeOfWater;
        this.monthTotalSludge = monthTotalSludge;
      }
      let option = {
        grid: {
          top: '16%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(168, 191, 221, 0.2)',
              width: 'auto'
            }
          },
          borderColor: 'transparent',
          backgroundColor: 'rgba(1, 38, 73, 0.8)', // 背景色
          borderRadius: 4,
          textStyle: {
            color: '#FFF' // 字体颜色
          }
        },
        color: ['#F7931E', '#17E3FF'],
        xAxis: [
          {
            data: dataAxis,
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              fontsize: 2,
              align: 'center',
              color: 'rgba(255,255,255)'
            }
          }
        ],
        yAxis: [
          {
            name: 'T',
            nameTextStyle: {
              padding: [0, 0, -12, -4]
            },
            axisLabel: {
              fontsize: 2,
              align: 'center',
              color: 'rgba(255,255,255)'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            name: '污泥量',
            data: data,
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(247, 147, 30, 1.0)' },
                { offset: 1, color: 'rgba(247, 147, 30, 0.1)' }
              ])
            }
          }
        ]
      };
      this.option = option;
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;

    .tips-header {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      margin-top: 4px;

      .filed {
        width: calc(50% - 8px);
        display: flex;
        justify-content: center;
        align-items: center;
        background: url('~@/assets/img/hz/sludge-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;

        .filed-info {
          .label {
            font-family: MicrosoftYaHei, sans-serif;
            font-size: 14px;
            color: #d9f7ff;
            text-align: center;
          }
          .value {
            font-family: YouSheBiaoTiHei, sans-serif;
            font-size: 18px;
            color: #ffffff;
            text-shadow: 0 2px 4px #32c5ffa8;
          }
        }
      }
    }
    .echarts-block {
      width: 100%;
      height: calc(100% - 44px);
      #sludge_out {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
