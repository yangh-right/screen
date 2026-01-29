<template>
  <div class="content-wrapper">
    <person-positioning></person-positioning>
    <video-box v-if="videoList.length > 0" class="video-box" :videoList="videoList" @on-close="handleVideoClose" />
  </div>
</template>
<script>
import personPositioning from '../../realTimePositioning/index.vue';
import videoBox from './videoBox.vue';
export default {
  name: 'personnelBracelet',
  props: {
    videoList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    personPositioning,
    videoBox
  },
  data() {
    return {};
  },
  methods: {
    handleVideoClose(index) {
      this.videoList.splice(index, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.content-wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  .video-box {
    width: calc(100% - 24px);
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
}
</style>
