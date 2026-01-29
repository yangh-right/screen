<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-06-15 20:35:37
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-06-18 09:00:02
 * @Description: 
-->
<template>
  <div class="carbon-forecast">
    <configuration v-if="isConfigured" :waterPlantId="waterPlantId"></configuration>
    <con-layout v-else :config="config">
      <template #carbonType>
        <carbonType :waterPlantId="waterPlantId" @carbonReductionChart="carbonChart"></carbonType>
      </template>
      <template #carbonEmissions>
        <carbonEmissions :waterPlantId="waterPlantId" :carbonEmissions="carbonEmissions"></carbonEmissions>
      </template>
      <template #carbonAmount>
        <carbonAmount :waterPlantId="waterPlantId"></carbonAmount>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { carbonData } from './data';
import ConLayout from '@/components/ConLayout/ConLayout';
import configuration from './configuration';
import carbonType from './carbonType';
import carbonEmissions from './carbonEmissions';
import carbonAmount from './carbonAmount';
export default {
  name: 'carbonBox',
  components: {
    ConLayout,
    configuration,
    carbonType,
    carbonEmissions,
    carbonAmount
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    },
    isConfigured: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      alarmInfo: {},
      carbonEmissions: carbonData[0] ?? {},
      config: {
        class: ['supply-flex-col'],
        children: [
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['carbonType']
              },
              {
                class: ['supply-flex-1'],
                slots: ['carbonEmissions']
              }
            ]
          },
          {
            class: ['supply-flex-1', 'supply-overflow-hidden'],
            style: { marginTop: '12px' },
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['carbonAmount']
              }
            ]
          }
        ]
      }
    };
  },
  computed: {},
  mounted() {},

  methods: {
    carbonChart(data) {
      this.carbonEmissions = data ?? carbonData[0];
    }
  }
};
</script>
<style lang="less" scoped>
.carbon-forecast {
  background: linear-gradient(rgb(5, 13, 36), rgb(6, 21, 53), rgb(4, 12, 33));
  width: 100%;
  height: 100%;
  /deep/ .margin-right {
    margin-right: 20px;
  }
}
</style>
