<template>
  <div
    class="flow-node-item"
    ref="node"
    :class="[isActive || isSelected ? 'active' : '']"
    :style="flowNodeContainer"
    @click="setActive"
    @mouseenter="showAnchor"
    @mouseleave="hideAnchor"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div class="head-title">
      <div class="log-wrap">
        <img :src="icons[node.type]" alt="" />
      </div>
      <div class="nodeName">{{ node.name }}</div>
      <div v-if="flowNodeExecute">
        <div v-if="!flowNodeExecute.state">
          <a-popover v-if="flowNodeExecute.executeStatus !== null" placement="rightTop">
            <template slot="content" v-if="node.type !== 'END'">
              <div class="head">变量执行结果</div>
              <div class="table">
                <a-table :dataSource="flowNodeExecute.executeLogs" :pagination="false">
                  <a-table-column title="变量名称" width="150px" ellipsis dataIndex="varName"></a-table-column>
                  <a-table-column title="变量结果" width="150px" ellipsis dataIndex="result"></a-table-column>
                  <!-- <a-table-column title="异常信息"></a-table-column> -->
                </a-table>
              </div>
              <div class="head">关系式执行日志</div>
              <div class="table">
                <a-table :dataSource="flowNodeExecute.relationLogs" :pagination="false">
                  <a-table-column title="名称" dataIndex="label"></a-table-column>
                  <a-table-column title="执行结果" dataIndex="result">
                    <template slot-scope="text">{{ text ? 'true' : 'false' }}</template>
                  </a-table-column>
                </a-table>
              </div>
            </template>
            <template slot="content" v-else>
              <div class="head">输出结果</div>
            </template>
            <a-icon type="exclamation-circle" v-if="!flowNodeExecute.executeStatus" class="node-warning"></a-icon>
            <a-icon type="check-circle" v-else class="node-success"></a-icon>
          </a-popover>
        </div>
        <a-popover v-else>
          <template slot="content">
            <div class="head">配置不完整</div>
          </template>
          <a-icon type="exclamation-circle" v-show="flowNodeExecute.state === 'warning'" class="node-warning"></a-icon>
        </a-popover>
      </div>
    </div>
    <div class="rule-desc" v-if="node.descs && (node.type !== 'START' || node.type !== 'END')">
      <ul>
        <li v-for="(desc, index) in node.descs" :key="index">{{ desc }}</li>
      </ul>
    </div>
    <!--连线用--//触发连线的区域-->
    <!-- <div class="node-anchor anchor-top" v-show="mouseEnter"></div> -->
    <div class="node-anchor anchor-right" v-show="mouseEnter"></div>
    <!-- <div class="node-anchor anchor-bottom" v-show="mouseEnter"></div>
    <div class="node-anchor anchor-left" v-show="mouseEnter"></div> -->
    <div class="flow-node-item-toolbar" v-show="node.id === currentNodeId">
      <div class="tool-box">
        <div class="tool-item" @click="doDelete($event)"><i class="icon iconfont icon-shanchu"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
