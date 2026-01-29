<template>
  <div class="box-wapper">
    <div class="text text1">综合楼、办公室、处理车间的夏季制冷</div>
    <div class="text text2">生活热水：综合楼生活热水的供应要求，小时热水量约5.4m3/h，生活热水供水温度按55℃计</div>
    <div class="text text3">冬季配药：将再生水或自来水加热至20℃左右，用于PAM配药，水量为100-132t/d</div>
    <div class="text text4">综合楼、办公室、处理车间的冬季供暖</div>
    <img class="box-svg" src="~@/assets/img/smartProduct/low-craft.png" alt="" />
  </div>
</template>

<script>
export default {
  components: {},
  name: 'configuration',
  data() {
    return {
      svgPreviewUrl: undefined
    };
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>
<style lang="less" scoped>
.box-wapper {
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/smartProduct/low-svg-bg.png') no-repeat;
  background-size: 100% 100%;
  border-radius: 4px;
  padding: 38px 64px 10px 23px;
  position: relative;
  .box-svg {
    width: 100%;
    height: 100%;
  }
  .text {
    position: absolute;
    background-image: linear-gradient(0deg, #7fcbfe33 0%, #7fcbfe1a 100%);
    font-family: AlibabaPuHuiTi-Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #bfd5ff;
    letter-spacing: 0;
    white-space: wrap;
    padding: 8px 6px;
    border-top: 1.21px solid #7fcbfe80;
    &.text1 {
      width: 99px;
      height: 78px;
      left: 123px;
      top: 103px;
    }
    &.text2 {
      width: 154px;
      height: 118px;
      right: 272px;
      top: 25px;
    }
    &.text3 {
      width: 154px;
      height: 95px;
      right: 72px;
      top: 36px;
    }
    &.text4 {
      width: 99px;
      height: 78px;
      right: 7px;
      top: 172px;
    }
  }
}
</style>
