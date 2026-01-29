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
      <template #carbonReduction>
        <carbon-reduction @configure="handleToggle" :waterPlantId="waterPlantId"></carbon-reduction>
      </template>
      <template #reuseWater>
        <reuse-water :waterPlantId="waterPlantId"></reuse-water>
      </template>
      <template #lightStatus>
        <light-status :waterPlantId="waterPlantId"></light-status>
      </template>
      <template #carbonBox>
        <carbonBox :isConfigured="isConfigured" :waterPlantId="waterPlantId"></carbonBox>
      </template>
      <template #autoLight>
        <auto-light :waterPlantId="waterPlantId"></auto-light>
      </template>
      <template #spongeCity>
        <sponge-city :waterPlantId="waterPlantId"></sponge-city>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConLayout from '@/components/ConLayout/ConLayout';
import carbonBox from './models/carbonBox';
import carbonReduction from './models/carbonReduction';
import reuseWater from './models/reuseWater';
import lightStatus from './models/lightStatus';
import autoLight from './models/autoLight';
import spongeCity from './models/spongeCity';
export default {
  name: 'lowCarbon',
  components: {
    ConLayout,
    carbonReduction,
    carbonBox,
    reuseWater,
    lightStatus,
    spongeCity,
    autoLight
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      isConfigured: false,
      alarmInfo: {},
      config: {
        class: ['supply-flex-col'],
        children: [
          {
            style: { height: '33.3%' },
            class: ['supply-overflow-hidden'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['carbonReduction']
              },
              {
                class: ['supply-flex-1'],
                slots: ['reuseWater']
              },
              {
                class: ['supply-flex-1'],
                slots: ['lightStatus']
              }
            ]
          },
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['carbonBox']
              },
              {
                style: { width: 'calc(33.3% - 10px)' },
                class: ['supply-flex-col'],
                children: [
                  {
                    class: ['supply-flex-1'],
                    slots: ['autoLight']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['spongeCity']
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  },

  mounted() {},

  methods: {
    handleToggle(isConfigured) {
      this.isConfigured = isConfigured;
    }
  }
};
</script>
<style lang="less" scoped>
.smart-forecast {
  background: linear-gradient(rgb(5, 13, 36), rgb(6, 21, 53), rgb(4, 12, 33));
  width: 100%;
  height: 100%;
  /deep/ .margin-right {
    margin-right: 20px;
  }
}
</style>
