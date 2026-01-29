<template>
  <div class="videoCmp">
    <div v-for="video in videos" :key="video.videoId" class="video-item">
      <div class="--video">
        <isc-video v-if="video.playUrl" :play-url="video.playUrl" :video-id="video.videoId" :timeout="1 * 1000" />
      </div>
    </div>
  </div>
</template>

<script>
import { chunk, isString } from 'lodash-es';
import IscVideo from '@/components/IscVideo/index.vue';
import { getISCHlsNoParse } from '@/api/mainPage.js';

export default {
  components: {
    IscVideo
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
      videoIndex: 0
    };
  },

  watch: {
    current(val) {
      this.getData();
    }
  },

  methods: {
    getData() {
      this.getVideos();
    },
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
