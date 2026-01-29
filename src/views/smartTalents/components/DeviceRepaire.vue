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
      <div class="des">
        {{ memo }}
      </div>
      <img class="img" :src="img2Url" @click="showImagePreview(img2Url)" alt="" />
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal :visible.sync="showPreview" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import { getDataFileList } from '@/api/mainPage';
import ImagePreviewModal from '@/views/summaryOverview/components/ImagePreviewModal.vue';
export default {
  name: 'DeviceRepaire',
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
      memo: '在党和团组织的坚强带领下，永康污水厂的青年团员们积极响应集团公司的号召，实际行动践行社会责任，传递正能量。其中一名青年员工获得了市城投集团志愿服务先进工作者。',
      img2Url: '',
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
      const careInfo = this.tableData.find(v => v.code === 'volunteerService');
      if (careInfo) {
        this.memo = careInfo.memo || this.memo;
        this.img2Url = careInfo.url || this.img2Url;
      }
    },
    transformDataItem(item) {
      return {
        ...item,
        url: this.generateFullUrl(item.url),
        urlList: item.url.split(',')
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
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .des {
    margin: 12px;
    font-family: AlibabaPuHuiTi-Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #bfd5ff;
    letter-spacing: 0.2px;
    text-indent: 28px;
    line-height: 22px;
  }
  .img {
    width: 100%;
    height: 206px;
    object-fit: cover;
    border-radius: 3.33px;
  }
}
</style>
