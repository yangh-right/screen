<template>
  <a-modal :visible="visible" :width="800" centered :footer="null" :closable="false" @cancel="handleClose">
    <video ref="dialogVideo" class="dialog-video" :src="videoSrc" autoplay muted loop controls></video>
    <div class="close-icon" @click="handleClose">
      <a-icon type="close-circle" theme="filled" />
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'videoBigger',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    videoSrc: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.ant-modal-content {
  background: transparent !important;
}
.dialog-video {
  width: 100%;
  height: 70vh;
  object-fit: contain;
  background: #000;
}

.close-icon {
  position: absolute;
  top: -20px;
  right: -20px;
  font-size: 28px;
  color: #bfd5ff;
  cursor: pointer;
  z-index: 1001;
}

.ant-modal-header {
  display: none;
}

.ant-modal-content {
  background: transparent;
  box-shadow: none;
  border: 2px solid rgba(0, 146, 246, 0.5);
  border-radius: 8px;
}
</style>
