import panzoom from 'panzoom';
import { uuid } from '@/common/js/tool/toolsMap.js';
import { deepClone } from '@/common/js/border/util.js';
const methods = {
  init() {
    this.jsPlumb.ready(() => {
      // 导入默认配置
      this.jsPlumb.importDefaults(this.jsplumbSetting);
      this.loadEasyFlow();
      // 会使整个jsPlumb立即重绘。
      this.jsPlumb.setSuspendDrawing(false, true);
      //完成连线前的校验
      if (!this.onlyView) {
        this.jsPlumb.bind('beforeDrop', evt => {
          const sourceId = evt.sourceId;
          const targetId = evt.targetId;
          let noMore = false;
          let endMore = false;
          this.data.nodeList.forEach(item => {
            if (item.id === sourceId) {
              if (item.type === 'END') {
                endMore = true;
              } else if (item.type !== 'JUDGE') {
                let lines = this.data.lineList.map(iitem => iitem.fromNo).filter(i => i === sourceId);
                if (lines.length >= 1) {
                  noMore = true;
                } else {
                  noMore = false;
                }
              } else {
                item.data.lineObjList.push({
                  relationshipNo: uuid().generate(),
                  no: undefined,
                  dataType: 'data',
                  judgment: undefined,
                  methodValue: [],
                  judgeComponents: [],
                  id: targetId,
                  value1: '',
                  value2: ''
                });
                item.data.lineObjList.forEach((line, i) => {
                  line.indexNo = i + 1;
                  this.setLineLabel(sourceId, targetId, ''.concat(line.indexNo));
                });
                return true;
              }
            } else {
              return true;
            }
          });
          if (sourceId === targetId) {
            this.$message.error('节点不支持连接自己');
          }
          if (noMore) {
            this.$message.error('该节点不能连接多个节点');
            return false;
          }
          if (endMore) {
            this.$message.error('结束节点不能连接其他节点');
            return false;
          }

          return true;
          // let res = () => {}; //此处可以添加是否创建连接的校验， 返回 false 则不添加；
          // return res;
        });

        // 连线创建成功后，维护本地数据
        this.jsPlumb.bind('connection', evt => {
          this.addLine(evt);
        });
        //连线双击删除事件
        // this.jsPlumb.bind("dblclick", (conn) => {
        //   this.confirmDelLine(conn);
        // });
        this.jsPlumb.bind('mouseover', e => {
          if (e.targetId.indexOf('jsPlumb') === -1) {
            if (e.getOverlay(`customOverlay${e.targetId}`)) {
              e.getOverlay(`customOverlay${e.targetId}`).show();
            } else {
              e.addOverlay(
                [
                  'Custom',
                  {
                    events: {
                      click: t => {
                        this.confirmDelLine(t.component);
                      }
                    },
                    create: () => {
                      let div = document.createElement('div');
                      div.className = 'delete-overlay';
                      let icon = document.createElement('i');
                      icon.classList.add('icon', 'iconfont', 'icon-shanchu');
                      div.append(icon);
                      return div;
                    },
                    id: `customOverlay${e.targetId}`
                  }
                ],
                true
              );
              let o = e.getOverlay(`customOverlay${e.targetId}`);
              o.show();
            }

            if (this.currentNodeNo === null) {
              this.jsPlumb.getAllConnections().forEach(function (line) {
                line.setPaintStyle({
                  stroke: 'rgba(193,198,201,0.4)',
                  strokeWidth: 2
                });
              });
              e.setPaintStyle({
                stroke: '#3471ff',
                strokeWidth: 3
              });
            } else {
              e.setPaintStyle({
                stroke: '#3471ff',
                strokeWidth: 3
              });
            }
          }
        });
        this.jsPlumb.bind('mouseout', e => {
          let overlay = e.getOverlay(`customOverlay${e.targetId}`);
          if (overlay) overlay.hide();
          if (this.currentNodeNo === null) {
            this.lineColorChange(null, 'init');
          } else {
            this.lineColorChange(this.currentNodeNo, 'change');
          }
        });
        //   this.jsPlumb.bind("contextmenu", (conn, originalEvent) => {
        //     originalEvent.preventDefault();
        //     this.$contextmenu({
        //       items: [
        //         {
        //           label: "删除",
        //           disabled: false,
        //           icon: "",
        //           onClick: () => {
        //             this.confirmDelLine(conn);
        //           },
        //         },
        //       ],
        //       event,
        //       customClass: "custom-class",
        //       zIndex: 9999,
        //       minWidth: 180,
        //     });
        //   });
        // this.jsPlumb.bind("connectionDrag", () => {
        //   this.canvasClick();
        // });

        //断开连线后，维护本地数据
        this.jsPlumb.bind('connectionDetached', evt => {
          this.deleLine(evt);
        });
      }
    });
    this.initPanZoom();
  },
  canvasClick() {
    this.currentNodeNo = null;
    this.lineColorChange(null, 'init');
  },
  doClick(e) {
    let toolNode = document.querySelector('.flow-tool ');
    if (toolNode && toolNode.contains(e.target)) return;
    let nodes = document.querySelectorAll('.flow-node-item');

    let n = 0;
    if (nodes.length > 0) {
      nodes.forEach(item => {
        if (item.contains(e.target)) {
          n++;
        }
      });
      if (n > 0) {
        this.isNode = true;
      } else {
        this.isNode = false;
      }
    }
    this.isExe = false;
  },
  setLineLabel(source, target, label) {
    this.$nextTick(() => {
      let line = this.jsPlumb.getConnections({
        source,
        target
      })[0];
      if (line) {
        line.setLabel({
          label
        });
        if (label && label !== '') {
          line.addClass('flowLabel');
        } else {
          line.removeClass('flowLabel');
        }
        this.data.lineList.forEach(r => {
          if (r.fromNo == source && r.toNo == target) r.data.label = label;
        });
      }
    });
  },
  // 加载流程图
  loadEasyFlow() {
    // 初始化节点
    for (let i = 0; i < this.data.nodeList.length; i++) {
      let node = this.data.nodeList[i];
      if (!this.onlyView) {
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
      }

      // this.jsPlumb.draggable(node.id);
      this.draggableNode(node.id);
    }

    // 初始化连线
    this.jsPlumb.unbind('connection'); //取消连接事件
    for (let i = 0; i < this.data.lineList.length; i++) {
      let line = this.data.lineList[i];
      this.jsPlumb.connect(
        {
          source: line.fromNo,
          target: line.toNo,
          label: line.data && line.data.label ? line.data.label : '',
          anchors: line.anchors ? line.anchors : null,
          paintStyle: line.paintStyle ? line.paintStyle : null
        },
        this.jsplumbConnectOptions
      );
      if (line.data && line.data.label) {
        this.setLineLabel(line.fromNo, line.toNo, line.data.label);
      }
    }
  },
  draggableNode(nodeId) {
    this.jsPlumb.draggable(nodeId, {
      grid: this.commonGrid,
      drag: params => {
        if (!this.onlyView) {
          this.alignForLine(nodeId, params.pos);
        }
      },
      start: () => {
        if (this.onlyView) return false;
      },
      stop: params => {
        this.auxiliaryLine.isShowXLine = false;
        this.auxiliaryLine.isShowYLine = false;
        this.changeNodePosition(nodeId, params.pos);
      }
    });
  },
  nodeEnter(t) {
    this.moveEnterNo = t;
    this.currentNodeNo || this.lineColorChange(t, 'change');
  },
  nodeLeave() {
    this.currentNodeNo || this.lineColorChange(null, 'init');
  },
  //移动节点时，动态显示对齐线
  alignForLine(nodeId, position) {
    let showXLine = false,
      showYLine = false;
    this.data.nodeList.some(el => {
      if (el.id !== nodeId && el.data.left == position[0] + 'px') {
        this.auxiliaryLinePos.x = position[0] + 60;
        showYLine = true;
      }
      if (el.id !== nodeId && el.data.top == position[1] + 'px') {
        this.auxiliaryLinePos.y = position[1] + 20;
        showXLine = true;
      }
    });
    this.auxiliaryLine.isShowYLine = showYLine;
    this.auxiliaryLine.isShowXLine = showXLine;
  },
  lineColorChange(t, e) {
    let lines = this.jsPlumb.getAllConnections();
    'change' === e
      ? lines.forEach(function (line) {
          line.setPaintStyle({
            stroke: 'rgba(193,198,201,0.4)',
            strokeWidth: 2
          });
          line.targetId === t &&
            line.setPaintStyle({
              stroke: '#7ede85',
              strokeWidth: 3
            });
          line.sourceId === t &&
            line.setPaintStyle({
              stroke: '#3471ff',
              strokeWidth: 3
            });
        })
      : lines.forEach(function (line) {
          line.setPaintStyle({
            stroke: '#c1c6c9',
            strokeWidth: 2
          });
        });
  },
  changeNodePosition(nodeId, pos) {
    this.data.nodeList.some(v => {
      if (nodeId == v.id) {
        v.data.left = pos[0] + 'px';
        v.data.top = pos[1] + 'px';
        return true;
      } else {
        return false;
      }
    });
  },
  drag(ele, item) {
    this.currentItem = item;
  },
  drop(event) {
    const starNodes = this.data.nodeList.filter(item => item.type === 'START');
    const endNodes = this.data.nodeList.filter(item => item.type === 'END');
    if (this.currentItem.type === 'START' && starNodes.length > 0) {
      this.$message.error('开始节点已经存在');
      return false;
    }
    if (this.currentItem.type === 'END' && endNodes.length > 0) {
      this.$message.error('结束节点已经存在');
      return false;
    }
    const containerRect = this.jsPlumb.getContainer().getBoundingClientRect();
    const scale = this.getScale();
    let left = (event.pageX - containerRect.left - 60) / scale;
    let top = (event.pageY - containerRect.top - 20) / scale;
    let currentItem = deepClone(this.currentItem);
    let nodes = this.data.nodeList.filter(item => item.name.includes(currentItem.name));
    if (nodes && nodes.length > 0) {
      currentItem.name = `${currentItem.name}${nodes.length}`;
    }
    currentItem.data.top = Math.round(top / 20) * 20 + 'px';
    currentItem.data.left = Math.round(left / 20) * 20 + 'px';
    let uid = uuid().generate();
    let temp = {
      ...currentItem,
      id: uid,
      no: uid
    };
    this.addNode(temp);
  },
  addLine(line) {
    let from = line.source.id;
    let to = line.target.id;
    this.data.lineList.push({
      fromNo: from,
      toNo: to,
      data: {
        label: ''
      },

      id: uuid().generate()
    });
  },
  addOverlay(fromId) {
    let node = this.data.nodeList.find(item => item.id === fromId);
    if (node) {
      let lines = this.jsPlumb.getAllConnections();
      if (node.type === 'JUDGE') {
        let linkLines = lines.filter(item => item.target === fromId || item.sourceId === fromId);
        linkLines.forEach((line, index) => {
          line.addOverlay([
            'Label',
            {
              label: `${index + 1}`,
              location: 0.5,
              cssClass: 'flowLabel'
            }
          ]);
        });
      }
    }
  },

  confirmDelLine(line) {
    this.$confirm({
      title: '删除连线',
      content: '确认删除该连线?',
      onOk: () => {
        this.doDeleteLine(line);
      }
    });
  },
  doDeleteLine(line) {
    this.data.nodeList.forEach(item => {
      if (item.id === line.sourceId && item.type === 'JUDGE') {
        let index = item.data.lineObjList.findIndex(li => {
          return li.id === line.targetId;
        });
        if (index > -1) {
          item.data.lineObjList.splice(index, 1);
          item.data.lineObjList.forEach((iitem, idx) => {
            iitem.indexNo = idx + 1;
            this.setLineLabel(line.sourceId, iitem.id, ''.concat(item.indexNo));
          });
        }
      }
    });
    var l = this.jsPlumb.getConnections({
      source: line.sourceId,
      target: line.targetId
    })[0];
    this.jsPlumb.deleteConnection(l);
  },
  deleLine(line) {
    this.data.lineList = this.data.lineList.filter(item => {
      return item.fromNo !== line.sourceId || item.toNo !== line.targetId;
    });
  },
  // dragover默认事件就是不触发drag事件，取消默认事件后，才会触发drag事件
  allowDrop(event) {
    event.preventDefault();
  },
  getScale() {
    let scale1;
    if (this.jsPlumb.pan) {
      const { scale } = this.jsPlumb.pan.getTransform();
      scale1 = scale;
    } else {
      const matrix = window.getComputedStyle(this.jsPlumb.getContainer()).transform;
      scale1 = matrix.split(', ')[3] * 1;
    }
    this.jsPlumb.setZoom(scale1);
    return scale1;
  },
  // 添加新的节点
  addNode(temp) {
    this.data.nodeList.push(temp);
    this.$nextTick(() => {
      this.jsPlumb.makeSource(temp.id, this.jsplumbSourceOptions);
      this.jsPlumb.makeTarget(temp.id, this.jsplumbTargetOptions);
      this.draggableNode(temp.id);
    });
  },

  initPanZoom() {
    const mainContainer = this.jsPlumb.getContainer();
    const mainContainerWrap = mainContainer.parentNode;
    const pan = panzoom(mainContainer, {
      smoothScroll: false,
      bounds: true,
      // autocenter: true,
      zoomDoubleClickSpeed: 1,
      minZoom: 0.5,
      maxZoom: 2,
      initialZoom: 0.8,
      //设置滚动缩放的组合键，默认不需要组合键
      beforeWheel: e => {
        console.log(e);
        // let shouldIgnore = !e.ctrlKey
        // return shouldIgnore
      },
      beforeMouseDown: function (e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = e.ctrlKey;
        return shouldIgnore;
      }
    });
    // pan.zoomTo(1200, 600, 1);
    this.jsPlumb.mainContainerWrap = mainContainerWrap;
    this.jsPlumb.pan = pan;
    // 缩放时设置jsPlumb的缩放比率
    pan.on('zoom', e => {
      const { x, y, scale } = e.getTransform();
      this.jsPlumb.setZoom(scale);
      //根据缩放比例，缩放对齐辅助线长度和位置
      this.auxiliaryLinePos.width = (1 / scale) * 100 + '%';
      this.auxiliaryLinePos.height = (1 / scale) * 100 + '%';
      this.auxiliaryLinePos.offsetX = -(x / scale);
      this.auxiliaryLinePos.offsetY = -(y / scale);
    });
    pan.on('panend', e => {
      const { x, y, scale } = e.getTransform();
      this.auxiliaryLinePos.width = (1 / scale) * 100 + '%';
      this.auxiliaryLinePos.height = (1 / scale) * 100 + '%';
      this.auxiliaryLinePos.offsetX = -(x / scale);
      this.auxiliaryLinePos.offsetY = -(y / scale);
    });

    // 平移时设置鼠标样式
    mainContainerWrap.style.cursor = 'grab';
    mainContainerWrap.addEventListener('mousedown', function wrapMousedown() {
      this.style.cursor = 'grabbing';
      mainContainerWrap.addEventListener('mouseout', function wrapMouseout() {
        this.style.cursor = 'grab';
      });
    });
    mainContainerWrap.addEventListener('mouseup', function wrapMouseup() {
      this.style.cursor = 'grab';
    });
  },

  setNodeName(nodeId, name) {
    this.data.nodeList.some(v => {
      if (v.id === nodeId) {
        v.name = name;
        return true;
      } else {
        return false;
      }
    });
  },

  //删除节点
  deleteNode(node) {
    let _this = this;
    this.$confirm({
      title: '删除节点',
      content: `确定要删除节点${node.name}?`,
      onOk: () => {
        _this.confirmDeleteNode(node);
      }
    });
  },
  confirmDeleteNode(node) {
    this.data.nodeList.forEach(item => {
      if (item.type === 'JUDGE') {
        let index = item.data.lineObjList.findIndex(i => {
          return i.id === node.id;
        });
        if (index > -1) {
          item.data.lineObjList.splice(index, 1);
          item.data.lineObjList.forEach((line, idx) => {
            line.indexNo = idx + 1;
            this.setLineLabel(item.id, line.id, ''.concat(line.indexNo));
          });
        }
      }
    });
    this.data.nodeList = this.data.nodeList.filter(item => item.id !== node.id);
    this.$nextTick(() => {
      this.jsPlumb.removeAllEndpoints(node.id);
    });
  },
  //更改连线状态
  changeLineState(no, val) {
    // let lines = this.jsPlumb.getAllConnections();
    // lines.forEach((line) => {
    //   if (line.targetId === nodeId || line.sourceId === nodeId) {
    //     // if (val) {
    //     //   line.canvas.classList.add("active");
    //     // } else {
    //     //   line.canvas.classList.remove("active");
    //     // }
    //   }
    // });
    if (val) {
      this.lineColorChange(no, 'change');
    } else {
      this.currentNodeNo = null;
      this.lineColorChange(null, 'init');
    }
  },

  //初始化节点位置  （以便对齐,居中）
  fixNodesPosition() {
    if (this.data.nodeList && this.$refs.flowWrap) {
      const nodeWidth = 180;
      const nodeHeight = 40;
      let wrapInfo = this.$refs.flowWrap.getBoundingClientRect();
      let maxLeft = 0,
        minLeft = wrapInfo.width,
        maxTop = 0,
        minTop = wrapInfo.height;
      let nodePoint = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      let fixTop = 0,
        fixLeft = 0;
      this.data.nodeList.forEach(el => {
        let top = Number(el.data.top.substring(0, el.data.top.length - 2));
        let left = Number(el.data.left.substring(0, el.data.left.length - 2));
        maxLeft = left > maxLeft ? left : maxLeft;
        minLeft = left < minLeft ? left : minLeft;
        maxTop = top > maxTop ? top : maxTop;
        minTop = top < minTop ? top : minTop;
      });
      nodePoint.left = minLeft;
      nodePoint.right = wrapInfo.width - maxLeft - nodeWidth;
      nodePoint.top = minTop;
      nodePoint.bottom = wrapInfo.height - maxTop - nodeHeight;
      fixTop = nodePoint.top !== nodePoint.bottom ? (nodePoint.bottom - nodePoint.top) / 2 : 0;
      fixLeft = nodePoint.left !== nodePoint.right ? (nodePoint.right - nodePoint.left) / 2 : 0;

      this.data.nodeList.map(el => {
        let top = Number(el.data.top.substring(0, el.data.top.length - 2)) + fixTop;
        let left = Number(el.data.left.substring(0, el.data.left.length - 2)) + fixLeft;
        el.data.top = Math.round(top / 20) * 20 + 100 + 'px';
        el.data.left = Math.round(left / 20) * 20 + 100 + 'px';
      });
    }
  },
  doSelection() {}
};

export default methods;
