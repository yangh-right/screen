<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-06-15 20:35:37
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-06-18 09:00:02
 * @Description: 
-->
<template>
  <div class="smart-forecast">
    <con-layout :config="config">
      <template #configuration>
        <configuration :waterPlantId="waterPlantId"></configuration>
      </template>
      <template #inWater>
        <in-Water :alarmInfo="alarmDetail"></in-Water>
      </template>
      <template #pointChart1>
        <point-chart pointName="NH3N" :alarmInfo="alarmDetail"></point-chart>
      </template>
      <template #pointChart2>
        <point-chart pointName="TN" :alarmInfo="alarmDetail"></point-chart>
      </template>
      <template #pointChart3>
        <point-chart pointName="TP" :alarmInfo="alarmDetail"></point-chart>
      </template>

      <template #alarm>
        <alarm @alarmChange="alarmChange" @alarmIdChange="alarmIdChange" :waterPlantId="waterPlantId"></alarm>
      </template>
      <template #decision>
        <decision :alarmInfo="alarmInfo"></decision>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { alarmDetailInfo } from '@/api/smartProduct';

import ConLayout from '@/components/ConLayout/ConLayout';
import configuration from './models/configuration';
import alarm from './models/alarm';
import decision from './models/decision';
import pointChart from './models/pointChart';
import inWater from './models/inWater';
export default {
  name: 'smartForecast',
  components: {
    ConLayout,
    configuration,
    alarm,
    decision,
    pointChart,
    inWater
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      alarmId: '',
      alarmInfo: {},
      alarmDetail: {},
      config: {
        class: ['supply-flex-col'],
        children: [
          {
            class: ['supply-flex-1'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['configuration']
              }
            ]
          },
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['inWater']
              },
              {
                class: ['supply-flex-1'],
                slots: ['pointChart1']
              },
              {
                class: ['supply-flex-1'],
                slots: ['pointChart2']
              },
              {
                class: ['supply-flex-1'],
                slots: ['pointChart3']
              }
            ]
          },
          {
            style: { height: '360px' },
            children: [
              {
                style: { width: 'calc(25% - 9px)' },
                slots: ['alarm']
              },
              {
                class: ['supply-flex-1'],
                slots: ['decision']
              }
            ]
          }
        ]
      }
    };
  },

  mounted() {},

  methods: {
    alarmChange(val) {
      this.alarmInfo = val;
    },
    alarmIdChange(val) {
      this.alarmId = val;
      this.getAlarmDetail();
    },
    async getAlarmDetail() {
      if (!this.alarmId) return;
      const { resultData, status } = await alarmDetailInfo(this.alarmId);
      if (status === 'complete') {
        console.log('1111', resultData);
        this.alarmDetail = resultData;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.smart-forecast {
  width: 100%;
  height: 100%;
  /deep/ .margin-right {
    margin-right: 18px;
  }
}
</style>
