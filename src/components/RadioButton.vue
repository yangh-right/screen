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
    padding: 0 4px;
    min-width: 70px;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    background: url('~@/assets/img/smartProduct/btn-unselect.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    cursor: pointer;
    .radio-label {
      font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: #90a6bd;
      letter-spacing: 0;
      text-align: center;
    }
    &.radio-selected {
      background: url('~@/assets/img/smartProduct/btn-select.png') no-repeat;
      background-size: 100% 100%;
      .radio-label {
        color: #d9ecff;
      }
    }
  }
}
</style>
