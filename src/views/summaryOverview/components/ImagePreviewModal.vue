<template>
  <a-modal
    :visible="visible"
    @cancel="handleClose"
    :footer="null"
    :closable="false"
    :maskClosable="true"
    :width="'60%'"
    :destroyOnClose="true"
    class="image-preview-modal"
  >
    <div class="modal-content" @click="handleClose">
      <img :class="[isBigger ? 'img-bigger' : '']" :src="imageUrl" alt="预览图" />
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'ImagePreviewModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    },
    isBigger: {
      type: Boolean,
      default: false
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
.img-bigger {
  transform: scale(1.2);
}
.image-preview-modal {
  :deep(.ant-modal-content) {
    background: transparent;
    box-shadow: none;

    .ant-modal-close {
      color: #fff;

      &:hover {
        color: #e6e5f7;
      }
    }

    .ant-modal-body {
      padding: 0;
    }
  }

  .modal-content {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
    }
  }
}
</style>
