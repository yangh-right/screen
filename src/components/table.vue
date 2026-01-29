
<script>
/* eslint-disable */
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 800
    },
    tableConfigs: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isShow: {
      type: Boolean,
      default: true
    },
    rowHeight: {
      type: Number,
      default: 40
    },
    needAutoScroll: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      innerTableData: [],
      stopDoNextScroll: false,
      animateTimer: null,
      scrollTimer: null,
      index: 0,
      extraIndex: -1,
      inited: false
    };
  },
  watch: {
    loading() {
      if (!this.needAutoScroll) return;
      if (!this.loading) {
        if (this.isShow) {
          this.$nextTick(this.init);
        }
      } else {
        this.inited = false;
        clearTimeout(this.scrollTimer);
        clearInterval(this.animateTimer);
      }
    },
    tableData: {
      handler() {
        this.innerTableData = [...this.tableData];
      },
      immediate: true
    },
    isShow() {
      if (this.isShow) {
        if (this.inited) {
          this.scrollTimer = setTimeout(this.scroll, this.interval);
        } else if (!this.loading) {
          this.init();
        }
      } else {
        clearTimeout(this.scrollTimer);
      }
    }
  },
  mounted() {
    if (this.needAutoScroll) {
      if (!this.loading && this.isShow) {
        this.init();
      }
    }
  },
  beforeDestroy() {
    if (!this.needAutoScroll) return;
    clearInterval(this.animateTimer);
    clearTimeout(this.scrollTimer);
  },
  methods: {
    mousewheel(e) {
      if (!this.needAutoScroll) return;
      e.preventDefault();
    },
    mouseenter() {
      if (!this.needAutoScroll) return;
      this.stopDoNextScroll = true;
      clearTimeout(this.scrollTimer);
    },
    mouseleave() {
      if (!this.needAutoScroll) return;
      this.stopDoNextScroll = false;
      if (this.loading) return;
      this.scrollTimer = setTimeout(this.scroll, this.interval);
    },
    init() {
      if (this.$refs.$table_body_wrapper) this.$refs.$table_body_wrapper.scrollTop = 0
      if (this.tableData.length === 0) return;
      if (
        this.$refs.$table_body_wrapper.clientHeight >=
        this.$refs.$tbody.clientHeight
      ) {
        return;
      }
      this.inited = true;
      const container = this.$refs.$table_body_wrapper;
      const extra = Math.ceil(container.clientHeight / this.rowHeight);

      this.extraIndex = this.tableData.length;
      for (let i = 0; i < extra; i++) {
        this.innerTableData.push(this.tableData[i]);
      }
      this.scrollTimer = setTimeout(this.scroll, this.interval);
    },
    doScroll(offset, duration) {
      return new Promise(resolve => {
        const n = Math.ceil(duration / 100);
        let i = 0;
        const stepLenght = offset / n;
        const prevScrollTop = this.$refs.$table_body_wrapper.scrollTop;
        clearInterval(this.animateTimer);
        this.animateTimer = setInterval(() => {
          i++;
          this.$refs.$table_body_wrapper.scrollTop =
            prevScrollTop + Math.floor(i * stepLenght);
          if (i === n) {
            clearInterval(this.animateTimer);
            resolve();
          }
        }, 100);
      });
    },
    scroll() {
      if (
        this.$refs.$table_body_wrapper.clientHeight >=
        this.$refs.$tbody.clientHeight
      ) {
        return;
      }
      this.doScroll(this.rowHeight, this.interval).then(() => {
        this.index++;
        this.$emit('scrollIndex', this.index); // 当前滚动到的数据位置
        if (this.index === this.extraIndex) {
          this.index = 0;
          this.$refs.$table_body_wrapper.scrollTop = 0;
        }
        if (this.stopDoNextScroll) return;
        this.scrollTimer = setTimeout(this.scroll, this.interval);
      });
    },
    renderContent() {
      // const h = this.$createElement
      if (this.loading) {
        return (
          <div class="loading">
            <i></i>加载中...
          </div>
        );
      }
      if (this.tableData.length === 0) {
        return <div class="no-data">暂无数据</div>;
      }
      return (
        <div
          ref="$table_body_wrapper"
          class="table-body__wrapper"
          onMousewheel={this.mousewheel}
          onMouseenter={this.mouseenter}
          onMouseleave={this.mouseleave}
        >
          <table ref="$tbody">
            <tbody>
              {this.innerTableData.map((row, rowIndex) => {
                return (
                  <tr
                    style={{ height: this.rowHeight + "px" }}
                    key={row.id || rowIndex}
                  >
                    {this.tableConfigs.map(config => (
                      <td
                        key={config.prop}
                        style={{
                          width: config.width
                            ? typeof config.width === "number"
                              ? config.width + "px"
                              : config.width
                            : "",
                          ...config.cellStyle
                        }}
                      >
                        <div class="div-cell">
                          {config.render
                            ? config.render(row[config.prop], row, rowIndex)
                            : row[config.prop]}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
  },
  render() {
    return (
      <div class="table-wrapper">
        <div class="table">
          <div class="table-header__wrapper">
            <table>
              <thead>
                <tr
                  style={{
                    height: this.rowHeight + "px",
                    borderBottom:
                      !this.loading && this.tableData.length === 0
                        ? "1px solid #009bee66"
                        : ""
                  }}
                >
                  {this.tableConfigs.map(config => (
                    <th
                      key={config.prop}
                      style={{
                        width: config.width
                          ? typeof config.width === "number"
                            ? config.width + "px"
                            : config.width
                          : "",
                        ...(config.headStyle || config.cellStyle)
                      }}
                    >
                      {config.renderHead ? config.renderHead() : config.label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          {this.renderContent()}
        </div>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.table-wrapper {
  // background-color: #012458;
  background-color: transparent;
}
.table {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    td,
    th {
      text-align: center;
      // color: #9fc9ff;
      // font-size: 14px;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: -0.29px;
      padding-left: 4px;
      padding-right: 4px;
      font-weight: normal;
      vertical-align: middle;
    }
    td {
      border-top: 1px solid #009bee66;
    }
  }
  .div-cell {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loading {
    text-align: center;
    color: #9fc9ff;
    font-size: 14px;
    > * {
      vertical-align: middle;
    }
    i {
      display: inline-block;
      height: 10px;
      width: 10px;
      border: 2px solid;
      box-sizing: border-box;
      border-radius: 50%;
      border-right-color: transparent;
      margin-right: 8px;
      animation: loading_indication 1000ms linear infinite both;
    }
  }
  .no-data {
    color: #9fc9ff;
    font-size: 14px;
    text-align: center;
    padding: 8px 0;
    letter-spacing: 1px;
  }
}
.table-header__wrapper {
  background-color: #00496A;
  flex: 0 0 auto;
  overflow-x: hidden;
  overflow-y: scroll;
  margin-right: -17px;
}
.table-body__wrapper {
  overflow-x: hidden;
  overflow-y: scroll;
  flex: 1 1 auto;
  min-height: 0;
  margin-right: -17px;
}
</style>

<style>
@keyframes loading_indication {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
