<template>
    <div>
        <el-button type="primary" @click="startRecording">开始录音</el-button>
        <el-button type="danger" @click="stopRecording">停止录音</el-button>
        <audio ref="audioPlayback" controls :src="audioData"></audio>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 获取用于播放录音的audio元素
// const audioPlayback = ref(null);
const audioData = ref('');
// 声明变量存储音频流对象
const stream = ref(null); // 获取流
// 声明变量存储MediaRecorder对象
const mediaRecorder = ref(null); // 录音器
// 声明数组用于存储录音数据块
const chunks = ref([]); // 存放录音数据

// 开始录音
const startRecording = async () => {
    // 请求用户媒体设备权限，获取音频流
    stream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
    // 使用获取到的音频流创建MediaRecorder实例
    mediaRecorder.value = new MediaRecorder(stream.value);
    // 在控制台输出相关信息（调试用）
    console.log(mediaRecorder.value);
    console.log(stream.value);
    console.log(typeof mediaRecorder.value);
    console.log(typeof stream.value);

    // 当录音数据可用时触发的事件处理函数
    mediaRecorder.value.ondataavailable = function (e) {
        // 将录音数据块添加到chunks数组中
        chunks.value.push(e.data);
    };
    // 开始录音
    mediaRecorder.value.start();
}

// 停止录音
const stopRecording = () => {
    // 遍历并停止音频流中的所有轨道
    stream.value.getTracks().forEach(track => track.stop());
    // 停止录音
    mediaRecorder.value.stop();

    // 监听录音停止事件
    mediaRecorder.value.addEventListener('stop', (e) => {
        // 将所有录音数据块组合成一个Blob对象，指定MIME类型为audio/ogg
        const blob = new Blob(chunks.value, { type: 'audio/ogg; codecs=opus' });
        // 创建Blob对象的URL，并将其设置为audio元素的播放源
        // audioPlayback.value.src = URL.createObjectURL(blob);
        audioData.value = URL.createObjectURL(blob);
        chunks.value = []; // 清空chunks数组，为下一次录音做准备
    });
}
</script>