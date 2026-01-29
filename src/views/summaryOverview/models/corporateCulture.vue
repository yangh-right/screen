<template>
  <unit-card cardTitle="企业文化" cardType="5">
    <div class="values-display">
      <div class="display-container">
        <div class="image-panel left-panel">
          <img :src="img1Url" @click="showImagePreview(img1Url)" alt="Office interior" class="panel-image" />
        </div>
        <div class="image-panel middle-panel">
          <img :src="img2Url" @click="showImagePreview(img2Url)" alt="Group with banner" class="panel-image" />
        </div>
        <div class="values-panel">
          <div class="values-title">
            <h2>发展理念</h2>
          </div>
          <div class="values-list">
            <div class="value-item">
              <!-- <div class="value-label" :class="item.labelClass">{{ item.label }}</div> -->
              <div class="value-content">{{ content }}</div>
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
import { getDataFileList } from '@/api/mainPage';
import ImagePreviewModal from '../components/ImagePreviewModal.vue';
export default {
  name: 'FiveColoredValues',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    ImagePreviewModal
  },
  data() {
    return {
      showPreview: false,
      previewImage: '',
      img1Url: '',
      img2Url: '',
      content: '永康钱江水务愿与您携手同行，以水为媒，共同绘就成水美好生活新画卷，让每一滴水都承载希望，流淌幸福',
      valueItems: [
        {
          label: '吾心即五心',
          content: '即"初心、核心、民心、信心、决心"',
          labelClass: 'blue-label'
        },
        {
          label: '党旗·红',
          content: '旗帜鲜明印初心，引擎带动"燃"起来',
          labelClass: 'regular-label'
        },
        {
          label: '先锋·金',
          content: '攻坚克难强核心，典型示范"亮"起来',
          labelClass: 'gold-label'
        },
        {
          label: '暖心·橙',
          content: '延伸服务暖民心，国企担当"树"起来',
          labelClass: 'orange-label'
        },
        {
          label: '活力·绿',
          content: '党团青年提信心，发展梯队"强"起来',
          labelClass: 'green-label'
        },
        {
          label: '警示·黄',
          content: '合规管理立决心，风险防线"筑"起来',
          labelClass: 'yellow-label'
        }
      ]
    };
  },
  mounted() {
    this.getPageData();
  },
  methods: {
    async getPageData() {
      try {
        const { status, resultData } = await getDataFileList({ fileGroup: 'screen' });
        if (status === 'complete') {
          this.processResultData(resultData);
        }
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    },
    processResultData(data) {
      this.tableData = data.map(this.transformDataItem);
      const careInfo = this.tableData.find(v => v.code === 'corporateCulture');
      if (careInfo && careInfo.urlList.length > 0) {
        this.memo = careInfo.memo || this.memo;
        this.img1Url = careInfo.urlList[0] || this.img1Url;
        this.img2Url = careInfo.urlList[1] || this.img2Url;
      }
    },
    transformDataItem(item) {
      return {
        ...item,
        url: this.generateFullUrl(item.url),
        urlList: item.url ? item.url.split(',').map(v => this.generateFullUrl(v)) : []
      };
    },
    generateFullUrl(path) {
      const baseUrl = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_HOST : window.location.origin;
      return `${baseUrl}${path.replace('/api', '/main')}`;
    },
    showImagePreview(imageUrl) {
      this.previewImage = imageUrl;
      this.showPreview = true;
    }
  }
};
</script>

<style lang="less">
.values-display {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 8px 0;
  box-sizing: border-box;

  .display-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
  }

  .image-panel {
    width: 200px;
    height: 100%;
    position: relative;
    padding: 10px;
    background: url('~@/assets/img/summaryOverview/fir_image_box_3.png') no-repeat;
    background-size: 100% 100%;
    margin-right: 12px;
    cursor: pointer;
    .panel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .values-panel {
    flex: 1;
    padding: 0 10px;
    position: relative;
    background: url('~@/assets/img/summaryOverview/fir_wucai_yaowu_heart.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;

    &:before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 20px;
      height: 20px;
      border-top: 2px solid #4a9eff;
      border-right: 2px solid #4a9eff;
    }

    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: -2px;
      width: 20px;
      height: 20px;
      border-bottom: 2px solid #4a9eff;
      border-left: 2px solid #4a9eff;
    }
  }

  .values-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    position: relative;

    h2 {
      font-family: Aliba, sans-serif;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 1px;
      text-align: center;
      background: linear-gradient(180deg, #f3f9ff 50%, #4794ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .values-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .value-item {
    display: flex;
    align-items: center;
    height: 22px;
    flex: 1;
  }

  .value-label {
    width: 90px;
    height: 100%;
    font-family: Aliba, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #fff4f1;
    letter-spacing: 0;
    text-align: center;
    margin-right: 10px;
  }

  .value-content {
    flex: 1;
    height: 100%;
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: #e8f0ff;
    letter-spacing: 0;
    line-height: 30px;
    display: flex;
    align-items: center;
  }

  .blue-label {
    background: url('~@/assets/img/summaryOverview/fir_blue.png') no-repeat;
    background-size: 100% 100%;
  }

  .regular-label {
    background: url('~@/assets/img/summaryOverview/fir_red.png') no-repeat;
    background-size: 100% 100%;
  }

  .gold-label {
    background: url('~@/assets/img/summaryOverview/fir_metal.png') no-repeat;
    background-size: 100% 100%;
  }

  .orange-label {
    background: url('~@/assets/img/summaryOverview/fir_orange.png') no-repeat;
    background-size: 100% 100%;
  }

  .green-label {
    background: url('~@/assets/img/summaryOverview/fir_green.png') no-repeat;
    background-size: 100% 100%;
  }

  .yellow-label {
    background: url('~@/assets/img/summaryOverview/fir_yellow.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
