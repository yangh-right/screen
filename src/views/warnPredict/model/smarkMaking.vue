<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-13 19:13:12
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="panel-box">
        <device-list title="预警列表" @cell-click="getRow"></device-list>
      </div>
      <div class="panel-box">
        <optimization-plan title="优化方案" :waterPlantId="waterPlantId" :alarmInfo="alarmDetail"></optimization-plan>
      </div>
      <div class="panel-box">
        <inter-tn title="进水曲线" :waterPlantId="waterPlantId" :alarmInfo="alarmDetail"></inter-tn>
        <curve-chart title="NH3N" :waterPlantId="waterPlantId" :alarmInfo="alarmDetail"></curve-chart>
      </div>
      <div class="panel-box">
        <curve-chart title="TN" :waterPlantId="waterPlantId" :alarmInfo="alarmDetail"></curve-chart>
        <curve-chart title="TP" :waterPlantId="waterPlantId" :alarmInfo="alarmDetail"></curve-chart>
      </div>
    </div>
  </div>
</template>

<script>
import { getAlarmDetial } from '@/api/warnPredict';
import deviceList from '../components/deviceList.vue';
import interTn from '../components/interTn.vue';
import curveChart from '../components/curveChart.vue';
import optimizationPlan from '../components/optimizationPlan.vue';
export default {
  name: 'InWaterQuality',
  components: {
    deviceList,
    interTn,
    curveChart,
    optimizationPlan
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
      alarmId: '',
      alarmDetail: {}
    };
  },
  watch: {
    alarmId: {
      handler(val) {
        this.getAlarmInfo();
      },
      immediate: true
    }
  },
  methods: {
    getRow(alarmId) {
      this.alarmId = alarmId;
    },
    async getAlarmInfo() {
      if (!this.alarmId) return;
      const { resultData, status } = await getAlarmDetial(this.alarmId);
      if (status === 'complete') {
        this.alarmDetail = resultData;
      }
    }
  }
};
</script>

<style lang="less" scoped>
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
    background: url('~@/assets/img/hz/predict-title.png') no-repeat;
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
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 12px 0 0 0;
    box-sizing: border-box;

    .panel-box {
      width: calc(25% - 9px);
      height: 100%;
      position: relative;
    }
  }
}
</style>
