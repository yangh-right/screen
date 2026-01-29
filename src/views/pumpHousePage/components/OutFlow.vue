<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-25 10:32:39
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="chart-btns">
        <div
          v-for="item in tabs"
          :key="item.pointName"
          :class="[currentPoint === item.pointName ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.pointMemo }}
        </div>
      </div>
      <div class="echart-block">
        <bar-chart :options="option"></bar-chart>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getPointConfigsByPumpHouseIdAndGroupType, modelEvaluation, queryList } from '@/api/pumpHousePage';

export default {
  name: 'OutFlow',
  components: {
    barChart: () => import('@/components/chart/Chart.vue')
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
  data() {
    return {
      cardTitle: '进水水质',
      currentPoint: '',
      option: {
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
        legend: {
          data: ['相对误差', '均方根误差'],
          itemWidth: 16,
          itemHeight: 8,
          left: 'right',
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '14%',
          bottom: '3%',
          height: '80%'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            fontsize: 2,
            align: 'center',
            color: 'rgba(255,255,255)'
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLine: {
              show: false
            },
            nameTextStyle: {
              align: 'right',
              color: '#D9F7FF',
              padding: [0, 8, 0, 0]
            },
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 14
            }
          },
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLine: {
              show: false
            },
            nameTextStyle: {
              align: 'right',
              color: '#D9F7FF',
              padding: [0, 8, 0, 0]
            },
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 14
            }
          }
        ],
        series: [
          {
            name: '相对误差',
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00FFE8' },
                  { offset: 1, color: '#003A8C' }
                ])
              }
            },
            data: []
          },
          {
            name: '均方根误差',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#6B4815' },
                  { offset: 1, color: '#FDD47C' }
                ])
              }
            },
            data: []
          }
        ]
      },
      tabs: [],
      optionId: ''
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getOption();
        }
      }
    }
  },
  methods: {
    //获取方案id
    async getOption() {
      let params = {
        solutionType: '1',
        waterPlantId: this.waterPlantId //传水厂id
      };
      let { resultData, status } = await queryList(params);
      if (status === 'complete') {
        resultData.forEach(item => {
          if (item.runningFlag) {
            this.optionId = item.id;
          }
        });
      }
      this.getTabsList();
    },
    async getTabsList() {
      let params = {
        pumpHouseId: this.waterPlantId, //传水厂id
        groupType: 'outFlow' //出水
      };
      let { resultData, status } = await getPointConfigsByPumpHouseIdAndGroupType(params);
      if (status === 'complete') {
        if (resultData.length) {
          this.tabs = resultData[0].pointConfigRels;
        }
      }
      this.handleChange(this.tabs[0]);
    },
    handleChange(item) {
      this.currentPoint = item.pointName;
      this.handleChart(item);
    },
    async handleChart(item) {
      let params = {
        optionId: this.optionId,
        pointName: item.pointName, //进水
        waterPlantId: this.waterPlantId //传水厂id
      };
      let { resultData, status } = await modelEvaluation(params);
      if (status === 'complete') {
        this.option.xAxis.data = resultData.xAxis;
        this.option.series[0].data = resultData.relativeList;
        this.option.series[1].data = resultData.squareList;
      }
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
    padding: 15px 12px;
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
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;

    .chart-btns {
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      .point-btn {
        width: calc(25% - 6px);
        height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
        line-height: 34px;
        cursor: pointer;
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .echart-block {
      width: 100%;
      height: calc(100% - 30px);
      margin-top: 6px;

      #alarm_chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
