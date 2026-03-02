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
    <!-- 全屏背景地图 -->
    <mapCmp ref="bgMap" class="background-map" :currentMapCenter="[119.9883396051631, 28.87622726922423]"
      :currentMapZoom="isFullScreen ? 17.6 : 17" />
    <con-layout :config="config">
      <template #introductionWaterPlant>
        <introduction-water-plant :waterPlantId="waterPlantId"
          @handleFullScreen="handleFullScreen"></introduction-water-plant>
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
      <!-- <template #leadersCaring>
        <leaders-caring :waterPlantId="waterPlantId"></leaders-caring>
      </template> -->
    </con-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { processStructure } from '@/api/smartProduct.js';
import ConLayout from '@/components/ConLayout/ConLayout';
import introductionWaterPlant from './models/introductionWaterPlant';
import mapCmp from '@/views/mapBox/index.vue';
import developmentHistory from './models/developmentHistory';
import processFlow from './models/processFlow';
import designedWaterQuality from './models/designedWaterQuality';
import corporateCulture from './models/corporateCulture';
// import leadersCaring from './models/leadersCaring';

export default {
  name: 'summaryOverview',
  components: {
    ConLayout,
    introductionWaterPlant,
    mapCmp,
    developmentHistory,
    processFlow,
    designedWaterQuality,
    corporateCulture,
    // leadersCaring
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
                  class: ['supply-flex-1', 'map-slot-transparent'],
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
              children: [
                {
                  class: ['supply-flex-1', 'map-slot-transparent'],
                  slots: ['introductionWaterPlant']
                },
                {
                  style: { height: '378px', marginTop: '10px', marginBottom: '10px' },
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
                  style: { paddingTop: '90px', paddingLeft: '30px' },
                  slots: ['processFlow']
                },
                {
                  class: ['supply-flex-1'],
                  style: { paddingLeft: '30px' },
                  slots: ['designedWaterQuality']
                },
                {
                  class: ['supply-flex-1'],
                  style: { marginBottom: '30px', paddingLeft: '30px' },
                  slots: ['corporateCulture']
                },
                // {
                //   class: ['supply-flex-1'],
                //   style: { marginTop: '10px' },
                //   slots: ['leadersCaring']
                // }
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
      // 切换后刷新地图尺寸
      this.$nextTick(() => {
        if (this.$refs.bgMap && this.$refs.bgMap.map) {
          this.$refs.bgMap.map.resize();
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.smart-product {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #073c57;

  .background-map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  /deep/ .con-layout {
    position: relative;
    z-index: 10;
    pointer-events: none; // 让布局容器不阻挡点击，透传给地图

    .con-layout__item {
      pointer-events: auto; // 具体的图表面板需要响应点击
      background: rgba(40, 72, 77, 0.4); // #28484d 带透明效果

      // 特殊处理：水厂简介所在的插槽需要透明且穿透
      &.map-slot-transparent {
        background: transparent !important;
        pointer-events: none;
      }

      .card-title5 {
        .title {
          .gradient-shadow {
            .text {
              margin-left: 45px !important;
            }
          }
        }
      }
    }
  }
}
</style>
