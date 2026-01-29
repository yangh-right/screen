<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle="智能视频监控" class="video-surveillance-wrapper">
    <c-select v-model="currentVideoId" slot="headerRight" @openChange="openChange" @change="handleVideoChange"
      class="select-wrapper">
      <a-select-option v-for="item in videoDetailList" :key="item.videoName" :value="item.videoId">{{
        item.videoName
      }}</a-select-option>
    </c-select>
    <div class="card-inner">
      <div class="video-box">
        <video-player route="smartSafe" playType="1" :playerId="'safePlayer'" :video-box-id="`safePlayWndd`" type="3"
          :videoNo="currentVideoId" :videoCode="currentVideoId"></video-player>
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
  name: 'videoSurveillance',
  components: {
    videoPlayer,
    cSelect,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      timer: null,
      currentVideoId: '',
      videoDetailList: []
    };
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.getPumpList(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('video', ['setHideVideo', 'setWndNum']),
    async getPumpList(id) {
      const { status, resultData } = await getVideoList(id);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.videoDetailList = resultData.filter(result => !result.videoName.includes('垃圾'));
        this.total = this.videoDetailList.length;
        this.currentVideoId = this.videoDetailList[0].videoId;

        // 轮播视频播放
        this.initPlugin();
      } else {
        this.videoDetailList = [];
        this.currentVideoId = '';
      }
    },
    initPlugin() {
      if (this.timer) clearInterval(this.timer);
      let i = 0;

      this.timer = setInterval(() => {
        i++;
        if ((i === this.videoDetailList) === 0) {
          i = 0;
        }
        this.currentVideoId = this.videoDetailList[i].videoId;
      }, 30000);
    },
    openChange(e) {
      this.setHideVideo(e);
    },
    handleVideoChange(videoId) {
      this.currentVideoId = videoId;
      this.videoList = this.videoDetailList.filter(item => item.videoId === videoId);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
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

.section {
  width: 442px;
  height: 276px;
  background: url('~@/assets/img/summaryOverview/fir_backup_2.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  padding: 14px;
  box-sizing: border-box;

  .section-header {
    font-family: Aliba, sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #e6f8ff;
    letter-spacing: 0;
    margin: 4px 0;
    position: relative;
    padding-left: 12px;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      background: url('~@/assets/img/summaryOverview/fir_circle_2.png') no-repeat center center;
      background-size: 100% 100%;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .section-content {
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 20px 2px #124c9f;
    background: url('~@/assets/img/summaryOverview/fir_safe.png') no-repeat center center;
    background-size: 100% 100%;
    cursor: pointer;
  }

  .person-info {
    position: absolute;
    left: 20px;
    top: 20px;
    background: rgba(0, 14, 36, 0.5);
    padding: 8px 12px;
    border-radius: 4px;
    min-width: 180px;
    box-shadow: 0 0 4px rgba(0, 67, 185, 0.4);

    .person-label {
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-size: 14px;
      color: #e6f8ff;
      line-height: 24px;
      white-space: nowrap;
      text-shadow: 0 0 5px rgba(52, 221, 255, 0.5);

      &:first-child {
        margin-top: 0;
      }

      &:before {
        content: '';
        display: inline-block;
        width: 5px;
        height: 5px;
        background-color: #34ddff;
        border-radius: 50%;
        margin-right: 6px;
        vertical-align: middle;
      }
    }
  }
}
</style>
