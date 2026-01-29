<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-25 13:15:54
 * @Description: 稳定出水监控组件
-->
<template>
  <unit-card cardTitle="排泥计划" :showTime="false">
    <div class="card-inner">
      <div class="sum">
        <div>累计外运泥量</div>
        <div class="value">
          <span class="num">{{ data.accumulatedSludgeVolume || 0 }}</span
          >吨
        </div>
      </div>

      <div class="label-item label-item-2">
        <div class="label-text">昨日外运泥量</div>
        <div class="label-value">
          <span class="num">{{ data.sludgeNumYesterday || 0 }}</span
          >吨
        </div>
      </div>

      <div class="label-item label-item-3">
        <div class="label-text">今日已外运泥量</div>
        <div class="label-value">
          <span class="num">{{ data.sludgeNumToday || 0 }}</span
          >吨
        </div>
      </div>

      <div class="label-item label-item-5">
        <div class="label-text">今日计划排泥量</div>
        <div class="label-value">
          <span class="num">{{ data.planSludgeNumToday || 0 }}</span
          >吨
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { sludgeDischargePlan } from '@/api/sludgeDischarge';
export default {
  name: 'ControlPrecision',
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
      poolList: [],
      data: {
        accumulatedSludgeVolume: '',
        dehydratedToday: '',
        dryTodayNum: '',
        planSludgeNumToday: '',
        sludgeNumYesterday: '',
        sludgeNumToday: ''
      },
      currentPoint: '',
      chartData: null
    };
  },

  computed: {},

  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.fetchData();
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchData() {
      let { resultData, status, errorMessage } = await sludgeDischargePlan({
        waterPlantId: this.waterPlantId
      });
      if (status === 'complete') {
        this.data = resultData;
      } else {
        console.log(errorMessage);
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .card-title {
  .title {
    .text {
      font-size: 20px !important;
    }
  }
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/sludgeDischarge/plan_bg.png') no-repeat;
  background-size: 192px 176px;
  background-position: 50% 50%;
  .sum {
    position: absolute;
    top: 45%;
    left: 40%;
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #d1e0ff;
    letter-spacing: 1px;
    text-align: center;
    .value {
      font-size: 12px;
      .num {
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #eff5ff;
      }
    }
  }
  .label-item {
    position: absolute;
    width: 165px;
    height: 60px;
    background: url('~@/assets/img/sludgeDischarge/point_icon.png') no-repeat;
    background-size: 122.49px 37.85px;
    padding-left: 52px;
    .label-text {
      margin-top: -10px;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #d1e0ff;
      letter-spacing: 1px;
    }
    .label-value {
      margin-top: 12px;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: #d1e0ff;
      letter-spacing: 0;
      .num {
        margin-right: 2px;
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #eff5ff;
        letter-spacing: 0;
      }
    }
  }
  .label-item-1 {
    top: 26%;
    left: 5%;
  }
  .label-item-2 {
    top: 50%;
    left: 0%;
  }
  .label-item-3 {
    top: 65%;
    right: 0%;
  }
  .label-item-4 {
    top: 23%;
    right: 0%;
  }
  .label-item-5 {
    top: 4%;
    left: 37%;
  }
}
</style>
sludgeDischarge
