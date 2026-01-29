<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-11-06 18:11:03
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <a-select
        v-model="lineCode"
        placeholder="设备选择"
        v-if="lineList.length > 0"
        dropdownClassName="select__list"
        class="select__block"
      >
        <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
        <a-select-option v-for="item in lineList" :key="item.pointName" :value="item.pointName">{{
          item.pointMemo
        }}</a-select-option>
      </a-select>
      <div class="echart-block">
        <line-chart ref="alarmChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>
//InstantaneousFlow
<script>
import { queryIndustryPoint, getHistoryData } from '@/api/energyAnalyse.js';
import moment from 'moment';
export default {
  name: 'carbonDosage',
  components: {
    lineChart: () => import('@/components/chart/Chart.vue'),
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
      option: {},
      deviceId: '2024102801',
      pointMemo: '',
      lineCode: undefined,
      lineList: []
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getPoints();
        }
      }
    },
    lineCode: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    handleLine(val) {
      console.log(val, 33333);
    },
    async getPoints() {
      let res = await queryIndustryPoint(this.deviceId);
      let { status, resultData } = res;
      this.lineList = [];
      this.lineCode = undefined;
      if (status === 'complete') {
        this.lineList = resultData || [];
        if (resultData.length > 0) {
          this.lineCode = resultData[0].pointName;
        }
      }
    },
    async initData() {
      let params = {
        queryType: 'month',
        waterPlantId: this.waterPlantId,
        deviceId: this.deviceId,
        pointName: this.lineCode,
        startTime: moment().format('YYYY-MM') + '-01 00:00:00',
        endTime: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      const { status, resultData } = await getHistoryData(params);
      if (status === 'complete') {
        const data = resultData?.[0]?.dataAndTimeList || [];
        this.pointMemo = resultData?.[0].pointMemo;
        this.initChart(data);
      }
    },
    initChart(val) {
      let xAxisData = val.map(item => item.date.slice(8, 10));
      let seriesData = val.map(item => item.pv);
      let option = {
        grid: {
          left: 10,
          right: 10,
          top: '16%',
          bottom: '3%',
          height: '80%'
        },
        color: ['#BD5DFF', '#36D2FF'],
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
          },
          formatter: function (param) {
            let value = param[0].value ? param[0].value : '--';
            var resultTooltip =
              '<div >' +
              '<div >' +
              param[0].name +
              '</div>' +
              "<div style='padding-top:5px;'>" +
              "<span style='display:inline-block;width:20px;height:3px;background-color:#BD5DFF;'></span>" +
              "<span style=''> " +
              param[0].seriesName +
              ': </span>' +
              "<span style=''>" +
              value +
              '</span>' +
              '</div>' +
              '<div >' +
              '</div>' +
              '</div>';
            return resultTooltip;
          }
        },
        legend: {
          show: false,
          right: 0,
          itemHeight: 2,
          itemWidth: 18,
          data: [],
          textStyle: {
            color: 'rgba(217,247,255, 1)',
            fontSize: 12
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              color: '#D9F7FF',
              fontWeight: 400,
              fontSize: 14
            },
            lineStyle: {
              color: 'rgba(108, 128, 151, 1)'
            },
            boundaryGap: false,
            data: xAxisData
          }
        ],
        yAxis: {
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)',
              type: [5, 5],
              width: 2,
              dashOffset: 5
            }
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
          },
          type: 'value',
          name: 'L/d',
          nameLocation: 'end'
        },
        series: [
          {
            name: this.pointMemo,
            type: 'line',
            z: 3,
            showSymbol: false,
            smoothMonotone: 'x',
            areaStyle: {
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(189,93,255,0.5)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(189,93,255,0.1)'
                  }
                ],
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: 'linear',
                global: false
              }
            },
            smooth: true,
            data: seriesData
          }
        ]
      };
      this.option = option;
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
  justify-content: space-between;

  .echart-block {
    margin-top: 32px;
    width: 100%;
    height: calc(100% - 40px);
    text-align: center;
  }
}
/deep/ .select__block {
  background: url('~@/assets/img/hz/ac-point.png') no-repeat;
  background-size: 100% 100%;
  width: 300px;
  height: 30px;
  position: absolute;
  top: 2px;
  left: 4px;
  z-index: 10;

  .ant-select-selection {
    background: transparent;
    border: none;
  }

  .ant-select-selection__rendered {
    height: 28px;
    line-height: 28px;
    text-align: center;
    .ant-select-selection-selected-value {
      float: unset;
      font-family: SourceHanSansCN-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
    .ant-select-selection__placeholder {
      margin-left: 12px;
    }
  }
}
</style>
<style lang="less">
.select__list {
  .ant-select-dropdown-menu {
    background: #042d53;
    background-size: 100% 100%;
    padding: 0;
    .ant-select-dropdown-menu-item {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      color: #7aaed4;
    }
    .ant-select-dropdown-menu-item:hover {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      box-shadow: inset 20px 0 20px 20px #005cad;
    }
  }
}
</style>
