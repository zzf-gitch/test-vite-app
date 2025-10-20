<template>
  <div class="income-chart">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const chartContainer = ref(null)
let chart = null

// 处理窗口大小变化
const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}

const init = async () => {
  const Data = await axios.get('/data.json')
  const data = Data.data

  // 计算总收入并排序
  const processedData = data.map(item => ({
    ...item,
    totalIncome: item.salary + item.bonus - item.tax
  }))

  // 按总收入排序并取前10
  const sortedData = processedData.sort((a, b) => b.totalIncome - a.totalIncome).slice(0, 10)

  // 准备图表数据
  const names = sortedData.map(item => item.name)
  const totalIncomes = sortedData.map(item => item.totalIncome)
  const scores = sortedData.map(item => parseFloat(item.score))

  // 确保DOM已经渲染
  await nextTick()

  // 初始化图表
  chart = echarts.init(chartContainer.value)

  // 图表配置
  const option = {
    title: {
      text: '员工总收入与综合评分（前十名）'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['总收入', '综合评分']
    },
    xAxis: [
      {
        type: 'category',
        data: names,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '总收入',
        position: 'left',
        axisLabel: {
          formatter: '{value} 元'
        }
      },
      {
        type: 'value',
        name: '综合评分',
        position: 'right',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '总收入',
        type: 'bar',
        data: totalIncomes,
        itemStyle: {
          color: '#5470c6'
        }
      },
      {
        name: '综合评分',
        type: 'line',
        yAxisIndex: 1,
        data: scores,
        itemStyle: {
          color: '#ee6666'
        }
      }
    ]
  }

  // 设置图表配置
  chart.setOption(option)
}

onMounted(() => {
  init()

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)

  // 销毁图表实例
  if (chart) {
    chart.dispose()
  }
})
</script>

<style scoped>
.income-chart {
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
}

.chart-container {
  width: 1200px;
  height: calc(100vh - 200px);
  min-height: 400px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
</style>
