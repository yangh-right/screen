<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-08 16:45:08
 * @Description: 稳定出水监控组件
-->
<template>
  <unit-card cardTitle="全自动污泥处理自控系统" :showTime="false">
    <div class="card-inner">
      <div class="card-inner-text">
        全自动污泥处理自控系统高度智能，以污泥浓度为依据自动排泥，各模块的排泥流量计精确计量排泥量。储泥池的微波污泥浓度计实时监控污泥含水率，提供可靠数据。机械臂自动配药，减少人力投入。针对泥处理湿度大易使
        PAM
        药剂黏连堵塞的问题，配备搅拌与防粘黏装置，保障药剂输送顺畅。本系统还配套自动污泥干化机房和污泥料仓，通过含水率仪实时监测料仓污泥情况。同时，地磅系统精准监测外运污泥量，实现污泥处理全流程自动化、精细化管理。
      </div>
    </div>
  </unit-card>
</template>

<script>
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
      currentPoint: '',
      chartData: null
    };
  },

  computed: {},

  methods: {}
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
  margin-top: 12px;
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/sludgeDischarge/text_bg.png') no-repeat;
  background-size: 100% 100%;
  .card-inner-text {
    padding: 12px 23px 0;
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #badcff;
    letter-spacing: 1px;
    line-height: 32px;
  }
  .card-item {
    margin: 10px 23px;
    display: flex;

    .icon {
      margin-right: 9px;
      width: 24px;
      height: 24px;
      background: url('~@/assets/img/sludgeDischarge/text_icon.png') no-repeat;
      background-size: 100% 100%;
    }
    .text {
      color: #bbddff;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      letter-spacing: 1px;
      text-align: left;
      span {
        color: #e8f3ff;
        font-size: 14px;
        font-family: AlibabaPuHuiTi_2_85, sans-serif;
        font-weight: 700;
      }
    }
  }
}
</style>
