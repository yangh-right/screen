<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="kpi-box">
        <div class="points-list">
          <div v-for="item in pointsArr" :key="item.name" class="point-tab">
            <div class="value">
              {{ !!item.value ? item.value : '--' }} <span class="unit">{{ item.unit }}</span>
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
import { statusStatistics } from '@/api/deviceManager.js';

export default {
  name: 'KpiAlasysis',
  components: {
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
    }
  },
  data() {
    return {
      pointsArr: [
        {
          name: '设备完好率',
          value: 0,
          code: 'onlineAndNotAlarmRate',
          unit: '%'
        },
        {
          name: '设备在线率',
          code: 'onlineRate',
          value: 0,
          unit: '%'
        },
        {
          name: '设备故障率',
          code: 'alarmRate',
          value: 0,
          unit: '%'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    async initData() {
      let data = {
        queryType: 'month',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        waterPlantId: this.waterPlantId
      };
      const { status, resultData } = await statusStatistics(data);
      if (status === 'complete') {
        let rate = {
          onlineAndNotAlarmRate: parseInt(Math.floor(Number(resultData.normal) * 100) / Number(resultData.total)),
          onlineRate: Math.floor(Number(resultData.online) * 100) / Number(resultData.total),
          alarmRate: Math.floor(Number(resultData.breakdown) * 100) / Number(resultData.total)
        };
        this.pointsArr.forEach(item => {
          item.value = parseFloat(rate[item.code].toFixed(2));
        });
      }
    }
  },
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
  .kpi-box {
    width: 427px;
    height: 221px;
    background: url('~@/assets/img/hz/kpi-bg.png') no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 27px;

    .points-list {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      padding: 0 8px;

      .point-tab {
        width: 120px;
        height: 100%;
        padding-top: 100px;
        box-sizing: border-box;
        text-align: center;

        .value {
          font-family: Oswald-Bold, sans-serif;
          background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 24px;
          font-weight: 500;

          .unit {
            font-family: Aliba, sans-serif;
            color: #ffffff;
            font-size: 16px;
            font-weight: 500;
          }
        }

        .label {
          font-family: PingFangSC, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d9f7ff;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
