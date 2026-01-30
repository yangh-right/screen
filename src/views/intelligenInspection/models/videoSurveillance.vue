<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description: 智能视频监控组件
-->
<template>
  <unit-card cardTitle="智能视频监控" class="video-surveillance-wrapper">
    <div class="card-inner">
      <div class="video-box">
        <video-player
          route="smartSafe"
          playType="1"
          :playerId="currentVideoId"
          :video-box-id="currentVideoId"
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
import videoPlayer from '@/views/video/videoPlayer';

export default {
  name: 'VideoSurveillance',
  components: {
    videoPlayer,
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
    },
  },

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {
    ...mapMutations('video', ['setHideVideo']),
  },
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
