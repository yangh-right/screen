<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-03-21 15:46:22
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 09:47:03
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="project-digital">
      <div class="digital-container">
        <!-- digital Images -->
        <div class="digital-images">
          <div v-for="(milestone, index) in milestones" :key="`img-${index}`" class="digital-main">
            <div class="image-item">
              <div class="image-frame">
                <img
                  :src="milestone.imageUrl"
                  :alt="milestone.title"
                  class="milestone-image"
                  @click="showImagePreview(milestone.bigImageUrl)"
                />
              </div>
            </div>
            <div class="milestone-item">
              <div class="milestone-title" :class="{ active: milestone.active }">
                <span class="milestone-ico"></span> {{ milestone.title }}
                <span class="milestone-ico"></span>
              </div>
              <!-- <div class="milestone-date">{{ milestone.date }}</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal :visible.sync="showPreview" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import ImagePreviewModal from '@/views/summaryOverview/components/ImagePreviewModal.vue';

export default {
  name: 'DigitalResults',
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    ImagePreviewModal
  },
  data() {
    return {
      showPreview: false,
      previewImage: '',
      milestones: [
        {
          title: '优质工程奖',
          date: '2024年12月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img9.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img9.png'),
          active: false
        },
        {
          title: '标准化污水处理厂',
          date: '2019年01月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img5.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img5.png'),
          active: false
        },
        {
          title: '荣誉证书',
          date: '2024年12月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img10.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img10.png'),
          active: false
        },
        {
          title: '文明单位',
          date: '2024年02月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img7.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img7.png'),
          active: true
        },
        {
          title: '先进党支部',
          date: '2022年02月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img6.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img6.png'),
          active: false
        },
        {
          title: '智慧工地优秀应用',
          date: '2024年12月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img8.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img8.png'),
          active: false
        }
      ]
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
.project-digital {
  width: 100%;
  padding: 20px 10px 40px;
  box-sizing: border-box;
  position: relative;

  .digital-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .digital-images {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    flex-wrap: wrap;
    .digital-main {
      width: 33%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .image-item {
      height: 98px;
      background: url('~@/assets/img/summaryOverview/fir_timeline__image.png') no-repeat;
      background-size: 100% 100%;

      .image-frame {
        height: 100%;
        padding: 7px 9px;
        position: relative;
        cursor: pointer;

        .milestone-image {
          width: 100%;
          height: 80px;
          object-fit: cover;
          display: block;
        }
      }
    }
  }

  .milestone-item {
    flex: 0 0 46px;
    text-align: center;
    display: flex;

    .milestone-title {
      font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #e6e5f7;
      letter-spacing: 0;
      text-align: center;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      .milestone-ico {
        width: 12px;
        height: 12px;
        background: url('~@/assets/img/summaryOverview/fir_tip_point.png') no-repeat;
        background-size: 100% 100%;
        margin: 0 6px;
      }
    }

    .milestone-date {
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #cecbfb;
      letter-spacing: 0;
    }
  }
}
</style>
