<template>
  <div class="isc-h5-video vjs-waiting">
    <a-spin v-if="loading" size="large" class="loading-spinner" />
    <div :id="playerId" class="isc-h5-video-box" />
    <div class="control-btns">
      <div class="btns-left"></div>
      <div>
        <img class="btn-icon img-icon" :src="closeSoundIcon" v-if="isOpenSound" title="打开声音" @click="openSound" />
        <img class="btn-icon img-icon" :src="openSoundIcon" v-if="!isOpenSound" title="关闭声音" @click="closeSound" />
        <span v-if="isRecording" style="margin-right: 12px; color: red">
          Rec: {{ hour | addPrePadding }}:{{ minute | addPrePadding }}:{{ second | addPrePadding }}
        </span>
        <a-icon
          v-if="!isRecording"
          type="video-camera"
          style="margin-right: 12px"
          class="supply-mr-4"
          theme="filled"
          title="开始录像"
          @click="Record"
        ></a-icon>
        <img
          :src="closeCamera"
          class="img-icon"
          v-if="isRecording"
          alt=""
          style="margin-right: 12px; color: red"
          title="停止录像"
          @click="StopRecord"
        />
        <a-icon theme="filled" type="camera" style="margin-right: 12px" title="抓图" @click="CapturePicture()"></a-icon>
        <a-icon type="fullscreen" style="margin-right: 12px" title="全屏" @click="FullSreen"></a-icon>
      </div>
    </div>
  </div>
</template>

<script>
import tools from '@common/js/tool/tools.js';
import moment from 'moment';
export default {
  name: 'IscVideo',
  filters: {
    addPrePadding(v) {
      return v < 10 ? `0${v}` : v;
    }
  },
  components: {},
  props: {
    playUrl: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      loading: true,
      mode: 1,
      hour: 0,
      minute: 0,
      second: 0,
      closeCamera: require('@/assets/img/closeCamera.png'),
      closeSoundIcon: require('@/assets/img/closeSound.png'),
      openSoundIcon: require('@/assets/img/openSound.png'),
      isPlaySuccess: false,
      isRecording: false,
      isOpenSound: true,
      playerId: `v-${tools.uuid()}`
    };
  },

  watch: {
    playUrl() {
      this.stopplay();

      setTimeout(() => {
        if (this.playUrl) {
          this.realplay();
        }
      });
    }
  },

  mounted() {
    this.init();

    setTimeout(() => {
      if (this.playUrl) {
        this.realplay();
      }
    });
  },

  beforeDestroy() {
    this.stopplay();
  },

  methods: {
    init() {
      this.createPlayer();
      this.createEvents();
    },
    /**
     *
     * @param {*} getImgData 受否获取图片数据，若是则返回图片数据不自动下载，否则自动下载图片，不返回图片数据
     */
    CapturePicture(getImgData) {
      const time = new Date().getTime();
      if (getImgData) {
        this.player?.JS_CapturePicture(0, `${time}`, 'JPEG', imgData => {
          // console.log("imageData", imgData);
          window.parent.postMessage(
            {
              cmd: 'snapShotRes',
              data: imgData
            },
            '*'
          );
        });
      } else {
        this.player?.JS_CapturePicture(0, `${time}`, 'JPEG');
      }
    },
    FullSreen() {
      this.player?.JS_FullScreenDisplay(true).then(
        () => {
          // console.log("JS_FullScreenDisplay success");
        },
        () => {
          console.error('JS_FullScreenDisplay failed');
        }
      );
    },
    startTimer() {
      this.second += 1;
      if (this.second >= 60) {
        this.second = 0;
        this.minute += 1;
      }
      if (this.minute >= 60) {
        this.minute = 0;
        this.hour += 1;
      }
    },
    Record() {
      let that = this;
      let szTime = moment(new Date()).format('YYYYMMDDHHmmss');
      this.player?.JS_StartSaveEx(0, `监控录像_${szTime}.mp4`, 5).then(
        () => {
          that.isRecording = true;
          that.timer = setInterval(that.startTimer, 1000);
          // console.log("record success");
        },
        () => {
          console.error('record failed');
        }
      );
    },
    StopRecord() {
      let that = this;
      this.player?.JS_StopSave(0).then(
        () => {
          that.isRecording = false;
          window.clearInterval(that.timer);
          that.hour = 0;
          that.minute = 0;
          that.second = 0;
          // console.log("stopRecord success");
        },
        () => {
          console.error('stopRecord failed');
        }
      );
    },
    createEvents() {
      // 设置播放容器的宽高并监听窗口大小变化
      window.addEventListener('resize', () => {
        this.player.JS_Resize();
      });
    },
    openSound() {
      this.player?.JS_OpenSound().then(
        () => {
          this.isOpenSound = false;
        },
        err => {
          this.$message.error('声音播放失败');
          console.error('声音播放失败', err);
        }
      );
    },
    closeSound() {
      this.player?.JS_CloseSound().then(
        () => {
          this.isOpenSound = true;
        },
        err => {
          this.$message.error('声音关闭失败');
          console.error('声音关闭失败', err);
        }
      );
    },
    createPlayer() {
      const _path =
        process.env.NODE_ENV !== 'production' ? '/static/hkisc/' : `/waterPurificationBigPage/static/hkisc/`;

      this.player = new window.JSPlugin({
        szId: this.playerId,
        szBasePath: _path,
        iMaxSplit: 1,
        iCurrentSplit: 1,
        // bSupportSound: false,
        oStyle: {
          borderSelect: '#000000'
        }
      });
    },

    /* 预览 */
    realplay() {
      let { player, mode } = this;
      let index = player.currentWindowIndex;
      this.loading = true;
      player.JS_Play(this.playUrl, { playURL: this.playUrl, mode }, index).then(
        () => {
          this.isPlaySuccess = true;
          this.loading = false;
          console.log('realplay success');
        },
        e => {
          this.isPlaySuccess = false;
          console.error(e);
        }
      );
    },
    Stop() {
      // console.log('stop...', this.cout, this.loading)
      this.player?.JS_StopRealPlayAll(0).then(
        () => {
          this.isPlaySuccess = false;
          // console.log("stop...done", this.cout);
        },
        e => {
          // console.log("stop...failed", this.cout);
          console.error('stop failed', e);
        }
      );
    },
    stopplay() {
      if (this.player) {
        this.player.JS_Stop().then(
          () => {
            this.isPlaySuccess = false;
            console.log('stop realplay success');
          },
          e => {
            console.error(e);
          }
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
.isc-h5-video {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .control-btns {
    background-color: rgb(61, 61, 61);
    width: 100%;
    height: 38px;
    margin: 0 auto;

    .img-icon {
      width: 14px;
      cursor: pointer;
      position: relative;
      top: 2px;
    }
    .wpgicon:hover {
      background-color: rgb(81, 81, 81);
    }

    /deep/ .ant-btn-link {
      color: white;
      cursor: auto;

      &:hover {
        color: white;
      }
    }

    /deep/ .ant-btn-link[disabled] {
      cursor: not-allowed;
      color: gray;

      &:hover {
        color: gray;
      }
    }
  }
  .control-btns {
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    btns-left {
      display: flex;
      align-items: center;
    }
    .btn-icon {
      margin-right: 12px;
      margin-left: 12px;
    }
  }
  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
  }

  .isc-h5-video-box {
    width: 100% !important;
    height: calc(100% - 38px) !important;
    pointer-events: none; // 禁止屏幕双击
  }

  /deep/canvas {
    transform: scale(1) !important;
    transform-origin: 0 0;
  }
}
</style>
