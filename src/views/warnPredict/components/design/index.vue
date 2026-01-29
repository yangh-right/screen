<template>
  <div class="rule-fl-con flow_region">
    <div class="nodes-wrap" v-if="!onlyView">
      <div v-for="(item, index) in nodeTypeList" :key="index">
        <div class="category">{{ item.category }}</div>
        <div v-for="node in item.list" :key="node.type" class="node" draggable="true" @dragstart="drag($event, node)">
          <div class="log">
            <img :src="icons[node.type]" alt="" />
          </div>
          <div class="name">{{ node.typeName }}</div>
        </div>
      </div>
    </div>
    <div
      id="flowWrap"
      ref="flowWrap"
      class="flow-wrap"
      @drop="drop($event)"
      @dragover="allowDrop($event)"
      @click="doClick"
    >
      <div id="flow">
        <div
          v-show="auxiliaryLine.isShowXLine"
          class="auxiliary-line-x"
          :style="{
            width: auxiliaryLinePos.width,
            top: auxiliaryLinePos.y + 'px',
            left: auxiliaryLinePos.offsetX + 'px'
          }"
        ></div>
        <div
          v-show="auxiliaryLine.isShowYLine"
          class="auxiliary-line-y"
          :style="{
            height: auxiliaryLinePos.height,
            left: auxiliaryLinePos.x + 'px',
            top: auxiliaryLinePos.offsetY + 'px'
          }"
        ></div>
        <flowNode
          v-for="item in data.nodeList"
          :id="item.id"
          :key="item.id"
          :node="item"
          :onlyView="onlyView"
          :nodeExecuteInfo="nodeExecuteInfo"
          @setNodeName="setNodeName"
          @deleteNode="deleteNode"
          @changeLineState="changeLineState"
          @getNode="getCurrentNode"
          @nodeEnter="nodeEnter"
          @nodeLeave="nodeLeave"
        ></flowNode>
      </div>
      <div class="flow-tool"></div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/common/js/border/util.js';
import { uuid } from '@/common/js/tool/toolsMap.js';
import { nodeTypeList, nodeData } from './config/init';
import { getDetaiById } from '@/api/warnPredict';

