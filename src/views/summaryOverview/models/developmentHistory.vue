<template>
  <unit-card cardTitle="发展历程" cardType="6">
    <div class="project-timeline">
      <div class="timeline-container">
        <!-- Timeline Images -->
        <div class="timeline-images">
          <div class="image-item" v-for="(milestone, index) in milestones" :key="`img-${index}`">
            <div class="image-frame">
              <img
                :src="milestone.imageUrl"
                :alt="milestone.title"
                class="milestone-image"
                @click="showImagePreview(milestone.bigImageUrl)"
              />
            </div>
          </div>
        </div>

        <!-- Timeline Line -->
        <div class="timeline-line">
          <div
            v-for="(milestone, index) in milestones"
            :key="`node-${index}`"
            class="timeline-node"
            :class="{ active: milestone.active }"
          ></div>
        </div>

        <!-- Timeline Milestones -->
        <div class="timeline-milestones">
          <div class="milestone-item" v-for="(milestone, index) in milestones" :key="`milestone-${index}`">
            <div class="milestone-title" :class="{ active: milestone.active }">
              <span class="milestone-ico"></span> {{ milestone.title }}
              <span class="milestone-ico"></span>
            </div>
            <div class="milestone-date">{{ milestone.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览弹框 -->
    <image-preview-modal :visible.sync="showPreview" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import ImagePreviewModal from '../components/ImagePreviewModal.vue';

export default {
  name: 'developmentHistory',
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
          title: '标准化污水处理厂',
          date: '2019年01月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img5.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img5.png'),
          active: false
        },
        {
          title: '先进党支部',
          date: '2022年02月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img6.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img6.png'),
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
          title: '智慧工地优秀应用',
          date: '2024年12月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img8.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img8.png'),
          active: false
        },
        {
          title: '优质工程奖',
          date: '2024年12月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img9.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img9.png'),
          active: false
        },
        {
          title: '荣誉证书',
          date: '2024年12月',
          imageUrl: require('@/assets/img/summaryOverview/fir_img10.png'),
          bigImageUrl: require('@/assets/img/summaryOverview/fir_img10.png'),
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

<style lang="less">
.project-timeline {
  width: 100%;
  background: url('~@/assets/img/summaryOverview/fir_timeline_background.png') no-repeat;
  background-size: 100% 100%;
  padding: 20px 10px 40px;
  box-sizing: border-box;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #4a9eff, transparent);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #4a9eff, transparent);
  }

  .timeline-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .timeline-images {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    .image-item {
      flex: 0 0 146px;
      height: 102px;
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

  .timeline-line {
    position: relative;
    height: 30px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    background: url('~@/assets/img/summaryOverview/fir_time.png') no-repeat;
    background-size: 100% 100%;
    align-items: center;
    padding: 0 63px;

    .timeline-node {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: url('~@/assets/img/summaryOverview/fir_unclicked_points.png') no-repeat;
      background-size: 100% 100%;
      z-index: 2;
      position: relative;

      &.active {
        width: 26px;
        height: 26px;
        background: url('~@/assets/img/summaryOverview/fir_timeline__click.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .timeline-milestones {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .milestone-item {
      flex: 0 0 176px;
      text-align: center;

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
}
</style>
