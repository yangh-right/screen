<template>
  <a-select
    dropdownClassName="custom-select__drop"
    class="custom-select"
    v-on="$listeners"
    v-bind="$attrs"
    v-model="key"
    @dropdownVisibleChange="openChange"
    @change="change"
  >
    <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
    <slot></slot>
  </a-select>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Array, Number],
      default: undefined
    }
  },
  data() {
    return {
      key: this.value
    };
  },
  watch: {
    value(val) {
      this.key = val;
    }
  },
  methods: {
    change(val) {
      this.$emit('input', val);
    },

    openChange(e) {
      this.$emit('openChange', e);
    }
  },
  mounted() {}
};
</script>
<style>
.custom-select__drop {
  z-index: 9999 !important;
  .ant-select-dropdown-menu {
    background: #042d53;
    background-size: 100% 100%;
    padding: 0;
    .ant-select-dropdown-menu-item {
      font-weight: 500;
      font-size: 12px;
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      color: #bdd5fa;
    }
    .ant-select-dropdown-menu-item:hover {
      background-color: rgba(18, 61, 132, 0.3);
      background-image: linear-gradient(-86deg, invalid gradient);
      box-shadow: inset 20px 0 20px 20px #005cad;
    }
  }
}
</style>
<style lang="less" scoped>
.custom-select {
  border: none;
  background: url('~@/assets/img/smartSafe/select-bg.png') no-repeat;
  background-size: 100% 100%;
  height: 34px;
  position: relative;
  z-index: 9999;

  /deep/.ant-select-selection {
    background: transparent;
    border: none;
  }
  /deep/ .ant-select-arrow {
    top: 45%;
  }
  /deep/.ant-select-selection__rendered {
    height: 34px;
    line-height: 32.5px;
    margin-left: 13.25px;
    .ant-select-selection-selected-value {
      float: unset;
      font-family: AlibabaPuHuiTiM, sans-serif;
      font-size: 16px;
      color: #f1f6ff;
      letter-spacing: 0;
    }
    .ant-select-selection__choice {
      background-color: transparent;
      border: none;
      color: #f1f6ff;
      font-size: 16px;
      font-weight: 400;
      font-family: AlibabaPuHuiTiM, sans-serif;
    }
    li {
      height: 22px;
      line-height: 22px;
    }
  }
}
</style>
