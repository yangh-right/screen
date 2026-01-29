<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-02-02 11:17:53
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-03-19 09:27:28
 * @Description:
-->
<template>
  <div class="video-block">
    <h5-flow v-if="playMode1 === '2'" v-bind="$attrs"></h5-flow>
    <videoisc-live
      @initPlugin="initPlugin"
      ref="isc"
      @wndClick="handleClick(videoIndex)"
      :hideVideo="hideVideo"
      v-if="playMode1 === '1' && !destroyIsc"
      v-bind="$attrs"
    ></videoisc-live>
  </div>
</template>

<script>
import h5Flow from './H5Back';
import videoiscLive from './videoiscLive';
import { mapState } from 'vuex';
export default {
  name: 'videoPlayer',
  components: { h5Flow, videoiscLive },
  props: {
    playMode: {
      type: String,
      default: ''
    },
    videoIndex: {
      type: Number,
      default: 0
    },
    boxNum: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      destroyIsc: false,
      isInitPlugin: false,
      playMode1: this.playMode || '1'
    };
  },
  computed: {
    ...mapState('video', ['hideVideo', 'defaultPlayMode'])
  },

  watch: {
    boxNum: {
      handler(val) {
        if (this.$refs.isc) {
          this.$refs.isc.handleResize();
        }
      }
    },
    playMode: {
      handler(val) {
        this.playMode1 = val;
      }
    }
  },
  mounted() {
    this.playMode1 = this.playMode || this.defaultPlayMode || '1';
    setTimeout(() => {
      this.isInitPlugin = true;
    }, 7000);
  },
  activated() {
    this.destroyIsc = false;
  },
  deactivated() {
    this.destroyIsc = !this.isInitPlugin;
  },
  methods: {
    initPlugin() {
      setTimeout(() => {
        this.isInitPlugin = true;
      }, 500);
    },
    handleClick(index) {
      this.$emit('videoClick', index);
    }
  }
};
</script>
<style lang="less" scoped>
.video-block {
  height: 100%;
  width: 100%;
  background-color: #000;
  position: relative;
  z-index: 1;
}
</style>
