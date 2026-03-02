<template>
  <unit-card cardTitle="企业文化" cardType="5">
    <div class="culture-container">
      <!-- 左侧：发展理念 -->
      <div class="concept-section">
        <div class="section-title">
          <img src="@/assets/lightimg/int/development.png" alt="" class="title-bg" />
          <div class="title-content">
            <!-- <span class="diamond"></span> -->
            <span class="text">发展理念</span>
            <!-- <span class="diamond"></span> -->
          </div>
        </div>
        <div class="concept-body">
          <div class="image-frame">
            <img :src="img1Url || require('@/assets/img/summaryOverview/fir_img5.png')"
              @click="showImagePreview(img1Url || require('@/assets/img/summaryOverview/fir_img5.png'))" alt="" />
          </div>
          <div class="text-frame">
            <div class="concept-text">{{ content }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧：领导关怀 -->
      <div class="caring-section">
        <div class="nav-arrow left" @click="prevNews">
          <img src="@/assets/lightimg/int/arrow_left.png" alt="prev" />
        </div>

        <div class="news-card">
          <div class="news-header">
            <div class="date-box">
              <span class="date-text">{{ currentNews.date || '2025年7月24日' }}</span>
            </div>
          </div>
          <div class="news-content-box">
            <div class="news-inner-frame">
              <img :src="currentNews.imageUrl" @click="showImagePreview(currentNews.imageUrl)" alt="" />
            </div>
          </div>
          <div class="news-footer">
            {{ currentNews.title || '欢迎领导莅临参观永康污水厂' }}
          </div>
        </div>

        <div class="nav-arrow right" @click="nextNews">
          <img src="@/assets/lightimg/int/arrow_right.png" alt="next" />
        </div>
      </div>
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal :visible.sync="showPreview" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import { getDataFileList } from '@/api/mainPage';
import ImagePreviewModal from '../components/ImagePreviewModal.vue';

export default {
  name: 'CorporateCulture',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    ImagePreviewModal
  },
  data() {
    return {
      showPreview: false,
      previewImage: '',
      img1Url: '',
      content: '永康钱江水务愿与您携手同行，以水为媒，共同绘就成水美好生活新画卷，让每一滴水都承载希望，流淌幸福',
      newsItems: [],
      currentIndex: 0
    };
  },
  computed: {
    currentNews() {
      return this.newsItems[this.currentIndex] || {};
    }
  },
  mounted() {
    this.getPageData();
  },
  methods: {
    async getPageData() {
      try {
        const { status, resultData } = await getDataFileList({ fileGroup: 'screen' });
        if (status === 'complete') {
          const list = resultData || [];
          // 发展理念图 (假设 code 为 corporateCulture)
          const cultureInfo = list.find(v => v.code === 'corporateCulture');
          if (cultureInfo && cultureInfo.url) {
            const urls = cultureInfo.url.split(',').map(v => this.generateFullUrl(v));
            this.img1Url = urls[0];
          }

          // 领导关怀列表 (假设 code 为 leadershipCare)
          this.newsItems = list
            .filter(v => v.code === 'leadershipCare')
            .map(item => ({
              date: item.title,
              imageUrl: this.generateFullUrl(item.url),
              title: item.memo
            }));

          if (this.newsItems.length === 0) {
            // Mock data if empty
            this.newsItems = [{
              date: '2025年7月24日',
              imageUrl: require('@/assets/img/summaryOverview/fir_img6.png'),
              title: '欢迎领导莅临参观永康污水厂'
            }];
          }
        }
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    },
    generateFullUrl(path) {
      if (!path) return '';
      const baseUrl = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_HOST : window.location.origin;
      return `${baseUrl}${path.replace('/api', '/main')}`;
    },
    showImagePreview(imageUrl) {
      if (!imageUrl) return;
      this.previewImage = imageUrl;
      this.showPreview = true;
    },
    prevNews() {
      if (this.newsItems.length <= 1) return;
      this.currentIndex = (this.currentIndex - 1 + this.newsItems.length) % this.newsItems.length;
    },
    nextNews() {
      if (this.newsItems.length <= 1) return;
      this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
    }
  }
};
</script>

<style lang="less" scoped>
.culture-container {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 10px 20px;
  box-sizing: border-box;
}

.concept-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  .section-title {
    height: 40px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;

    .title-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .title-content {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 1;

      .text {
        width: 76px;
        height: 18px;
        font-family: PangMenZhengDao-3;
        font-weight: 3;
        font-size: 18px;
        color: #FFF4F1;
        letter-spacing: 1px;
        text-align: center;
        text-shadow: 0 2px 4px #00000080;
        margin-bottom: 10px;
      }

      .line {
        width: 40px;
        height: 1px;
        background: linear-gradient(90deg, transparent, #ffffff, transparent);
      }

      // .diamond {
      //   width: 6px;
      //   height: 6px;
      //   background: #f09537;
      //   transform: rotate(45deg);
      // }
    }
  }

  .concept-body {
    flex: 1;
    display: flex;
    gap: 15px;
    align-items: stretch;

    .image-frame {
      width: 200px;
      height: 200px;
      background: url('~@/assets/lightimg/int/video.png') no-repeat;
      background-size: 100% 100%;
      padding: 8px;
      box-sizing: border-box;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
      }
    }

    .text-frame {
      width: 170px;
      height: 190px;
      background: url('~@/assets/lightimg/int/text_intro.png') no-repeat;
      background-size: 100% 100%;
      padding: 12px;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      .concept-text {
        width: 146px;
        height: 168px;
        font-family: AlibabaPuHuiTi_2_55_Regular;
        font-weight: 400;
        font-size: 16px;
        color: #FFF4F1;
        letter-spacing: 0;
        line-height: 28px;
      }
    }
  }
}

.caring-section {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  gap: 10px;

  .nav-arrow.left {
    margin-left: 20px;
  }

  .nav-arrow {
    cursor: pointer;
    transition: transform 0.2s;
    z-index: 5;

    &:hover {
      transform: scale(1.1);
    }

    img {
      width: 100%;
    }
  }

  .news-card {
    width: 290px;
    height: 250px;
    background: url('~@/assets/lightimg/int/leadership_care.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .news-header {
      height: 40px;
      display: flex;
      align-items: center;

      .date-box {
        display: flex;
        align-items: center;
        gap: 10px;

        .news-icon {
          width: 24px;
        }

        .date-text {
          width: 128px;
          height: 25px;
          font-family: AlibabaPuHuiTi_2_85_Bold;
          font-weight: 700;
          font-size: 18px;
          color: #6B9BDA;
          letter-spacing: 0;
          margin-left: 35px;
        }
      }
    }

    .news-content-box {
      flex: 1;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .news-inner-frame {
        width: 90%;
        height: 100%;
        padding: 5px;
        box-sizing: border-box;
        border: 1px solid rgba(0, 168, 255, 0.3);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
        }
      }
    }

    .news-footer {
      height: 40px;
      display: flex;
      align-items: center;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-size: 14px;
      color: #fff;
      margin-left: 10px;
    }
  }
}
</style>
