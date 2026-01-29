<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-06-15 20:35:37
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-06-18 09:00:02
 * @Description: 
-->
<template>
  <div class="smart-product">
    <con-layout :config="config">
      <template #configuration>
        <configuration :waterPlantId="waterPlantId"></configuration>
      </template>
      <template #valvePrecision>
        <valve-precision :waterPlantId="waterPlantId"></valve-precision>
      </template>
      <template #theory>
        <control-theory :waterPlantId="waterPlantId"></control-theory>
      </template>
      <template #dissolvedOxygen>
        <dissolved-oxygen :waterPlantId="waterPlantId"></dissolved-oxygen>
      </template>
      <template #outQuality>
        <out-quality :waterPlantId="waterPlantId"></out-quality>
      </template>
      <template #controlPrecision>
        <control-precision :waterPlantId="waterPlantId"></control-precision>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConLayout from '@/components/ConLayout/ConLayout';
import valvePrecision from './models/valvePrecision';
import dissolvedOxygen from './models/dissolvedOxygen';
import controlTheory from './models/controlTheory';
import controlPrecision from './models/controlPrecision';
import outQuality from './models/outQuality';
import configuration from './models/configuration';
export default {
  name: 'smartProduct',
  components: {
    ConLayout,
    valvePrecision,
    configuration,
    controlTheory,
    dissolvedOxygen,
    outQuality,
    controlPrecision
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      config: {
        children: [
          {
            class: ['supply-flex-1', 'supply-flex-col'],
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['configuration']
              },
              {
                style: { height: '273px' },
                slots: ['valvePrecision']
              }
            ]
          },
          {
            class: ['supply-flex-col'],
            style: { width: '42%' },
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['theory']
              },
              {
                class: ['supply-flex-1'],
                children: [
                  {
                    style: { marginRight: '16px' },
                    class: ['supply-flex-1'],
                    slots: ['dissolvedOxygen']
                  },
                  {
                    class: ['supply-flex-1'],
                    slots: ['outQuality']
                  }
                ]
              },
              {
                class: ['supply-flex-1'],
                slots: ['controlPrecision']
              }
            ]
          }
        ]
      }
    };
  },

  mounted() {},

  methods: {
  }
};
</script>
<style lang="less" scoped>
.smart-product {
  width: 100%;
  height: 100%;
}
</style>
