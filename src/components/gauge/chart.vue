<template>
  <div ref="gauge" :class="{gauge:true,[theme]:true}" />
</template>

<script>
/* eslint-disable */
const BLUE = 'blue'
const PINK = 'pink'
export default {
  props: {
    theme: {
      type: String,
      default: BLUE
    },
    percent: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    option() {
      return {
        series: [
          {
            name: '1',
            type: 'gauge',
            radius: '100%',
            startAngle: '225',
            endAngle: '-45',
            min: 0,
            splitNumber: 10,
            pointer: {
              show: true,
              length: '60%',
              width: 3
            },
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: this.theme === BLUE ? [{
                  offset: 0, color: '#046CD9'
                }, {
                  offset: 1, color: '#59D1FF'
                }] : [{
                  offset: 0, color: '#D647AE'
                }, {
                  offset: 1, color: '#80D8FF'
                }],
                global: false // 缺省为 false
              }
            },
            detail: {
              show: true,
              formatter: () => {
                return `{${this.theme}|${this.percent}%}`
              },
              rich: {
                [BLUE]: {
                  fontSize: 17,
                  lineHeight: 23,
                  fontWeight: 'bold',
                  color: '#1BFCE5'
                },
                [PINK]: {
                  fontSize: 17,
                  lineHeight: 23,
                  fontWeight: 'bold',
                  color: '#FF71FE'
                }
              },
              offsetCenter: ['0%', '90%']
            },
            data: [
              { name: '1', value: this.percent }
            ],
            title: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: true,
              length: 6,
              lineStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: this.theme === BLUE ? [{
                    offset: 0, color: '#0065D7'
                  }, {
                    offset: 1, color: '#4DF4FF'
                  }] : [{
                    offset: 0, color: '#AB12B2'
                  }, {
                    offset: 1, color: '#FF71FE'
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            splitLine: {
              show: false,
              length: 1
            },
            axisLabel: {
              show: true,
              color: '#9FC9FF',
              fontSize: 6,
              distance: 10
            },
            animationDuration: 4000
          },
          {
            type: 'gauge',
            radius: 42,
            startAngle: '225',
            endAngle: '-45',
            min: 0,
            splitNumber: 10,
            detail: { show: false },
            pointer: {
              show: false
            },
            title: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: true,
              length: 1,
              lineStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: this.theme === BLUE ? [{
                    offset: 0, color: '#0065D7'
                  }, {
                    offset: 1, color: '#4DF4FF'
                  }] : [{
                    offset: 0, color: '#AB12B2'
                  }, {
                    offset: 1, color: '#FF71FE'
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            splitLine: {
              show: false,
              length: 1
            },
            axisLabel: {
              show: false
            }
          },
          {
            type: 'pie',
            radius: [0, 4],
            itemStyle: {
              color: this.theme === BLUE ? '#19435C' : '#2D233C'
            },
            labelLine: {
              show: false
            },
            data: [100],
            silent: true,
            animation: false,
            selected: false
          },
          {
            type: 'pie',
            radius: [0, 2],
            itemStyle: {
              color: '#111418'
            },
            labelLine: {
              show: false
            },
            data: [100],
            silent: true,
            animation: false,
            selected: false
          }
        ]
      }
    }
  },
  watch: {
    option() {
      this.echartsInstance.setOption(this.option)
    }
  },
  mounted() {
    const echarts = require('echarts/lib/echarts');
    this.echartsInstance = echarts.init(this.$refs.gauge)
    this.echartsInstance.setOption(this.option)
  }
}
</script>

<style lang="less" scoped>
.gauge {
  width: 100px;
  height: 100px;
  background-position: (100 - 54)/2px ((100 - 54)/2 - 1px);
  background-size: 54px;
  background-repeat: no-repeat;
  &.blue{
    background-image: url('../../assets/PY/gauge1-1.png');
  }
  &.pink{
    background-image: url('../../assets/PY/gauge2-2.png');
  }
}
</style>
