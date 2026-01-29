<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-01-07 08:59:48
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="left">
        <pie-chart ref="alarmChart" :options="option" defaultHighlight="false"> </pie-chart>
      </div>
      <div class="right">
        <div class="tab-list">
          <div class="tab-item" v-for="(item, index) in list" :key="index">
            <div class="label">
              <div class="icon" :style="{ background: item.color }"></div>
              <div class="text">{{ item.name }}</div>
            </div>
            <div class="value">{{ item.value }}个</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
const color1 = [
  ['rgba(86, 220, 34,0.3)', 'rgba(86, 220, 34,0.8)'],
  // ['rgba(51, 136, 255,0.3)', 'rgba(51, 136, 255, 0.8)'],
  ['rgba(204, 217, 220,0.3)', 'rgba(204, 217, 220,0.8)']
];
import { deviceOnlineStatus } from '@/api/energyAnalyse';
export default {
  name: 'SludgeAlasysis',
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
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.getDeviceOnlineStatus();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      noData: true,
      maxValue: 0,
      option: {},
      list: [
        {
          name: '在线',
          value: 0,
          color: '#56DC22'
        },
        {
          name: '离线',
          value: 0,
          color: '#CCD9DC'
        }
      ]
    };
  },
  methods: {
    async getDeviceOnlineStatus() {
      let res = await deviceOnlineStatus(this.waterPlantId);
      let { status, resultData } = res;
      if (status === 'complete') {
        this.list = [
          {
            name: '在线',
            value: resultData.onlineNum || 0,
            color: '#56DC22'
          },
          {
            name: '离线',
            value: resultData.offlineNum || 0,
            color: '#CCD9DC'
          }
        ];
        this.maxValue = Math.max(this.list[0].value, this.list[1].value);
        this.option = {
          tooltip: {
            textStyle: {
              color: '#FFF'
            },
            backgroundColor: 'rgba(1,38,73,0.8)',
            trigger: 'item',
            confine: true
          },
          legend: {
            show: false
          },
          series: [
            {
              type: 'pie',
              radius: ['14%', '90%'],
              center: ['50%', '50%'],
              roseType: 'area',
              clockwise: false, // 鼠标悬浮效果
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
                formatter: '{value|{b}}\n{name|{c}}{unit|个}',
                rich: {
                  name: { fontSize: 20, color: '#F4F8FF', fontWeight: 600 },
                  unit: { fontSize: 20, color: '#F4F8FF', fontWeight: 600 },
                  value: { fontSize: 16, color: '#B4C2DB', lineHeight: 36 }
                }
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    return {
                      type: 'line',
                      x: 1,
                      y: 1,
                      x2: 0,
                      y2: 0,
                      colorStops: [
                        { offset: 0, color: color1[params.dataIndex][0] },
                        { offset: 1, color: color1[params.dataIndex][1] }
                      ]
                    };
                  }
                }
              },
              data: this.list
            },
            {
              name: 'Line 2',
              type: 'pie',
              clockWise: false, //顺时加载
              hoverAnimation: false, //鼠标移入变大
              center: ['50%', '50%'],
              radius: ['90%', '90%'],
              itemStyle: {
                normal: {
                  borderWidth: 2,
                  borderColor: '#4171ca',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              data: [
                {
                  value: this.maxValue,
                  name: ''
                }
              ]
            },
            {
              type: 'pie',
              // zlevel: 2,
              silent: true,
              radius: ['51%', '52%'],
              label: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this._pie3()
            }
          ]
        };
      }
    },
    _pie3() {
      let dataArr = [];
      for (var i = 0; i < 100; i++) {
        if (i % 2 === 0) {
          dataArr.push({
            name: (i + 1).toString(),
            value: 25,
            itemStyle: {
              normal: {
                color: 'rgb(126,190,255)',
                borderWidth: 0,
                borderColor: 'rgba(0,0,0,0)'
              }
            }
          });
        } else {
          dataArr.push({
            name: (i + 1).toString(),
            value: 20,
            itemStyle: {
              normal: {
                color: 'rgba(0,0,0,0)',
                borderWidth: 0,
                borderColor: 'rgba(0,0,0,0)'
              }
            }
          });
        }
      }
      return dataArr;
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 30px 15px 30px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .left {
    width: calc(100% - 220px);
    height: 100%;
  }
  .right {
    flex: 0 0 200px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .tab-list {
      width: 100%;
      .tab-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 32px;
        margin-bottom: 42px;
        padding: 0 13px 0 10px;
        background: url('~@/assets/img/hz/pie-point.png') no-repeat;
        background-size: 100% 100%;
        .value {
          font-family: PingFangSC-Medium, sans-serif;
          font-weight: 500;
          font-size: 16px;
          color: #7f96bf;
          letter-spacing: 0;
        }
        .label {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .icon {
            width: 8px;
            height: 8px;
          }
          .text {
            margin-left: 6px;
            font-family: PingFangSC-Regular, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #e7e7eb;
            letter-spacing: 0;
          }
        }
      }
      .tab-item:last-child {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
