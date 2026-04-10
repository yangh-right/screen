<template>
  <div class="welcome-container" @click="handleClick">
    <div class="logo-container">
      <img :src="logoSrc" alt="永康水务" class="logo" />
    </div>

    <div class="content">
      <div class="slogan">悟水之道 善水之德</div>
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
      videoSrc: require('@/assets/lightimg/int/video(6).mp4')
    };
  },
  mounted() { },
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
  background: none;

  .wave-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: none;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
    font-family: AlibabaPuHuiTi_3_65_Medium;
    font-weight: 500;
    font-size: 51px;
    color: #5C5C5C;
    letter-spacing: 0;
    text-align: center;
  }

  .welcome-text {
    font-family: AlibabaPuHuiTi_3_85_Bold;
    font-weight: 700;
    font-size: 125px;
    letter-spacing: 0;
    text-align: center;
    background: linear-gradient(180deg, #15A0FF 0%, #0532BC 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    /* 使用 text-stroke 实现描边，或者使用 drop-shadow 模拟 */
    -webkit-text-stroke: 3px #D4EFF8;
  }

  .tags {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: AlibabaPuHuiTi_3_65_Medium;
    font-weight: 500;
    font-size: 51px;
    color: #5C5C5C;
    letter-spacing: 0;
    text-align: center;
    margin-top: 16px;

    .divider {
      margin: 0 10px;
    }
  }
}
</style>
