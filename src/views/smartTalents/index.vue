<template>
  <div class="main-page smart-talents">
    <div class="center-side-wrap">
      <div class="content-wrap">
        <!-- 使用动态组件减少重复代码 -->
        <component
          :is="currentComponent"
          v-if="currentComponent"
          :memo="currentModuleData.memo"
          :urlList="currentModuleData.urlList"
          :currentPreviewIndex="currentPreviewIndex"
          @preview="showImagePreview"
        />
      </div>
      <div class="content-tab">
        <carousel-3d
          :count="slides.length + 1"
          :perspective="30"
          :inverseScaling="500"
          :dir="'ltl'"
          :width="215"
          :height="430"
          :border="0"
          :space="280"
        >
          <slide v-for="(slide, i) in slides" :index="i" :key="slide.code" class="slide-box">
            <template slot-scope="{ index, isCurrent, leftIndex, rightIndex }">
              <div class="slide-con" :class="fade ? 'fade' : 'fade-in'">
                <div class="slide-img">
                  <img
                    :data-index="index"
                    :class="{ current: isCurrent, onLeft: leftIndex >= 0, onRight: rightIndex >= 0 }"
                    class="img_ball"
                    alt=""
                    :src="isCurrent ? slide.imgUrlActive : slide.imgUrl"
                    @click="clickSlide(slide)"
                  />
                </div>
                <div class="slide-title">{{ slide.title }}</div>
              </div>
            </template>
          </slide>
        </carousel-3d>
      </div>
    </div>
    <div class="left-side-wrap">
      <slide-panel :showStage="showStage" ref="left" />
    </div>
    <div class="right-side-wrap">
      <think-panel :showStage="showStage" ref="right" />
    </div>
    <!-- 图片预览弹框 -->
    <image-preview-modal
      :isBigger="isBigger"
      :visible.sync="showPreview"
      :imageUrl="previewImage"
      @close="handleClose"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getDataFileList } from '@/api/mainPage';
