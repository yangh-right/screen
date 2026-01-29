<template>
  <unit-card cardTitle="领导关怀" cardType="5">
    <div class="news-display">
      <div class="display-container">
        <div class="news-panel" v-for="(item, index) in newsItems" :key="index">
          <div class="date-bar">
            <div class="date-text">{{ item.date }}</div>
          </div>
          <div class="news-content">
            <div class="image-container">
              <img :src="item.imageUrl" alt="" class="news-image" @click="showImagePreview(item.bigImageUrl)" />
            </div>
            <div class="news-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
      <div class="side-decoration left"></div>
      <div class="side-decoration right"></div>
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal :visible.sync="showPreview" :isBigger="true" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import ImagePreviewModal from '../components/ImagePreviewModal.vue';
import UnitCard from '@/components/UnitCard.vue';
import { getDataFileList } from '@/api/mainPage';
export default {
  name: 'leadersCaring',
  components: {
    UnitCard,
    ImagePreviewModal
  },
  data() {
    return {
      showPreview: false,
      previewImage: '',
      tableData: [],
      newsItems: [
        {
          date: '',
          imageUrl: '',
          bigImageUrl: '',
          title: ''
        },
        {
          date: '',
          imageUrl: '',
          bigImageUrl: '',
          title: ''
        }
      ]
    };
  },
  mounted() {
    this.getPageData();
  },
  methods: {
    getPageData() {
      const params = {
        fileGroup: 'screen'
      };
      getDataFileList(params)
        .then(res => {
          const { status, resultData } = res || {}; // 防止res为undefined
          if (status === 'complete' && resultData) {
            this.tableData = resultData.map(item => {
              const baseUrl =
                process.env.NODE_ENV === 'development' ? process.env.VUE_APP_HOST : window.location.origin; // 使用origin简化URL拼接
              return {
                ...item,
                url: `${baseUrl}${item.url.replace('/api', '/main')}`,
                urlList: item.url.split(',')
              };
            });
            const newArr = this.tableData
              .filter(v => v.code === 'leadershipCare')
              .map(item => ({
                date: item.title,
                imageUrl: item.url,
                bigImageUrl: item.url,
                title: item.memo
              }));
            if (newArr.length > 0) {
              this.newsItems = newArr;
            }
          }
        })
        .catch(error => {
          console.error('获取领导关怀数据失败:', error);
        });
    },
    showImagePreview(imageUrl) {
      this.previewImage = imageUrl;
      this.showPreview = true;
    }
  }
};
</script>

<style lang="less">
.news-display {
  width: 100%;
  height: 100%;
  padding: 8px 0px 0px 0px;
  box-sizing: border-box;
  position: relative;

  .display-container {
    height: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    position: relative;
    z-index: 2;
    margin: 0 auto;
  }

  .news-panel {
    width: 316px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: url('~@/assets/img/summaryOverview/fir_leadership.png') no-repeat;
    background-size: 100% 100%;
    padding-top: 10px;
  }

  .date-bar {
    padding-left: 40px;
    position: relative;
    height: 30px;

    .date-text {
      font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #6b9bda;
      letter-spacing: 0;
    }
  }

  .news-content {
    position: relative;
    margin-top: 10px;
  }

  .image-container {
    width: 284px;
    height: 116px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
    margin-top: 6px;
    cursor: pointer;

    .news-image {
      width: 100%;
      height: 100%;
    }
  }

  .news-title {
    padding: 0 15px;
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #f9fbff;
    letter-spacing: 0;
    margin-top: 2px;
  }

  .side-decoration {
    position: absolute;
    width: 64px;
    height: 144px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    &.left {
      left: 0;
      background: url('~@/assets/img/summaryOverview/fir_arrow_left.png') no-repeat;
    }

    &.right {
      right: 0;
      background: url('~@/assets/img/summaryOverview/fir_arrow_right.png') no-repeat;
    }
  }
}
</style>
