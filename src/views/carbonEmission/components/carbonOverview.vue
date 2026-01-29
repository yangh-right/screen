<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-30 15:59:54
 * @Description:
-->
<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="btns-block">
        <div v-for="(item, i) in btnList" :key="item.key" @click="handleTab(i)" class="echart-btns">
          <div class="echart-label">{{ item.name }}</div>
          <div class="echart-bar">
            <span class="echart-val">{{ item.value }}</span>
            <span class="echart-unit">tonCO₂</span>
            <span :class="['echart-img', item.icon]"></span>
          </div>
        </div>
      </div>
      <div class="echart-block">
        <line-chart ref="alarmChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';
import { monthReduceData } from '@/api/carbonEmission.js';

export default {
  name: 'carbonOverview',
  components: {
    lineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard
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
      option: {},
      btnList: [],
      idx: 0
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
      this.btnList = [];
      let params = {
        waterPlantId: this.waterPlantId
      };
      const { status, resultData } = await monthReduceData(params);

      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.btnList = resultData;
        this.handleData();
      }
    },
    handleData() {
      let option = {
        legend: [
          {
            right: 0,
            itemHeight: 8,
            itemWidth: 8,
            data: [''],
            itemStyle: {
              color: '#F23FFF'
            },
            textStyle: {
              color: 'rgba(217,247,255, 1)',
              fontSize: 12
            }
          }
        ],
        grid: {
          left: 10,
          right: 10,
          top: '16%',
          bottom: '3%',
          height: '80%'
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
        xAxis: {
          type: 'category',
          boundaryGap: true,
          nameTextStyle: {
            color: '#D9F7FF'
          },
          axisLabel: {
            showMaxLabel: true,
            showMinLabel: true,
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 12
          },
          axisTick: {
            lineStyle: {
              color: '#384267'
            },
            show: true
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#384267',
              width: 1,
              type: 'dashed'
            },
            show: true
          },
          data: []
        },
        yAxis: [
          {
            nameTextStyle: {
              color: '#D9F7FF'
            },
            axisLabel: {
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 12
            },
            axisTick: {
              lineStyle: {
                color: '#384267',
                width: 1
              },
              show: true
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#384267',
                width: 1,
                type: 'dashed'
              },
              show: true
            },
            name: 'tonCO₂'
          }
        ],
        series: [
          {
            name: '新增工单',
            data: [],
            type: 'bar',
            barMaxWidth: 'auto',
            barWidth: 18,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                type: 'linear',
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: '#420FBF'
                  },
                  {
                    offset: 0.5,
                    color: '#4D128F'
                  },
                  {
                    offset: 0.5,
                    color: '#5C04AB'
                  },
                  {
                    offset: 1,
                    color: '#B151FF'
                  }
                ]
              }
            },
            label: {
              show: false,
              position: 'top',
              color: '#fff'
            },
            tooltip: {
              show: false
            }
          },
          {
            name: '新增工单',
            data: [1, 1, 1, 1, 1, 1, 1],
            itemStyle: {
              color: '#420FBF'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbol: 'diamond',
            symbolOffset: [0, '50%'],
            symbolSize: [18, 9],
            tooltip: {
              show: false
            }
          },
          {
            name: '新增工单',
            data: [],
            itemStyle: {
              color: '#F23FFF'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbolPosition: 'end',
            symbol: 'diamond',
            symbolOffset: [0, '-50%'],
            symbolSize: [18, 9],
            zlevel: 2
          },
          {
            name: '新增工单',
            data: [],
            itemStyle: {
              color: 'rgba(169,88,255,0.2)'
            },
            type: 'bar',
            barMaxWidth: 'auto',
            barWidth: 18,
            barGap: '-100%',
            zlevel: -1,
            tooltip: {
              show: false
            }
          },
          {
            name: '新增工单',
            data: [1, 1, 1, 1, 1, 1, 1],
            itemStyle: {
              color: 'rgba(169,88,255,0.6)'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbol: 'diamond',
            symbolOffset: [0, '50%'],
            symbolSize: [18, 9],
            zlevel: -2,
            tooltip: {
              show: false
            }
          },
          {
            name: '新增工单',
            data: [],
            itemStyle: {
              color: 'rgba(89,101,121,0.8)'
            },
            type: 'pictorialBar',
            barMaxWidth: '20',
            symbolPosition: 'end',
            symbol: 'diamond',
            symbolOffset: [0, '-50%'],
            symbolSize: [18, 9],
            zlevel: -1,
            tooltip: {
              show: false
            }
          }
        ]
      };
      let tempArr = this.btnList[this.idx].carbonEmissionSourceGasAnalysisList;
      option.xAxis.data = tempArr.map(v => v.sourceTypeName);
      let seriesData = tempArr.map(v => v.value);
      option.series[0].data = option.series[2].data = seriesData;
      let dataMax = Math.max(...seriesData) + 1;
      option.series[3].data = option.series[5].data = [...Array(seriesData.length).fill(dataMax)];

      this.option = option;
    },
    handleTab(i) {
      this.idx = i;
      this.handleData();
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .btns-block {
    display: flex;
    justify-content: space-between;
    margin-top: 3px;
    .echart-btns {
      cursor: pointer;
    }

    .echart-label {
      width: 133px;
      height: 25px;
      background: url('~@/assets/img/carbonEmission/ac_overview.png') no-repeat;
      background-size: 100% 100%;
      font-family: PingFangSC, sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: #e9faff;
      letter-spacing: 0;
      text-shadow: -3px 4px 1px #00355c80;
      padding-left: 25px;
      box-sizing: border-box;
    }
    .echart-bar {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .echart-val {
        font-family: MiSans-Regular, sans-serif;
        font-weight: 600;
        font-size: 20px;
        color: #ffffff;
        text-shadow: 0 2px 6px #32c5ffa3;
      }
      .echart-unit {
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        letter-spacing: 0;
      }
      .echart-img {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 3px;
        margin-top: -3px;
      }
      .ico-up {
        background: url('~@/assets/img/carbonEmission/ico_up.png') no-repeat;
        background-size: 100% 100%;
      }
      .ico-down {
        background: url('~@/assets/img/carbonEmission/ico_down.png') no-repeat;
        background-size: 100% 100%;
      }
      .ico-jian {
        background: url('~@/assets/img/carbonEmission/ico_jian.png') no-repeat;
        background-size: 100% 100%;
      }
      .ico-add {
        background: url('~@/assets/img/carbonEmission/ico_add.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .echart-block {
    width: 100%;
    height: 100%;
    text-align: center;
  }
}
</style>
