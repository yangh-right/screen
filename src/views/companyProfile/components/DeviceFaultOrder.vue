<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-11 15:18:41
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="img">
        <img :src="img2Url" @click="showImagePreview(img2Url)" alt="" />
      </div>
      <div class="des">
        永康污水厂将持续深化团队建设，在党建引领下，不断提升员工专业素养，强化团队协作，以更饱满的热情和更专业的技术，为永康的碧水蓝天贡献力量，在城市污水处理的征程中续写辉煌篇章。
      </div>
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal :visible.sync="showPreview" :imageUrl="previewImage" />
  </unit-card>
</template>

<script>
import { deviceOperation } from '@/api/deviceManager.js';
import ImagePreviewModal from '@/views/summaryOverview/components/ImagePreviewModal.vue';
import moment from 'moment';

export default {
  name: 'DeviceFaultOrder',
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
      img2Url: require('@/assets/img/smartTalents/team_building.png'),
      config: {
        header: ['设备名称', '持续时长', '持续时长'],
        data: [],
        columnWidth: [70, 120, 100, 150],
        rowNum: 6,
        headerHeight: 30,
        index: true,
        indexHeader: '排行',
        align: ['center', 'center', 'center', 'left']
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    showImagePreview(imageUrl) {
      this.previewImage = imageUrl;
      this.showPreview = true;
    },
    async initData() {
      let data = {
        queryType: 'month',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        waterPlantId: this.waterPlantId
      };
      const { status, resultData } = await deviceOperation(data);
      if (status === 'complete') {
        resultData?.forEach(item => {
          let radio = item.radio || 0;
          this.config.data.push([
            item.deviceName,
            `${item.duration}h`,
            `<div class="process-box">
              <div class="process-bg">
                <div class="process-pre"></div>
              </div>
              <div class="process-num">${radio}%</div>
            </div>`
          ]);
        });
        this.$refs['scrollBoard'].updateRows(this.config.data);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 18px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .des {
    font-family: AlibabaPuHuiTi-Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #bfd5ff;
    text-indent: 28px;
    letter-spacing: 0.2px;
    line-height: 22px;
  }
  .img {
    margin: 12px;
    width: 452px;
    height: 206px;
    box-shadow: inset 0 0 55px 11px #00172d;
    border-radius: 3.33px;
    /* background: url('~@/assets/img/smartTalents/team_building.png') no-repeat center;
    background-size: 100% 100%; */
    img {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
