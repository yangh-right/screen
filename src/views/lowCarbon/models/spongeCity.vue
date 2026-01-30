<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-08 18:06:12
 * @Description:
-->
<template>
  <unit-card cardTitle="绿色低碳">
    <div class="card-inner">
      <!-- 使用过渡组件包裹 img 标签 -->
      <div class="img-list">
        <a-carousel effect="fade" :dots="false" autoplay>
          <div @click="showImagePreview(i)" v-for="(item, i) in imgsList" :key="item.id" class="img-box">
            <img class="img-item" :src="item.url" :key="item.id" alt="" />
          </div>
        </a-carousel>
      </div>
      <div class="text">
        永康城市污水厂以数字化技术驱动低碳转型，采用精确曝气、精确加药和智慧平台等实现污水处理全流程实时监测、动态调控与精准运维，从生产运营端切实实现节能降耗、减碳增效，推动污水处理工艺向绿色高效升级，也为区域水务行业低碳发展提供了可复制、可推广的实践范例。
      </div>
    </div>
    <image-preview-modal :visible.sync="showPreview" :imageUrl="currentImgUrl" />
  </unit-card>
</template>

<script>
import ImagePreviewModal from '@/views/summaryOverview/components/ImagePreviewModal.vue';
export default {
  name: 'spongeCity',
  components: {
    ImagePreviewModal,
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
      imgsList: [
        {
          id: 1,
          url: require('@/assets/img/smartProduct/spongeCity.jpg')
        }
      ],
      showPreview: false,
      currentImgIndex: 0,
      imageInterval: null
    };
  },
  computed: {
    currentImgUrl() {
      return this.imgsList[this.currentImgIndex].url;
    }
  },

  methods: {
    showImagePreview(i) {
      this.currentImgIndex = i;
      this.showPreview = true;
    },
    async initData() {}
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 20px 0;
  display: flex;
  align-items: center;
  /* For demo */
  .img-list {
    height: 100%;
    width: calc(50% - 8px);
    margin-right: 16px;
  }
  /deep/.ant-carousel {
    height: 100%;
    width: 100%;
  }
  /deep/.slick-slider {
    height: 100%;
    width: 100%;
  }

  /deep/.slick-list,
  /deep/.slick-slide,
  /deep/.slick-track div {
    height: 100%;
    width: 100%;
  }
  /deep/.slick-track {
    height: 100%;
  }
  .img-box {
    cursor: pointer;
    height: 100%;
    width: 100%;
    object-fit: cover;
    margin-right: 15px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      box-shadow: inset 0 0 20px 2px #0e457a;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .img-item {
      width: 100%;
      height: 100%;
    }
  }

  .text {
    height: 100%;
    width: calc(50% - 8px);
    overflow: auto;
    padding: 25px 22px 0;
    background-image: linear-gradient(180deg, #003874b3 0%, #00244a33 53%, #00244ab3 100%);
    box-shadow: inset 0 0 20px 0 #007dff4d;
    border-radius: 4px;
    font-family: AlibabaPuHuiTi-Regular, sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: #bfd5ff;
    letter-spacing: 2px;
    line-height: 26px;
  }
}
</style>
