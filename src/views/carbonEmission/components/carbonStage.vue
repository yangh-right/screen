<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-30 16:01:54
 * @Description:
-->
<template>
  <unit-card :cardTitle="title">
    <div v-if="pointsArr.length > 0" class="card-inner">
      <div v-for="item in pointsArr" :key="item.sourceType" class="echart-block">
        <div class="echart-title">{{ item.sourceTypeName }}</div>
        <div class="echart-box">
          <bar-chart :options="item.option"></bar-chart>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';

export default {
  name: 'DigitalAssets',
  components: {
    UnitCard,
    BarChart: () => import('@/components/chart/Chart.vue')
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
    sourceTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      pointsArr: [],
      option: {}
    };
  },
  watch: {
    sourceTypeList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.pointsArr = [];
          let bar1 =
            'image://data:image/png;base64,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';
          let bar2 =
            'image://data:image/png;base64,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';
          let tempArr = JSON.parse(JSON.stringify(this.sourceTypeList));
          this.pointsArr = tempArr.map((item, i) => {
            let yAxisData = [];
            let seriesData = [];
            let option = {
              title: {
                show: false
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
              grid: {
                left: '3%',
                right: '4%',
                bottom: '2%',
                top: '12%'
              },
              xAxis: {
                type: 'value',
                axisLabel: {
                  showMaxLabel: true,
                  showMinLabel: true,
                  color: '#D9F7FF',
                  fontWeight: 400,
                  fontSize: 12,
                  rotate: 40,
                  interval: 4
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: 'rgba(255,255,255,0.1)'
                  }
                },
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: 'category',
                axisLabel: {
                  color: '#D9F7FF',
                  fontWeight: 400,
                  fontSize: 12
                },
                data: []
              },
              series: [
                {
                  type: 'pictorialBar',
                  barWidth: 14,
                  zlevel: 2,
                  data: []
                }
              ]
            };
            if (item.sourceTypeName == '电耗') {
              item.carbonEmissionSourceDeviceAnalysisList
                .sort((a, b) => b.deviceValue - a.deviceValue)
                .forEach((point, i) => {
                  yAxisData.push(point.deviceName);
                  if (i === 0) {
                    seriesData.push({
                      value: point.deviceValue,
                      symbol: bar1
                    });
                  } else {
                    seriesData.push({
                      value: point.deviceValue,
                      symbol: bar2
                    });
                  }
                });
            } else {
              item.carbonEmissionSourceGasAnalysisList
                .sort((a, b) => b.gasValue - a.gasValue)
                .forEach((point, i) => {
                  yAxisData.push(point.gasTypeName);
                  if (i === 0) {
                    seriesData.push({
                      value: point.gasValue,
                      symbol: bar1
                    });
                  } else {
                    seriesData.push({
                      value: point.gasValue,
                      symbol: bar2
                    });
                  }
                });
            }

            option.yAxis.data = yAxisData;
            option.series[0].data = seriesData.reverse();
            item['option'] = option;
            return item;
          });

          // 按需添加其它 echart 图表
          let tempBool = true;
          if (tempBool) {
            let tempObj = {};
            let yAxisData = [];
            let seriesData = [];
            let option = {
              title: {
                show: false
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
              grid: {
                left: '3%',
                right: '4%',
                bottom: '2%',
                top: '12%'
              },
              xAxis: {
                type: 'value',
                axisLabel: {
                  showMaxLabel: true,
                  showMinLabel: true,
                  color: '#D9F7FF',
                  fontWeight: 400,
                  fontSize: 12,
                  rotate: 40,
                  interval: 4
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: 'rgba(255,255,255,0.1)'
                  }
                },
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: 'category',
                axisLabel: {
                  color: '#D9F7FF',
                  fontWeight: 400,
                  fontSize: 12
                },
                data: []
              },
              series: [
                {
                  type: 'pictorialBar',
                  barWidth: 14,
                  zlevel: 2,
                  data: []
                }
              ]
            };
            tempArr
              .sort((a, b) => b.typeValue - a.typeValue)
              .forEach((point, i) => {
                yAxisData.push(point.sourceTypeName);
                if (i === 0) {
                  seriesData.push({
                    value: point.typeValue,
                    symbol: bar1
                  });
                } else {
                  seriesData.push({
                    value: point.typeValue,
                    symbol: bar2
                  });
                }
              });
            option.yAxis.data = yAxisData;
            option.series[0].data = seriesData.reverse();
            tempObj['sourceTypeName'] = '不同碳排放来源';
            tempObj['sourceType'] = 'wyr';
            tempObj['option'] = option;

            this.pointsArr.push(tempObj);
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .echart-block {
    width: calc(50% - 5px);
    height: calc(33.3% - 2px);
    position: relative;
    .echart-title {
      width: 100%;
      height: 24px;
      background: url('~@/assets/img/carbonEmission/echart_stage.png') no-repeat;
      background-size: 100% 100%;
      font-family: Aliba, sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: #e4f1ff;
      letter-spacing: 0;
      padding: 0 0 0 24px;
      box-sizing: border-box;
    }
    .echart-box {
      width: 100%;
      height: calc(100% - 24px);
      position: relative;
    }
  }
}
</style>
