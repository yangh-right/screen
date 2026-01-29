<template>
  <div class="radio-group">
    <div
      v-for="option in options"
      :key="option.value"
      class="radio-item"
      @click="handleChange(option.value)"
      :class="{ 'radio-selected': option.value === key }"
    >
      <span class="radio-label">{{ option.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadioButton',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    }
  },
  data() {
    return {
      key: ''
    };
  },
  watch: {
    value: {
      handler(val) {
        this.key = this.value;
      },
      immediate: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value);
      this.$emit('change', value);
    }
  }
};
</script>

<style scoped>
.radio-group {
  display: flex;
  align-items: center;
  .radio-item {
    width: 97px;
    height: 22.5px;
    line-height: 22.5px;
    margin-right: -31px;
    text-align: center;
    background: url('~@/assets/img/smartProduct/radio.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    .radio-label {
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #b9c8e8;
      letter-spacing: 0;
      text-align: center;
    }
    &.radio-selected {
      z-index: 2;
      background: url('~@/assets/img/smartProduct/radio-selected.png') no-repeat;
      background-size: 100% 100%;
      .radio-label {
        color: #e5ebf8;
      }
    }
  }
}
</style>
