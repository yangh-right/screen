<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-17 18:03:38
 * @Description: 稳定出水监控组件
-->
<template>
  <unit-card cardTitle="自动配药系统" :showTime="false">
    <div @dblclick="toggleFullscreen" class="card-inner">
      <img v-show="isPlay" :src="play" @click="handleVideo" alt="" />
      <video ref="videoPlayer" :src="videoSrc" muted width="100%" height="100%" @ended="handleEnd"></video>
    </div>
    <videoBigger :visible.sync="dialogVisible" :videoSrc="videoSrc" @close="closeDialog"></videoBigger>
  </unit-card>
</template>
<script>
import videoBigger from '@/components/videoBigger';
export default {
  name: 'ControlPrecision',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    videoBigger
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      play: require('@/assets/img/sludgeDischarge/play.png'),
      videoSrc: require('@/assets/img/sludgeDischarge/arm.mp4'),
      poolList: [],
      currentPoint: '',
      isPlay: true,
      dialogVisible: false, // 新增弹窗状态
      chartData: null
    };
  },
  computed: {},
  methods: {
    handleEnd() {
      this.isPlay = true;
    },
    toggleFullscreen() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    handleVideo() {
      this.$refs.videoPlayer.play();
      this.isPlay = false;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .card-title {
  .title {
    .text {
      font-size: 20px !important;
    }
  }
}
.card-inner {
  position: relative;
  margin: 10px 0 0 0px;
  width: 452px;
  height: 258px;
  background: url('~@/assets/img/sludgeDischarge/video_bg.png') no-repeat;
  background-size: 100% 100%;
  background-position: 50% 50%;
  img {
    z-index: 1000;
    position: absolute;
    top: 40%;
    left: 46%;
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
  video {
    padding: 10px;
    width: 100%;
    height: 100%;
  }
}
</style>
