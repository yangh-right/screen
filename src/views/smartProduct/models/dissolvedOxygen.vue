<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description:
-->
<template>
  <unit-card cardTitle="溶氧控制">
    <div class="pool-select" slot="headerRight">
      <radio-button @change="lineChange" :options="poolList" v-model="line"></radio-button>
    </div>
    <div class="echart-block developing-tip">
      <LineChart v-if="line === 0" :options="threeOption"></LineChart>
      <LineChart v-else :options="oneOption"></LineChart>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { cloneDeep } from 'lodash';
import * as echarts from 'echarts';
import RadioButton from '../components/RadioButton.vue';
import { doControl } from '@/api/smartProduct';
import { getnewModelHistoryData } from '@/api/warnPredict';
import { todayTicketCreateOrDoneTrend } from '@/api/sludgeProperty.js';
import LineChart from '@/components/chart/Chart.vue';
import { getDissolvedOxygenOption as getOption, colorRgb } from './data';
export default {
  name: 'dissolvedOxygen',
  components: {
    RadioButton,
    LineChart,
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
      oneOption: getOption({ empty: true }),
      threeOption: getOption({ empty: true }),
      oneConfigCode: 'bio_reactor_north_precise_aeration',
      threeConfigCode: 'bio_reactor_south_precise_aeration',
      poolList: [
        { value: 0, label: '南池' },
        { value: 1, label: '北池' }
      ],
      line: 0,
      option: {
        color: ['#5BC8FF', '#5BFF72'],
        series: [],
        grid: [
          {
            left: '16px',
            right: '12px',
            top: '60px',
            bottom: '12px',
            containLabel: true
          }
        ],
        legend: {
          show: true,
          top: 6,
          right: 6,
          icon: 'rect',
          itemHeight: 2,
          itemWidth: 12
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
            min: 0,
            max: 100,
            nameTextStyle: {
              align: 'right'
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
          this.getLeftOneData();
          this.getLeftThreeData();
          this.handleChart();
        }
      },
      immediate: true,
    }
  },
  mounted() {
  },
  methods: {
    async getLeftThreeData() {
      if (!this.waterPlantId) return;
      this.threeOption = await this.getSingleCommonData(this.threeConfigCode);
    },
    async getLeftOneData() {
      if (!this.waterPlantId) return;
      this.oneOption = await this.getSingleCommonData(this.oneConfigCode);
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
      if (status === 'complete' && resultData?.length) {
        let xData = resultData?.[0]?.timeDataList?.map(data => `${data.dateTimeStr}:00`) || [];
        let series = resultData?.map(item => {
          let yData = item.timeDataList?.map(data => data.historyPointValue);
          return {
            name: item.pointMemo,
            data: yData || [],
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb('#5BC8FF', 0.5) },
                { offset: 1, color: colorRgb('#5BC8FF', 0.1) }
              ])
            }
          }
        });

        tmpOption.series = series;
        tmpOption.xAxis[0].data = xData;
        tmpOption.yAxis = resultData?.map(item => {
          return {
            type: 'value',
            name: item.pointUnit || '',
            min: 0,
            max: 100,
            nameTextStyle: {
              align: 'right'
            }
          }
        });
      }
      return tmpOption;
    },
    lineChange() {
      this.getLeftOneData();
      this.getLeftThreeData();
      this.handleChart();
    },
    async handleChart() {
      let params = {
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        line: this.line,
        queryType: 'hours',
        startTime: moment().subtract(1, 'days').format('YYYY-MM-DD 08:00:00'),
        waterPlantId: this.waterPlantId
      };
      const { resultData, status } = await doControl(params);
      if (status === 'complete') {
        let xData = resultData?.[0]?.dataAndTimeList?.map(item => item.date?.slice(11, 16)) || [];
        let isEmpty = !xData.length;
        if (isEmpty) {
          this.option = getOption({ empty: true });
          return;
        }
        let option = getOption({
          xData,
          yAxisName: resultData?.[0]?.unit || 'mg/L'
        });
        let pointList = ['finalDO', 'DO'];
        pointList.forEach((item, index) => {
          let curPoint = resultData?.find(point => point.pointName === item);
          if (curPoint) {
            option.series[index].data = curPoint.dataAndTimeList?.map(val => val.pv) || [];
          }
        });
        this.option = option;
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .card-title__right {
  right: 23px !important;
}

.echart-block {
  width: 100%;
  height: 100%;
}

.developing-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}
</style>
