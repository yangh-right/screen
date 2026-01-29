<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-06-15 20:35:12
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-06-18 09:00:02
 * @Description: 
-->
<template>
  <div class="smart-product">
    <con-layout :config="config">
      <template #introductionWaterPlant>
        <introduction-water-plant
          :waterPlantId="waterPlantId"
          @handleFullScreen="handleFullScreen"
        ></introduction-water-plant>
      </template>
      <template #developmentHistory>
        <development-history :waterPlantId="waterPlantId"></development-history>
      </template>
      <template #processFlow>
        <process-flow :waterPlantId="waterPlantId"></process-flow>
      </template>
      <template #designedWaterQuality>
        <designed-water-quality :waterPlantId="waterPlantId"></designed-water-quality>
      </template>
      <template #corporateCulture>
        <corporate-culture :waterPlantId="waterPlantId"></corporate-culture>
      </template>
      <template #leadersCaring>
        <leaders-caring :waterPlantId="waterPlantId"></leaders-caring>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { processStructure } from '@/api/smartProduct.js';
import ConLayout from '@/components/ConLayout/ConLayout';
import introductionWaterPlant from './models/introductionWaterPlant';
import developmentHistory from './models/developmentHistory';
import processFlow from './models/processFlow';
import designedWaterQuality from './models/designedWaterQuality';
import corporateCulture from './models/corporateCulture';
import leadersCaring from './models/leadersCaring';

export default {
  name: 'summaryOverview',
  components: {
    ConLayout,
    introductionWaterPlant,
    developmentHistory,
    processFlow,
    designedWaterQuality,
    corporateCulture,
    leadersCaring
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
      isFullScreen: false
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId']),
    config() {
      if (this.isFullScreen) {
        return {
          children: [
            {
              class: ['supply-flex-col', 'supply-flex-1'],
              style: { marginRight: '0px' },
              children: [
                {
                  class: ['supply-flex-1'],
                  slots: ['introductionWaterPlant']
                }
              ]
            }
          ]
        };
      } else {
        return {
          children: [
            {
              class: ['supply-flex-col', 'supply-flex-1'],
              style: { marginRight: '16px' },
              children: [
                {
                  class: ['supply-flex-1'],
                  slots: ['introductionWaterPlant']
                },
                {
                  style: { height: '258px', marginTop: '10px' },
                  slots: ['developmentHistory']
                }
              ]
            },
            {
              class: ['supply-flex-col'],
              style: { width: '784px' },
              children: [
                {
                  class: ['supply-flex-1'],
                  slots: ['processFlow']
                },
                {
                  class: ['supply-flex-1'],
                  style: { marginTop: '10px' },
                  slots: ['designedWaterQuality']
                },
                {
                  class: ['supply-flex-1'],
                  style: { marginTop: '10px' },
                  slots: ['corporateCulture']
                },
                {
                  class: ['supply-flex-1'],
                  style: { marginTop: '10px' },
                  slots: ['leadersCaring']
                }
              ]
            }
          ]
        };
      }
    }
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
    },
    handleFullScreen(val) {
      this.isFullScreen = val;
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
