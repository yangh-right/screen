<template>
  <div class="news-display" :class="{ 'full-screen': isFull }">
    <div class="left-panel" v-if="!isFull">
      <div class="title">{{ title }}</div>
      <div class="description">{{ description }}</div>
    </div>
    <!-- 全屏切换按钮 -->
    <a-icon :type="isFull ? 'fullscreen-exit' : 'fullscreen'" class="page-edit" @click="handleFull" />
    <mapCmp ref="leafletMap" v-if="showMap" :currentMapCenter="waterPlantMapCenter" :currentMapZoom="17" />
  </div>
</template>

<script>
import mapCmp from '@/views/mapBox/index.vue';
export default {
  name: 'introductionWaterPlant',
  components: {
    mapCmp
  },
  data() {
    return {
      waterPlantMapCenter: [119.986682,28.876899],
      title: '水厂简介',
      description:
        '永康污水处理厂，坐落于浙江省金华市永康市城西新区章店村，设计处理能力为日处理污水4.00万立方米。永康市城市污水处理厂收集范围包括主城区、经济开发区、城西新区、花街镇部分和石柱镇部分，排水去向为永康江，自2007年6月正式投入运行以来，污水处理设备运转良好，日平均处理污水量为4.01 万立方米。该项目采用先进的污水处理设备，厂区主体工艺采用氧化沟处理工艺，对城市水环境，对治理污染，保护当地流域水质和生态平衡具有十分重要的作用。',
      showMap: true,
      isFull: false // 是否全屏
    };
  },
  methods: {
    // 切换全屏
    handleFull() {
      this.isFull = !this.isFull;
      this.$emit('handleFullScreen', this.isFull);
      // 全屏切换后刷新地图尺寸
      this.$nextTick(() => {
        if (this.$refs.leafletMap && this.$refs.leafletMap.map) {
          const map = this.$refs.leafletMap.map;
          map.resize();
          const currentZoom = map.getZoom();
          const currentCenter = map.getCenter();
          // 全屏时地图适当放大
          if (this.isFull) {
            map.easeTo({
              center: currentCenter,
              zoom: currentZoom + 0.6,
              duration: 800
            });
          } else {
            map.easeTo({
              center: currentCenter,
              zoom: currentZoom - 0.6,
              duration: 800
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.news-display {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;

  &.full-screen {
    padding: 0 !important;
    .left-panel {
      display: none !important;
    }
    .page-edit {
      z-index: 1000;
    }
  }

  .left-panel {
    width: 212px;
    height: 100%;
    background: url('~@/assets/img/summaryOverview/fir_introduction_to_waterworks.png') no-repeat left top;
    position: absolute;
    top: 0;
    left: 0;
    padding: 164px 38px 0 16px;
    box-sizing: border-box;
    z-index: 100;
    .title {
      width: 17px;
      height: 92px;
      font-family: YouSheBiaoTiHei, sans-serif;
      font-size: 18px;
      color: #e5ebf7;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    .description {
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 17px;
      color: #e8f0ff;
      letter-spacing: 0;
      line-height: 24px;
    }
  }

  mapCmp {
    flex: 1 1 0%;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .page-edit {
    position: absolute;
    top: 25px;
    right: 25px;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    cursor: pointer;
    color: #ffffff;
  }
}
</style>
