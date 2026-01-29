<template>
  <div class="welcome-container" @click="handleClick">
    <div class="logo-container">
      <img :src="logoSrc" alt="永康水务" class="logo" />
    </div>

    <div class="content">
      <div class="slogan">悟水之道  善水之德</div>
      <div class="welcome-text">欢迎各位领导莅临参观</div>
      <div class="tags">
        <span class="tag">团结</span>
        <span class="divider">/</span>
        <span class="tag">诚信</span>
        <span class="divider">/</span>
        <span class="tag">务实</span>
        <span class="divider">/</span>
        <span class="tag">奋进</span>
      </div>
    </div>

    <div class="wave-animation">
      <video autoplay muted loop>
        <source :src="videoSrc" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  data() {
    return {
      logoSrc: require('@/assets/bottom-logo.png'),
      videoSrc: require('@/assets/home-bg.mp4')
    };
  },
  mounted() {},
  methods: {
    handleClick() {
      this.$router.push('/mainPage');
    }
  }
};
</script>

<style lang="less">
.welcome-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;

  .wave-animation {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;

    video {
      width: 100%;
      height: 100%;
    }
  }
  .logo-container {
    position: absolute;
    top: 40px;
    left: 40px;
    z-index: 10;
  }
}

.content {
  width: 100%;
  position: absolute;
  top: 414px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;

  .slogan {
    font-weight: 500;
    font-size: 56.78px;
    color: #bdcfff;
    letter-spacing: 0;
  }

  .welcome-text {
    font-family: AlibabaPuHuiTi_3_85_Bold, sans-serif;

    font-weight: 700;
    font-size: 128.78px;
    letter-spacing: 0;
    background: linear-gradient(to bottom, #f4f8ff 50%, #a9c8ff);
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }

  .tags {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 44.78px;
    color: #cad9ff;
    letter-spacing: 0;
    margin-top: 16px;

    .divider {
      margin: 0 10px;
    }
  }
}
</style>
