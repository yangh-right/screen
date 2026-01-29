<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-05-07 15:58:05
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-09-12 17:26:19
 * @Description:
-->
<template>
  <unit-card cardTitle="进水曲线" cardType="3">
    <div class="warn-diagnosis">
      <radio-button class="radio-button" :options="pointList" v-model="pointCode" />
      <div class="chart-wrap">
        <line-chart ref="lineChart" :options="option"></line-chart>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import LineChart from '@/components/chart/Chart.vue';
import { inflowModelHistoryData } from '@/api/warnPredict';
import { genInWaterOption } from './config';
import UnitCard from '@/components/UnitCard.vue';
import RadioButton from '@/components/RadioButton.vue';
export default {
  props: {
    alarmInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      pointCode: '',
      option: genInWaterOption(),
      pointList: [],
      date: [moment().startOf('day'), moment().endOf('day')]
    };
  },

  components: { UnitCard, LineChart, RadioButton },
  watch: {
    alarmInfo: {
      handler(val) {
        this.date = [
          moment(this.alarmInfo.startTime).subtract(12, 'hours').startOf('day'),
          moment(this.alarmInfo.startTime).add(12, 'hours').endOf('day')
        ];
        this.getData();
      },
      immediate: true
    },
    pointCode: {
      handler(val) {
        this.option = this.pointList.find(item => item.value === this.pointCode)?.option || {};
      }
    }
  },
  methods: {
    async getData() {
      if (this.alarmInfo.pumpHouseId && this.alarmInfo.expertDecisionType) {
        let params = {
          waterPlantId: this.alarmInfo.pumpHouseId,
          startTime: this.date?.[0].format('YYYY-MM-DD HH:mm:ss') || '',
          endTime: this.date?.[1].format('YYYY-MM-DD HH:mm:ss') || ''
        };
        const { resultData, status } = await inflowModelHistoryData(params);
        if (status === 'complete') {
          this.pointList =
            resultData?.map(item => {
              let xData = item.timeDataList?.map(data => data.dateTimeStr);
              let yData = item.timeDataList?.map(data => data.historyPointValue);
              return {
                value: item.pointName,
                label: item.pointMemo,
                option: genInWaterOption({
                  xData,
                  yData,
                  yAxisName: item.pointUnit,
                  seriesName: item.pointMemo
                })
              };
            }) || [];
          let curPointIndex = this.pointList.findIndex(item => item.value === this.pointCode);
          if (this.pointCode && curPointIndex > -1) {
            this.option = this.pointList?.[curPointIndex]?.option || genInWaterOption();
          } else {
            this.option = this.pointList?.[0]?.option || genInWaterOption();
            this.pointCode = this.pointList?.[0]?.value || '';
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .circle-radio {
  margin-left: 12px;
  .wpg-radio-wrapper {
  }
  .wpg-radio-button-wrapper:not(:first-child)::before {
    display: none;
  }
  .wpg-radio-button-wrapper:last-child {
    margin-right: 0;
  }
  .wpg-radio-button-wrapper {
    margin-right: 8px;
    border-radius: 13px;
    color: var(--supply-color-secondary);
    padding: 5px 15px !important;
    height: 26px;
    position: relative;
    font-size: 12px;
    line-height: 16px;
    background: var(--supply-color-bg-card-dark);
    border: 1px solid #d9d9d9 !important;
    transition: all 0.2s ease;

    &.wpg-radio-button-wrapper-checked {
      color: var(--supply-color-online);
      box-shadow: none !important;
      outline: none !important;
      /* 新增：亮眼背景渐变 + 细边框强化 */
      background: linear-gradient(120deg, rgba(22, 119, 255, 0.1), rgba(22, 119, 255, 0.05));
      border: 1px solid var(--supply-color-online) !important;
      /* 新增：放大文字/加粗，进一步突出 */
      font-weight: 600;
      transform: scale(1.05); /* 轻微放大，增强感知 */
    }
  }
}

.chart-wrap {
  height: calc(100% - 32px);
}
.circle-radio {
  margin-left: 0px;
  margin-top: 6px;
}
/deep/ .card-box__title {
  .text {
    max-width: 150px;
  }
}
.warn-diagnosis {
  width: 100%;
  height: 100%;
  position: relative;
  .btn {
    width: 282px !important;
    z-index: 10;
    position: absolute;
    right: 16px;
    top: 10px;
  }
}
</style>
