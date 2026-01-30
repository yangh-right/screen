<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-08 19:15:04
 * @Description:
-->
<template>
  <unit-card cardTitle="过程指标" cardType="3" :showTime="false">
    <div class="aaa">
      <div class="card-inner">
        <div class="second_title">
          <div class="pool-select" slot="headerRight">
            <radio-button @change="lineChange" :options="poolList" v-model="line"></radio-button>
          </div>
        </div>
        <div class="echart-block developing-tip" style="height: 285px;">
          <line-chart v-if="line === 0" :options="twoOption"></line-chart>
          <line-chart v-else :options="threeOption"></line-chart>
        </div>
      </div>
      <div class="card-inner">
        <div class="second_title">
          <div class="title">加药泵反馈</div>
        </div>
        <div class="pump-feedback-grid">
          <div class="pump-card" v-for="(item, index) in pumpFeedbackList" :key="index">
            <div class="pump-icon">
              <img src="@/assets/shui.webp" alt="pump" />
            </div>
            <div class="pump-label">{{ item.label }}</div>
            <div class="pump-value-wrap">
              <div class="pump-value">{{ item.value }}<span class="pump-unit">{{ item.rag }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import * as echarts from 'echarts';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { queryPointHistoryData } from '@/api/energyAnalyse';
import { getnewModelHistoryData, getRealDataByPointConfigCode } from '@/api/warnPredict';
import RadioButton from '../components/RadioButton.vue';
import { processPointsData, POINTS_CONFIG, POINTS_LIST, getValue, colorRgb, getDissolvedOxygenOption as getOption } from './data';
import { genOption } from './config';
const BASE_CHART_CONFIG = {
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
    show: true,
    data: [],
    icon: 'rect',
    itemWidth: 10,
    itemHeight: 10,
    top: 6,
    right: 10,
    textStyle: {
      color: '#D9F7FF',
      fontWeight: 400,
      fontSize: 12
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    top: '15%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      show: false,
      alignWithLabel: true
    },
    splitLine: {
      show: false // 显示分割线
    },
    axisLabel: {
      showMaxLabel: true,
      showMinLabel: true,
      fontSize: 14,
      rotate: 40,
      margin: 24,
      align: 'center',
      color: '#BAC9E7'
    }
  },
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: false, //分割线
        lineStyle: {
          type: [5, 5],
          color: 'rgba(255,255,255,0.2)'
        }
      },
      axisLine: {
        show: false
      },
      name: 'mg/L',
      nameTextStyle: {
        fontSize: 14,
        color: '#BAC9E7',
        padding: [0, 30, 0, 0]
      },
      axisLabel: {
        fontSize: 14,
        color: '#BAC9E7'
      }
    }
  ],
  series: []
};
const BASE_LINE_SERIES = {
  name: '',
  type: 'line',
  smooth: true,
  symbolSize: 12,
  symbol:
    'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAl1JREFUSEu9lk1IVFEUx3/nPmcmTAgN+5jpi4KKQk0JWqWbFgpBGCG0TNCFQmsLIiKo1oEtFGwZDJEEgS7aqKsgNBWjWkRaM5GSEWQ0M7574j1n5Dn5Bfl8y3fuPb97/+fc/73CJr4p1ShzVNg/7PSGmx0sUMn8aZHsRtNlvQET01ruGq6IocFaDiFLAJQFY5hRy5BjeVp9WH6slWdVwOtPur8kSgdKuyp7AAvMAb/yicqASm8zIsxaocdmeXT2iHwtBv0DGE/pCQv3US7lEwwqvHCESdUlgAhlrlIlcFGVRn8BwnMDN2oS8j4IWQHwkysvgQPAkDE8qInL4Hoyjqe10Vq6gAbgixEuBCHLAE8WJ0I3SjPCsFPCteq98nGjInrxiW961F3kMUo9Qr+bo7Mg1zJgNK13xXLTwIhEaN1s8sICfEiOPuC8Gu7VxeWWL6e/gmkttyW88wpqDE0bybLWrvJyDXiFN4uc9LrLB4x91jaEHhEGzySkKZhAVZ1sllOu4U5eZy/steftaJS3IuIGx79J6YBfeKW99qD0ineIcmn6VLmKcL02Id3BCZmMVrmGXoVzRd3xyrG0xWIyGfw/ltJOlIciPInEaZWpWd2XyZAU4bhjaKmOy3Bwwu+cPlNoXk0Wgf7SiFwOxibSWu9akqp8iMVokckZPZYzJAV2GaGlJiGjRYDvChVrAOZLI7I7GBtPaZ1Vkgo/I3Y7AKFLFHqRQ2/TbTloHqRgFcCIs9VW4QFCNzsPErRrA0NspV0XDkuoF04B4sllonSYMK7MFb4S1qVf7Dv/82z5CynFsTQu0JXhAAAAAElFTkSuQmCC',

  data: [],
  itemStyle: {
    color: '#00C9FF',
    borderColor: '#00C9FF',
    borderWidth: 1,
    normal: {
      lineStyle: {
        color: '#00C9FF',
        width: 2 // 折线宽度
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: 'rgba(0,201,255,0.05)'
          },
          {
            offset: 1,
            color: 'rgba(0,201,255,0.45)'
          }
        ])
      }
    }
  }
};
// 添加图表颜色配置常量
const CHART_COLORS = [
  {
    lineColor: '#0092f6',
    areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      { offset: 0, color: 'rgba(7,44,90,0.3)' },
      { offset: 1, color: 'rgba(0,146,246,0.9)' }
    ])
  },
  {
    lineColor: '#00d4c7',
    areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      { offset: 0, color: 'rgba(7,44,90,0.3)' },
      { offset: 1, color: 'rgba(0,212,199,0.9)' }
    ])
  },
  {
    lineColor: '#aecb56',
    areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      { offset: 0, color: 'rgba(7,44,90,0.3)' },
      { offset: 1, color: 'rgba(114,144,89,0.9)' }
    ])
  },
  {
    lineColor: '#B06BFF',
    areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      { offset: 0, color: 'rgba(202,125,255,0.3)' },
      { offset: 1, color: 'rgba(138,48,255,0.9)' }
    ])
  },
  {
    lineColor: '#FFB86C',
    areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      { offset: 0, color: 'rgba(90,44,7,0.3)' },
      { offset: 1, color: 'rgba(255,184,108,0.9)' }
    ])
  },
  {
    lineColor: '#4ECDC4',
    areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      { offset: 0, color: 'rgba(7,90,84,0.3)' },
      { offset: 1, color: 'rgba(78,205,196,0.9)' }
    ])
  },
  {
    lineColor: '#45B7D1',
    areaColor: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      { offset: 0, color: 'rgba(7,73,90,0.3)' },
      { offset: 1, color: 'rgba(69,183,209,0.9)' }
    ])
  }
];