import ImagePreviewModal from '@/views/summaryOverview/components/ImagePreviewModal.vue';
import { Carousel3d, Slide } from 'vue-carousel-3d';
import SlidePanel from './model/SlidePanel.vue';
import ThinkPanel from './model/ThinkPanel.vue';
import TalentTeam from './components/TalentTeam.vue';
import TalentAward from './components/TalentAward.vue';
import TalentPatent from './components/TalentPatent.vue';
export default {
  name: 'SmartTalentsPage',
  components: {
    SlidePanel,
    ThinkPanel,
    Carousel3d,
    Slide,
    ImagePreviewModal,
    TalentTeam,
    TalentAward,
    TalentPatent
  },
  data() {
    return {
      showPreview: false,
      previewImage: '',
      showStage: true,
      fade: false,
      currentModule: '5',
      // 常量配置
      MODULE_CONFIG: {
        ORG_CULTURE: 'orgCulture',
        EXCELLENT_EMPLOYEE: 'excellentEmployee',
        TEAM_BUILDING: 'teamBuilding',
        AWARD_RECORD: 'awardRecord',
        PATENT_INVENTION: 'patentInvention'
      },
      AUTO_PREVIEW_INTERVAL: 3000,
      slides: [
        {
          title: '专利发明',
          code: '5',
          imgUrl: require('@/assets/img/smartTalents/zhuanli.png'),
          imgUrlActive: require('@/assets/img/smartTalents/zhuanli_active.png'),
          icon: 'zhuanli',
          urlList: [],
          memo: '',
          moduleName: 'patentInvention'
        },
        {
          title: '优秀员工',
          code: '1',
          imgUrl: require('@/assets/img/smartTalents/nengli.png'),
          imgUrlActive: require('@/assets/img/smartTalents/nengli_active.png'),
          urlList: [],
          memo: '',
          moduleName: 'excellentEmployee'
        },
        {
          title: '组织文化',
          code: '2',
          imgUrl: require('@/assets/img/smartTalents/guanli.png'),
          imgUrlActive: require('@/assets/img/smartTalents/guanli_active.png'),
          urlList: [],
          memo: '',
          moduleName: 'orgCulture'
        },
        {
          title: '团队建设',
          code: '3',
          imgUrl: require('@/assets/img/smartTalents/cai1.png'),
          imgUrlActive: require('@/assets/img/smartTalents/cai1_active.png'),
          urlList: [],
          memo: '',
          moduleName: 'teamBuilding'
        },
        {
          title: '获奖情况',
          code: '4',
          imgUrl: require('@/assets/img/smartTalents/huojiang.png'),
          imgUrlActive: require('@/assets/img/smartTalents/huojiang_active.png'),
          bgUrl: require('@/assets/img/smartTalents/ball_bg.png'),
          icon: 'huojiang',
          memo: '',
          moduleName: 'awardRecord'
        }
      ],
      modules: [
        {
          title: '胜任力分析',
          code: '1',
          imgUrl: require('@/assets/img/smartTalents/nengli.png'),
          imgUrlActive: require('@/assets/img/smartTalents/nengli_active.png')
        },
        {
          title: '8S管理',
          code: '2',
          imgUrl: require('@/assets/img/smartTalents/guanli.png'),
          imgUrlActive: require('@/assets/img/smartTalents/guanli_active.png')
        },
        {
          title: '团队建设',
          code: '3',
          imgUrl: require('@/assets/img/smartTalents/cai1.png'),
          imgUrlActive: require('@/assets/img/smartTalents/cai1_active.png')
        },
        {
          title: '获奖情况',
          code: '4',
          imgUrl: require('@/assets/img/smartTalents/huojiang.png'),
          imgUrlActive: require('@/assets/img/smartTalents/huojiang_active.png'),
          icon: 'huojiang'
        },
        {
          title: '专利发明',
          code: '5',
          imgUrl: require('@/assets/img/smartTalents/zhuanli.png'),
          imgUrlActive: require('@/assets/img/smartTalents/zhuanli_active.png'),
          icon: 'zhuanli'
        }
      ],
      selectValue: '陈聪',
      manageList: [
        {
          title: '整理',
          mainText: '核心：区分必要与不必要的物品，清除不必要的物品。',
          targetText: '目的：减少浪费、腾出空间，避免物品堆积造成的混乱。'
        },
        {
          title: '整顿',
          mainText: '核心：合理规划物品的位置，确保必要物品易取易放。',
          targetText: '目的：提高工作效率，减少寻找物品的时间。'
        },
        {
          title: '清扫',
          mainText: '核心：彻底清理工作区域，保持环境干净整洁。',
          targetText: '目的：消除脏污、发现潜在问题。'
        },
        {
          title: '清洁',
          mainText: '核心：合理规划物品的位置，确保必要物品易取易放。',
          targetText: '目的：提高工作效率，减少寻找物品的时间。'
        },
        {
          title: ' 素养',
          mainText: '核心：培养员工遵守规章制度的习惯，形成自律文化。',
          targetText: '目的：提升员工素质，确保管理持续有效。'
        },
        {
          title: '安全',
          mainText: '核心：识别并消除安全隐患，保障人身和财产安全。',
          targetText: '目的：预防事故，创造安全的工作环境。'
        },
        {
          title: '节约',
          mainText: '核心：合理利用资源，避免浪费。',
          targetText: '目的：降低成本，提升经济效益。'
        },
        {
          title: '学习',
          mainText: '核心：持续学习与改进，提升员工技能和管理水平。',
          targetText: '目的：推动创新，适应变化，实现持续发展。'
        }
      ],
      baseOption: {
        backgroundColor: 'transparent',
        color: ['#0ceed2', '#c285ff'],
        legend: {
          //  orient:'vertical',
          icon: 'rect', //图例形状
          data: ['自评', '上级'],
          top: 0,
          right: 0,
          padding: 8,
          itemWidth: 10, // 图例标记的图形宽度。[ default: 25 ]
          itemHeight: 10, // 图例标记的图形高度。[ default: 14 ]
          itemGap: 24, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
          textStyle: {
            fontSize: 16,
            color: '#BFD5FF'
          }
        },
        tooltip: {
          // show:false,
          backgroundColor: '#0a1644',
          textStyle: {
            color: '#BFD5FF'
          }
        },
        radar: {
          center: ['50%', '56%'],
          radius: '70%',
          startAngle: 90,
          splitNumber: 5,
          shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              fontSize: 16,
              fontFamily: 'AlibabaPuHuiTiM'
              //   fontWeight:'bolder'
            }
          },
          indicator: [
            {
              text: '开拓创新精神',
              max: 100
            },
            {
              text: '专业能力',
              max: 100
            },
            {
              text: '组织与计划能力',
              max: 100
            },
            {
              text: '沟通与协调能力',
              max: 100
              //  axisLabel: {show: true, textStyle: {fontSize: 18, color: '#333'}}
            },
            {
              text: '判断和决策能力',
              max: 100
            },
            {
              text: '高效执行',
              max: 100
            },
            {
              text: '责任感与担当',
              max: 100
            },
            {
              text: '安全意识',
              max: 100
            }
          ],
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          axisLine: {
            //指向外圈文本的分隔线样式
            lineStyle: {
              color: '#114e89'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#114e89', // 分隔线颜色
              width: 4 // 分隔线线宽
            }
          }
        },
        series: [
          {
            type: 'radar',
            symbolSize: 0,
            // symbol: 'angle',
            data: [
              {
                value: [50, 70, 60, 90, 80, 40, 77, 94],
                name: '自评',
                lineStyle: {
                  width: 3
                },
                areaStyle: {
                  normal: {
                    // 单项区域填充样式
                    color: {
                      type: 'linear',
                      x: 0, //右
                      y: 0, //下
                      x2: 1, //左
                      y2: 1, //上
                      colorStops: [
                        {
                          offset: 0,
                          color: '#0ceed2'
                        },
                        {
                          offset: 0.5,
                          color: 'rgba(0,0,0,0)'
                        },
                        {
                          offset: 1,
                          color: '#0ceed2'
                        }
                      ],
                      globalCoord: false
                    },
                    opacity: 1 // 区域透明度
                  }
                }
              },
              {
                value: [70, 90, 70, 80, 60, 89, 97, 90],
                name: '上级',
                lineStyle: {
                  width: 3
                },
                areaStyle: {
                  normal: {
                    // 单项区域填充样式
                    color: {
                      type: 'linear',
                      x: 0, //右
                      y: 0, //下
                      x2: 1, //左
                      y2: 1, //上
                      colorStops: [
                        {
                          offset: 0,
                          color: '#c285ff'
                        },
                        {
                          offset: 0.5,
                          color: 'rgba(0,0,0,0)'
                        },
                        {
                          offset: 1,
                          color: '#c285ff'
                        }
                      ],
                      globalCoord: false
                    },
                    opacity: 1 // 区域透明度
                  }
                }
              }
            ]
          }
        ]
      },
      autoPreviewTimer: null,
      currentPreviewIndex: 0,
      // 统一模块数据管理
      moduleData: {
        orgCulture: { memo: '', urlList: [] },
        excellentEmployee: { memo: '', urlList: [] },
        teamBuilding: { memo: '', urlList: [] },
        patentInvention: { memo: '', urlList: [] },
        awardRecord: { memo: '', urlList: [] }
      }
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId']),

    // 当前模块对应的组件
    currentComponent() {
      const componentMap = {
        1: 'TalentTeam',
        2: 'TalentTeam',
        3: 'TalentTeam',
        4: 'TalentAward',
        5: 'TalentPatent'
      };
      return componentMap[this.currentModule];
    },

    // 当前模块数据
    currentModuleData() {
      const moduleMap = {
        1: this.moduleData.excellentEmployee,
        2: this.moduleData.orgCulture,
        3: this.moduleData.teamBuilding,
        4: this.moduleData.awardRecord,
        5: this.moduleData.patentInvention
      };
      return moduleMap[this.currentModule] || {};
    },

    chartId() {
      return 'chart' + Date.now() + Math.random() * 9999;
    },

    isBigger() {
      return this.currentModule === '5' || this.currentModule === '3';
    }
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {}
    }
  },
  created() {},
  mounted() {
    this.initPage();
    this.initSlide();
    this.getPageData();
  },

  beforeDestroy() {
    this.clearAutoPreviewTimer();
  },
  methods: {
    // 初始化页面
    initPage() {
      this.setPageBackground();
    },

    // 设置页面背景
    setPageBackground() {
      document.querySelectorAll('.content-wrapper').forEach(wrapper => {
        wrapper.querySelectorAll('.content-main').forEach(wrapperInner => {
          if (wrapperInner.querySelectorAll('.smart-talents').length > 0) {
            wrapper.style.background = '#050d21';
          }
        });
      });
    },

    // 重置页面背景
    resetPageBackground() {
      document.querySelectorAll('.content-wrapper').forEach(wrapper => {
        wrapper.style.background = '';
      });
    },

    formatFileUrl(url) {
      if (!url) return '';
      const baseUrl = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_HOST : window.location.origin;
      return baseUrl + url.replace('/api', '/main');
    },
    async getPageData() {
      try {
        const res = await getDataFileList({ fileGroup: 'screen' });
        const { status, resultData } = res || {};

        if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
          this.processPageData(resultData);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },

    // 处理页面数据
    processPageData(data) {
      // 处理URL数据，格式化文件路径
      const processedData = data.map(item => ({
        ...item,
        urlList: item.url ? item.url.split(',').map(v => this.formatFileUrl(v)) : []
      }));

      // 更新轮播数据
      this.slides.forEach(slide => {
        const module = processedData.find(v => v.code === slide.moduleName);
        if (module) {
          slide.urlList = module.urlList;
          slide.memo = module.memo;
          slide.title = module.title;
        }
      });

      // 更新模块数据
      Object.keys(this.moduleData).forEach(key => {
        const module = processedData.find(v => v.code === key);
        if (module) {
          this.moduleData[key] = module;
        }
      });
    },
    showImagePreview(imageUrl) {
      this.previewImage = imageUrl;
      this.showPreview = true;
    },
    initSlide() {
      const targetSlide = this.slides.find(slide => slide.code === '5');
      if (targetSlide) {
        this.clickSlide(targetSlide);
      }
    },
    clickSlide(slide) {
      this.currentModule = slide.code;
      this.clearAutoPreviewTimer();

      const currentUrlList = this.currentModuleData.urlList || [];
      if (currentUrlList.length > 0) {
        this.currentPreviewIndex = 0;
        this.startAutoPreview(currentUrlList);
      }
    },
    startAutoPreview(images) {
      if (!images || images.length === 0) return;

      this.autoPreviewTimer = setInterval(() => {
        this.currentPreviewIndex = (this.currentPreviewIndex + 1) % images.length;
      }, 3000);
    },

    // 清除自动预览定时器
    clearAutoPreviewTimer() {
      if (this.autoPreviewTimer) {
        clearInterval(this.autoPreviewTimer);
        this.autoPreviewTimer = null;
      }
    },
    handleClose() {
      this.showPreview = false;
    },
    handleSelect(value) {
      this.selectValue = value;
      this.updateChartData();
    },

    // 更新图表数据
    updateChartData() {
      this.baseOption.series[0].data[0].value = this.generateRandomScores();
      this.baseOption.series[0].data[1].value = this.generateRandomScores();
    },
    generateRandomScores() {
      return Array.from(
        { length: 8 },
        () => Math.floor(Math.random() * 41) + 60 // 生成60-100的随机整数
      );
    },
    changeModule(val) {
      this.currentModule = val;
      // 找到当前选中模块的索引
      const currentIndex = this.modules.findIndex(item => item.code === val);
      // 将选中的模块移到数组开头，同时保持其他模块的相对顺序
      const selectedModule = this.modules.splice(currentIndex, 1)[0];
      this.modules.unshift(selectedModule);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.clearAutoPreviewTimer();
    this.resetPageBackground();
    next();
  }
};
</script>

<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  background: #050d24;

  .center-side-wrap {
    position: relative;
    width: calc(100% - 914px);
    margin: 32px 0;
    height: 90%;
    background: url('~@/assets/img/smartTalents/bg.png') no-repeat;
    background-size: 100% 100%;
    .content-wrap {
      position: absolute;
      width: 80%;
      height: 48%;
      top: 6%;
      left: 10%;
      .module-wrap1 {
        height: 100%;
        padding: 12px 24px;
        .chart {
          height: 100%;
        }
      }
      .module-wrap2 {
        .content-middle {
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          flex-direction: row;
          .manage-item {
            width: 368px;
            height: 86px;
            background: url('~@/assets/img/smartTalents/guanli_bg.png') no-repeat;
            background-size: 100% 100%;
            margin: 10px 0px;
            .manage-item-title {
              height: 24px;
              width: 100%;
              padding-left: 36px;
              padding-top: 2px;
              font-family: AlibabaPuHuiTiM, sans-serif;
              font-size: 14px;
              color: #ffffff;
              letter-spacing: 2px;
            }
            .manage-item-text {
              margin-top: 6px;
              padding-left: 12px;
              font-family: AlibabaPuHuiTi-Regular, sans-serif;
              font-weight: 400;
              font-size: 14px;
              color: #ffffff;
              letter-spacing: 0px;
            }
          }
        }
      }
      .module-wrap3 {
        .content-top {
          margin-top: 32px;
          padding: 26px 18px;
          width: 762px;
          height: 191px;
          background: url('~@/assets/img/smartTalents/center_bg.png') no-repeat;
          background-size: 100% 100%;
          font-family: AlibabaPuHuiTi-Regular, sans-serif;
          text-indent: 32px;
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0.2px;
          line-height: 28px;
        }
        .content-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          margin-top: 32px;
          img {
            flex: 1 1 0;
            height: 135px;
            object-fit: cover;
            width: 0;
            max-width: 100%;
          }
        }
      }
      .module-wrap4 {
        .content-top {
          margin-top: 36px;
          padding: 26px 16px;
          width: 762px;
          height: 191px;
          text-indent: 32px;
          background: url('~@/assets/img/smartTalents/center_bg.png') no-repeat;
          background-size: 100% 100%;
          font-family: AlibabaPuHuiTi-Regular, sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0.2px;
          line-height: 28px;
        }
        .content-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          margin-top: 36px;
          img {
            width: 33.3%;
            height: 153px;
            object-fit: cover;
          }
        }
      }
      .module-wrap5 {
        .content-top {
          margin-top: 24px;
          width: 776px;
          height: 84px;
          text-indent: 34px;
          font-family: AlibabaPuHuiTiM, sans-serif;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: 1px;
          line-height: 28px;
        }
        .content-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          margin-top: 32px;
          img {
            flex: 1 1 auto;
            height: 204px;
            object-fit: cover;
          }
        }
      }
    }
    .content-tab {
      position: absolute;
      top: 62%;
      left: 0%;
      width: 100%;
      height: 400px;
      .carousel-3d-container {
        margin: 0 !important;
        height: 515px;
      }
      /deep/.carousel-3d-slide {
        background-color: transparent !important;
      }
      .current {
        display: flex;

        width: 154px !important;
        height: 185px !important;
        top: 50%;
        left: 15%;
        .slide-con {
          .slide-img {
            .img_ball {
              width: 154px !important;
              height: 154px !important;
            }
          }
          .slide-title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            color: #ffffff;
          }
        }
      }
      .right-1 {
        display: flex;
        width: 100px !important;
        height: 144px !important;
        transition: none !important;
        transform: none !important;
        top: 32%;
        left: 192%;
        .slide-con {
          .slide-img {
            img {
              width: 110px;
              height: 110px;
            }
          }
          .slide-title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            opacity: 0.8;
            color: #ffffff;
          }
        }
      }
      .right-2 {
        display: flex;
        width: 75px !important;
        height: 105px !important;
        transition: none !important;
        transform: none !important;
        top: 1%;
        left: 90%;
        .slide-con {
          .slide-img {
            img {
              width: 66px;
              height: 66px;
            }
          }
          .slide-title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            opacity: 0.7;
            color: #ffffff;
          }
        }
      }
      .left-1 {
        display: flex;
        width: 100px !important;
        height: 144px !important;
        transition: none !important;
        transform: none !important;
        top: 32%;
        left: -132%;
        .slide-con {
          .slide-img {
            img {
              width: 110px;
              height: 110px;
            }
          }
          .slide-title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            opacity: 0.8;
            color: #ffffff;
          }
        }
      }
      .left-2 {
        display: flex;
        width: 74px !important;
        height: 105px !important;
        transition: none !important;
        transform: none !important;
        top: 1%;
        left: -28%;
        .slide-con {
          .slide-img {
            img {
              width: 66px;
              height: 66px;
            }
          }
          .slide-title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            opacity: 0.7;
            color: #ffffff;
          }
        }
      }
      .content-tab-item {
        position: absolute;
        img {
          width: 103px;
          height: 95px;
        }
        .name {
          opacity: 0.8;
          font-family: AlibabaPuHuiTi-Regular, sans-serif;
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
        }
      }
      .content-tab-item_active {
        img {
          width: 144.14px;
          height: 131.82px;
        }
      }
      .module1 {
        left: 45%;
        top: 56%;
        .name {
          font-size: 18px;
          color: #ffffff;
        }
      }
      .module2 {
        right: 9%;
        top: 36%;
        .name {
          font-size: 16px;
          opacity: 0.8;
        }
      }
      .module3 {
        right: 34%;
        top: -4%;
        img {
          width: 61.8px;
          height: 56.46px;
        }
        .name {
          font-size: 14px;
          opacity: 0.7;
          margin-top: -6px;
        }
      }
      .module4 {
        left: 34%;
        top: -4%;
        img {
          width: 61.8px;
          height: 56.46px;
        }
        .name {
          font-size: 14px;
          opacity: 0.7;
          margin-top: -12px;
        }
      }
      .module5 {
        left: 9%;
        top: 36%;
        .name {
          font-size: 16px;
          opacity: 0.8;
        }
      }
    }
  }
  .right-side-wrap {
    position: fixed;
    width: 452px;
    height: calc(100% - 110px);
    top: 6%;
    right: 32px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
  .left-side-wrap {
    position: fixed;
    width: 452px;
    height: calc(100% - 132px);
    top: 8%;
    left: 32px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
  .img-active {
    transform: scale(1.1);
  }
  /deep/ .select__block {
    z-index: 100;
    position: absolute;
    background: url('~@/assets/img/hz/ac-point.png') no-repeat;
    background-size: 100% 100%;

    width: 124px;
    height: 34px;

    margin-right: 12px;

    .ant-select-selection {
      background: transparent;
      border: none;
    }

    .ant-select-selection__rendered {
      height: 34px;
      line-height: 34px;
      text-align: center;
      .ant-select-selection-selected-value {
        float: unset;
        font-family: SourceHanSansCN-Regular, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
  .fade {
    animation: fade 2s ease-in 1;
  }
  .fade-in {
    animation: move 2s 3s ease-in infinite;
  }
  @keyframes move {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-4px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  @keyframes fade {
    0% {
      transform: rotateX(0deg);
      opacity: 1;
    }
    30% {
      transform: rotateX(180deg);
      opacity: 0;
    }
    40% {
      transform: rotateX(0deg);
      opacity: 1;
    }
    50% {
      transform: rotateX(20deg);
      opacity: 0.8;
    }
    60% {
      transform: rotateX(0deg);
      opacity: 1;
    }
    70% {
      transform: rotate(10deg);
      opacity: 0.8;
    }
    100% {
      transform: rotate(0deg);
      opacity: 1;
    }
  }
}
</style>
