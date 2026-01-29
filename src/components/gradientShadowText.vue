<template>
  <div class="gradient-shadow">
    <span class="text" :text="text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'GradientShadowText',
  props: {
    // 文本内容
    text: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="less" scoped>
.gradient-shadow .text {
  display: inline-block;
  height: fit-content;
  font-family: YouSheBiaoTiHei, sans-serif;
  font-size: 44px;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px #040224b3;
  /*文字的颜色*/
  color: #fff;
}
.gradient-shadow .text:before {
  /*覆盖的文字*/
  content: attr(text);
  position: absolute;
  letter-spacing: 2px;
  z-index: 10;
  /*覆盖文字的颜色*/
  color: #76a1f7;
  -webkit-mask: linear-gradient(to top, #76a1f7 28%, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 79%);
}
</style>