export default {
  name: 'valvePrecision',
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
      twoOption: getOption({ empty: true }),
      twoConfigCode: 'carbon_source_dosing_bio_pool_north_water_quality',

      threeOption: getOption({ empty: true }),
      threeConfigCode: 'carbon_source_dosing_bio_pool_south_water_quality',
      chartOptions: { ...JSON.parse(JSON.stringify(BASE_CHART_CONFIG)) },
      barOption: { ...JSON.parse(JSON.stringify(BASE_CHART_CONFIG)) },
      line: 0,
      tabs: [],
      currentPoint: 'COD',
      tabs1: [
        {
          label: '生化池',
          value: 'biocycle_pool'
        },
        {
          label: '高效沉淀池',
          value: 'high-density_pool'
        },
        {
          label: '气浮池',
          value: 'air_fotation_tank'
        }
      ],
      tabPointActive: 'biocycle_pool',
      poolList: [
        { value: 1, label: '北池' },
        { value: 2, label: '南池' }
      ],
      pumpFeedbackList: []
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.getLeftTwoData();
          this.getLeftThreeData();
          this.getRealData();
        }
      },
      immediate: true
    },
    tabPointActive: {
      handler(val) {
        if (val) {
          this.getLeftTwoData();
          this.getLeftThreeData();
          this.getRealData();
        }
      }
    }
  },

  methods: {
    async getRealData() {
      let params = {
        "configCode": "carbon_source_dosing_flow",
        "pumpHouseId": "1932771122805809153"
      };
      let res = await getRealDataByPointConfigCode(params);
      if (res.success) {
        console.log(res.resultData, 'ppp');
        this.pumpFeedbackList = res.resultData.map(item => {
          return {
            value: item.pointValueRatio,
            label: item.pointMemo,
            rag: item.pointUnit
          };
        });
      }
    },
    async getLeftTwoData() {
      if (!this.waterPlantId) return;
      this.twoOption = await this.getSingleCommonData(this.twoConfigCode);
    },

    async getLeftThreeData() {
      if (!this.waterPlantId) return;
      this.threeOption = await this.getSingleCommonData(this.threeConfigCode);
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
      let tmpOption = cloneDeep(BASE_CHART_CONFIG);
      if (status === 'complete') {
        let xData = resultData?.[0]?.timeDataList?.map(data => `${data.dateTimeStr}:00`) || [];
        let series = resultData?.map((item, index) => {
          let yData = item.timeDataList?.map(data => data.historyPointValue);
          // 使用协调的颜色配置
          const colorConfig = CHART_COLORS[index % CHART_COLORS.length];
          return {
            name: item.pointMemo,
            data: yData || [],
            type: 'line',
            smooth: false, // 折线不平滑，使用直线连接
            symbol: 'circle', // 圆形数据点
            symbolSize: 10, // 数据点大小
            showSymbol: true, // 显示所有数据点
            lineStyle: {
              color: colorConfig.lineColor,
              width: 2
            },
            itemStyle: {
              color: '#fff', // 数据点内部填充白色
              borderColor: colorConfig.lineColor, // 数据点边框颜色
              borderWidth: 2 // 数据点边框宽度
            },
            areaStyle: {
              color: colorConfig.areaColor // 保留阴影填充
            }
          }
        });

        tmpOption.series = series;
        tmpOption.xAxis.data = xData;
        // 设置图例数据
        tmpOption.legend.data = resultData?.map(item => item.pointMemo) || [];
        // 保留左侧Y轴配置
        if (resultData && resultData.length > 0) {
          tmpOption.yAxis[0] = {
            type: 'value',
            splitLine: { show: false },   // ✅ 关掉横线
            name: resultData[0].pointUnit || '',
            nameTextStyle: {
              align: 'right'
            }
          };
        }
        // 右侧Y轴保持0-1范围
        tmpOption.yAxis[1] = {
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
        };
      }
      return tmpOption;
    },

    async getCommonData(configCode) {
      let params = {
        endDateTime: moment().format('YYYY-MM-DD 08:00:00'),
        startDateTime: moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD 08:00:00'),
        waterPlantId: this.waterPlantId,
        configCode: configCode
      };
      const { resultData, status } = (await getnewModelHistoryData(params)) || {};
      if (status === 'complete') {
        return resultData?.map(item => {
          let xData = item.timeDataList?.map(data => `${data.dateTimeStr}:00`);
          let yData = item.timeDataList?.map(data => data.historyPointValue);
          let option = genOption({
            xData,
            yData,
            yAxisName: item.pointUnit,
            xAxisRotate: 40
          });
          let isNoData = yData?.some(data => data != null);
          if (!isNoData) {
            option.yAxis[0].min = 0;
            option.yAxis[0].max = 5;
          } else {
            delete option.yAxis[0].min;
            delete option.yAxis[0].max;
          }
          return {
            value: item.pointName,
            label: item.pointMemo,
            option
          };
        }) || [];
      }
      return [];
    },
    lineChange() {
      this.getLeftTwoData();
      this.getLeftThreeData();
    },
    async fetchData() {
      if (!this.waterPlantId) return;
      try {
        const params = {
          endDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          startDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD 08:00:00'),
          configCode: 'phosphorus_removal_agent_is_added',
          timePeriod: 'HOURS',
          waterPlantId: this.waterPlantId
        };
        const { resultData, status } = await queryPointHistoryData(params);
        // 处理数据逻辑
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },
    async fetchPointData() {
      if (!this.waterPlantId) return;
      try {
        const params = {
          endDateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          startDateTime: moment().subtract(1, 'days').format('YYYY-MM-DD 08:00:00'),
          configCode: this.tabPointActive,
          timePeriod: 'HOURS',
          waterPlantId: this.waterPlantId
        };
        const { resultData, status } = await queryPointHistoryData(params);
        // 处理数据逻辑
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },
    handlePointTab(value) {
      this.tabPointActive = value;
    }
  }
}
</script>

<style lang="less" scoped>
.aaa {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}


.card-inner {
  width: calc(50% - 10px);
  height: calc(100% - 18px);
  /* 减去 margin-top 的偏移 */
  margin-top: 18px;
  display: flex;
  flex-direction: column;

  .second_title {
    width: 100%;
    height: 28px;
    padding: 0 50px;
    display: flex;
    justify-content: right;
    background: url('~@/assets/img/smartProduct/second_title-bg.png') no-repeat;
    background-size: 100% 100%;
    padding-bottom: 10px;
    flex-shrink: 0;

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
    height: 30px;
    margin-top: 12px;
    display: flex;
    justify-content: flex-start;
    flex-shrink: 0;

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

  .echart-block {
    width: 100%;
    flex: 1;
    min-height: 0;
    margin-top: 12px;
  }

  .chart {
    height: 100%;
  }
}

// 加药泵反馈卡片网格布局
.pump-feedback-grid {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px 5px;
  flex: 1;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
}

.pump-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex: 1;
  min-width: 0;
  padding: 10px 4px 15px 4px;
  background: rgba(0, 45, 95, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 168, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 60, 120, 0.6);
    border-color: rgba(0, 212, 255, 0.8);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0, 212, 255, 0.2);
  }

  // 四角装饰增强 - 顶部
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: #00d4ff;
    border-style: solid;
    z-index: 2;
    animation: cornerPulse 2s infinite ease-in-out;
  }

  &::before {
    top: 4px;
    left: 4px;
    border-width: 2px 0 0 2px;
  }

  &::after {
    top: 4px;
    right: 4px;
    border-width: 2px 2px 0 0;
  }

  // 底部装饰
  .pump-value-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: static;
    /* 修改为 static 让 pseudo 元素相对于 card 定位，或者保持并调整 wrap 的尺寸 */

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border-color: #00d4ff;
      border-style: solid;
      bottom: 4px;
      /* 内部定位 */
      animation: cornerPulse 2s infinite ease-in-out;
      z-index: 2;
    }

    &::before {
      left: 4px;
      border-width: 0 0 2px 2px;
    }

    &::after {
      right: 4px;
      border-width: 0 2px 2px 0;
    }
  }
}

