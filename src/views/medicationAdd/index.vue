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
      <template #configuration>
        <configuration :waterPlantId="waterPlantId"></configuration>
      </template>
      <template #valvePrecision>
        <valve-precision :waterPlantId="waterPlantId"></valve-precision>
      </template>
      <template #theory>
        <control-theory :waterPlantId="waterPlantId"></control-theory>
      </template>
      <!-- <template #dissolvedOxygen>
        <dissolved-oxygen :line="line" :waterPlantId="waterPlantId"></dissolved-oxygen>
      </template> -->
      <template #controlPrecision>
        <control-precision @lineChange="lineChange" :waterPlantId="waterPlantId"></control-precision>
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

import configuration from './models/configuration';
export default {
  name: 'smartProduct',
  components: {
    ConLayout,
    valvePrecision,
    configuration,
    controlTheory,
  //  dissolvedOxygen,
    controlPrecision
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
                class: ['supply-flex-1'],
                slots: ['configuration']
              },
              {
                style: { height: '346px' },
                slots: ['valvePrecision']
              }
            ]
          },
          {
            class: ['supply-flex-col'],
            style: { width: '26%' },
            children: [
              {
                class: ['supply-flex-1'],
              //  style:{flex:'2 1 0%'},
                slots: ['theory']
              },
              // {
              //   class: ['supply-flex-1'],
              //   children: [
              //     {
              //       style: { marginRight: '16px' },
              //       class: ['supply-flex-1'],
              //       slots: ['dissolvedOxygen']
              //     }
              //   ]
              // },
              {
                class: ['supply-flex'],
                // style:{flex:'1 1 0%'},
                style: { height: '346px' },
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
    lineChange(val) {
      this.line = val
    },
  }
};
</script>
<style lang="less" scoped>
.smart-product {
  width: 100%;
  height: 100%;
}
</style>
