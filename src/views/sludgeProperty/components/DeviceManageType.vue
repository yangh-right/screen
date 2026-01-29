<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="points-list">
        <div v-for="item in pointsArr" :key="item.name" class="point-tab">
          <div class="label">{{ item.name }}</div>
          <div class="chart-block">
            <line-chart :options="item.option"> </line-chart>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';

export default {
  name: 'DeviceManageType',
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
      pointsArr: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      let tempArr = [
        {
          name: '水质仪表',
          children: [
            {
              name: '流量计',
              value: 50,
              unit: '%'
            },
            {
              name: '液位计',
              value: 20,
              unit: '%'
            },
            {
              name: '气体检测',
              value: 22,
              unit: '%'
            },
            {
              name: '声光报警',
              value: 15,
              unit: '%'
            },
            {
              name: '水质仪表',
              value: 49,
              unit: '%'
            }
          ],
          colors: [
            {
              offset: 0,
              color: '#00A6FF' // 0% 处的颜色
            },
            {
              offset: 0.7,
              color: '#72B8FC' // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#F7FBFF' // 100% 处的颜色
            }
          ],
          symbolRotate: '28'
        },
        {
          name: '设备状态',
          children: [
            {
              name: '正常运行',
              value: 20,
              unit: '%'
            },
            {
              name: '保养警告',
              value: 15,
              unit: '%'
            },
            {
              name: '停用状态',
              value: 50,
              unit: '%'
            },
            {
              name: '正在维检',
              value: 99,
              unit: '%'
            },
            {
              name: '正在保养',
              value: 15,
              unit: '%'
            }
          ],
          colors: [
            {
              offset: 0,
              color: '#00A6FF' // 0% 处的颜色
            },
            {
              offset: 0.7,
              color: '#51FFE5' // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#87FEFF' // 100% 处的颜色
            }
          ],
          symbolRotate: '-28'
        }
      ];
      tempArr.forEach(item => {
        var getmyd = item.children.map(r => r.value); //收入金额
        let option = {
          grid: {
            left: 0,
            right: 0,
            top: '16%',
            bottom: '3%',
            height: '80%'
          },
          xAxis: [
            {
              type: 'value',
              axisLabel: {
                showMaxLabel: true,
                showMinLabel: true,
                show: false,
                color: '#fff',
                formatter: function (val) {
                  return val + '';
                },
                textStyle: {
                  fontSize: '13'
                }
              },
              min: 0,
              max: 100,
              splitNumber: 5,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            {
              type: 'value',
              axisLabel: {
                show: false
              },
              min: 0,
              max: 100,
              splitNumber: 5,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              inverse: true,
              data: item.children.map(r => r.name),
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 14,
                  fontFamily: 'PingFang SC',
                  fontWeight: 400,
                  color: '#83AFD7'
                }
              }
            },
            {
              gridIndex: 0, //y轴所在的 grid 的索引
              splitLine: 'none',
              axisTick: 'none',
              axisLine: 'none',
              data: getmyd,
              inverse: true,
              axisLabel: {
                show: true,
                verticalAlign: 'bottom',
                align: 'right',
                padding: [0, 4, 6, 0],
                formatter: function (value) {
                  return '{x|' + value + '}  {y|' + '%}';
                },
                rich: {
                  y: {
                    color: '#BEC9D5',
                    fontFamily: 'Orbitron',
                    fontSize: 12
                  },
                  x: {
                    color: '#BEC9D5',
                    fontFamily: 'Orbitron',
                    fontSize: 12
                  }
                }
              }
            }
          ],
          series: [
            {
              name: '值',
              type: 'bar',
              xAxisIndex: 0,
              label: {
                show: false
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 4,
                  color: {
                    colorStops: item.colors
                  }
                }
              },
              barWidth: 12,
              data: getmyd
            },
            {
              // 分隔
              type: 'pictorialBar',
              symbolRotate: item.symbolRotate,
              itemStyle: {
                normal: {
                  color: 'rgba(47,101,195,0.7)'
                }
              },
              symbolRepeat: 'fixed',
              symbolMargin: 4,
              symbol: 'rect',
              symbolClip: true,
              symbolSize: [4, 14],
              symbolPosition: 'start',
              symbolOffset: [3, 0],
              data: getmyd,
              z: 66,
              tooltip: {
                show: false
              },
              animationEasing: 'elasticOut'
            },
            {
              name: '',
              type: 'pictorialBar',
              itemStyle: {
                normal: {
                  opacity: 0.6,
                  color: '#6494db'
                }
              },
              symbolSize: ['100%', '80%'],
              symbolRepeat: false,
              symbolMargin: 2,
              symbolPosition: 'start',
              symbolOffset: [0, 4],
              tooltip: {
                show: false
              },
              symbol: `image://data:image/png;base64,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`,
              data: [100, 100, 100, 100, 100]
            }
          ]
        };
        item['option'] = option;
      });
      this.pointsArr = tempArr;
    }
  },
  created() {},
  mounted() {
    this.initData();
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
  justify-content: space-between;
  align-items: center;
  .points-list {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    .point-tab {
      width: 50%;
      height: 100%;
      text-align: left;

      .label {
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 13px;
        color: #d9f7ff;
        margin-top: 10px;
      }
      .chart-block {
        width: 100%;
        height: calc(100% - 30px);
      }
    }
  }
}
</style>
