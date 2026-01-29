<template>
  <div class="mainVideoModal">
    <div class="title">
      <span class="text">视频监控</span>
      <a-icon type="close" style="font-size: 16px; color: #fff" @click="closeModal" />
    </div>
    <div class="main-device-box">
      <video class="video-box" muted controls autoplay id="remoteVideo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'videoMonitor',
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
  watch: {
    videoInfo: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.videoInfo && Object.keys(this.videoInfo).length > 0) {
          this.playVideo();
        }
      }
    }
  },
  mounted() {
    if (this.videoInfo && Object.keys(this.videoInfo).length > 0) {
      this.playVideo();
    }
  },
  methods: {
    playVideo() {
      const openUrl = this.videoInfo.api_url;
      const rtcUrl = this.videoInfo.play_url[3];
      this.player = new window.JSWebrtc.Player(openUrl, rtcUrl, {
        video: document.getElementById('remoteVideo'),
        autoplay: true,
        onPlay: () => {
          this.$emit('clearVideo');
        },
        onFail: () => {
          console.log('播放失败');
        }
      });
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
  top: 10%;
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
    display: flex;
    align-items: center;
    padding: 0 6px 0 12px;
    height: 40px !important;
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
    }
  }
}
</style>
