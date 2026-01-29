<template>
  <div class="box-wapper">
    <div class="title"></div>
    <iframe class="svg" v-if="svgPreviewUrl" :src="svgPreviewUrl" title=""></iframe>
  </div>
</template>

<script>
import storage from '@/common/js/tool/storage';

import { getSvgListByCondition } from '@/api/mainPage';
export default {
  components: {},
  name: 'configuration',
  data() {
    return {
      svgPreviewUrl: undefined
    };
  },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
      let { resultData, status } = await getSvgListByCondition({ currentPage: 1, pageSize: 99 });
      if (status === 'complete') {
        let user = JSON.parse(storage.get('user_info'));
        let token = user.accessToken.replace('Bearer ', '');
        resultData.forEach(item => {
          // 智能加药页面显示 carbon_source_dosing 类型组态图
          if (item.type === 'carbon_source_dosing') {
            const isLocal = window.location.hostname === 'localhost';
            if (isLocal) {
              this.svgPreviewUrl = 'https://zhjs.ykqjsw.com/' + item.previewUrl + `&token=${token}&parent=${window.origin}`;
            } else {
              this.svgPreviewUrl = item.previewUrl + `&token=${token}&parent=${window.origin}`;
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.box-wapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/smartProduct/svg-bg.png') no-repeat;
  background-size: 100% 100%;

  .title {
    position: absolute;
    top: 36px;
    left: 0;
    width: 279px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('~@/assets/img/hz/smart_medication_title.png') no-repeat;
    background-size: 100% 100%;
  }

  .svg {
    width: 100%;
    height: 100%;
  }
}
</style>
