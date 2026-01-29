<template>
  <div class="main-page smart-talents">
    <div class="center-side-wrap">
      <mapCmp ref="leafletMap" v-if="showMap" :currentMapCenter="mainPageMapCenter" :currentMapZoom="11"/>
    </div>
    <div class="left-side-wrap">
      <slide-panel :showStage="showStage" ref="left" />
    </div>
    <div class="right-side-wrap">
      <think-panel :showStage="showStage" ref="right" />
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal
      :isBigger="isBigger"
      :visible.sync="showPreview"
      :imageUrl="previewImage"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getDataFileList } from '@/api/mainPage';
import ImagePreviewModal from '@/views/summaryOverview/components/ImagePreviewModal.vue';
import SlidePanel from './model/SlidePanel.vue';
import ThinkPanel from './model/ThinkPanel.vue';
import mapCmp from '@/views/mapBox/index.vue';

export default {
  name: 'SmartTalentsPage',
  components: {
    SlidePanel,
    ThinkPanel,
    ImagePreviewModal,
    mapCmp
  },
  data() {
    return {
      mainPageMapCenter: [120.096682, 28.976899],
      isBigger: true,
      showMap: true,
      showPreview: false,
      previewImage: '',
      showStage: true,
      fade: false
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {}
    }
  },
  created() {},
  mounted() {},
  methods: {
    showImagePreview(imageUrl) {
      this.previewImage = imageUrl;
      this.showPreview = true;
    }
  }
};
</script>

<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;

  .center-side-wrap {
    position: relative;
    width: 100%;
    margin: 10px 0;
    height: 97%;
    .content-wrap {
      position: absolute;
      width: 80%;
      height: 48%;
      top: 6%;
      left: 10%;
    }
  }
  .right-side-wrap {
    position: fixed;
    width: 452px;
    height: calc(100% - 132px);
    top: 8%;
    right: 32px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
  .left-side-wrap {
    position: fixed;
    width: 452px;
    height: calc(100% - 132px);
    top: 8%;
    left: 32px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
  .img-active {
    transform: scale(1.1);
  }
  /deep/ .select__block {
    z-index: 100;
    position: absolute;
    background: url('~@/assets/img/hz/ac-point.png') no-repeat;
    background-size: 100% 100%;

    width: 124px;
    height: 34px;

    margin-right: 12px;

    .ant-select-selection {
      background: transparent;
      border: none;
    }

    .ant-select-selection__rendered {
      height: 34px;
      line-height: 34px;
      text-align: center;
      .ant-select-selection-selected-value {
        float: unset;
        font-family: SourceHanSansCN-Regular, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
}
</style>
