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
      <template #waterTreatment>
        <water-treatment :waterPlantId="waterPlantId"></water-treatment>
      </template>
      <template #inWaterQuality>
        <in-water-quality :waterPlantId="waterPlantId" :qualityData="qualityData"></in-water-quality>
      </template>
      <template #outWaterQuality>
        <out-water-quality :waterPlantId="waterPlantId"></out-water-quality>
      </template>
      <template #outWaterRate>
        <out-water-rate :waterPlantId="waterPlantId" :qualityData="qualityData"></out-water-rate>
      </template>
      <template #keyInstruments>
        <key-instruments :waterPlantId="waterPlantId"></key-instruments>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { processStructure } from '@/api/smartProduct.js';
import ConLayout from '@/components/ConLayout/ConLayout';
import configuration from './models/configuration';
import waterTreatment from './models/waterTreatment';
import inWaterQuality from './models/inWaterQuality';
import outWaterQuality from './models/outWaterQuality';
import outWaterRate from './models/outWaterRate';
import keyInstruments from './models/keyInstruments';
export default {
  name: 'smartProduct',
  components: {
    ConLayout,
    configuration,
    waterTreatment,
    inWaterQuality,
    outWaterQuality,
    outWaterRate,
    keyInstruments
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      line: 0,
      qualityData: {
        inflowStandard: 365,
        inflowStandardRate: 100,
        inflowStandardRateThisYear: 0,
        inflowStandardThisYear: 1,
        quasiClassThree: 365,
        quasiClassThreeRate: 100,
        quasiClassThreeRateThisYear: 0,
        quasiClassThreeThisYear: 1
      },
      config: {
        class: ['supply-flex-col'],
        children: [
          {
            class: ['supply-flex-1'],
            children: [
              {
                style: { width: '1090px', marginRight: '16px' },
                slots: ['configuration']
              },
              {
                class: ['supply-flex-1', 'supply-flex-col'],
                children: [
                  {
                    class: ['supply-flex-1'],
                    children: [
                      {
                        style: { marginRight: '16px' },
                        class: ['supply-flex-1'],
                        slots: ['waterTreatment']
                      },
                      {
                        class: ['supply-flex-1'],
                        slots: ['inWaterQuality']
                      }
                    ]
                  },
                  {
                    class: ['supply-flex-1'],
                    style: { marginTop: '16px' },
                    children: [
                      {
                        style: { marginRight: '16px' },
                        class: ['supply-flex-1'],
                        slots: ['outWaterQuality']
                      },
                      {
                        class: ['supply-flex-1'],
                        slots: ['outWaterRate']
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            style: { height: '313px' },
            slots: ['keyInstruments']
          }
        ]
      }
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initWaterStatistics();
        }
      },
      immediate: true
    }
  },

  methods: {
    async initWaterStatistics() {
      let params = {
        waterPlantId: this.waterPlantId
      };
      let { resultData, status } = await processStructure(params);
      if (status === 'complete') {
        this.qualityData = resultData;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.smart-product {
  width: 100%;
  height: 100%;
}
</style>
