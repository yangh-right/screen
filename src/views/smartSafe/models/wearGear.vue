<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <div class="card-inner">
    <div
      class="card-content"
      @dblclick="toggleFullscreen"
      @mouseenter="showControl = true"
      @mouseleave="showControl = false"
    >
      <div class="title">实时管控操作步骤</div>
      <div class="mask"></div>
      <video
        ref="videoPlayer"
        class="video-player"
        :src="videoSrc"
        loop
        muted
        @play="isPlaying = true"
        @pause="isPlaying = false"
      ></video>
      <div class="play-control" v-show="!isPlaying || showControl" @click="togglePlay">
        <img :src="isPlaying ? playSrc : pauseSrc" :alt="isPlaying ? '暂停' : '播放'" class="control-icon" />
      </div>
    </div>
    <videoBigger :visible.sync="dialogVisible" :videoSrc="videoSrc" @close="closeDialog"></videoBigger>
  </div>
</template>

<script>
import videoBigger from '@/components/videoBigger';
export default {
  name: 'pcAudit',
  components: { videoBigger },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showControl: false,
      isPlaying: false,
      dialogVisible: false, // 新增弹窗状态
      videoSrc: require('@/assets/img/smartSafe/wear.mp4'),
      pauseSrc: require('@/assets/img/summaryOverview/fir_pause.png'),
      playSrc: require('@/assets/img/summaryOverview/fir_start.png')
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    initData() {},
    togglePlay() {
      const video = this.$refs.videoPlayer;
      if (video) {
        if (video.paused) {
          video.play();
          this.isPlaying = true;
        } else {
          video.pause();
          this.isPlaying = false;
        }
      }
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    toggleFullscreen() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 12px;
  background-image: linear-gradient(180deg, #003874b3 0%, #00244a33 53%, #00244ab3 100%);
  box-shadow: inset 0 0 20px 0 #007dff4d;
  border-radius: 4px;
  .card-content {
    position: relative;
    width: 100%;
    height: 100%;
    .video-player {
      width: 100%;
      height: 100%;
    }
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      box-shadow: inset 0 0 55px 11px #00172d;
      border-radius: 3.33px;
      z-index: 2;
    }
    .play-control {
      z-index: 4;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      background: rgba(0, 146, 246, 0.2);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      opacity: 0;
      animation: fadeIn 0.3s forwards;

      &:hover {
        background: rgba(0, 146, 246, 0.4);
      }

      .control-icon {
        width: 50px;
        height: 50px;
      }
    }
    .title {
      position: absolute;
      z-index: 3;
      width: 60%;
      height: 40px;
      font-family: AlibabaPuHuiTiM, sans-serif;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0.46px;
      padding: 0 14px;
      line-height: 40px;
      background-image: linear-gradient(270deg, #1e539000 7%, #134479ba 77%);
    }
  }
}
</style>
