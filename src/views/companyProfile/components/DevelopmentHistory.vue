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
    <div class="card-inner">
      <div class="img-box">
        <img v-for="(img, idx) in imageUrls" :key="idx" class="img" :src="img" @click="showImagePreview(img)" alt="" />
      </div>
      <div class="des">
        {{ memo }}
      </div>
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal :visible.sync="showPreview" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import { getDataFileList } from '@/api/mainPage';
import ImagePreviewModal from '@/views/summaryOverview/components/ImagePreviewModal.vue';
export default {
  name: 'DevelopmentHistory',
  components: {
    ImagePreviewModal,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
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
  data() {
    return {
      showPreview: false,
      previewImage: '',
      memo: '',
      imageUrls: [],
      tableData: [],
      pointsArr: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    showImagePreview(imageUrl) {
      this.previewImage = imageUrl;
      this.showPreview = true;
    },
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
      const careInfo = this.tableData.find(v => v.code === 'developmentHistory');
      if (careInfo) {
        this.memo = careInfo.memo || this.memo;
        const list = Array.isArray(careInfo.urlList) ? careInfo.urlList : [];
        this.imageUrls = (list.length ? list : careInfo.url ? [careInfo.url] : []).map(p => this.generateFullUrl(p));
      }
    },
    transformDataItem(item) {
      return {
        ...item,
        url: this.generateFullUrl(item.url),
        urlList: (item.url || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      };
    },
    generateFullUrl(path) {
      const baseUrl =
        process.env.NODE_ENV === 'development'
          ? process.env.VUE_APP_HOST
          : `${window.location.protocol}//${window.location.host}`;
      return `${baseUrl}${path.replace('/api', '/main')}`;
    }
  },
  mounted() {
    this.getPageData();
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 0 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .des {
    margin: 6px 0;
    font-family: AlibabaPuHuiTi-Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #bfd5ff;
    letter-spacing: 0.2px;
    text-indent: 28px;
    line-height: 22px;
  }
  .img-box {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 6px; /* 添加间距 */
  }
  .img {
    width: 0; /* 重置宽度，让flex:1生效 */
    height: 166px;
    object-fit: cover;
    border-radius: 3.33px;
    flex: 1; /* 均等分空间 */
  }
}
</style>
