<!--
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-05-07 15:58:05
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-22 13:43:30
 * @Description:
-->
<template>
  <unit-card cardTitle="智慧决策" cardType="3">
    <div class="solution-box" id="expert-solution">
      <div class="panel">
        <div class="title" :title="alarmInfo.alarmContent">{{ alarmInfo.alarmContent }}</div>
        <div class="time">
          <img src="@/assets/img/smartForecast/calendar.png" alt="" class="time__icon" />
          <span class="time__str">{{ alarmInfo.startTime }}</span>
        </div>
        <div
          class="card-content"
          :style="{
            'justify-content': appliedPointList.length ? 'space-between' : 'flex-start'
          }"
        >
          <div class="text condition" v-html="conditionDesc"></div>
          <div v-if="realValue.length" class="box">
            <div class="text name">实际值为</div>
            <div class="value__content real-content" v-for="(value, index) in realValue" :key="index">
              <span class="text" style="margin-right: 6px">{{ value.devicePointName }}</span>
              <div class="value__num">{{ value.value }}</div>
            </div>
          </div>
          <div class="box point" v-if="appliedPointList.length">
            <div class="text name">经系统研判</div>
            <div class="value__content">
              <div class="value__num" v-for="item in appliedPointList" :key="item.factorType">
                {{ item.factorTypeName }}
              </div>
            </div>
            <div class="text" style="margin-top: 6px">{{ appliedPointList.length > 1 ? '等' : '' }}方面存在问题</div>
          </div>
        </div>
      </div>

      <div class="right">
        <radio-button class="radio-button" :options="filterPointList" v-model="factorType" />
        <div class="solution-wrapper">
          <div v-if="!loading && planDataList.length" class="solution" v-resize="resize">
            <div
              :class="['solution__item', planData.applied ? 'plan-applied' : '']"
              v-for="(planData, index) in filterPlanDataList"
              :key="planData.id"
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
              </note-box>
            </div>
          </div>
          <empty
            v-if="planDataList.length === 0 && numData !== 1"
            class="data-empty"
            tip="二级因素均未命中，请深入排查"
          >
            <vue-typed-js
              :strings="['二级因素均未命中，请深入排查']"
              :shuffle="false"
              cursorChar=""
              :typeSpeed="50"
              :fadeOutClass="'fadeOutClass'"
              :loop="false"
              :loopCount="1"
              :startDelay="1000"
              :showCursor="true"
              :contentType="'html'"
            >
              <div class="typing"></div>
            </vue-typed-js>
          </empty>
          <empty v-if="planDataList.length === 0 && numData === 1 && !loading" class="data-empty"> </empty>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import Empty from '../components/empty.vue';
