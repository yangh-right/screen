<!--
 * @Description:
 * @Author: JianYue
 * @Date: 2023-12-08 14:13:45
 * @LastEditTime: 2024-09-23 13:30:15
 * @LastEditors: wangyr
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <!-- <div v-if="videoDetailList.length > 0" class="point-btns">
      <a-select
        ref="structureSelect"
        placeholder="请选择"
        @dropdownVisibleChange="openChange"
        @change="selectPoint"
        mode="multiple"
        :maxTagTextLength="5"
        :maxTagCount="1"
        v-model="curPoints"
        class="select__block"
        dropdownClassName="select__list"
      >
        <a-select-option :value="item.videoId" :disabled="curPoints.length >= 6 && !curPoints.includes(item.videoId)" v-for="item in videoDetailList" :key="item.videoId">{{
          item.videoName
        }}</a-select-option>
      </a-select>
    </div> -->
    <div v-show="videoDetailList.length > 0" class="card-inner">
      <div class="monitorCmp">
        <video-cmp :current="current" :videoList="visibleVideos" />
      </div>
    </div>
    <div v-show="!videoDetailList.length" class="card-inner">
      <img src="~@/assets/img/hz/viod.png" alt="" />
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es';
import { mapState, mapMutations } from 'vuex';
import { getVideoList } from '@/api/mainPage.js';
import VideoCmp from './videoPlugin.vue';

export default {
  name: 'DigitalHomework',
  components: {
    VideoCmp
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
    // 实际方法中设置防抖，保证多个图表同时存在，也能对应去触发
    this.Dscroll = debounce(this.handleScroll, 200);
    return {
      current: '',
      videoDetailList: [],
      visibleVideos: [],
      curPoints: [],
      perPage: 8,
      currentPage: 0,
      total: 0,
      hasMore: true // 是否有更多数据
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
        this.videoDetailList = resultData;
        this.total = this.videoDetailList.length;
        this.current = this.videoDetailList[0].videoId;
        this.visibleVideos = this.total > 6 ? this.videoDetailList.slice(0, 6) : this.videoDetailList;

        this.curPoints = this.visibleVideos.map(v => v.videoId);
        // this.loadData();
      } else {
        this.videoDetailList = [];
        this.current = null;
      }
    },
    /* 时间选择下拉弹窗打开或关闭时显示或隐藏视频插件 */
    openChange(e) {
      this.setHideVideo(e);
    },
    selectPoint(item) {
      this.curPoints = item;
      this.visibleVideos = this.videoDetailList.filter(v => this.curPoints.includes(v.videoId));
      console.log('kkk', this.visibleVideos);
    },
    handleScroll(event) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;

      // 当滚动到底部时加载更多数据
      if (scrollHeight - (scrollTop + clientHeight) < 5) {
        this.loadData();
      }
    },
    async loadData() {
      if (!this.hasMore) return;
      try {
        this.currentPage += 1;
        let videoCount = this.currentPage * this.perPage;
        if (videoCount < this.total) {
          this.visibleVideos = [
            ...this.visibleVideos,
            ...this.videoDetailList.slice(this.visibleVideos.length, videoCount)
          ];
          this.hasMore = true;
        } else {
          this.visibleVideos = [...this.visibleVideos, ...this.videoDetailList.slice(this.visibleVideos.length)];
          this.hasMore = false;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  /deep/ .select__block {
    width: 100% !important;
    background: #00295294;
    box-shadow: inset 0 0 14px 3px #47a3ff80;
    border-radius: 2px;
    height: 32px;
    color: #d1e2f2;
    .ant-select-selection {
      background-color: transparent !important;
      border: 1px solid #40a9ff !important;
    }
    .ant-select-selection__choice {
      color: #d8f7ff !important;
      background-color: #013d71;
      border: 1px solid #013d91 !important;
    }
    .ant-select-selection__choice__remove {
      color: #d8f7ff !important;
    }
    .ant-select-selection__placeholder {
      font-size: 16px;
      line-height: 26px;
      color: #d8f7ff !important;
    }
  }
  .point-btns {
    width: 260px;
    padding: 4px 12px 0 22px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: absolute !important;
    right: 12px;
    top: 2px;
    z-index: 1000;
  }
  .card-inner {
    width: 100%;
    height: calc(100% - 47px);
    position: relative;
    padding: 12px 10px;
    box-sizing: border-box;
    .monitorCmp {
      width: 100%;
      height: 98%;
      overflow-y: auto;
    }
    img {
      height: 98%;
      width: 100%;
    }
  }
}
</style>
