<template>
  <div class="module-wrap4">
    <div class="content-top">
      {{ memo }}
    </div>
    <div class="content-bottom">
      <img
        v-for="(item, index) in urlList"
        :key="index"
        :src="item"
        :class="{ 'img-active': currentPreviewIndex === index }"
        alt=""
        @click="$emit('preview', item)"
        :style="getImgStyle"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TalentAward',
  props: {
    memo: {
      type: String,
      required: true
    },
    urlList: {
      type: Array,
      required: true
    },
    currentPreviewIndex: {
      type: Number,
      required: true
    }
  },
  computed: {
    getImgStyle() {
      const count = this.urlList.length;
      if (count <= 5) {
        return {
          width: `calc((100% - ${(count - 1) * 12}px) / ${count})`,
          minWidth: '120px'
        };
      } else {
        return {
          width: '204px',
          minWidth: '120px'
        };
      }
    }
  }
};
</script>

<style scoped>
.module-wrap4 .content-top {
  margin-top: 32px;
  padding: 26px 16px;
  width: 762px;
  height: 181px;
  text-indent: 32px;
  background: url('~@/assets/img/smartTalents/center_bg.png') no-repeat;
  background-size: 100% 100%;
  font-family: AlibabaPuHuiTi-Regular, sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0.2px;
  line-height: 28px;
}
.module-wrap4 .content-bottom {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-top: 32px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #3a7bd5 #1a2233;
}
.module-wrap4 img {
  height: 164px;
  object-fit: cover;
  margin-right: 6px;
}
.module-wrap5 .content-bottom img:last-child {
  margin-right: 0;
}
.img-active {
  transform: scale(1.1);
}
.module-wrap5 .content-bottom::-webkit-scrollbar {
  height: 8px;
}
.module-wrap5 .content-bottom::-webkit-scrollbar-thumb {
  background: #3a7bd5;
  border-radius: 4px;
}
.module-wrap5 .content-bottom::-webkit-scrollbar-track {
  background: #1a2233;
}
</style>
