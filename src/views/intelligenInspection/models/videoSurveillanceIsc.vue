<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @Description: 智能视频监控组件 - 使用 JSPlugin 播放器
-->
<template>
  <unit-card cardTitle="智能视频监控" class="video-surveillance-wrapper">
    <div class="card-inner">
      <div class="video-box">
        <!-- 加载状态 -->
        <div class="loading" v-if="vLoading">
          <p>加载中...</p>
        </div>
        <!-- 播放器容器 -->
        <div :id="playerId" v-resize="handleResize" style="width: 100%; height: 100%" class="player"
          v-show="playSuccess && !vLoading" />
        <!-- 空状态 -->
        <div class="empty" v-if="!playSuccess && !vLoading">
          <p>暂无视频资源</p>
        </div>
      </div>
    </div>
  </unit-card>
</template>
<script>
import { mapMutations } from 'vuex';
import axiosConfig from '@/api/axiosConfig';

const axios = axiosConfig.axios;
const TOKENURL = axiosConfig.TOKENURL;
const DEVICEURL = axiosConfig.DEVICEURL;

const MAX_NUM = 1000;
const ERROR_NUM = 100;

export default {
  name: 'VideoSurveillance',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },

  props: {
    waterPlantId: {
      type: String,
      default: '',
      required: true
    },
    currentVideoId: {
      type: String,
      default: '',
      required: true
    }
  },

  data() {
    return {
      playerId: `video-player-${Number(new Date())}${String((Math.random() * 1000).toFixed(0))}`,
      player: null,
      curIndex: 0,
      playSuccess: false,
      vLoading: false,
      protocol: 'ws', // 0: ws协议 , 1: hls协议
      retryCount: 0, // 重试计数器
      maxRetry: MAX_NUM, // 最大重试次数
      isStopping: false, // 状态标志
      errorCount: 1,
      playerReady: false, // 播放器是否已初始化完成
      retryTimer: null, // 重试定时器
      RETRY_DELAY: 2000, // 重试延迟时间（毫秒）
      switchTimer: null // 视频切换防抖定时器
    };
  },

  computed: {},

  watch: {
    currentVideoId: {
      handler(val) {
        if (val && this.playerReady) {
          // 🔧 添加防抖，避免频繁切换视频
          if (this.switchTimer) {
            clearTimeout(this.switchTimer);
          }
          this.switchTimer = setTimeout(() => {
            console.log('🔄 切换视频ID:', val);
            this.showPreview();
          }, 300); // 300ms防抖
        }
      },
      immediate: false // 改为 false，避免在 mounted 之前执行
    }
  },

  async mounted() {
    await this.initProtocol();
    // 等待 DOM 元素渲染完成后初始化播放器
    await this.waitForPlayerElement();
  },

  deactivated() {
    this.player && this.player.JS_Pause(this.curIndex);
  },

  activated() {
    this.player && this.player.JS_Resume(this.curIndex).catch((e) => console.log(e));
  },

  beforeDestroy() {
    // 清除重试定时器
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    // 清除视频切换防抖定时器
    if (this.switchTimer) {
      clearTimeout(this.switchTimer);
      this.switchTimer = null;
    }
    this.player && this.player.JS_Stop(this.curIndex);
  },

  methods: {
    ...mapMutations('video', ['setHideVideo']),

    /**
     * 等待播放器容器元素渲染完成
     * @param {number} maxRetries - 最大重试次数
     * @param {number} interval - 每次重试的间隔时间 (ms)
     */
    waitForPlayerElement(maxRetries = 10, interval = 100) {
      return new Promise((resolve) => {
        let retries = 0;
        const checkElement = () => {
          const playerElement = document.getElementById(this.playerId);
          if (playerElement) {
            this.init();
            this.playerReady = true;
            // 初始化完成后，如果有 videoId 则开始播放
            if (this.currentVideoId) {
              this.showPreview();
            }
            resolve(true);
          } else if (retries < maxRetries) {
            retries++;
            console.log(`等待播放器容器元素... 重试 ${retries}/${maxRetries}`);
            setTimeout(checkElement, interval);
          } else {
            console.error('播放器容器元素未找到，已达到最大重试次数');
            resolve(false);
          }
        };
        // 使用 $nextTick 作为第一次尝试
        this.$nextTick(checkElement);
      });
    },

    handleResize() {
      if (this.player) {
        this.player.JS_Resize();
      }
    },

    init() {
      // 获取由 qiankun 注入的公共路径，若未注入则默认为当前目录
      const publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ ?? './';
      console.log('publicPath', publicPath);
      // 初始化 JSPlugin 播放器实例
      this.player = new window.JSPlugin({
        szId: this.playerId, // 需要英文字母开头 必填
        szBasePath: `${publicPath}video/hkH5/`, // 必填
        iCurrentSplit: 1,
        oStyle: {
          border: '#343434',
          borderSelect: '#FFCC00',
          background: '#000'
        }
      });

      let that = this;
      // 设置窗口控制回调函数
      this.player.JS_SetWindowControlCallback({
        windowEventSelect(index) {
          // 插件选中窗口回调
          this.curIndex = index;
        },
        pluginErrorHandler(index, iErrorCode, oError) {
          // 插件错误回调
          console.error('视频播放错误 ====', {
            errorCode: iErrorCode,
            error: oError,
            retryCount: that.retryCount,
            maxRetry: that.maxRetry
          });

          // 区分错误类型，某些错误不需要重试
          const NON_RETRYABLE_ERRORS = [400, 404, 403]; // 不可重试的错误码
          if (NON_RETRYABLE_ERRORS.includes(iErrorCode)) {
            console.error('不可恢复的错误，停止重试');
            that.playSuccess = false;
            that.vLoading = false;
            return;
          }

          that.stopPlayer().then(() => {
            if (that.retryCount < that.maxRetry) {
              that.retryCount += 1;
              console.log(`准备重试播放... (${that.retryCount}/${that.maxRetry})`);
              // 延迟重试，避免频繁请求
              that.retryTimer = setTimeout(() => {
                that.showPreview(true);
              }, that.RETRY_DELAY);
            } else {
              console.error('已达到最大重试次数，播放失败');
              that.playSuccess = false;
              that.vLoading = false;
            }
          });
        },
        performanceLack(error) {
          // 性能不足回调 - 这是警告而非致命错误，不需要重试
          console.warn('性能不足警告====', error);
          // 可选：降低视频质量或切换软解码
          // 不再触发重试，让视频继续播放
        }
      });
    },

    /**
     * 异步初始化协议类型
     */
    async initProtocol() {
      try {
        console.log(axiosConfig, 'axiosConfig');
        const res = await axios.get(`${TOKENURL}/sysDictClient/sysDictValueRest/isWS`);
        if (res?.resultData === '0') {
          this.protocol = 'ws';
        } else {
          this.protocol = 'ws';
        }
        console.log(this.protocol, '协议类型 ==== ', res);
      } catch (error) {
        console.log('初始化协议错误', error);
      }
    },

    /**
     * 异步显示视频预览
     */
    async showPreview(isRetry = false) {
      if (isRetry && this.retryCount >= this.maxRetry) return;
      if (!this.playerReady) {
        console.log('播放器尚未初始化完成');
        return;
      }
      try {
        this.playSuccess = false;
        this.vLoading = true;

        const { resultData: url } = await axios.get(`${DEVICEURL}/videoISC/getHlsUrlByVideoNo/?videoNo=${this.currentVideoId}&protocol=${this.protocol}`);

        console.log('datadatadatadatadatadata:', url);
        if (url) {
          this.tryPlayVideo(url);
        } else {
          throw new Error('未获取到视频URL');
        }
      } catch (e) {
        console.log('获取视频URL错误', e);
        this.playSuccess = false;
        this.vLoading = false;
      }
    },

    tryPlayVideo(url) {
      console.log('尝试播放视频 URL:', url);
      this.player
        .JS_Play(url, { playURL: url, mode: 1 }, 0)
        .then(() => {
          console.log('✅ 视频播放成功');
          this.playSuccess = true;
          this.vLoading = false;
          // 播放成功后重置重试计数器
          this.retryCount = 0;
          // 清除重试定时器
          if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = null;
          }
        })
        .catch((error) => {
          console.error('❌ 播放失败:', error);
          this.playSuccess = false;
          this.vLoading = false;
        });
    },

    async stopPlayer() {
      if (this.isStopping) return;
      this.isStopping = true;
      try {
        if (this.player) {
          await this.player.JS_Stop(this.curIndex);
        }
      } finally {
        this.isStopping = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.video-surveillance-wrapper {
  position: relative;
  z-index: 9999;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;

  .video-box {
    width: 100%;
    height: 100%;
    position: relative;
    background: #000;

    .player {
      width: 100% !important;
      height: 100% !important;
      position: relative;
    }

    .loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: #030b19;
      border-radius: 4px;
      z-index: 10;

      p {
        margin: 0;
        font-family: PingFangSC-Regular, PingFangSC-Medium, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #6ce8ff;
        text-align: center;
      }
    }

    .empty {
      width: 100%;
      height: 100%;
      background: #030b19;
      border-radius: 4px;
      z-index: 10;

      p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: PingFangSC-Regular, PingFangSC-Medium, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #6f86ae;
        text-align: center;
      }
    }
  }
}

.select-wrapper {
  width: 190px;
  height: 32px;
  margin-top: 28px;
  position: relative;
  z-index: 9999;
}
</style>
