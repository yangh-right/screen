<template>
  <div class="videoCmp">
    <div v-for="(item, index) in videoList" :key="item.videoId" class="video-item">
      <div class="--video">
        <video-player
          :showPlugin="showPanel"
          route="securityManagement"
          playType="1"
          :playerId="'player' + index"
          :video-box-id="`playWndd${index}`"
          type="3"
          :query-time="queryTime"
          :videoNo="item.videoId"
          :videoCode="item.videoId"
        ></video-player>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { chunk, isString } from 'lodash-es';
import videoPlayer from '@/views/video/videoPlayer';
import { getISCHlsNoParse } from '@/api/mainPage.js';

export default {
  components: {
    videoPlayer
  },
  props: {
    current: {
      type: String,
      default: ''
    },
    videoList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      videos: [],
      videoIndex: 0,
      showPanel: true,
      queryTime: [moment().subtract(2, 'day'), moment()]
    };
  },

  methods: {
    async getVideos() {
      this.videos = this.videoList.map(v => {
        return {
          ...v,
          playUrl: ''
        };
      });
      const isHttps = window.location.protocol === 'https:';
      this.videos.forEach(async v => {
        let { status, resultData } = await getISCHlsNoParse(v.videoId, isHttps ? 'wss' : 'ws');
        if (status === 'complete' && isString(resultData)) {
          v.playUrl = resultData;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.videoCmp {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .video-item {
    width: calc(50% - 6px);
    height: 33%;
    margin-bottom: 12px;
  }

  .--video {
    width: 100%;
    height: 100%;
    margin-bottom: 4px;
  }
}
</style>
