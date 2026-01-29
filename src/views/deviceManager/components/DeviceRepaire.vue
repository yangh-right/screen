<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="points-list">
        <div v-for="item in pointsArr" :key="item.name" class="point-tab">
          <div class="value">{{ item.counts || 0 }}{{ item.unit || '' }}</div>
          <div class="info">
            <div class="yoy-box">
              <span class="repaire-label">同比</span><span class="repaire-num">{{ item.yearOnYear || 0 }}%</span
              ><span class="arrow-up"></span>
            </div>
            <div class="pop-box">
              <span class="repaire-label">环比</span><span class="repaire-num">{{ item.chainComparison || 0 }}%</span
              ><span class="arrow-down"></span>
            </div>
          </div>
          <div class="label">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { baseAnalysis, basic } from '@/api/deviceManager.js';
import moment from 'moment';

export default {
  name: 'DeviceRepaire',
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
      pointsObj: {
        createTicket: '设备维修工单数',
        finishTicket: '维修工单完成数',
        waitAcceptDuration: '接单平均等待时长',
        finishTicketRate: '维修工单完成比例'
      },
      pointsArr: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    async initData() {
      let data = {
        queryType: 'month',
        dateRangeType: 'dayRange',
        dateUnit: 'M',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        typeList: ['zhjs-sbwx']
      };
      const { status, resultData } = await baseAnalysis(data);
      if (status === 'complete') {
        resultData.forEach(item => {
          item.name = this.pointsObj[item.countsType];
          if (item.countsType === 'finishTicketRate') item.unit = '%';
          if (item.name) this.pointsArr.push(item);
        });
      }
      const res = await basic(data);
      if (res.status === 'complete') {
        let val = res.resultData.waitAcceptDuration;
        this.pointsArr.push({
          chainComparison: val.TlastCycleRate,
          counts: val.nowCycl,
          countsType: 'waitAcceptDuration',
          yearOnYear: val.lastYearRate,
          name: '维修工单平均等待时长 ',
          unit: 'min'
        });
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
  height: calc(100% - 34px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .points-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 6px;
    box-sizing: border-box;

    .point-tab {
      width: calc(50% - 3px);
      height: 110px;
      background: url('~@/assets/img/hz/repaire-info.png') no-repeat;
      margin-top: 8px;
      background-size: 100% 100%;
      text-align: center;

      .value {
        font-family: PingFangSC, sans-serif;
        background-image: linear-gradient(to bottom, #ffffff 70%, #b6ecfd 100%);
        -webkit-background-clip: text;
        color: transparent;
        font-size: 18px;
        font-weight: 400;
        text-shadow: 0 2px 4px #32c5ffa8;
        padding-top: 6px;
      }

      .info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        .yoy-box,
        .pop-box {
          width: calc(50% - 2px);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .repaire-num {
          font-family: MiSans-Medium, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
        }
        .repaire-label {
          font-family: MiSans-Medium, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #88afe0;
          // writing-mode: vertical-rl;
          text-orientation: upright;
          white-space: nowrap;
          margin-right: 3px;
        }
        .arrow-up {
          display: inline-block;
          width: 11px;
          height: 17px;
          background: url('~@/assets/img/hz/arrow-up.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 3px;
          vertical-align: text-top;
        }
        .arrow-down {
          display: inline-block;
          width: 11px;
          height: 17px;
          background: url('~@/assets/img/hz/arrow-down.png') no-repeat;
          background-size: 100% 100%;
          margin-left: 3px;
          vertical-align: text-top;
        }
      }

      .label {
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        margin-top: 8px;
        opacity: 0.6;
        color: #88afe0;
      }
    }
    .point-tab:first-child {
      padding-left: 12px;
    }
  }
}
</style>
