<template>
  <unit-card cardTitle="工艺仿真" cardType="4">
    <div class="box-wapper">
      <iframe class="svg" v-if="svgPreviewUrl" :src="svgPreviewUrl" title=""></iframe>
    </div>
  </unit-card>
</template>

<script>
import storage from '@/common/js/tool/storage';

import { getSvgListByCondition } from '@/api/mainPage';
export default {
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
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
          if (item.type === 'predication') {
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
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/smartProduct/svg-bg.png') no-repeat;
  background-size: 100% 100%;
  .svg {
    width: 100%;
    height: 100%;
  }
}
</style>
