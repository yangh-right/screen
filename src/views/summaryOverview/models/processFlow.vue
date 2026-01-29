<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle="工艺流程" cardType="5">
    <div class="card-inner">
      <div class="process-flow-container">
        <img
          :src="processFlowImg"
          @click="showImagePreview(processFlowImg)"
          alt="工艺流程图"
          class="process-flow-img"
        />
      </div>
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal class="img-bigger" :visible.sync="showPreview" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import ImagePreviewModal from '../components/ImagePreviewModal1.vue';

export default {
  name: 'processFlow',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    ImagePreviewModal
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPreview: false,
      previewImage: '',
      processFlowImg: require('@/assets/img/summaryOverview/fir_has_text.png')
    };
  },
  methods: {
    showImagePreview(imageUrl) {
      this.previewImage = imageUrl;
      this.showPreview = true;
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 4px 0px 0px 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  .process-flow-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .process-flow-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
.img-bigger {
  /deep/.ant-modal-content {
    transform: scale(1.7);
    margin-top: 12%;
  }
}
</style>
