<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-14 09:57:38
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="tank-card card1">
        <div class="header">系统构成</div>
        <div class="solution-wrapper">
          <div v-if="!loading && planDataList.length" class="solution" v-resize="resize">
            <div
              v-for="(planData, index) in filterPlanDataList"
              :key="planData.id"
              :class="['solution__item', planData.applied ? 'plan-applied' : '']"
            >
              <note-box v-if="planData.startRender" :title="getPlanDataTitle(planData)">
                <template
                  v-if="
                    (planData.alarmDataList && planData.alarmDataList.length) ||
                    (planData.planList && planData.planList.length)
                  "
                >
                  <vue-typed-js
                    :strings="planData.htmlStr || ''"
                    :shuffle="false"
                    cursorChar=""
                    @onComplete="onComplete(index)"
                    :typeSpeed="14"
                    :fadeOutClass="'fadeOutClass'"
                    :loop="false"
                    :loopCount="1"
                    :startDelay="500"
                    :showCursor="true"
                    :contentType="'html'"
                  >
                    <div class="typing"></div>
                  </vue-typed-js>
                </template>
                <!-- <a-empty v-else></a-empty> -->
              </note-box>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import noteBox from './noteBox';
import { getExpertProcessControlList, getExpertProcessData } from '@/api/warnPredict';
export default {
  name: 'optimizationPlan',
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    alarmInfo: {
      type: Object,
      default: () => ({})
    }
  },
  components: { noteBox },
  data() {
    return {
      factorType: '',
      pointList: [],
      planDataList: [],
      solutionMap: {},
      planList: [],
      loading: false
    };
  },
  computed: {
    filterPlanDataList() {
      return this.planDataList
        .filter(item => this.isShowAll || item.applied)
        .map((item, index) => {
          if (index === 0) {
            item.startRender = true;
          }
          return item;
        });
    },
    params() {
      return {
        controlId: this.alarmInfo?.expertProcessControl?.id,
        alarmTime: this.alarmInfo?.startTime,
        factorType: this.factorType
      };
    }
  },
  watch: {
    params: {
      handler(val) {
        this.getExpertProcessData();
      },
      immediate: true
    },
    alarmInfo: {
      handler(val) {
        this.getPointList();
      },
      immediate: true
    }
  },
  methods: {
    async getPointList() {
      if (this.alarmInfo?.expertProcessControl?.id != null && this.alarmInfo.startTime) {
        let params = {
          controlId: this.alarmInfo.expertProcessControl.id,
          alarmTime: this.alarmInfo.startTime
        };
        const { resultData, status } = await getExpertProcessControlList(params);
        if (status === 'complete') {
          this.pointList = resultData || [];
          this.factorType = this.pointList?.find(item => this.isShowAll || item.applied)?.factorType || '';
        }
      } else {
        this.pointList = [];
        this.factorType = '';
      }
    },
    async getExpertProcessData() {
      this.loading = true;
      if (this.alarmInfo?.expertProcessControl?.id != null && this.alarmInfo.startTime && this.factorType) {
        const { resultData, status } = await getExpertProcessData(this.params);
        if (status === 'complete') {
          this.planDataList = resultData || [];
          this.planDataList.forEach((item, index) => {
            item.title = item.decisionConditionExpressionShow || '';
            item.htmlStr = [this.getNoteHtmlStr(item)];
          });
        }
      } else {
        this.planDataList = [];
      }
      this.loading = false;
    },
    resize() {
      if (!this.filterPlanDataList.every(item => item.completeRender)) {
        this.$nextTick(() => {
          let solutionWrapper = document.querySelector('.solution-wrapper');
          solutionWrapper?.scrollTo({ top: solutionWrapper.scrollHeight, behavior: 'smooth' });
        });
      }
    },
    onComplete(index) {
      this.filterPlanDataList[index]['completeRender'] = true;
      if (this.filterPlanDataList[index + 1]) {
        this.$set(this.filterPlanDataList[index + 1], 'startRender', true);
      }
    },
    getPlanDataTitle(data) {
      let title = data.title || '';
      let alarmValue = data?.alarmDataList?.[0]?.[0]?.pvAfterRatio;
      return alarmValue == undefined
        ? title
        : `${title}实际值是<span class="point_value">${alarmValue}</span>，建议采取措施如下：`;
    },
    getNoteHtmlStr(data) {
      let str = '';
      if (data.planList?.length) {
        let noteItems = '';
        data.planList.map((note, index) => {
          noteItems += `<div class="note__item"><span class="note__text">
            <span class="status-point"></span>
            <span class="note__text-name">${note.measuresTypeName + '：'}</span>
           ${note.measures}
            </span></div>`;
        });
        str += `<div class="note">${noteItems}</div>
         `;
      }
      return str;
    },
    // 是否已采纳
    whetherAdopt(measuresType, planIdList, adoptPlanIdList) {
      if (planIdList && planIdList.includes(measuresType)) {
        return false;
      } else if (adoptPlanIdList && adoptPlanIdList.includes(measuresType)) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
    height: 24px;
    background: url('~@/assets/img/hz/predict-stitle.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .content-spin {
    width: 100%;
    height: calc(100% - 42px);
    position: relative;

    .tank-card {
      margin: 12px 0 0 0;
      .header {
        font-family: AlibabaPuHuiTi_2_85, sans-serif;
        font-weight: 700;
        font-size: 18px;
        color: #b1ffff;
        letter-spacing: 0;
        display: flex;
        justify-content: center;
      }
      .solution-wrapper {
        height: calc(100% - 36px);
        overflow: auto;
      }
      .solution {
        height: 100%;
        overflow: auto;
      }
    }
    .card1 {
      width: 100%;
      height: 100%;
      background: url('~@/assets/img/hz/predict-panel.png') no-repeat;
      background-size: 100% 100%;
      .header {
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-weight: 700;
        font-family: AlibabaPuHuiTi, sans-serif;

        font-size: 14px;
        color: #e4f1ff;
        letter-spacing: 0;
        text-shadow: 0 2px 4px #00000080;
      }
    }
    .solution {
      width: 100%;
      &__item {
        margin-bottom: 10px;
        width: 100%;
        &.plan-applied {
          /deep/.card-box__title {
            .text {
              color: #d8f7ff;
            }
          }
        }
        /deep/.card-box {
          border-radius: 4px;
          &__title {
            height: auto !important;
          }
          &__content {
            padding: 8px;
          }
        }
        &:nth-last-child(1) {
          margin-bottom: 0;
        }
        /deep/.typing {
          .note__title {
            color: #d8f7ff;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .note {
            overflow: auto;
            font-weight: 400;
            font-size: 14px;
            color: #d8f7ff;
            letter-spacing: 0;
            height: 100%;
            &__text {
              margin-left: 6px;
              position: relative;
              top: -2px;
              .status-point {
                position: relative;
                top: -2px;
                display: inline-block;
                background-color: #4f9df1;
                width: 4px;
                height: 4px;
                margin-right: 6px;
                border-radius: 50%;
              }
              &-name {
                font-weight: 400;
                color: #d8f7ff;
              }
            }
            &__wrapper {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              padding: 2px 6px;
            }
            &__item {
              margin-left: 0;
              margin-bottom: 6px;
              display: flex;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
