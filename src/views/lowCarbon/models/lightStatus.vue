<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-18 09:51:21
 * @Description:
-->
<template>
  <unit-card cardTitle="照明状态">
    <div class="card-inner">
      <div class="total">
        <img class="light" src="@/assets/img/smartProduct/light.png" alt="" />
        <div class="name">回路数量</div>
        <div class="value">{{ total }} 个</div>
      </div>
      <div class="status">
        <div class="status__item" v-for="item in dataList" :key="item.name">
          <div class="count">{{ item.count }}</div>
          <div class="split"></div>
          <div class="name">{{ item.name }}</div>
          <div class="percent">
            <span class="val">{{ item.percent }}</span>
            <span class="unit">%</span>
          </div>
          <div class="rate">{{ item.rateName }}</div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { illuminationCondition } from '@/api/smartProduct';
export default {
  name: 'lightStatus',
  components: {
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
      total: 0,
      dataList: [
        { count: 0, name: '在线数量（盏）', percent: 0, rateName: '在线率' },
        { count: 0, name: '开灯数量（盏）', percent: 0, rateName: '亮灯率' },
        { count: 0, name: '关灯数量（盏）', percent: 0, rateName: '关灯率' }
      ]
    };
  },

  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  methods: {
    async initData() {
      const { resultData, status } = await illuminationCondition(this.waterPlantId);
      if (status === 'complete') {
        this.total = resultData?.totalNum ?? 0;
        this.dataList[0].count = resultData?.onlineNum ?? 0;
        this.dataList[0].percent = resultData?.onlineRate ?? 0;
        this.dataList[1].count = resultData?.lightUp ?? 0;
        this.dataList[1].percent = resultData?.lightUpRate ?? 0;
        this.dataList[2].count = resultData?.lightDown ?? 0;
        this.dataList[2].percent = resultData?.lightDownRate ?? 0;
        this.dataList = [...this.dataList];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 17px 20px 0;
  .total {
    height: 46px;
    display: flex;
    align-items: center;
    margin-bottom: 17px;
    background: url('~@/assets/img/smartProduct/light-title.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 0 72px;
    .light {
      position: absolute;
      left: 6.5px;
      width: 51px;
      height: 51px;
    }
    .name {
      font-family: AlibabaPuHuiTi-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #bac9e7;
      letter-spacing: 0.46px;
      margin-right: 42px;
    }
    .value {
      font-family: AlibabaPuHuiTiM, sans-serif;
      font-size: 18px;
      color: #ffffff;
      letter-spacing: 0.51px;
    }
  }
  .status {
    display: flex;
    align-items: center;

    &__item {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 29.34px;
      &:nth-last-child(1) {
        margin-right: 0;
      }
      .count {
        font-family: AlibabaPuHuiTiM, sans-serif;
        font-size: 24px;
        color: #ffffff;
        letter-spacing: 0;
      }
      .split {
        width: 100%;
        border: 1.28px solid #203a57;
        margin: 8px 0;
      }
      .name {
        width: 100%;
        height: 33.34px;
        background: rgba(35, 88, 146, 0.4);
        font-family: AlibabaPuHuiTi-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #bac9e7;
        letter-spacing: 0;
        text-align: center;
        line-height: 33.34px;
        margin-bottom: 22.76px;
      }
      .percent {
        background: url('~@/assets/img/smartProduct/light-ball.png') no-repeat;
        background-size: 100% 100%;
        height: 70.28px;
        width: 70.28px;
        text-align: center;
        line-height: 70.28px;
        color: #ebf4fd;
        font-size: 24px;
        letter-spacing: 0;
        margin-bottom: 6.18px;
        .unit {
          font-size: 14px;
        }
      }
      .rate {
        font-family: AlibabaPuHuiTi-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #bac9e7;
        text-align: center;
      }
    }
  }
}
</style>
