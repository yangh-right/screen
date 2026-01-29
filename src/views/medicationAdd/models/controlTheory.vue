<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-09 10:28:17
 * @Description:
-->
<template>
  <unit-card cardTitle="碳源投加系统" cardType="2" :showTime="false">
    <div class="pool-select" slot="headerRight">
      <radio-button @change="lineChange" :options="poolList" v-model="line"></radio-button>
    </div>
    <div class="card-inner">
      <div class="tabs" style="height: 330px;">
        <line-chart v-if="line === 0" :options="firstOption"></line-chart>
        <LineChart v-else :options="oneOption"></LineChart>
      </div>
    </div>
    <div class="card-inner">
      <div class="second_title">
        <div class="title">加药泵运行状况</div>
      </div>
      <div class="tabs" style="height: 275px;">
        <line-chart :options="secondOption"></line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { cloneDeep } from 'lodash';
import * as echarts from 'echarts';
import RadioButton from '../components/RadioButton.vue';
import { doControl } from '@/api/smartProduct';
import { getnewModelHistoryData, getEnergyDayData } from '@/api/warnPredict';
import { todayTicketCreateOrDoneTrend } from '@/api/sludgeProperty.js';
import { getDissolvedOxygenOption as getOption, colorRgb } from './data';
export default {
  name: 'dissolvedOxygen',
  components: {
    RadioButton,
    LineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      firstOption: getOption({ empty: true }),
      firstConfigCode: 'carbon_source_dosing_out_water_quality',
      oneOption: getOption({ empty: true }),
      oneConfigCode: 'carbon_source_dosing_in_water_quality',
      secondOption: getOption({ empty: true }),
      poolList: [
        { value: 0, label: '出水' },
        { value: 1, label: '进水' }
      ],
      line: 0,

      doAnalysisData: {
        northDoSetValue: '',
        southDoSetValue: '',
        northHitRangeRatio: '',
        southHitRangeRatio: ''
      },

      progressColor: {
        '0%': '#3CCAD7',
        '100%': '#00DB89'
      },

      option: {
        color: ['#5BC8FF', '#5BFF72'],
        series: [],
        grid: {
          left: '3%',
          right: '4%',
          top: '15%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          show: true,
          data: [],
          top: 6,
          icon: 'rect',     // ✅ 矩形（看起来就是小方块）
          itemWidth: 10,    // 方块宽
          itemHeight: 10,   // 方块高（=宽 就是正方形）
          right: 6,
          textStyle: {
            color: '#D9F7FF',
            fontWeight: 400,
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            axisLabel: {
              rotate: 40
            },
            axisLine: {
              show: false,
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            splitLine: { show: false },   // ✅ 关掉横线
            nameTextStyle: {
              align: 'right'
            }
          },
          {
            type: 'value',
            name: '',
            min: 0,
            max: 1,
            show: false,
            position: 'right',
            nameTextStyle: {
              align: 'left'
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ]
      }
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.getFirstData()
          this.getLeftOneData()
          this.getSecondData()
        }
      },
      immediate: true,
    }
  },
  mounted() {
  },
  methods: {
    async getSecondData() {
      if (!this.waterPlantId) return;
      let params = {
        endDate: moment().subtract(1, 'days')
          .format('YYYY-MM-DD'),
        startDate: moment().subtract(8, 'days')
          .format('YYYY-MM-DD'),
        waterPlantIdList: [this.waterPlantId]
      };
      let { resultData, status } = await getEnergyDayData(params);
      let tmpOption = cloneDeep(this.option);
      if (status === 'complete') {
        let xData = resultData?.map(data => {
          const dateStr = `${data.date}` || '';
          return dateStr.slice(-5);
        }) || [];
        let yData = resultData?.map(data => {
          return data.sodiumAcetatePv == null ? 0 : Number(data.sodiumAcetatePv) || 0;
        }) || [];
        let series = [{
          name: '碳源消耗量',
          data: yData || [],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorRgb('#007e7f', 0.5) },
              { offset: 1, color: colorRgb('#007e7f', 0.1) }
            ])
          }
        }];

        tmpOption.series = series;
        tmpOption.legend.data = ['碳源消耗量'];
        tmpOption.xAxis[0].data = xData;
        tmpOption.xAxis[0].axisLabel.rotate = 0;
        tmpOption.yAxis[0] = {
          type: 'value',
          name: 'm³',
          splitLine: { show: false },   // ✅ 关掉横线
          nameTextStyle: {
            align: 'right'
          }
        };
        // 右侧Y轴保持0-1范围
        tmpOption.yAxis[1] = {
          type: 'value',
          splitLine: { show: false },   // ✅ 关掉横线
          name: '',
          min: 0,
          max: 1,
          show: false,
          position: 'right',
          nameTextStyle: {
            align: 'left'
          },
          axisLine: {
            show: false
          },
        };
        tmpOption.color = ['#007e7f'];
        this.secondOption = tmpOption;
      }
    },

    async getLeftOneData() {
      if (!this.waterPlantId) return;
      this.oneOption = await this.getSingleCommonData1(this.oneConfigCode);
    },
    async getFirstData() {
      if (!this.waterPlantId) return;
      this.firstOption = await this.getSingleCommonData(this.firstConfigCode);
    },
    async getSingleCommonData1(configCode) {
      let params = {
        endDateTime: moment().format('YYYY-MM-DD 08:00:00'),
        startDateTime: moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD 08:00:00'),
        waterPlantId: this.waterPlantId,
        configCode: configCode
      };
      const { resultData, status } = (await getnewModelHistoryData(params)) || {};
      let tmpOption = cloneDeep(this.option);
      if (status === 'complete' && resultData && resultData.length > 0) {
        let xData = resultData?.[0]?.timeDataList?.map(data => `${data.dateTimeStr}:00`) || [];

        // 找出 TN 和 NH3-N 的数据
        let tnData = null;
        let nh3nData = null;
        resultData?.forEach(item => {
          if (item.pointMemo && item.pointMemo.includes('TN')) {
            tnData = item;
          } else if (item.pointMemo && (item.pointMemo.includes('NH'))) {
            nh3nData = item;
          }
        });

        let series = [];
        // TN 使用左侧 Y 轴 (yAxisIndex: 0)
        if (tnData) {
          let yData = tnData.timeDataList?.map(data => data.historyPointValue);
          series.push({
            name: tnData.pointMemo,
            data: yData || [],
            type: 'line',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb('#5BC8FF', 0.5) },
                { offset: 1, color: colorRgb('#5BC8FF', 0.1) }
              ])
            }
          });
        }
        // NH3-N 使用右侧 Y 轴 (yAxisIndex: 1)
        if (nh3nData) {
          let yData = nh3nData.timeDataList?.map(data => data.historyPointValue);
          series.push({
            name: nh3nData.pointMemo,
            data: yData || [],
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb('#8B7AFF', 0.5) },
                { offset: 1, color: colorRgb('#8B7AFF', 0.1) }
              ])
            }
          });
        }

        tmpOption.series = series;
        // 设置图例数据
        let legendData = [];
        if (tnData) legendData.push(tnData.pointMemo);
        if (nh3nData) legendData.push(nh3nData.pointMemo);
        tmpOption.legend.data = legendData;
        tmpOption.xAxis[0].data = xData;
        tmpOption.color = ['#5BC8FF', '#8B7AFF'];

        // 左侧Y轴配置 - TN
        tmpOption.yAxis[0] = {
          type: 'value',
          splitLine: { show: false },   // ✅ 关掉横线
          name: tnData?.pointUnit || 'mg/L',
          max: (value) => {
            return (value.max * 1.2).toFixed(2);
          },
          nameTextStyle: {
            align: 'right'
          }
        };

        // 右侧Y轴配置 - NH3-N (动态范围)
        tmpOption.yAxis[1] = {
          type: 'value',
          name: nh3nData?.pointUnit || 'mg/L',
          max: (value) => {
            return (value.max * 1.5).toFixed(2);
          },
          show: true,
          position: 'right',
          nameTextStyle: {
            align: 'left'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        };
      }
      return tmpOption;
    },
    async getSingleCommonData(configCode) {
      let params = {
        endDateTime: moment().format('YYYY-MM-DD 08:00:00'),
        startDateTime: moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD 08:00:00'),
        waterPlantId: this.waterPlantId,
        configCode: configCode
      };
      const { resultData, status } = (await getnewModelHistoryData(params)) || {};
      let tmpOption = cloneDeep(this.option);
      if (status === 'complete') {
        let xData = resultData?.[0]?.timeDataList?.map(data => `${data.dateTimeStr}:00`) || [];

        // 找出 TN 和 NH3-N 的数据
        let tnData = null;
        let nh3nData = null;
        resultData?.forEach(item => {
          if (item.pointMemo && item.pointMemo.includes('TN')) {
            tnData = item;
          } else if (item.pointMemo && (item.pointMemo.includes('NH'))) {
            nh3nData = item;
          }
        });

        let series = [];
        // TN 使用左侧 Y 轴 (yAxisIndex: 0)
        if (tnData) {
          let yData = tnData.timeDataList?.map(data => data.historyPointValue);
          series.push({
            name: tnData.pointMemo,
            data: yData || [],
            type: 'line',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb('#5BC8FF', 0.5) },
                { offset: 1, color: colorRgb('#5BC8FF', 0.1) }
              ])
            }
          });
        }
        // NH3-N 使用右侧 Y 轴 (yAxisIndex: 1)
        if (nh3nData) {
          let yData = nh3nData.timeDataList?.map(data => data.historyPointValue);
          series.push({
            name: nh3nData.pointMemo,
            data: yData || [],
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 10,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb('#8B7AFF', 0.5) },
                { offset: 1, color: colorRgb('#8B7AFF', 0.1) }
              ])
            }
          });
        }

        tmpOption.series = series;
        // 设置图例数据
        let legendData = [];
        if (tnData) legendData.push(tnData.pointMemo);
        if (nh3nData) legendData.push(nh3nData.pointMemo);
        tmpOption.legend.data = legendData;
        tmpOption.xAxis[0].data = xData;
        tmpOption.color = ['#5BC8FF', '#8B7AFF'];

        // 左侧Y轴配置 - TN
        tmpOption.yAxis[0] = {
          type: 'value',
          splitLine: { show: false },   // ✅ 关掉横线
          name: tnData?.pointUnit || 'mg/L',
          max: (value) => {
            return (value.max * 1.2).toFixed(2);
          },
          nameTextStyle: {
            align: 'right'
          }
        };

        // 右侧Y轴配置 - NH3-N (动态范围)
        tmpOption.yAxis[1] = {
          type: 'value',
          name: nh3nData?.pointUnit || 'mg/L',
          max: (value) => {
            return (value.max * 1.5).toFixed(2);
          },
          show: false,
          position: 'right',
          nameTextStyle: {
            align: 'left'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        };
      }
      return tmpOption;
    },
    lineChange() {
      this.getFirstData()
      this.getLeftOneData()
      this.getSecondData()
    },
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 50%;
  padding: 15px 0px;

  .second_title {
    width: 100%;
    height: 28px;
    padding: 0 50px;
    display: flex;
    justify-content: space-between;
    background: url('~@/assets/img/smartProduct/second_title-bg.png') no-repeat;
    background-size: 100% 100%;
    padding-bottom: 10px;

    .title {
      display: flex;
      align-items: center;
      font-family: AlibabaPuHuiTi_2_65_Medium, sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: #d8edff;
      letter-spacing: 0;
    }
  }

  .tabs {
    width: 100%;
    height: calc(100% - 20px);
    margin-top: 12px;
    display: flex;
    justify-content: flex-start;

    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90px;
      height: 28px;

      background: url('~@/assets/img/smartProduct/btn-unselect.png') no-repeat;
      background-size: 100% 100%;
      font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: #d9ecff;
      letter-spacing: 0;
      text-align: center;
      cursor: pointer;
    }

    .tab-active {
      background: url('~@/assets/img/smartProduct/btn-select.png') no-repeat;
      background-size: 100% 100%;
    }
  }

  .chart {
    height: 220px;
  }
}
</style>
