<template>
  <a-modal
    :visible="visible"
    @cancel="handleClose"
    :footer="null"
    :closable="false"
    :centered="true"
    :maskClosable="true"
    :width="width"
    :destroyOnClose="true"
    class="image-preview-modal"
  >
    <div :style="{ height: height }" class="modal-box">
      <div class="title">
        <div class="name">工艺流程</div>
        <div class="close" @click="handleClose"></div>
      </div>
      <div class="content-body">
        <img :src="imageUrl" alt="预览图" />
      </div>
      <div class="footer"></div>
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
    height: {
      type: String,
      default: '416px'
    },
    width: {
      type: String,
      default: '852px'
    },
    imageUrl: {
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
.image-preview-modal {
  :deep(.ant-modal-content) {
    box-shadow: none;
    width: fit-content;
    background: transparent;

    .ant-modal-close {
      color: #fff;

      &:hover {
        color: #e6e5f7;
      }
    }

    .ant-modal-body {
      padding: 0;
      display: flex;
      justify-content: center;
    }
  }
  .modal-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    .title {
      width: 100%;
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0 0 50px;
      background: url('~@/assets/img/modal-title.png') no-repeat;
      background-size: 100% 100%;
      .name {
        font-family: YouSheBiaoTiHei, sans-serif;
        font-size: 24px;
        color: #eaf1fb;
      }
      .close {
        position: relative;
        top: 9px;
        width: 42px;
        height: 34px;
        background: url('~@/assets/img/modal-close.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }

    .content-body {
      background: url('~@/assets/img/modal-bg.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 22px 22px 0;
      img {
        object-fit: contain;
      }
    }
    .footer {
      width: 100%;
      height: 37px;
      background: url('~@/assets/img/modal-bottom.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