import {
  jsplumbSetting,
  jsplumbConnectOptions,
  jsplumbSourceOptions,
  jsplumbTargetOptions
} from './config/commonConfig';
import methods from './config/methods';
import flowNode from './node-item';
import { icons } from './config/commonConfig';
export default {
  name: 'FlowEdit',
  components: {
    flowNode
  },
  props: {
    onlyView: {
      type: Boolean,
      default: false
    },
    flowId: {
      type: String,
      default: ''
    },
    flowData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      jsPlumb: null,
      currentItem: null,
      nodeTypeList,
      nodeTypeObj: {},
      data: {
        nodeList: [],
        lineList: []
      },
      icons,
      selectedList: [],
      jsplumbSetting,
      jsplumbConnectOptions,
      jsplumbSourceOptions,
      jsplumbTargetOptions,
      auxiliaryLine: { isShowXLine: false, isShowYLine: false }, //对齐辅助线是否显示
      auxiliaryLinePos: {
        width: '100%',
        height: '100%',
        offsetX: 0,
        offsetY: 0,
        x: 20,
        y: 20
      },
      commonGrid: [5, 5], //节点移动最小距离
      selectModuleFlag: false, //多选标识
      rectAngle: {
        px: '', //多选框绘制时的起始点横坐标
        py: '', //多选框绘制时的起始点纵坐标
        left: 0,
        top: 0,
        height: 0,
        width: 0
      },
      currentNode: null,
      showRuleConfig: false,
      isNode: false,
      dFlowInfo: null,
      currentNodeNo: null,
      moveEnterNo: '',
      coverType: true,
      isExe: false,
      executeParam: [],
      nodeExecuteInfo: [],
      loading: false
    };
  },
  activated() {
    if (this.jsPlumb) {
      this.resetData();
    }
    this.initInstance();
    this.showRuleConfig = false;
  },
  deactivated() {
    this.showRuleConfig = false;
    this.jsPlumb.cleanupListeners();
    this.jsPlumb.reset();
    if (typeof document.onselectstart != 'undefined') {
      document.onselectstart = () => {
        return true;
      };
    } else {
      document.onmousedown = () => {
        return true;
      };
      document.onmouseup = () => {
        return true;
      };
    }
  },
  beforeDestroy() {
    this.resetData();
  },
  mounted() {
    if (this.onlyView) {
      this.initInstance();
    }
  },
  methods: {
    async initInstance() {
      if (!this.jsPlumb) {
        // eslint-disable-next-line no-undef
        this.jsPlumb = jsPlumb.getInstance();
      }
      this.initNodeTypeObj();
      this.loading = true;
      try {
        if (this.flowData) {
          this.dFlowInfo = this.flowData;
          this.initNode(this.dFlowInfo);
        } else {
          let id = this.onlyView ? this.flowId : this.$route.query.id;
          let res = await getDetaiById(id);

          if (res.status === 'complete') {
            this.dFlowInfo = res.resultData;
            this.initNode(this.dFlowInfo ? this.dFlowInfo.ruleFlowInfo : null);
          }
        }

        this.fixNodesPosition();
        this.$nextTick(() => {
          this.init();
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    resetData() {
      this.data.nodeList = [];
      this.data.lineList = [];
    },
    ...methods,
    initNodeTypeObj() {
      let nodeList = this.getAllNode();
      nodeList.map(v => {
        this.nodeTypeObj[v.type] = v;
      });
    },
    confirmLeave(e) {
      this.$confirm({
        title: '是否确定离开规则流设计界面',
        content: '离开之后当前编辑的内容不做保存?',
        onCancel: () => {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    },
    getAllNode() {
      let nodeList = [];
      nodeTypeList.forEach(item => {
        nodeList = [...nodeList, ...item.list];
      });
      return nodeList;
    },
    initNode(ruleFlowInfo) {
      if (ruleFlowInfo) {
        this.data.nodeList = ruleFlowInfo.nodeList;
        this.data.lineList = ruleFlowInfo.lineList;
        this.coverType = ruleFlowInfo.coverType;
      } else {
        this.initFirstNode();
        this.coverType = true;
      }
    },
    initFirstNode() {
      let nodes = [];
      let nData = deepClone(nodeData);
      nData.top = '200px';
      nData.left = '200px';
      nodes.push({
        id: uuid().generate(),
        no: uuid().generate(),
        type: 'START',
        typeName: '开始',
        name: '开始',
        data: {
          ...nData
        }
      });
      const random = Math.floor(Math.random() * 10 + 1);
      const uid = (Number(uuid().generate()) + random).toString();
      nodes.push({
        id: uid,
        no: uid,
        type: 'END',
        typeName: '结束',
        name: '结束',
        data: {
          ...nData,
          left: '600px',
          resultSetting: [
            {
              key: 'alarmFlag',
              value: undefined,
              type: 'node',
              remark: ''
            }
          ]
        }
      });
      this.data.nodeList = nodes;
      this.data.lineList = [];
    },
    getCurrentNode(data) {
      this.showRuleConfig = true;
      this.currentNode = data;
      this.isNode = true;
      this.currentNodeNo = data.no;
    },
    getContrastValues(t) {
      var e = '';
      return (
        'var' === t.dataType &&
          ['between', 'noBetween'].indexOf(t.judgment) > -1 &&
          (e = '${@var:' + t.value1 + '},${@var:' + t.value2 + '}'),
        'data' === t.dataType && ['between', 'noBetween'].indexOf(t.judgment) > -1 && (e = t.value1 + ',' + t.value2),
        'var' === t.dataType && -1 === ['between', 'noBetween'].indexOf(t.judgment) && (e = '${@var:' + t.value1 + '}'),
        'data' === t.dataType && -1 === ['between', 'noBetween'].indexOf(t.judgment) && (e = t.value1),
        'data' === t.dataType &&
          ['in', 'nin', 'likeIn', 'NotLikeIn'].indexOf(t.judgment) > -1 &&
          (e = t.methodValue.join()),
        'var' === t.dataType &&
          ['in', 'nin', 'likeIn', 'NotLikeIn'].indexOf(t.judgment) > -1 &&
          (e = t.methodValue.join()),
        e
      );
    },
    // 构造节点相关参数
    makeParam() {
      if (this.data) {
        this.data.nodeList.forEach(item => {
          if (item.type === 'JUDGE') {
            // 条件分支节点处理
            item.data.nodeVariable.forEach(v => {
              v.judgeComponents = [];
            });
            item.data.nodeData = {
              nodeId: item.data.id
            };
            let node = item.data.lineObjList.map(n => {
              return {
                relationshipNo: n.relationshipNo,
                no: n.no,
                judgment: n.judgment,
                contrastValues: this.getContrastValues(n),
                nextNodeNo: n.id
              };
            });
            item.data.nodeTwigs = node;
            node.forEach(t => {
              item.data.nodeVariable.forEach(e => {
                if (e.no === t.no) {
                  e.judgeComponents.push({
                    judgment: t.judgment,
                    contrastValues: t.contrastValues,
                    nextNodeNo: t.nextNodeNo
                  });
                }
              });
            });
            //todo
          } else if (item.type === 'RULES') {
            // 规则节点的数据处理
            let allParamObjList = [];
            item.data.paramObjList.forEach(p => {
              if (p.list.length > 0) {
                p.list.forEach(s => {
                  allParamObjList.push(s);
                });
              }
            });
            let node = allParamObjList.map(n => {
              return {
                relationshipNo: n.relationshipNo,
                no: n.no,
                judgment: n.judgment,
                contrastValues: this.getContrastValues(n)
              };
            });
            item.data.nodeTwigs = node;
            item.data.nodeVariable.forEach(t => {
              let index = node.findIndex(n => {
                return n.no === t.no;
              });
              if (index > -1) {
                t.no = node[index].no;
                t.judgment = node[index].judgment;
                t.contrastValues = node[index].contrastValues;
              }
            });
            this.$forceUpdate();
          } else if (item.type === 'ASSIGNMENT') {
            let allParamObjList = [];
            item.data.paramObjList.forEach(p => {
              if (p.list.length > 0) {
                p.list.forEach(s => {
                  allParamObjList.push(s);
                });
              }
            });
            let node = allParamObjList.map(function (t) {
              return {
                relationshipNo: t.relationshipNo,
                no: t.no,
                replaceValue: t.dataType === 'data' ? t.value1 : '${@var:' + t.value1 + '}'
              };
            });
            item.data.nodeTwigs = node;
            item.data.nodeVariable.forEach(t => {
              let index = node.findIndex(n => {
                return n.no === t.no;
              });
              if (index > -1) {
                t['name'] = item.data.nodeVariable[index].name;
              }
            });
            this.$forceUpdate();
          } else if (item.type === 'VARIABLE') {
            // 变量节点的数据处理
            let node = item.data.lineObjList.map(n => {
              return {
                relationshipNo: n.relationshipNo,
                no: n.no,
                operator: n.operator,
                calculateValue: this.getContrastValues(n)
              };
            });
            let source;
            if (node && node.length > 0) {
              source = {
                sourceValue: '${@var:' + node[0].no + '}',
                operator: node[0].operator,
                calculateValue: node[0].calculateValue
              };
            } else {
              source = {
                sourceValue: '',
                operator: '',
                calculateValue: ''
              };
            }
            item.data.nodeTwigs = node;
            item.data.nodeData = {
              nodeId: item.data.id,
              expandData: source
            };
            item.data.nodeVariable.forEach(t => {
              let index = node.findIndex(i => {
                return i.no === t.no;
              });
              if (index > -1) {
                t.sourceValue = node[index].no;
                t.operator = node[index].operator;
                t.calculateValue = node[index].calculateValue;
              }
            });
          } else if (item.type === 'SCORE') {
            let expandData = {
              weightStatus: item.data.nodeData.expandData.summationMethod === 'weight',
              summationMethod: item.data.nodeData.expandData.summationMethod
            };
            item.data.nodeData = {
              nodeId: item.data.id,
              expandData
            };
            item.data.nodeVariable.forEach(v => {
              if (item.data.nodeData.expandData.summationMethod === 'fractions') {
                v.weight = null;
              }
              if (v.scorecardsMethod === 'gather') {
                v.scorecardsSettings.forEach(score => {
                  if (score.presetSettings !== 'contrarilyValue') score.presetSettings = this.getPresetSettings(score);
                });
              }
            });
            item.data.nodeTwigs = item.data.nodeVariable;
          }
        });
      }
    },
    getPresetSettings(score) {
      let left;
      let right;
      if (score.rangeType === '1' || score.rangeType === '4') {
        left = '[';
      }
      if (score.rangeType === '2' || score.rangeType === '3') {
        left = '(';
      }
      if (score.rangeType === '1' || score.rangeType === '3') {
        right = ']';
      }
      if (score.rangeType === '2' || score.rangeType === '4') {
        right = ')';
      }

      return `${left}${score.value1 ? score.value1 : ''}${score.value2 ? score.value2 : ''}${right}`;
    }
  }
};
</script>

<style lang="less" scoped>
@import '~@/common/style/color.less';

.flow_region {
  display: flex;
  width: 100%;
  height: 100%;
  // background: #f4f7f9;
  [data-wpg-theme='dark'] & {
    background-color: @black-bg;
  }

  /deep/ .delete-overlay {
    display: block;
    padding: 5px;
    background-color: #409eff;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    color: #fff;
  }

  .nodes-wrap {
    width: 200px;
    height: 100%;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    opacity: 0.8;
    border-radius: 4px;

    .category {
      margin: 20px;
      font-weight: 700;
      color: #333333;

      [data-wpg-theme='dark'] & {
        color: #fff;
      }
    }

    .node {
      display: flex;
      height: 36px;
      width: 80%;
      margin: 5px auto;
      border: 1px dashed #d6d6d6;
      [data-wpg-theme='dark'] & {
        border: 1px dashed @black-border;
      }
      line-height: 26px;

      padding: 5px;
      border-radius: 5px;
      padding-left: 8px;

      &:hover {
        cursor: move;
        background-color: #f1f6fd;
        border: 1px dashed #4285f4;
        border-left: 4px solid #4285f4;
        [data-wpg-theme='dark'] & {
          background-color: #181c24;
          border: 1px dashed @black-border;
          border-left: 4px solid @black-border;
        }
        [data-wpg-theme='green'] & {
          background-color: #f1f6fd;
          border: 1px dashed @green-border;
          border-left: 4px solid @green-border;
        }
        [data-wpg-theme='red'] & {
          background-color: #f1f6fd;
          border: 1px dashed @red-border;
          border-left: 4px solid @red-border;
        }
        padding-left: 5px;
      }

      &:active {
        cursor: grabbing;
      }

      .log {
        width: 26px;
        height: 26px;
      }

      .name {
        width: 0;
        flex-grow: 1;
        font-size: 14px;
        font-weight: bold;
        font-family: MiSans-Demibold, sans-serif;

        margin-left: 6px;
      }
    }
  }

  .flow-wrap {
    height: 100%;
    position: relative;
    overflow: hidden;
    outline: none !important;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    #flow {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      /deep/ .jtk-overlay.flowLabel:not(.aLabel, .delete-overlay) {
        background-color: #fff;
        font-size: 12px;
        color: #3471ff !important;
        border: 1px solid #3471ff;
        height: 18px;
        line-height: 18px;
        text-align: center;
        width: 18px;
        border-radius: 9px;
      }

      .auxiliary-line-x {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
        z-index: 9999;
      }

      .auxiliary-line-y {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
        z-index: 9999;
      }
    }
  }
}
</style>
<style lang="less">
.jtk-connector.active {
  z-index: 9999;

  path {
    stroke: #150042;
    stroke-width: 1.5;
    animation: ring;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    stroke-dasharray: 5;
  }
}

@keyframes ring {
  from {
    stroke-dashoffset: 50;
  }

  to {
    stroke-dashoffset: 0;
  }
}

.wpg-drawer-mask {
  opacity: 0 !important;
}
</style>
