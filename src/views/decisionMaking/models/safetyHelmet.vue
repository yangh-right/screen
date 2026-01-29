<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-03-12 11:40:39
 * @Description:
-->
<template>
  <unit-card cardTitle="安全帽" cardType="6">
    <c-select v-model="currentVideoId" slot="headerRight" @change="handleVideoChange" class="select-wrapper">
      <a-select-option v-for="item in videoDetailList" :key="item.videoName" :value="item.videoId">{{
        item.videoName
      }}</a-select-option>
    </c-select>
    <div class="content-wrapper">
      <div v-for="item in visibleVideos" :key="item.videoName" @click="handleVideoChange(item.videoId)" class="section">
        <div class="person-info">
          <div class="person-label">姓名: {{ item.name }}</div>
          <div class="person-label">工号:{{ item.code }}</div>
          <div class="person-label">联系方式: {{ item.phone }}</div>
        </div>
        <div class="section-content"></div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { mapMutations } from 'vuex';
import { getVideoList } from '@/api/mainPage.js';
import cSelect from '@/components/antDesign/cSelect.vue';
export default {
  name: 'safetyHelmet',
  components: {
    cSelect,
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
      currentVideoId: '',
      videoDetailList: [],
      visibleVideos: [
        {
          videoName: '1#',
          videoId: '',
          name: '陈聪',
          code: '001135',
          phone: '18505729876'
        },
        {
          videoName: '2#',
          videoId: '',
          name: '马昕立',
          code: '001369',
          phone: '13305717890'
        },
        {
          videoName: '3#',
          videoId: '',
          name: '朱君勇',
          code: '001270',
          phone: '15006133210'
        }
      ]
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.getPumpList(val);
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('video', ['setHideVideo', 'setWndNum']),
    async getPumpList(id) {
      const { status, resultData } = await getVideoList(id);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        this.videoDetailList = resultData.filter(result => !result.videoName.includes('垃圾'));
        this.total = this.videoDetailList.length;
        this.currentVideoId = this.videoDetailList[0].videoId;
        this.visibleVideos = [
          {
            videoName: '1#',
            videoId: 'f6243706258842c6affc1b983c055909',
            name: '陈聪',
            code: '001135',
            phone: '18505729876'
          },
          {
            videoName: '2#',
            videoId: 'ea2f4c0b84164201b81877226dafcb71',
            name: '马昕立',
            code: '001369',
            phone: '13305717890'
          },
          {
            videoName: '3#',
            videoId: '3f6dbe4f3ab84c8bb2bb2f14fab1a5d8',
            name: '朱君勇',
            code: '001270',
            phone: '15006133210'
          }
        ];
      } else {
        this.videoDetailList = [];
        this.visibleVideos = [
          {
            videoName: '1#',
            videoId: 'f6243706258842c6affc1b983c055909',
            name: '陈聪',
            code: '001135',
            phone: '18505729876'
          },
          {
            videoName: '2#',
            videoId: 'ea2f4c0b84164201b81877226dafcb71',
            name: '马昕立',
            code: '001369',
            phone: '13305717890'
          },
          {
            videoName: '3#',
            videoId: '3f6dbe4f3ab84c8bb2bb2f14fab1a5d8',
            name: '朱君勇',
            code: '001270',
            phone: '15006133210'
          }
        ];
        this.currentVideoId = '';
      }
    },
    handleVideoChange(videoId) {
      this.currentVideoId = videoId;
      this.videoList = this.videoDetailList.filter(item => item.videoId === videoId);
      this.$emit('update:videoList', this.videoList);
    }
  }
};
</script>

<style lang="less" scoped>
.content-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0px 0 0px;
  box-sizing: border-box;
  position: relative;

  .select-wrapper {
    width: 190px;
    height: 32px;
    margin-top: 28px;
  }
  .section {
    width: 442px;
    height: 276px;
    background: url('~@/assets/img/summaryOverview/fir_backup_2.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    padding: 14px;
    box-sizing: border-box;
    .section-header {
      font-family: Aliba, sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: #e6f8ff;
      letter-spacing: 0;
      margin: 4px 0;
      position: relative;
      padding-left: 12px;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        background: url('~@/assets/img/summaryOverview/fir_circle_2.png') no-repeat center center;
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .section-content {
      width: 100%;
      height: 100%;
      box-shadow: inset 0 0 20px 2px #124c9f;
      background: url('~@/assets/img/summaryOverview/fir_safe.png') no-repeat center center;
      background-size: 100% 100%;
      cursor: pointer;
    }
    .person-info {
      position: absolute;
      left: 20px;
      top: 20px;
      background: rgba(0, 14, 36, 0.5);
      padding: 8px 12px;
      border-radius: 4px;
      min-width: 180px;
      box-shadow: 0 0 4px rgba(0, 67, 185, 0.4);
      .person-label {
        font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
        font-size: 14px;
        color: #e6f8ff;
        line-height: 24px;
        white-space: nowrap;
        text-shadow: 0 0 5px rgba(52, 221, 255, 0.5);
        &:first-child {
          margin-top: 0;
        }
        &:before {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          background-color: #34ddff;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
