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
      <template #safetyHelmet>
        <safety-helmet :waterPlantId="waterPlantId" @update:videoList="updateVideoList"></safety-helmet>
      </template>
      <template #personnelBracelet>
        <personnel-bracelet :waterPlantId="waterPlantId" :videoList="videoList"></personnel-bracelet>
      </template>
      <template #purificationQuestion>
        <purification-question :waterPlantId="waterPlantId"></purification-question>
      </template>
      <template #dataViewing>
        <data-viewing :waterPlantId="waterPlantId"></data-viewing>
      </template>
      <template #smartQa>
        <smart-qa :waterPlantId="waterPlantId"></smart-qa>
      </template>
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { processStructure } from '@/api/smartProduct.js';
import ConLayout from '@/components/ConLayout/ConLayout';
import safetyHelmet from './models/safetyHelmet';
import personnelBracelet from './models/personnelBracelet';
import purificationQuestion from './models/purificationQuestion';
import dataViewing from './models/dataViewing';
import smartQa from './models/smartQa';
export default {
  name: 'decisionMaking',
  components: {
    ConLayout,
    safetyHelmet,
    personnelBracelet,
    purificationQuestion,
    dataViewing,
    smartQa
  },

  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  data() {
    return {
      videoList: [],
      config: {
        children: [
          {
            class: ['supply-flex-1', 'supply-flex-col'],
            style: { marginRight: '16px' },
            children: [
              {
                style: { height: '330px' },
                slots: ['safetyHelmet']
              },
              {
                class: ['supply-flex-1'],
                slots: ['personnelBracelet']
              }
            ]
          },
          {
            class: ['supply-flex-col'],
            style: { width: '452px' },
            children: [
              {
                class: ['supply-flex-1'],
                slots: ['purificationQuestion']
              },
              {
                class: ['supply-flex-1'],
                style: { marginTop: '16px' },
                slots: ['dataViewing']
              },
              {
                class: ['supply-flex-1'],
                style: { marginTop: '16px' },
                slots: ['smartQa']
              }
            ]
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
    },
    updateVideoList(videoList) {
      this.videoList = videoList;
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
