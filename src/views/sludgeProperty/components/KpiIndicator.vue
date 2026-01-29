<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="kpi-box">
        <div class="points-list">
          <div
            v-for="(item, i) in pointsArr"
            :key="item.name"
            :style="{ background: `url(${item.imgUrl}) no-repeat` }"
            :class="['point-tab', `point-tab` + (i + 1)]"
          >
            <div class="value">
              {{ item.value }} <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="label">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import UnitCard from './UnitCard';
import { baseAnalysis, basic } from '@/api/deviceManager.js';
export default {
  name: 'KpiIndicator',
  components: {
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
      pointsArr: [
        {
          name: '工单废止率',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/indicator1.png')
        },
        {
          name: '工单超时率',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/indicator2.png')
        },
        {
          name: '工单办结率',
          value: 0,
          unit: '%',
          imgUrl: require('@/assets/img/indicator3.png')
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    async initData() {
      let data = {
        dateType: 'day',
        dateRangeType: 'dayRange',
        dateUnit: 'M',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        SysCode: 'water_purification'
      };
      const baseAnalysisData = await baseAnalysis(data);
      if (baseAnalysisData.status === 'complete') {
        baseAnalysisData.resultData.forEach(item => {
          if (item.countsType === 'finishTicketRate') this.pointsArr[2].value = item.counts;
          if (item.countsType === 'colseRate') this.pointsArr[0].value = item.counts;
        });
      }
      const basicData = await basic(data);
      if (basicData.status === 'complete') {
        this.pointsArr[1].value = basicData.resultData.timeoutTicketRate.nowCycle;
      }
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
  justify-content: center;
  align-items: flex-start;
  .kpi-box {
    width: 227px;
    height: 227px;
    background: url('~@/assets/img/kpi-indicator.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;

    .points-list {
      width: 100%;
      height: 100%;
      position: relative;

      .point-tab {
        width: 136px;
        height: 136px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-size: 100% 100%;

        .value {
          font-family: Oswald-Bold, sans-serif;
          background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 22px;
          font-weight: 500;

          .unit {
            font-family: Aliba, sans-serif;
            color: #ffffff;
            font-size: 22px;
            font-weight: 500;
          }
        }

        .label {
          font-family: Aliba, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d9f7ff;
          margin-top: 2px;
        }
      }
      .point-tab1 {
        position: absolute;
        top: 46px;
        left: -68px;
      }
      .point-tab2 {
        position: absolute;
        top: 6px;
        right: -64px;
      }
      .point-tab3 {
        position: absolute;
        top: 136px;
        right: -30px;
      }
    }
  }
}
</style>
