<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle="控制精度" cardType="9" :showTime="false">
    <div class="card-inner">
      <div class="box">
        <div class="box__item" v-for="item in dataList" :key="item.title">
          <div class="card-left">
            <div class="icon"></div>
            <div class="title">{{ item.title }}</div>
          </div>
          <div class="card-right">
            <div class="data-row">
              <div class="name">
                <div class="star"></div>
                <div class="name-text">溶解氧误差</div>
                <div class="star"></div>
              </div>
              <div class="value">
                <div class="value-input">±{{ item.realData }}</div>
                <div class="unit">mg/L</div>
              </div>
            </div>
            <div class="data-row">
              <div class="name">
                <div class="star"></div>
                <div class="name-text">设定值</div>
                <div class="star"></div>
              </div>
              <div class="value">
                <div class="value-input">{{ item.precisionValue }}</div>
                <div class="unit">%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { controlAccuracy } from '@/api/smartProduct';
import { getRealDataByPointConfigCode } from '@/api/smartProduct';
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
        { value: 2, label: '南池' },
        { value: 1, label: '北池' }
      ],
      line: 0,
      dataList: [
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
  created() { },
  methods: {
    async initData() {
      this.getData();
    },
    async getData() {
      let setSouthPrecisionAerationParams = {
        configCode: 'south_do_set_precision_aeration',
        pumpHouseId: this.waterPlantId
      };
      let setSouthPrecisionAerationResultData = await getRealDataByPointConfigCode(setSouthPrecisionAerationParams);
      let realSouthPrecisionAerationParams = {
        configCode: 'south_do_real_precision_aeration',
        pumpHouseId: this.waterPlantId
      };
      let realSouthPrecisionAerationResultData = await getRealDataByPointConfigCode(realSouthPrecisionAerationParams);

      let setNorthPrecisionAerationParams = {
        configCode: 'north_do_set_precision_aeration',
        pumpHouseId: this.waterPlantId
      };
      let setNorthPrecisionAerationResultData = await getRealDataByPointConfigCode(setNorthPrecisionAerationParams);
      let realNorthPrecisionAerationParams = {
        configCode: 'south_do_set_precision_aeration',
        pumpHouseId: this.waterPlantId
      };
      let realNorthPrecisionAerationResultData = await getRealDataByPointConfigCode(realNorthPrecisionAerationParams);
      this.dataList.push({
        precisionValue: setSouthPrecisionAerationResultData?.resultData?.[0]?.pointValueRatio || 0,
        realData: realSouthPrecisionAerationResultData?.resultData?.[0]?.pointValueRatio ?? 0,
        title: '南侧生物池'
      });
      this.dataList.push({
        precisionValue: setNorthPrecisionAerationResultData?.resultData?.[0]?.pointValueRatio || 0,
        realData: realNorthPrecisionAerationResultData?.resultData?.[0]?.pointValueRatio ?? 0,
        title: '北侧生物池'
      });
      console.log('data...', setNorthPrecisionAerationResultData);
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
  padding: 40px 20px;

  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    &__item {
      flex: 1;
      margin-right: 17px;
      max-width: 480px;
      height: 100%;
      background: url('~@/assets/lightimg/baoqi/card2.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      padding: 0 40px;
      overflow: hidden;

      &:nth-last-child(1) {
        margin-right: 0;
      }

      .card-left {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 40px;
        margin-top: 70px;

        .icon {
          width: 82px;
          height: 79px;
          margin-bottom: 20px;
        }

        .title {
          font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #f1f7ff;
          text-align: center;
          white-space: nowrap;
        }
      }

      .card-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30px;

        .data-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .name {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 11px;
        margin-bottom: 6px;

        .star {
          width: 20px;
          height: 20px;
          background: url('~@/assets/img/smartProduct/star.png') no-repeat;
          background-size: 100% 100%;
        }

        &-text {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #d1e0ff;
          letter-spacing: 0;
          margin: 0 10px;
        }
      }

      .value {
        display: flex;
        align-items: center;
        margin-top: 8px;
        margin-left: 20px;

        &-input {
          min-width: 80px;
          height: 32px;
          line-height: 32px;
          background: url('~@/assets/lightimg/baoqi/input_box.png') no-repeat;
          background-size: 100% 100%;
          font-family: MiSans-Medium, sans-serif;
          font-weight: 500;
          font-size: 18px;
          color: #e5ebf8;
          letter-spacing: 0;
          text-align: center;
          padding: 0 10px;
        }

        .unit {
          margin-left: 12px;
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #d0e0ff;
          letter-spacing: 0;
        }
      }
    }
  }
}
</style>
