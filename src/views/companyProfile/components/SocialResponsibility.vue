<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="product-layout-container">
      <!-- 四个业务分类 -->
      <div class="business-categories">
        <!-- 制水售水 -->
        <div class="category-item category-top-left">
          <div class="category-sphere">
            <div class="category-title">制水 售水</div>
          </div>
          <div class="category-items">
            <div class="item">南山水厂</div>
            <div class="item">桥下水厂</div>
            <div class="item">管道直饮水</div>
          </div>
        </div>

        <!-- 污水处理 -->
        <div class="category-item category-top-right">
          <div class="category-sphere">
            <div class="category-title">污水 处理</div>
          </div>
          <div class="category-items">
            <div class="item">永康市钱江芝水</div>
            <div class="item">水务有限公司</div>
          </div>
        </div>

        <!-- 管道安装 -->
        <div class="category-item category-bottom-left">
          <div class="category-sphere">
            <div class="category-title">管道 安装</div>
          </div>
          <div class="category-items">
            <div class="item">水务安装工程</div>
          </div>
        </div>

        <!-- 光伏项目 -->
        <div class="category-item category-bottom-right">
          <div class="category-sphere">
            <div class="category-title">光伏 项目</div>
          </div>
          <div class="category-items">
            <div class="item">新能源项目</div>
            <div class="item">绿色能源解决方案</div>
          </div>
        </div>

        <!-- 产品布局 -->
        <div class="product-layout">产品布局</div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'SocialResponsibility',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: '产品布局'
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 业务分类数据
      businessCategories: [
        {
          title: '制水 售水',
          items: ['南山水厂', '桥下水厂', '管道直饮水']
        },
        {
          title: '污水 处理',
          items: ['永康市钱江芝水', '水务有限公司']
        },
        {
          title: '管道 安装',
          items: ['水务安装工程']
        },
        {
          title: '光伏 项目',
          items: ['新能源项目', '绿色能源解决方案']
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.product-layout-container {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  overflow: hidden;
  background: url('~@/assets/img/smartTalents/product_bg.png') center 30px no-repeat;
  background-size: auto 100%;
}

/* 业务分类容器 */
.product-layout-container .business-categories {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 5;
}

/* 分类项目 */
.product-layout-container .category-item {
  position: absolute;
}

.product-layout-container .category-item .category-sphere {
  width: 36px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-layout-container .category-item .category-sphere .category-title {
  font-family: Aliba;
  font-weight: 700;
  font-size: 15px;
  color: #ebf4fd;
  text-align: center;
  text-shadow: 0 3px 6px #00396ecc;
}

.product-layout-container .category-item .category-items {
  margin-top: 8px;
  margin-left: -10px;
}

.product-layout-container .category-item .category-items .item {
  font-size: 10px;
  color: #bfd5ff;
  margin: 2px 0;
  padding-left: 8px;
  position: relative;
}

.product-layout-container .category-item .category-items .item::before {
  content: '●';
  color: #00ff88;
  position: absolute;
  left: 0;
  font-size: 8px;
}

/* 四个分类位置 */
.product-layout-container .category-top-left {
  top: 18%;
  left: 29.5%;
}

.product-layout-container .category-top-right {
  top: 14%;
  right: 21.5%;
}

.product-layout-container .category-bottom-left {
  bottom: 13%;
  left: 11.5%;
}

.product-layout-container .category-bottom-right {
  bottom: 4%;
  right: 2%;
}
.product-layout-container .product-layout {
  position: absolute;
  top: 67%;
  left: 44%;
  font-family: Aliba;
  font-weight: 700;
  font-size: 18px;
  color: #ebf4fd;
  text-align: center;
  text-shadow: 0 3px 6px #00396ecc;
}
</style>
