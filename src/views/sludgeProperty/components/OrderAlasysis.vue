<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="points-list">
        <div v-for="item in pointsArr" :key="item.name" class="point-tab">
          <div class="point-img">
            <img :src="item.imgUrl" :alt="item.name" />
          </div>
          <div class="point-box">
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
import UnitCard from './UnitCard';
import { getLeaderCockpitCard } from '@/api/sludgeProperty.js';

export default {
  name: 'OrderAlasysis',
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
          name: '当日新增工单',
          code: 'todayNewTicketCounts',
          value: 685,
          imgUrl: require('@/assets/img/order1.png')
        },
        {
          name: '办理中工单',
          code: 'doingTicketCounts',
          value: 256,
          imgUrl: require('@/assets/img/order2.png')
        },
        {
          name: '已挂起工单',
          code: 'currentHangupTicketCounts',
          value: 468,
          imgUrl: require('@/assets/img/order3.png')
        },
        {
          name: '当天办结工单',
          code: 'todayDoneCounts',
          value: 356,
          imgUrl: require('@/assets/img/order4.png')
        },
        {
          name: '签到步骤工单',
          code: 'signInStepTicketCounts',
          value: 685,
          imgUrl: require('@/assets/img/order5.png')
        },
        {
          name: '现场处理工单',
          code: 'onSiteTicketCounts',
          value: 256,
          imgUrl: require('@/assets/img/order6.png')
        },
        {
          name: '当前步骤超时工单',
          code: 'stepOverTimeTicketCounts',
          value: 468,
          imgUrl: require('@/assets/img/order7.png')
        },
        {
          name: '当前流程超时工单',
          code: 'processTimeOutTicketCounts',
          value: 356,
          imgUrl: require('@/assets/img/order8.png')
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    async initData() {
      const { status, resultData } = await getLeaderCockpitCard();
      if (status === 'complete') {
        this.pointsArr.forEach(item => {
          item.value = resultData[item.code];
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
  height: 100%;
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
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20px;
    box-sizing: border-box;

    .point-tab {
      width: calc(25% - 4px);
      height: 50%;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .point-img {
        margin-right: 12px;
      }
      .point-box {
        text-align: left;
      }

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
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        margin-top: 10px;
      }
    }
  }
}
</style>
