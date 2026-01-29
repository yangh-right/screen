<!--
 * @Author: wangyr
 * @Date: 2023-04-21 17:20:07
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-05 16:48:12
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <img src="@/assets/img/warnPredict/safe.png" alt="" />
    <div class="content-spin">
      <a-select :value="solutionVal" dropdownClassName="select__list" class="select__block" @change="handleDate">
        <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
        <a-select-option :value="item.value" v-for="item in devices" :key="item.value">{{
          item.label
        }}</a-select-option>
      </a-select>
      <div class="gis">
        <div class="gas-item" v-for="(item, index) in dataList" :key="index">
          <div class="echart-block">
            <dashboard :value="item.value"></dashboard>
          </div>
          <div class="right-box">
            <div class="lable">{{ item.name }}</div>
            <div class="lable">{{ item.alarmType }}</div>
            <div class="value">
              {{ item.value }}<span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
        <div class="gas-item" v-for="(item, index) in dataList" :key="index">
          <div class="echart-block">
            <dashboard :value="item.value"></dashboard>
          </div>
          <div class="right-box">
            <div class="lable">{{ item.name }}</div>
            <div class="lable">{{ item.alarmType }}</div>
            <div class="value">
              {{ item.value }}<span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDevices, environmentAlarmList } from '@/api/warnPredict';

export default {
  name: 'WaterStatistics',
  components: {
    dashboard: () => import('./dashboard.vue')
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
      solutionVal: '',
      devices: [],
      dataList: []
    };
  },
  computed: {},
  watch: {
    waterPlantId(val) {
      if (val) {
        // this.getPointList();
      }
    }
  },
  methods: {
    async getDevicesOption() {
      let data = {
        waterPlantId: this.waterPlantId,
        configCode: 'environmental_param'
      };
      const { success, resultData } = await getDevices(data);
      if (success) {
        this.devices = resultData.map(item => {
          return {
            label: item.deviceName,
            value: item.industryPlatformId
          };
        });
      }
      this.solutionVal = this.devices[0].value;
      this.getPointList(this.solutionVal);
    },
    handleDate(item) {
      this.solutionVal = item;
      this.getPointList(item);
    },
    async getPointList(val) {
      let { resultData, success } = await environmentAlarmList(val);
      if (success) {
        this.dataList = resultData.map(item => {
          return {
            value: item.pointAlarmValue ? parseFloat(item.pointAlarmValue).toFixed(2) : 0,
            name: item.pointMemo,
            alarmType: item.alarm ? '超限预警' : '',
            unit: item.pointUnit || ''
          };
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getDevicesOption();
  }
};
</script>

<style lang="less" scoped>
/deep/ .select__block {
  background: url('~@/assets/img/hz/ac-point.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 12px;
  width: 150px;
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
    padding: 15px 12px;
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
  img {
    position: absolute;
    right: 30px;
    top: 20px;
    width: 80px;
    height: 80px;
  }

  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    padding: 0 12px;
    box-sizing: border-box;
    position: relative;
    flex-direction: column;
    display: flex;

    .gis {
      margin-top: 20px;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
      .gas-item {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
      }
    }
    .echart-block {
      background: url('~@/assets/img/warnPredict/axisLine.png') no-repeat;
      background-size: 100% 100%;
      width: 118px;
      height: 118px;
      position: relative;

      .pie-bg {
        width: 84px;
        font-weight: 700;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -42px;
        margin-top: -28px;
        font-family: Oswald-Bold, sans-serif;
        font-size: 38px;
        text-shadow: 0 1px 4px #32c5ff82;
        background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
        -webkit-background-clip: text;
        color: transparent;
      }

      .echart-title {
        width: 158px;
        height: 34px;
        font-family: Aliba, sans-serif;
        text-align: center;
        line-height: 34px;
        margin: 0 auto;
        font-weight: 600;
        font-size: 14px;
        color: #d9f7ff;
        position: absolute;
        bottom: 0px;
        left: 50%;
        margin-left: -79px;
      }
    }

    .right-box {
      margin-left: 8px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 79px;
      height: 94px;
      background: url('~@/assets/img/warnPredict/panel4.png') no-repeat;
      background-size: 100% 100%;

      .lable {
        font-weight: 600;
        font-size: 14px;
        color: #c1e9ff;
        letter-spacing: 0;
        text-align: center;
      }

      .value {
        font-family: MiSans-DNaNpxibold, sans-serif;
        font-weight: 600;
        font-size: 24px;
        color: #ffffff;
        text-shadow: 0 2px 6px #32c5ffa3;
      }

      .unit {
        font-weight: 600;
        font-size: 14px;
        color: #c1e9ff;
        letter-spacing: 0;
        text-align: right;
        text-shadow: 0 0 4px #36e7d78f;
      }
    }
  }

  /deep/ .wpg-spin-container {
    height: 100%;
  }
}
</style>
