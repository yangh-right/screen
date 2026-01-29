<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description: 智能视频监控组件
-->
<template>
  <unit-card cardTitle="智能视频监控" class="video-surveillance-wrapper">
    <c-select
      v-model="currentVideoId"
      slot="headerRight"
      @openChange="handleOpenChange"
      @change="handleVideoChange"
      class="select-wrapper"
      placeholder="请选择视频"
    >
      <a-select-option v-for="item in videoDetailList" :key="item.videoId" :value="item.videoId">
        {{ item.videoName }}
      </a-select-option>
    </c-select>

    <div class="card-inner">
      <div class="video-box">
        <video-player
          route="smartSafe"
          playType="1"
          playerId="safePlayer"
          video-box-id="safePlayWndd"
          type="3"
          :videoNo="currentVideoId"
          :videoCode="currentVideoId"
        />
      </div>
    </div>
  </unit-card>
</template>

<script>
import { mapMutations } from 'vuex';
import { getVideoList } from '@/api/mainPage.js';
import videoPlayer from '@/views/video/videoPlayer';
import cSelect from '@/components/antDesign/cSelect.vue';

export default {
  name: 'VideoSurveillance',
  components: {
    videoPlayer,
    cSelect,
    UnitCard: () => import('@/components/UnitCard.vue')
  },

  props: {
    waterPlantId: {
      type: String,
      default: '',
      required: true
    }
  },

  data() {
    return {
      timer: null,
      currentVideoId: '',
      videoDetailList: [],
      currentIndex: 0,
      isAutoPlay: true
    };
  },

  computed: {
    hasVideos() {
      return this.videoDetailList.length > 0;
    }
  },

  watch: {
    waterPlantId: {
      handler(newVal) {
        if (newVal) {
          this.fetchVideoList(newVal);
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapMutations('video', ['setHideVideo']),

    /**
     * 获取视频列表
     * @param {string} id - 水厂ID
     */
    async fetchVideoList(id) {
      try {
        const { status, resultData } = await getVideoList(id);

        if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
          // 过滤掉包含"垃圾"的视频
          this.videoDetailList = resultData.filter(item => !item.videoName.includes('垃圾'));

          if (this.videoDetailList.length > 0) {
            this.currentVideoId = this.videoDetailList[0].videoId;
            this.currentIndex = 0;
            this.startAutoPlay();
          }
        } else {
          this.resetVideoData();
        }
      } catch (error) {
        console.error('获取视频列表失败:', error);
        this.resetVideoData();
      }
    },

    /**
     * 重置视频数据
     */
    resetVideoData() {
      this.videoDetailList = [];
      this.currentVideoId = '';
      this.currentIndex = 0;
      this.stopAutoPlay();
    },

    /**
     * 开始自动播放
     */
    startAutoPlay() {
      if (this.videoDetailList.length <= 1) return;

      this.stopAutoPlay();
      this.timer = setInterval(() => {
        this.nextVideo();
      }, 30000); // 30秒切换一次
    },

    /**
     * 停止自动播放
     */
    stopAutoPlay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    /**
     * 切换到下一个视频
     */
    nextVideo() {
      if (this.videoDetailList.length === 0) return;

      this.currentIndex = (this.currentIndex + 1) % this.videoDetailList.length;
      this.currentVideoId = this.videoDetailList[this.currentIndex].videoId;
    },

    /**
     * 处理下拉框打开/关闭事件
     * @param {boolean} isOpen - 是否打开
     */
    handleOpenChange(isOpen) {
      this.setHideVideo(isOpen);

      // 打开下拉框时暂停自动播放，关闭时恢复
      if (isOpen) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    },

    /**
     * 处理视频选择变化
     * @param {string} videoId - 选中的视频ID
     */
    handleVideoChange(videoId) {
      this.currentVideoId = videoId;
      this.currentIndex = this.videoDetailList.findIndex(item => item.videoId === videoId);

      // 重置自动播放计时器
      this.startAutoPlay();
    }
  },

  beforeDestroy() {
    this.stopAutoPlay();
  },

  deactivated() {
    this.stopAutoPlay();
  },

  activated() {
    if (this.hasVideos) {
      this.startAutoPlay();
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
  display: flex;
  padding: 20px 0;

  .video-box {
    flex: 1;
    height: 100%;
    overflow: hidden;
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