import { icons } from './config/commonConfig';
export default {
  name: 'nodeItem',
  props: {
    node: Object,
    nodeExecuteInfo: Array,
    onlyView: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 节点容器样式
    flowNodeContainer: {
      get() {
        return {
          top: this.node.data.top,
          left: this.node.data.left
        };
      }
    },
    flowNodeExecute: {
      get() {
        return this.nodeExecuteInfo.find(i => i.id === this.node.id);
      }
    }
  },
  mounted() {},
  deactivated() {
    document.removeEventListener('click', e => {
      console.log(e);
    });
  },
  data() {
    return {
      mouseEnter: false,
      isActive: false,
      isSelected: false,
      dragFlag: false,
      x1: null,
      x2: null,
      y1: null,
      y2: null,
      currentNodeId: '',
      icons
    };
  },
  methods: {
    showAnchor(e) {
      if (!this.onlyView) {
        this.mouseEnter = true;
        this.$emit('nodeEnter', this.node.no);
        this.currentNodeId = e.target.id;
      }
    },
    hideAnchor() {
      if (!this.onlyView) {
        this.$emit('nodeLeave');
        this.mouseEnter = false;
        this.currentNodeId = '';
      }
    },
    doDelete(event) {
      let e = event || window.event;
      e.stopPropagation();
      this.$emit('deleteNode', this.node);
    },
    setActive() {
      if (window.event.ctrlKey) {
        this.isSelected = !this.isSelected;
        return false;
      }
      if (!this.dragFlag) return false;
      this.isActive = true;
      this.isSelected = false;

      setTimeout(() => {
        this.$emit('changeLineState', this.node.no, true);
        this.$emit('getNode', this.node);
      }, 0);
    },
    setNotActive(evt) {
      let targerArea = document.querySelector('.ruleConfig .wpg-drawer-content-wrapper');
      if (targerArea && targerArea.contains(evt.target) && !this.dragFlag) return;
      if (!window.event.ctrlKey) {
        this.isSelected = false;
      }
      if (!this.isActive) {
        return;
      }
      this.$emit('changeLineState', this.node.no, false);
      this.isActive = false;
    },
    editNode() {
      this.newNodeName = this.node.name;
      this.$Modal.confirm({
        render: h => {
          return h('Input', {
            props: {
              value: this.newNodeName,
              autofocus: true
            },
            on: {
              input: val => {
                this.newNodeName = val;
              }
            }
          });
        },
        onOk: () => {
          this.$emit('setNodeName', this.node.id, this.newNodeName);
        }
      });
    },
    handleMouseDown(e) {
      this.x1 = e.clientX;
      this.y1 = e.clientY;
    },
    handleMouseUp(e) {
      this.x2 = e.clientX;
      this.y2 = e.clientY;
      const _val = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1));
      console.log(_val);
      //判断
      if (_val >= 0 && _val <= 2) {
        this.dragFlag = true;
      } else {
        this.dragFlag = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@labelColor: #409eff;
@nodeSize: 12px;
@viewSize: 10px;
.flow-node-item {
  position: absolute;
  // display: flex;
  height: auto;
  min-width: 180px;
  max-width: 300px;
  justify-content: center;
  align-items: center;
  border: 1px solid #acafb3;
  border-radius: 6px;
  cursor: move;
  box-sizing: content-box;
  z-index: 9995;
  &:hover {
    z-index: 9998;
    .delete-btn {
      display: block;
    }
  }
  .head-title {
    display: flex;
    height: 32px;
    line-height: 22px;
    padding: 4px 8px;

    .log-wrap {
      width: 32px;
      height: 32px;
    }
    .nodeName {
      flex-grow: 1;
      width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #ffffff;
    }
  }
  .rule-desc {
    border-top: 1px solid #acafb3;
    background: #f1f6fa;
    margin-bottom: 3px;
    li {
      padding: 4px 8px;
      border-bottom: 1px solid #acafb3;
      &:last-child {
        border: none;
      }
    }
  }
  .node-anchor {
    display: flex;
    position: absolute;
    width: @nodeSize;
    height: @nodeSize;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    cursor: crosshair;
    z-index: 9999;
    // background: -webkit-radial-gradient(sandybrown 10%, white 30%, #9a54ff 60%);
    border: 1px solid #409eff;
  }
  .anchor-top {
    top: calc((@nodeSize / 2) * -1);
    left: 50%;
    margin-left: calc((@nodeSize / 2) * -1);
  }
  .anchor-right {
    top: 50%;
    right: calc((@nodeSize / 2) * -1);
    margin-top: calc((@nodeSize / 2) * -1);
  }
  .anchor-bottom {
    bottom: calc((@nodeSize / 2) * -1);
    left: 50%;
    margin-left: calc((@nodeSize / 2) * -1);
  }
  .anchor-left {
    top: 50%;
    left: calc((@nodeSize / 2) * -1);
    margin-top: calc((@nodeSize / 2) * -1);
  }
  &-toolbar {
    position: absolute;
    right: 0;
    top: -36px;
    cursor: default;
    padding-bottom: 4px;
    .tool-box {
      display: flex;
      align-items: center;
      .tool-item {
        display: block;
        padding: 5px;
        background-color: #409eff;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        color: #fff;
      }
      .link {
        margin-left: 8px;
      }
    }
  }
}
.active {
  border: 1px solid @labelColor;
  box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.5);
}
.node-success {
  color: #84cf65;
}
.node-warning {
  color: #e6a23c;
}
.head {
  padding: 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #222;
}
</style>
