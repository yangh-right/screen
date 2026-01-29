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
      <template #envSafe>
        <env-safe :waterPlantId="waterPlantId"></env-safe>
      </template>
      <template #videoSurveillance>
        <video-surveillance :waterPlantId="waterPlantId"></video-surveillance>
      </template>
      <template #alarmList>
        <alarm-list :waterPlantId="waterPlantId"></alarm-list>
      </template>
      <template #temperatureInfo>
        <temperature-info :waterPlantId="waterPlantId"></temperature-info>
      </template>
      <template #temperatureRank>
        <temperature-rank :waterPlantId="waterPlantId"></temperature-rank>
      </template>
      <template #autoFireSuppression>
        <auto-fire-suppression :waterPlantId="waterPlantId"></auto-fire-suppression>
      </template>
      <template #securityControl>
        <security-control :waterPlantId="waterPlantId"></security-control>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConLayout from '@/components/ConLayout/ConLayout';
import envSafe from './models/envSafe';
import videoSurveillance from './models/videoSurveillance';
import alarmList from './models/alarmList';
import temperatureInfo from './models/temperatureInfo';
import temperatureRank from './models/temperatureRank';
import securityControl from './models/securityControl';
import autoFireSuppression from './models/autoFireSuppression';
export default {
  name: 'smartForecast',
  components: {
    ConLayout,
    videoSurveillance,
    envSafe,
    alarmList,
    temperatureInfo,
    autoFireSuppression,
    temperatureRank,
    securityControl
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      config: {
        class: ['supply-flex-col'],
        children: [
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['envSafe']
              },
              {
                class: ['supply-flex-1'],
                slots: ['videoSurveillance']
              },
              {
                class: ['supply-flex-1'],
                slots: ['alarmList']
              }
            ]
          },
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['temperatureInfo']
              },
              {
                class: ['supply-flex-1'],
                slots: ['temperatureRank']
              },
              {
                class: ['supply-flex-1'],
                slots: ['autoFireSuppression']
              }
            ]
          },
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            slots: ['securityControl']
          }
        ]
      }
    };
  },

  mounted() {},

  methods: {}
};
</script>
<style lang="less" scoped>
.smart-forecast {
  background: linear-gradient(rgb(5, 13, 36), rgb(4, 12, 33));
  width: 100%;
  height: 100%;
  /deep/ .margin-right {
    margin-right: 20px;
  }
}
</style>
