<template>
  <div class="mainVideoModal">
    <div class="title">
      <span class="text">当前播放：{{ videoInfo.name }}</span>
      <a-icon type="close" style="font-size: 16px; color: #fff" @click="closeModal" />
    </div>
    <div class="main-device-box">
      <div id="myVideo" class="video-box"></div>
    </div>
  </div>
</template>

<script>
import Player from 'xgplayer';
export default {
  name: 'videoBack',
  components: {},
  props: {
    videoInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      player: null //实例
    };
  },
  computed: {},
  watch: {
    videoInfo: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (!this.player) {
          this.initPlayer();
          return;
        } else {
          this.player.destroy();
          this.player = null;
          this.initPlayer();
        }
      }
    }
  },
  mounted() {
    // 初始化播放器
    this.initPlayer();
  },
  methods: {
    initPlayer() {
      if (!this.videoInfo?.url) return false;
      const config = {
        id: 'myVideo',
        url: this.videoInfo.url,
        /**倍速播放 */
        // playbackRate: [0.5, 0.75, 1, 1.5, 2],
        // defaultPlaybackRate: 1,
        width: 980,
        height: 648,
        videoInit: true,
        loop: true,
        autoplay: true
      };
      this.player = new Player(config);
    },
    closeModal() {
      this.$emit('closeVideo');
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
  }
};
</script>

<style lang="less" scoped>
.mainVideoModal {
  position: fixed;
  top: -10%;
  transform: translateX(-50%);
  left: 50%;
  width: 1000px;
  height: 700px;
  z-index: 1000;
  border-radius: 4px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.5);
  background: #03172738;
  background-image: linear-gradient(90deg, rgba(8, 20, 45, 0.7) 0%, rgba(1, 11, 33, 0.82) 100%);
  .title {
    align-items: center;
    padding: 0 6px 0 12px;
    height: 40px !important;
    display: flex;
    background: url('~@/assets/img/position/sub_title_bg.png') no-repeat;
    background-size: 100% 100%;
    justify-content: space-between;
    .text {
      line-height: normal;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .main-device-box {
    padding: 0 10px;
    width: 100%;
    height: calc(100% - 40px);

    .video-box {
      width: 100%;
      height: 100%;
      position: relative;

      /deep/video {
        width: 100%;
      }
    }
  }
}
</style>
