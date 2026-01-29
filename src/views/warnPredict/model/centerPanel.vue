<!--
 * @Author: 史磊
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-07-05 16:07:57
 * @LastEditors: wangyr
 * @Description:
-->
<template>
  <div class="center_panel">
    <alarm-situation title="今日报警情况" class="alarm-situation" :waterPlantId="waterPlantId"></alarm-situation>
    <div class="col">
      <device-alert title="设备预警" class="device-alert" :waterPlantId="waterPlantId"></device-alert>
      <material-alert title="物料预警" class="material-alert" :waterPlantId="waterPlantId"></material-alert>
    </div>
    <!-- <div class="logic">
      <water-alert title="水质预警" class="water-alert" :waterPlantId="waterPlantId"></water-alert>
      <diagnostic-logic title="诊断逻辑" class="diagnostic-logic" :waterPlantId="waterPlantId"></diagnostic-logic>
    </div> -->
  </div>
</template>

<script>
import alarmSituation from '../components/alarmSituation.vue';
import deviceAlert from '../components/deviceAlert.vue';
import materialAlert from '../components/materialAlert.vue';
// import diagnosticLogic from '../components/diagnosticLogic.vue';
// import waterAlert from '../components/waterAlert.vue';
export default {
  name: 'CenterPanel',
  components: {
    alarmSituation,
    deviceAlert,
    materialAlert,
    // diagnosticLogic,
    // waterAlert
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.center_panel {
  .alarm-situation {
    height: 130px;
    background-color: rgba(18, 61, 132, 0.4);
  }
  .col {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    .device-alert {
      height: 220px;
      background-color: rgba(18, 61, 132, 0.4);
      margin-right: 12px;
      width: calc(50% - 6px);
    }
    .material-alert {
      height: 220px;
      width: calc(50% - 6px);
      background-color: rgba(18, 61, 132, 0.4);
    }
  }
  .logic {
    position: relative;
    .water-alert {
      width: 187px;
      height: 156px;
      position: absolute;
    }
    .diagnostic-logic {
      height: 540px;
      background-color: rgba(18, 61, 132, 0.4);
    }
  }
}
</style>
