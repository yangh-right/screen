<!--
 * @Author: wangyr
 * @Date: 2024-06-05 10:41:53
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-22 16:46:44
 * @Description:
-->
<template>
  <div>
    <button @click="startRecording">开始录音</button>
    <button @click="stopRecording">停止录音</button>
    <button @click="playRecording">播放录音</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mediaRecorder: null,
      audioChunks: [],
      stream: null
    };
  },
  methods: {
    startRecording() {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          this.stream = stream;
          this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          this.mediaRecorder.ondataavailable = event => {
            if (event.data && event.data.size > 0) {
              this.audioChunks.push(event.data);
            }
          };
          this.mediaRecorder.start();
        })
        .catch(error => console.error(error));
    },
    stopRecording() {
      this.mediaRecorder.stop();
    },
    playRecording() {
      const superBuffer = new Blob(this.audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(superBuffer);
      const audio = new Audio();
      audio.src = audioUrl;
      audio.play();
    }
  }
};
</script>
