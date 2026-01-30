<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-09 11:01:17
 * @Description:
-->
<template>
  <unit-card cardTitle="碳减排量" cardType="2">
    <div class="carbon-dashboard">
      <div class="header-section">
        <div class="header-item">
          <span class="header-label">十二月累计减排:</span>
          <span class="header-value">323t<i>CO₂e</i></span>
        </div>
        <div class="header-item">
          <span class="header-label">近半年累计减排:</span>
          <span class="header-value">2042.37t<i>CO₂e</i></span>
        </div>
      </div>
      <div class="time-range">6~12月份</div>

      <div class="metrics-container">
        <div v-for="(metric, index) in metrics" :key="index" class="metric-item">
          <div :class="`glow-${metric.color}`" class="metric-value-container">
            <div class="metric-value">
              <span class="value-number">{{ metric.value }}</span>
              <span class="value-unit">tCO₂e</span>
            </div>
          </div>
          <div class="metric-label">{{ metric.label }}</div>
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
      metrics: [
        { label: '精准曝气', color: 'yellow', value: 192.2 },
        { label: '精准加药', color: 'green', value: 1659.74 },
        { label: '中水回用', color: 'blue', value: 92.52 },
        { label: '光伏发电', color: 'blue', value: 35.91 },
        { label: '景观用水', color: 'yellow', value: 54 },
        { label: '绿化', color: 'green', value: 8 }
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
.carbon-dashboard {
  width: 100%;
  height: 100%;
  padding: 12px 14px;
  position: relative;

  .time-range {
    width: 98px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: url('~@/assets/img/smartProduct/fir_range.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 12px;
    right: 14px;
    color: #bac9e7;
    font-size: 16px;
    font-family: Aliba, sans-serif;
    font-weight: 400;
  }

  .header-section {
    display: flex;
    justify-content: flex-start;

    .header-item {
      width: 300px;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      display: flex;
      align-items: center;
      background: url('~@/assets/img/smartProduct/fir_shape_binding.png') no-repeat;
      background-size: 100% 100%;
      margin-right: 24px;

      .header-label {
        color: #bac9e7;
        font-size: 16px;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        letter-spacing: 1.6px;
        margin-right: 4px;
      }

      .header-value {
        color: #ffffff;
        font-size: 24px;
        font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
        vertical-align: baseline;
        i {
          font-style: normal;
          color: #bac9e7;
          font-size: 16px;
          font-family: Aliba, sans-serif;
          font-weight: 400;
          letter-spacing: 1.6px;
          margin-left: 2px;
        }
      }
    }
  }

  .metrics-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 12px;

    .metric-item {
      width: 157px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .metric-value-container {
        position: relative;
        width: 157px;
        height: 215px;
        display: flex;
        justify-content: center;
        align-items: center;

        .metric-value {
          position: relative;
          text-align: center;
          margin-top: -25px;

          .value-number {
            font-size: 36px;
            font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
          }

          .value-unit {
            font-size: 14px;
            font-weight: 400;
            margin-left: 3px;
          }
        }

        &.glow-blue {
          background: url('~@/assets/img/smartProduct/fir_formation_18.png') no-repeat;
          background-size: 100% 100%;
          .value-number {
            background-image: linear-gradient(to bottom, #ffffff 15%, #00b9ff 99%);
            -webkit-background-clip: text;
            color: transparent;
          }
          .value-unit {
            background-image: linear-gradient(to bottom, #ffffff 5%, #00b9ff 99%);
            -webkit-background-clip: text;
            color: transparent;
          }
        }
        &.glow-yellow {
          background: url('~@/assets/img/smartProduct/fir_formation_19.png') no-repeat;
          background-size: 100% 100%;
          .value-number {
            background-image: linear-gradient(to bottom, #ffffff 15%, #fef165 99%);
            -webkit-background-clip: text;
            color: transparent;
          }
          .value-unit {
            background-image: linear-gradient(to bottom, #ffffff 5%, #fef165 99%);
            -webkit-background-clip: text;
            color: transparent;
          }
        }
        &.glow-green {
          background: url('~@/assets/img/smartProduct/fir_group_20.png') no-repeat;
          background-size: 100% 100%;
          .value-number {
            background-image: linear-gradient(to bottom, #ffffff 15%, #81f193 99%);
            -webkit-background-clip: text;
            color: transparent;
          }
          .value-unit {
            background-image: linear-gradient(to bottom, #ffffff 5%, #81f193 99%);
            -webkit-background-clip: text;
            color: transparent;
          }
        }
      }

      .metric-label {
        margin-top: 8px;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #bac9e7;
        letter-spacing: 1.6px;
      }
    }
  }
}
</style>
