<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-25 17:24:45
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="echart-block">
        <line-chart ref="alarmChart" :options="option"> </line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getEnergyDeviceAnalysis } from '@/api/energyAnalyse.js';
import * as echarts from 'echarts';
export default {
  name: 'DevicePowerAlasysis',
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
      noData: true,
      stationList: [
        {
          statName: '生化段出水',
          powerPv: null
        },
        {
          statName: '出水流量计井',
          powerPv: null
        },
        {
          statName: '1#加药间',
          powerPv: null
        }
      ]
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let params = {
        dateType: 'day',
        deviceIdList: [],
        ratioFlag: true,
        statType: 0,
        startDate: this.parameter.startTime,
        endDate: this.parameter.endTime,
        waterPlantIdList: [this.parameter.waterPlantId]
      };
      const { status, resultData } = await getEnergyDeviceAnalysis(params);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.noData = resultData.every(item => !item.powerPv);
        this.stationList = resultData;
      }
      this.initChart(this.stationList);
    },
    initChart(val) {
      const createSvg = (shadowColor, shadowBlur) => `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
        x="0px" y="0px"
        viewBox="0 0 32 128"
        xml:space="preserve"
    >
        <style>
            .st2 {
                fill: transparent;
                stroke: ${shadowColor};
                stroke-width: ${shadowBlur}px;
                filter: url(#chart-inset-shadow);
            }
        </style>
        <defs>
            <filter id="chart-inset-shadow" width="200%" height="200%" x="-50%" y="-50%">
        		<feGaussianBlur in="SourceGraphic" result="gass" stdDeviation="${shadowBlur * 0.75}" />
        		<feMerge>
        			<feMergeNode in="gass" />
        		</feMerge>
        	</filter>
        </defs>
        <path class="st2" d="M0 0 L32 0 L32 128 L0 128 Z" />
    </svg>
`;

      const svgString = createSvg('#00FFD5', 8);
      const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

      const DOMURL = window.URL || window.webkitURL || window;
      const insetShadowUrl = DOMURL.createObjectURL(svg);

      let seriesData = val.map(item => item.powerPv);
      let xData = val.map(item => item.statName);

      let option = {
        grid: {
          top: '14%',
          containLabel: true
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
          },
          formatter: function (param) {
            let value = param[0].value ? param[0].value : '--';
            var resultTooltip =
              '<div >' +
              '<div >' +
              param[0].name +
              '</div>' +
              "<div style='padding-top:5px;'>" +
              "<span style='display:inline-block;border-radius:4px;width:20px;height:10px;background-color:rgba(0, 255, 213, .3);border: 2px solid #00FFD5;'></span>" +
              "<span style=''> " +
              '耗电间' +
              ': </span>' +
              "<span style=''>" +
              value +
              '</span><span></span>' +
              '</div>' +
              '</div>';
            return resultTooltip;
          }
        },
        graphic: [
          {
            type: 'text',
            top: '4%',
            left: '2%',
            style: {
              text: '( kwh )',
              fontSize: 12,
              fill: '#D9F7FF'
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
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
          splitLine: {
            show: false
          },
          data: xData
        },
        yAxis: {
          name: '( kwh )',
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          nameTextStyle: {
            align: 'right',
            color: 'transparent',
            padding: [0, 8, 0, 0]
          },
          axisLabel: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 14
          },
          min: 0,
          max: this.noData ? 5 : null,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        series: [
          {
            data: seriesData,
            type: 'pictorialBar',
            symbol: 'image://' + insetShadowUrl,
            barWidth: 18
          },
          {
            data: seriesData,
            type: 'bar',
            barWidth: 18,
            itemStyle: {
              color: 'transparent',
              borderWidth: 3,
              borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#00FFD5'
                },
                {
                  offset: 1,
                  color: '#E2F1FF'
                }
              ]),
              shadowColor: 'blue',
              shadowBlur: 12,
              shadowOffsetX: 0,
              shadowOffsetY: 0
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
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .echart-block {
    width: 100%;
    height: 100%;
    text-align: center;
  }
}
</style>
