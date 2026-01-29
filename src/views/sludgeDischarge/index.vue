<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-06-15 20:35:37
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-18 09:20:25
 * @Description:
-->
<template>
  <div class="smart-product">
    <con-layout :config="config">
      <template #sludgePlan>
        <sludge-plan :waterPlantId="waterPlantId"></sludge-plan>
      </template>
      <template #sludgeConcentration>
        <sludge-concentration :waterPlantId="waterPlantId"></sludge-concentration>
      </template>
      <template #autoDispensingSystem>
        <auto-dispensing-system :waterPlantId="waterPlantId"></auto-dispensing-system>
      </template>
      <template #mechanicalArmMatching>
        <mechanical-arm-matching :waterPlantId="waterPlantId"></mechanical-arm-matching>
      </template>

      <template #configuration>
        <configuration :waterPlantId="waterPlantId"></configuration>
      </template>

      <template #dischargeVolume>
        <discharge-volume :line="line" :waterPlantId="waterPlantId"></discharge-volume>
      </template>

      <template #dehydrationSituation>
        <dehydration-situation :line="line" :waterPlantId="waterPlantId"></dehydration-situation>
      </template>

      <template #mudProduction>
        <mud-production :waterPlantId="waterPlantId"></mud-production>
      </template>
      <template #sludgeTransportation>
        <sludge-transportation :waterPlantId="waterPlantId"></sludge-transportation>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConLayout from '@/components/ConLayout/ConLayout';
import configuration from './models/configuration';
import sludgePlan from './models/sludgePlan';
import sludgeConcentration from './models/sludgeConcentration';
import autoDispensingSystem from './models/autoDispensingSystem';
import mechanicalArmMatching from './models/mechanicalArmMatching';
import dischargeVolume from './models/dischargeVolume';
import dehydrationSituation from './models/dehydrationSituation';

import mudProduction from './models/mudProduction';

import sludgeTransportation from './models/sludgeTransportation';
export default {
  name: 'smartProduct',
  components: {
    ConLayout,
    configuration,

    sludgePlan,
    sludgeConcentration,
    autoDispensingSystem,
    mechanicalArmMatching,
    dischargeVolume,
    dehydrationSituation,
    mudProduction,
    sludgeTransportation
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      line: 0,
      config: {
        children: [
          {
            class: ['supply-flex-1', 'supply-flex-col'],
            children: [
              {
                class: ['supply-flex-row'],
                style: { height: '314px' },
                children: [
                  {
                    class: ['supply-flex-1'],
                    slots: ['sludgePlan']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['sludgeConcentration']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['autoDispensingSystem']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['mechanicalArmMatching']
                  }
                ]
              },
              {
                class: ['supply-flex-1'],
                slots: ['configuration']
              },
              {
                class: ['supply-flex-row'],
                style: { height: '296px' },
                children: [
                  {
                    class: ['supply-flex-1'],
                    slots: ['dischargeVolume']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['dehydrationSituation']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['mudProduction']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['sludgeTransportation']
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

  methods: {}
};
</script>
<style lang="less" scoped>
.smart-product {
  width: 100%;
  height: 100%;
}
</style>
