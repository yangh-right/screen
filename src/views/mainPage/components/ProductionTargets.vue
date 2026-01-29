<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:53
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-10 18:38:30
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <a-select :value="dataSelect" dropdownClassName="select__list" class="select__block" @change="handleDate">
      <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
      <a-select-option value="0">{{ month }}</a-select-option>
      <a-select-option value="1">{{ lastMonth }}</a-select-option>
      <a-select-option value="2">{{ onTheLastMonth }}</a-select-option>
    </a-select>
    <div class="card-inner">
      <div v-for="(item, i) in deviceArr" :key="item.label" class="divice-tab">
        <div class="device-title">
          <div :class="['device-img', 'img' + (i + 1)]"></div>
        </div>
        <div class="device-cont">
          <div class="device-info">
            <div class="name">本月{{ item.costName }}</div>
            <div class="target">
              {{ item.costPv || 0 }} <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
          <div class="device-info">
            <div class="name">吨水{{ item.costName }}</div>
            <div class="target">
              {{ item.costWaterPv || 0 }} <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productionIndex } from '@/api/mainPage.js';
import moment from 'moment';

export default {
  name: 'ProductionTargets',
  components: {},
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
      cardTitle: '设备管理',
      deviceArr: [],
      dataSelect: '0',
      dataVal: {
        0: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')],
        1: [
          moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
          moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        ],
        2: [
          moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD'),
          moment().subtract(2, 'month').endOf('month').format('YYYY-MM-DD')
        ]
      },
      carbonReduction: 0,
      evaluationOfEnergy: 0,
      month: moment().locale('zh-cn').format('MMMM'),
      lastMonth: moment().subtract(1, 'month').locale('zh-cn').format('MMMM'),
      onTheLastMonth: moment().subtract(2, 'month').locale('zh-cn').format('MMMM')
    };
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      let paramsData = this.dataVal[this.dataSelect];
      let data = {
        waterPlantId: this.waterPlantId,
        startTime: paramsData[0],
        endTime: paramsData[1],
        dateType: 'MONTH'
      };
      const { status, resultData } = await productionIndex(data);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        let codeArr = ['power', 'medicine', 'sludge'];
        this.deviceArr = resultData.filter(item => {
          return codeArr.includes(item.costCode);
        });
      } else {
        this.deviceArr = [
          {
            costCode: 'power',
            costName: '电耗',
            costPv: 0,
            costSmallTypeList: [],
            costWaterPv: 0,
            isOnlySmallTypeData: false,
            qoqCostPv: 0,
            qoqCostRatio: null,
            unit: 'kWh'
          },
          {
            costCode: 'medicine',
            costName: '药耗',
            costPv: 0,
            costSmallTypeList: [],
            costWaterPv: 0,
            isOnlySmallTypeData: false,
            qoqCostPv: 0,
            qoqCostRatio: '-81.41',
            unit: 'kg'
          },
          {
            costCode: 'sludge',
            costName: '污泥外运',
            costPv: 0,
            costSmallTypeList: [],
            costWaterPv: 0,
            isOnlySmallTypeData: false,
            qoqCostPv: 0,
            qoqCostRatio: '-84.21',
            unit: 'kg'
          }
        ];
      }
    },
    handleDate(val) {
      this.dataSelect = val;
      this.initData();
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .select__block {
  background: url('~@/assets/img/hz/ac-point.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 70%;
  width: 124px;
  height: 28px;

  margin-right: 12px;

  .ant-select-selection {
    background: transparent;
    border: none;
  }

  .ant-select-selection__rendered {
    height: 28px;
    line-height: 28px;
    text-align: center;
    .ant-select-selection-selected-value {
      float: unset;
      font-family: SourceHanSansCN-Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }
  }
}
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .divice-tab {
      width: 100%;
      height: 25%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: url('~@/assets/img/hz/b-device.png') no-repeat;
      background-size: 100% 100%;
      padding: 0 12px 0 35px;
      box-sizing: border-box;

      .device-title {
        width: 86px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .device-img {
          width: 86px;
          height: 87px;
        }
        .img1 {
          background: url('~@/assets/img/hz/k-water.png') no-repeat;
        }
        .img2 {
          background: url('~@/assets/img/hz/k-medicine.png') no-repeat;
        }
        .img3 {
          background: url('~@/assets/img/hz/k-slduge.png') no-repeat;
        }
        .label {
          color: #e2f2ff;
          font-family: YouSheBiaoTiHei, sans-serif;
          font-size: 14px;
        }
      }
      .device-cont {
        width: calc(100% - 110px);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .device-info {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .name {
            font-family: PingFangSC, sans-serif;
            font-weight: 500;
            font-size: 14px;
            color: #d9f7ffc2;
            letter-spacing: 0;
          }

          .target {
            font-family: PingFangSC, sans-serif;
            font-weight: 500;
            font-size: 24px;
            color: #f9f9f9;
          }
          .unit {
            font-family: PingFangSC, sans-serif;
            font-weight: 600;
            font-size: 12px;
            color: #f9f9f9;
          }
          &:nth-child(2n) {
            padding-left: 20px;
          }
        }
      }
    }
    .other-tab {
      width: 100%;
      height: 25%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: url('~@/assets/img/hz/o-point.png') no-repeat;
      background-size: 100% 100%;
      padding-top: 10px;
      box-sizing: border-box;

      .point-tab {
        width: 190px;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;

        &:last-child {
          padding-right: 40px;
          box-sizing: border-box;
        }
        .name {
          font-family: PingFangSC, sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #d9f7ffc2;
          letter-spacing: 0;
          margin-bottom: 12px;
        }
        .target {
          font-family: DINAlternate-Bold, sans-serif;
          font-weight: 700;
          font-size: 32px;
          color: #9ce3ff;
          letter-spacing: 2.4px;
          text-align: center;
          line-height: 24px;
          text-shadow: 0 2px 4px #3388ff5e;
        }
        .unit {
          font-family: PingFangSC, sans-serif;
          font-weight: 600;
          font-size: 12px;
          color: #f9f9f9;
        }
        .evalute {
          font-family: YouSheBiaoTiHei, sans-serif;
          font-size: 30px;
          background-image: linear-gradient(to bottom, #ffde6f, #f1dfc2, #f7d6a2);
          -webkit-background-clip: text;
          color: transparent;
          letter-spacing: 1.25px;
          line-height: 24px;
          text-shadow: 0 2px 4px #ffaa3a6b;
        }
      }
    }
  }
}
</style>
