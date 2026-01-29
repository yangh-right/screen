<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle="控制精度" cardType="2" :showTime="false">
    <div class="card-inner">
      <div class="box">
        <div class="box__item" v-for="item in dataList" :key="item.title">
          <div class="icon"></div>
          <div class="name">
            <div class="star"></div>
            <div class="name-text">溶解氧实际值</div>
            <div class="star"></div>
          </div>
          <div class="value">
            <div class="value-input">{{ item.errorValue }}</div>
            <div class="unit">mg/L</div>
          </div>
          <div class="name">
            <div class="star"></div>
            <div class="name-text">设定值</div>
            <div class="star"></div>
          </div>
          <div class="value">
            <div class="value-input">{{ item.precisionValue }}</div>
            <div class="unit">mg/L</div>
          </div>
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { controlAccuracy } from '@/api/smartProduct';
export default {
  name: 'controlTheory',
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
      poolList: [
        { value: 0, label: '南池' },
        { value: 1, label: '北池' }
      ],
      line: 0,
      dataList: [
        {
          errorValue: '0',
          precisionValue: '0',
          title: '南池一级好氧池末段'
        },
        {
          errorValue: '0',
          precisionValue: '0',
          title: '南池二级好氧池末段'
        },
        {
          errorValue: '0',
          precisionValue: '0',
          title: '北池一级好氧池末段'
        },
        {
          errorValue: '0',
          precisionValue: '0',
          title: '北池二级好氧池末段'
        }
      ]
    };
  },
  computed: {},
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
  created() {},
  methods: {
    async initData() {
      this.getData(0);
      this.getData(1);
    },
    async getData(line) {
      let params = {
        endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        line: line,
        queryType: 'hours',
        startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        waterPlantId: this.waterPlantId
      };
      let { resultData, status } = await controlAccuracy(params);
      if (status === 'complete') {
        if (!line) {
          this.dataList[0].errorValue = resultData.firstEndRealPv ?? 0;
          this.dataList[1].errorValue = resultData.secondMiddleRealPv ?? 0;
          this.dataList[0].precisionValue = resultData.firstEndDesignPv ?? 0;
          this.dataList[1].precisionValue = resultData.secondMiddleDesignPv ?? 0;
        } else {
          this.dataList[2].errorValue = resultData.firstEndRealPv ?? 0;
          this.dataList[3].errorValue = resultData.secondMiddleRealPv ?? 0;
          this.dataList[2].precisionValue = resultData.firstEndDesignPv ?? 0;
          this.dataList[3].precisionValue = resultData.secondMiddleDesignPv ?? 0;
        }
      }
    },
    lineChange() {
      this.initData();
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 17px 12px 0;
  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    &__item {
      flex: 1;
      margin-right: 17px;
      max-width: 242px;
      height: 100%;
      padding-top: 10px;
      background: url('~@/assets/img/smartProduct/precision-bg1.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      &:nth-last-child(1) {
        margin-right: 0;
        background: url('~@/assets/img/smartProduct/precision-bg2.png') no-repeat;
        background-size: 100% 100%;
      }
      .icon {
        width: 82px;
        height: 79px;
        left: -1px;
        position: relative;
        margin-top: 10px;
        margin-bottom: 5px;
        background: url('~@/assets/img/smartProduct/oxic-tank1.png') no-repeat;
        background-size: 100% 100%;
      }
      &:nth-child(2) {
        .icon {
          background: url('~@/assets/img/smartProduct/oxic-tank2.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      &:nth-child(4) {
        .icon {
          background: url('~@/assets/img/smartProduct/oxic-tank2.png') no-repeat;
          background-size: 100% 100%;
        }
      }
      .name {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 11px;
        margin-bottom: 6px;

        .star {
          width: 24px;
          height: 24px;
          background: url('~@/assets/img/smartProduct/star.png') no-repeat;
          background-size: 100% 100%;
        }
        &-text {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d1e0ff;
          letter-spacing: 0;
          margin: 0 12px;
        }
      }
      .value {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        &-input {
          width: 60px;
          height: 25px;
          line-height: 25px;
          background: url('~@/assets/img/smartProduct/input.png') no-repeat;
          background-size: 100% 100%;
          font-family: MiSans-Medium, sans-serif;
          font-weight: 500;
          font-size: 16px;
          color: #e5ebf8;
          letter-spacing: 0;
          text-align: center;
        }
        .unit {
          margin-left: 8px;
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d0e0ff;
          letter-spacing: 0;
        }
      }
      .title {
        width: 188px;
        height: 38px;
        line-height: 38px;
        font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
        font-weight: 700;
        font-size: 16px;
        color: #f1f7ff;
        text-align: center;
        background: url('~@/assets/img/smartProduct/title-bg.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
