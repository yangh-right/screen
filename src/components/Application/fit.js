// 屏幕适配 mixin 函数

// * 默认缩放值
const scale = {
  width: '1',
  height: '1'
};

// * 设计稿尺寸（px）
const baseWidth = 1920;
const baseHeight = 1200;

// * 需保持的比例（默认1.77778）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5));

const ignores = {
  DvBaiduMap: {
    dom: '.bdMap',
    width: baseWidth,
    height: baseHeight
  },
  DvMapPopup: {
    dom: '.bmap-popup',
    revert: true
  }
};

const autofit = root => {
  const ignoreStyle = document.createElement('style');
  ignoreStyle.lang = 'text/css';
  ignoreStyle.id = 'ignoreStyle';

  root.appendChild(ignoreStyle);
};

function ignore(scale) {
  for (const key in ignores) {
    const item = ignores[key];
    const itemEl = item.el || item.dom;
    if (!itemEl) {
      console.error(`bad selector: ${itemEl}`);
      continue;
    }

    const ignoreStyleDOM = document.querySelector('#ignoreStyle');
    const realScaleX = item.scale ? item.scale : (1 / scale[0]).toFixed(5);
    const realScaleY = item.scale ? item.scale : (1 / scale[1]).toFixed(5);
    const realWidth = realScaleX !== scale[0] ? (item.width * scale[0]).toFixed(5) : 'autofit';
    const realHeight = realScaleY !== scale[1] ? (item.height * scale[1]).toFixed(5) : 'autofit';

    const regex = new RegExp(`${itemEl}(\x20|{)`, 'gm');
    const isIgnored = regex.test(ignoreStyleDOM ? ignoreStyleDOM.innerHTML : '');
    if (isIgnored) {
      continue;
    }

    if (item.revert) {
      let revertScale = Math.max(0.5, scale[0], scale[1]);
      revertScale = Math.min(revertScale, 1);
      document.querySelector('#ignoreStyle').innerHTML += `\n${itemEl} {
        transform: scale(${revertScale}, ${revertScale})!important;
        transform-origin: bottom;
      }`;
    } else {
      document.querySelector('#ignoreStyle').innerHTML += `\n${itemEl} {
        transform: scale(${realScaleX}, ${realScaleY})!important;
        transform-origin: 0 0;
        width: ${realWidth}px!important;
        height: ${realHeight}px!important;
      }`;
    }
  }
}

export default {
  data() {
    return {
      showContent: false,
      isFit: true,
      isFixed: false,
      isFull: false,
      // * 定时函数
      drawTiming: null
    };
  },
  computed: {
    isScale() {
      return true;
    }
  },
  mounted() {
    if (!this.isScale) {
      return;
    }
    this.showContent = true;

    this.calcRate();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    calcRate() {
      const appRef = this.$refs['appRef'];
      if (!appRef) {
        return;
      }

      autofit(appRef);

      if (this.isFit) {
        this.calcFit();
      } else if (this.isFixed) {
        this.calcFixed();
      } else {
        this.calcFull();
      }
    },

    calcFull() {
      const screenRef = this.$refs['screenRef'];

      screenRef.style.width = `${baseWidth}px`;
      screenRef.style.height = `${baseHeight}px`;

      document.body.classList.add('is-scale');
    },

    calcFixed() {
      const appRef = this.$refs['appRef'];
      // 当前宽高比
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5));
      appRef.style.width = `${baseWidth}px`;
      appRef.style.height = `${baseHeight}px`;
      if (appRef) {
        if (currentRate > baseProportion) {
          // 表示更宽
          scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5);
          scale.height = (window.innerHeight / baseHeight).toFixed(5);
          // appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`;
          appRef.style.transform = `scale(${scale.width}, ${scale.height})`;
        } else {
          // 表示更高
          scale.height = (window.innerWidth / baseProportion / baseHeight).toFixed(5);
          scale.width = (window.innerWidth / baseWidth).toFixed(5);
          // appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`;
          appRef.style.transform = `scale(${scale.width}, ${scale.height})`;
        }
      }

      let htmlRoot = document.body;
      if (window.innerWidth >= 1920) {
        htmlRoot.classList.add('is-scale');
      } else {
        htmlRoot.classList.remove('is-scale');
      }
    },

    calcFit() {
      const appRef = this.$refs['appRef'];
      const screenRef = this.$refs['screenRef'];

      // 当前宽高比
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5));

      if (appRef) {
        if (currentRate > baseProportion) {
          // 表示更宽
          scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5);
          scale.height = (window.innerHeight / baseHeight).toFixed(5);
          const width = (baseWidth * scale.width).toFixed(5);
          const height = (baseHeight * scale.height).toFixed(5);

          appRef.style.width = `${width}px`;
          appRef.style.height = `${height}px`;
          screenRef.style.transform = `scale(${scale.width}, ${scale.height})`;
        } else {
          // 表示更高
          scale.height = (window.innerWidth / baseProportion / baseHeight).toFixed(5);
          scale.width = (window.innerWidth / baseWidth).toFixed(5);
          const width = (baseWidth * scale.width).toFixed(5);
          const height = (baseHeight * scale.height).toFixed(5);

          appRef.style.width = `${width}px`;
          appRef.style.height = `${height}px`;
          screenRef.style.transform = `scale(${scale.width}, ${scale.height})`;
        }
      }

      ignore([scale.width, scale.height]);

      let htmlRoot = document.body;
      if (window.innerWidth >= 1920) {
        htmlRoot.classList.add('is-scale');
      } else {
        htmlRoot.classList.remove('is-scale');
      }

      screenRef.style.width = `${baseWidth}px`;
      screenRef.style.height = `${baseHeight}px`;
    },

    resize() {
      if (!this.isScale) {
        return;
      }
      clearTimeout(this.drawTiming);
      this.drawTiming = setTimeout(() => {
        this.calcRate();
      }, 200);
    }
  }
};
