<template>
    <p>{{ test }}</p>
</template>

<script setup>
const test = ref('测试全局组件-看vite.config.js中配置的AutoImport无需导入ref即可使用')
</script>