.pump-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 5px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px dashed rgba(0, 212, 255, 0.3);
    border-radius: 50%;
    animation: rotateCircle 10s linear infinite;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 50%;
    z-index: 1;
    filter: drop-shadow(0 0 6px rgba(0, 212, 255, 0.4));
    animation: iconPulse 3s infinite ease-in-out;
  }
}

.pump-label {
  font-size: 12px;
  color: #ffffff;
  background: rgba(0, 100, 200, 0.4);
  padding: 4px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  text-align: center;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin-bottom: 5px;
  box-shadow: 0 0 10px rgba(0, 100, 200, 0.2);
  white-space: normal;
  word-break: break-all;
  line-height: 1.3;
  width: 92%;
  min-height: 32px;
  /* 保证折行后的一致性 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.pump-value {
  font-family: 'DIN Alternate', 'Roboto Mono', monospace;
  font-size: 24px;
  font-weight: bold;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.7);
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.pump-unit {
  font-size: 12px;
  font-weight: normal;
  color: #a8d6f5;
  opacity: 0.7;
}

// 动画定义
@keyframes rotateCircle {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes iconPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }

  50% {
    transform: scale(1.03);
    opacity: 1;
  }
}

@keyframes cornerPulse {

  0%,
  100% {
    opacity: 0.5;
    filter: brightness(1);
  }

  50% {
    opacity: 1;
    filter: brightness(1.3);
  }
}
</style>