import noteBox from '../components/noteBox';
import { getExpertProcessControlList, getExpertProcessData } from '@/api/smartProduct';
export default {
  props: {
    alarmInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isTimeOut: true,
      isShowAll: false,
      timeOut: null,
      expertControlId: undefined,
      factorType: '',
      pointList: [],
      planDataList: [],
      loading: false,
      numData: 1
    };
  },

  components: {
    noteBox,
    Empty,
    RadioButton: () => import('@/components/RadioButton.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  computed: {
    filterPointList() {
      return this.pointList.filter(item => this.isShowAll || item.applied);
    },
    appliedPointList() {
      return this.pointList.filter(item => item.applied);
    },
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
    conditionDesc() {
      return this.alarmInfo?.expertProcessControl?.conditionDescShow || '';
    },
    realValue() {
      return this.alarmInfo?.expertProcessControl?.advanceAlarmRealDataList || [];
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
    getAlarmName(alarm) {
      return (alarm?.[0]?.deviceName || '') + (alarm?.[0]?.pointMemo || '');
    },
    async getExpertProcessData() {
      this.loading = true;
      if (this.alarmInfo?.expertProcessControl?.id != null && this.alarmInfo.startTime && this.factorType) {
        const { resultData, status } = await getExpertProcessData(this.params);
        if (status === 'complete') {
          this.numData = this.numData + 1;
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
      this.filterPlanDataList[index].completeRender = true;
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
              <span class="name-wrap">
                <span class="status-point"></span>
                <span class="note__text-name">${note.measuresTypeName + '：'}</span>
              </span>
              <span class="note__text-content">${note.measures}</span>
              </span></div>`;
        });
        str += `<div class="note">${noteItems}</div>
           `;
      }
      return str;
    },
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
          if (!this.factorType) {
            this.factorType = this.pointList?.[0]?.factorType || '';
          }
          this.pointList.forEach(item => {
            item.value = item.factorType;
            item.label = item.factorTypeName;
          });
        }
      } else {
        this.pointList = [];
        this.factorType = '';
      }
    },
    handleApplied() {
      if (!this.isShowAll) {
        if (!this.pointList?.find(item => item.factorType === this.factorType)?.applied) {
          this.factorType = this.pointList?.find(item => item.applied)?.factorType || '';
        }
      } else if (!this.factorType) {
        this.factorType = this.pointList?.[0]?.factorType || '';
      }
    },
    toModel() {
      this.drillDown({
        path: '/expertProcessControl',
        query: {
          tab: this.alarmInfo?.expertDecisionType ?? '',
          id: this.alarmInfo?.expertProcessControl?.id ?? ''
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.radio-button {
  margin-bottom: 12px;
  /deep/ .radio-item {
    min-width: 92px !important;
  }
}
.expression {
  min-width: 100px;
}
/deep/ .point_value {
  font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #6ce8ff;
  letter-spacing: 0;
}
.solution-box {
  padding: 10px 0;
  height: 100%;
  display: flex;
  .panel {
    width: 210px;
    height: 100%;
    margin-right: 14px;
    padding: 9px 8px 12px;
    display: flex;
    flex-direction: column;
    background: url('~@/assets/img/smartForecast/panel.png') no-repeat;
    background-size: 100% 100%;
    .title {
      width: 72%;
      height: 24px;
      margin-left: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: PingFangSC-Medium, sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: #e9f1ff;
      letter-spacing: 0;
      margin-bottom: 5px;
    }
    .time {
      background: #0613278c;
      border-radius: 14px;
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      .time__icon {
        width: 15.67px;
        margin-right: 10.7px;
      }
      .time__str {
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #90b6ff;
        letter-spacing: 0;
      }
    }
    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: auto;
      padding: 2px 12px 0;
      .text {
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #e9f1ff;
        letter-spacing: 0;
        &.condition {
          margin-bottom: 20px;
        }
      }
      .name {
        margin-bottom: 6px;
      }
      .box {
        &__icon {
          width: 20px;
          margin-bottom: 6px;
        }
        .value__content {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .value__num {
            text-align: center;
            line-height: 25px;
            font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
            font-weight: 700;
            font-size: 14px;
            color: #6ce8ff;
            letter-spacing: 0;
            margin-right: 7px;
            background: url('~@/assets/img/smartForecast/underline.png') 0 24px no-repeat;
            background-size: 100% 1px;
            &:nth-last-child(1) {
              margin-right: 0px;
            }
          }
          &.real-content {
            margin-bottom: 2px;
            &:nth-last-child(1) {
              margin-bottom: 0px;
            }
          }
        }
        &.point {
          margin-top: 10px;
        }
      }
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
.action {
  position: absolute;
  top: -24px;
  z-index: 3;
  right: 16px;
}
/deep/ .point-radio {
  margin-top: 10px;
  .wpg-radio-button-wrapper:not(:first-child)::before {
    display: none;
  }
  .wpg-radio-button-wrapper:last-child {
    margin-right: 0;
  }
  .wpg-radio-button-wrapper {
    margin-bottom: 8px;
    margin-right: 8px;
    border-radius: 13px;
    padding: 5px 15px !important;
    height: 26px;
    position: relative;
    font-size: 12px;
    line-height: 16px;
    border: 1px solid transparent;
    &.wpg-radio-button-wrapper-checked {
      box-shadow: none !important;
      outline: none !important;
    }
  }
}
.control {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  .target {
    display: flex;
    align-items: center;
    margin-right: 12px;
  }
}
.solution-wrapper {
  flex: 1;
  overflow: auto;
}
.data-empty {
  position: absolute;
  left: 58%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.solution {
  width: 100%;
  &__item {
    margin-bottom: 10px;
    width: 100%;
    /deep/.card-box {
      border-radius: 4px;
      &__content {
        padding: 10px 8px 6px;
      }
    }
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
    /deep/.typing {
      width: 100%;
      .note__title {
        font-size: 14px;
        margin-bottom: 8px;
      }
      .note {
        width: 100%;
        overflow: auto;
        font-weight: 400;
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        letter-spacing: 0;
        height: 100%;
        &__text {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 12px;
          color: #aec8ef;
          line-height: 19px;
          margin-left: 6px;
          position: relative;
          top: -2px;
          display: flex;
          .name-wrap {
            white-space: nowrap;
          }
          .status-point {
            position: relative;
            top: -2px;
            display: inline-block;
            width: 4px;
            height: 4px;
            background-image: linear-gradient(180deg, #fbfffa 0%, #8be778 100%);
            box-shadow: 0 0 4px 0 #4fef15cf;
            margin-right: 6px;
          }
          &-name {
            font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #e9f1ff;
            line-height: 16px;
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
          display: flex;
          width: calc(50% - 19px);
          margin-bottom: 11px;
          &:last-child {
            margin-bottom: 0;
          }
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
          &:nth-last-child(2) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
