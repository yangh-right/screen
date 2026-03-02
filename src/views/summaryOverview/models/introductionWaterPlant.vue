<template>
  <div class="news-display" :class="{ 'full-screen': isFull }">
    <div class="left-panel" v-if="!isFull">
      <div class="title">{{ title }}</div>
      <div class="description">{{ description }}</div>
    </div>
    <!-- 全屏切换按钮 -->
    <a-icon :type="isFull ? 'fullscreen-exit' : 'fullscreen'" class="page-edit" @click="handleFull" />
    <!-- 这里原本显示地图，现在作为透明区域让背景地图透出来 -->
    <div class="map-hole"></div>
  </div>
</template>

<script>
export default {
  name: 'introductionWaterPlant',
  data() {
    return {
      title: '水厂简介',
      description:
        '永康污水处理厂，坐落于浙江省金华市永康市城西新区章店村，设计处理能力为日处理污水4.00万立方米。主要建设内容包括厂区土建施工，工艺设备、工艺管道安装，电气、自控系统安装，照明，防雷接地，采暖，通风，厂区道路施工及绿化等。永康市城市污水处理厂自2007年6月正式投入运行以来，污水处理设备运转良好，日平均处理污水量为4.01 万立方米。该项目采用先进的污水处理设备，厂区主体工艺采用氧化沟处理工艺。永康污水处理厂建成后极大地改善了城市水环境，对治理污染，保护当地流域水质和生态平衡具有十分重要的作用，同时对改善金华市的投资环境，实现金华市经济社会可持续发展具有积极的推进作用。',
      isFull: false // 是否全屏
    };
  },
  methods: {
    // 切换全屏
    handleFull() {
      this.isFull = !this.isFull;
      this.$emit('handleFullScreen', this.isFull);
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
  background: transparent;

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
    background: url('~@/assets/lightimg/int/plant_intro.png') no-repeat left center;
    background-size: 100% 100%;
    position: absolute;
    top: 130px;
    left: 0;
    padding: 15px 30px 0 15px;
    box-sizing: border-box;
    z-index: 100;
    pointer-events: auto;

    .title {
      width: 17px;
      height: 92px;
      font-family: YouSheBiaoTiHei, sans-serif;
      font-size: 18px;
      color: #e5ebf7;
      position: absolute;
      right: 8px;
      top: 48%;
      transform: translateY(-50%);
    }

    .description {
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #e8f0ff;
      letter-spacing: 0;
      line-height: 22px;
    }
  }

  .map-hole {
    flex: 1;
    height: 100%;
    pointer-events: none; // 让点击穿透到背景地图
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
    pointer-events: auto;
  }
}
</style>
