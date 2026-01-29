<template>
  <div class="box-wrapper">
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
          if (item.type === 'screen_sludge_discharge') {
            this.svgPreviewUrl = item.previewUrl + `&token=${token}&parent=${window.origin}`;
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.box-wrapper {
  position: relative;
  padding: 0 24px;
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/sludgeDischarge/svg-bg.png') no-repeat;
  background-size: 100% 100%;
  .title {
    position: absolute;
    top: 36px;
    left: 0;
    width: 327px;
    height: 57px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('~@/assets/img/hz/sludge_discharge_title.png') no-repeat;
    background-size: 100% 100%;
  }
  .zutai {
    height: 413px;
    width: 100%;
  }
  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #f8fbff;
    letter-spacing: 0;
    text-align: center;
  }
  .label1 {
    width: 76px;
    height: 26px;
    top: 29%;
    left: 4%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .label2 {
    width: 76px;
    height: 26px;
    top: 65%;
    left: 4%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .label3 {
    width: 76px;
    height: 26px;
    bottom: 1%;
    left: 3%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .label4 {
    width: 118px;
    height: 26px;
    top: 58%;
    left: 17%;
    background: url('~@/assets/img/sludgeDischarge/w_118.png') no-repeat;
    background-size: 100% 100%;
  }
  .label5 {
    width: 90px;
    height: 26px;
    top: 32%;
    left: 33%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .label6 {
    width: 76px;
    height: 26px;
    top: 66%;
    left: 34%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .img1 {
    position: absolute;
    top: 39%;
    left: 45%;
    width: 75px;
    height: 80px;
    z-index: 100;
  }
  .label7 {
    width: 118px;
    height: 26px;
    top: 57%;
    left: 44%;
    background: url('~@/assets/img/sludgeDischarge/w_118.png') no-repeat;
    background-size: 100% 100%;
  }
  .label8 {
    width: 96px;
    height: 26px;
    top: 89%;
    left: 57%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .label9 {
    width: 96px;
    height: 26px;
    top: 89%;
    left: 72%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .label10 {
    width: 96px;
    height: 26px;
    top: 56%;
    left: 81%;
    background: url('~@/assets/img/sludgeDischarge/w_96.png') no-repeat;
    background-size: 100% 100%;
  }
  .label11 {
    width: 118px;
    height: 26px;
    top: 68%;
    left: 92%;
    background: url('~@/assets/img/sludgeDischarge/w_118.png') no-repeat;
    background-size: 100% 100%;
  }
  .value {
    position: absolute;
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #f8fbff;
    letter-spacing: 1px;
    text-align: center;
  }
  .value1 {
    top: 4%;
    left: 11%;
  }
  .value2 {
    top: 45%;
    left: 11%;
  }
  .value3 {
    top: 78%;
    left: 11%;
  }
  .value4 {
    top: 30%;
    left: 18%;
  }
  .value5 {
    top: 30%;
    left: 45%;
  }
  .value6 {
    top: 24%;
    right: 16%;
  }
  .svg {
    width: 100%;
    height: 100%;
  }
}
</style>
