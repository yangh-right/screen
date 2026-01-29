<template>
  <div class="split">
    <div class="split__head"></div>
    <div class="split__body"></div>
    <div class="split__head"></div>
  </div>
</template>

<script>
export default {
  name: 'split'
};
</script>
<style lang="less" scoped>
.split {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &__head {
    width: 6px;
    border: 2px solid #9ccbfb;
  }
  &__body {
    flex: 1;
    border: 1.5px solid rgba(46, 76, 117, 0.6);
  }
}
</style>
