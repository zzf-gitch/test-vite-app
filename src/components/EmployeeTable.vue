<template>
  <div class="employee-table">
    <el-table :data="paginatedData" style="width: 100%" border :default-sort="{ prop: 'date', order: 'ascending' }">

      <!-- 序号列：固定列，宽度80像素，居中对齐，可排序 -->
      <el-table-column prop="id" label="序号" width="80" fixed align="center" sortable />
      <!-- 基本信息列组：包含员工的基本信息，固定列 -->
      <el-table-column label="基本信息" fixed header-align="center">
        <!-- 姓名列：显示员工姓名，宽度120像素，可排序 -->
        <el-table-column prop="name" label="姓名" width="120" sortable />
        <!-- 部门列：显示员工部门，宽度120像素，可排序，使用标签展示 -->
        <el-table-column prop="department" label="部门" width="120" sortable>
          <!-- 自定义部门列内容：根据部门显示不同颜色的标签 -->
          <template #default="{ row }">
            <!-- 根据部门类型映射表显示对应颜色的标签 -->
            <el-tag :type="getDepartmentType(row.department)">
              {{ row.department }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 职位列：显示员工职位，宽度150像素，可排序 -->
        <el-table-column prop="position" label="职位" width="150" sortable />
        <!-- 职级列：显示员工职级，宽度80像素，可排序 -->
        <el-table-column prop="level" label="职级" width="80" sortable />
        <!-- 状态列：显示员工在职状态，宽度80像素，可排序 -->
        <el-table-column prop="status" label="状态" width="80" sortable>
          <!-- 自定义状态列内容：根据状态显示不同颜色的文本 -->
          <template #default="{ row }">
            <!-- 在职状态显示绿色，其他状态显示灰色 -->
            <el-text :type="row.status === '在职' ? 'success' : 'info'">{{ row.status }}</el-text>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 动态列：根据配置显示其他列信息 -->
      <el-table-column v-for="column in scrollableColumns" :key="column.label" :label="column.label"
        header-align="center">
        <!-- 判断是否存在子列头 -->
        <template v-if="column.em_header">
          <!-- 遍历子列头 -->
          <template v-for="subColumn in column.em_header" :key="subColumn.value || subColumn.label">
            <!-- 判断是否还存在子列头 -->
            <el-table-column v-if="!subColumn.em_header" :prop="subColumn.value" :label="subColumn.label"
              :width="subColumn.width || 150" sortable>
              <!-- 自定义单元格内容 -->
              <template #default="{ row }">
                <!-- 特殊处理评分列 -->
                <template v-if="subColumn.value === 'score'">
                  <!-- 显示评分组件，禁用编辑，最大值5，支持半星 -->
                  <el-rate :model-value="parseFloat(row[subColumn.value])" disabled :max="5" :allow-half="true" />
                </template>
                <!-- 特殊处理出勤率列 -->
                <template v-else-if="subColumn.value === 'attendanceRate'">
                  <!-- 根据出勤率显示不同颜色的标签 -->
                  <el-tag
                    :type="row[subColumn.value] >= 90 ? 'success' : row[subColumn.value] >= 70 ? 'warning' : 'danger'"
                    effect="light">
                    {{ row[subColumn.value] }}%
                  </el-tag>
                </template>
                <!-- 特殊处理财务信息列 -->
                <template v-else-if="column.label === '财务信息'">
                  <!-- 显示金额前缀 -->
                  <span>￥{{ row[subColumn.value] }}</span>
                </template>
                <!-- 特殊处理经验年限列 -->
                <template v-else-if="subColumn.value === 'experience'">
                  <!-- 显示年限后缀 -->
                  <span>{{ row[subColumn.value] }}年</span>
                </template>
                <!-- 普通列显示 -->
                <template v-else>
                  {{ row[subColumn.value] }}
                </template>
              </template>
            </el-table-column>
            <!-- 处理三级表头的情况 -->
            <el-table-column v-else v-for="subSubColumn in subColumn.em_header"
              :key="subSubColumn.value || subSubColumn.label" :prop="subSubColumn.value" :label="subSubColumn.label"
              :width="subSubColumn.width || 150" sortable>
              <!-- 自定义单元格内容 -->
              <template #default="{ row }">
                <!-- 使用进度展示组件 -->
                <ProgressDisplay :value="row[subSubColumn.value]" />
              </template>
            </el-table-column>
          </template>
        </template>
      </el-table-column>

      <!-- 操作列：固定在右侧，包含编辑和删除操作 -->
      <el-table-column align="center" label="操作" min-width="150" fixed="right">
        <!-- 自定义操作列内容 -->
        <template #default="scope">
          <!-- 刷新按钮 -->
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            刷新
          </el-button>
          <!-- 删除按钮 -->
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件：用于分页展示数据 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="[20, 30, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems"
      style="margin-top: 10px; justify-content: center; position: fixed; bottom: 10px; right: 20px;">
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, inject } from 'vue'
import ProgressDisplay from './ProgressDisplay.vue'
import axios from 'axios'

// 定义表格数据的响应式引用
const tableData = ref([])
// 定义表格列配置的响应式引用
const tableColumns = ref([])

// 定义当前页码的响应式引用，默认第1页
const currentPage = ref(1)
// 定义每页显示条数的响应式引用，默认20条
const pageSize = ref(20)
// 注入父组件提供的reload方法，用于刷新页面
const reload = inject('reload');

// 计算属性：计算总条目数
const totalItems = computed(() => tableData.value.length)

// 计算属性：计算当前页需要显示的数据
const paginatedData = computed(() => {
  // 计算起始索引
  const start = (currentPage.value - 1) * pageSize.value
  // 计算结束索引
  const end = start + pageSize.value
  // 返回分页后的数据
  return tableData.value.slice(start, end)
})

// 计算属性：过滤出可滚动的列（排除序号和基本信息列）
const scrollableColumns = computed(() => {
  // 过滤掉序号和基本信息列
  return tableColumns.value.filter(column =>
    column.label !== '序号' && column.label !== '基本信息'
  )
})

// 部门类型映射表：用于给不同部门分配不同颜色标签
const departmentTypeMap = {
  '技术部': 'primary',
  '研发部': 'primary',
  '运营部': 'success',
  '销售部': 'success',
  '市场部': 'warning',
  '产品部': 'warning',
  '人事部': 'danger'
}

// 获取部门对应的标签类型的方法
const getDepartmentType = (department) => {
  // 返回部门对应的标签类型，如果没有匹配则返回默认的info类型
  return departmentTypeMap[department] || 'info'
}

// 处理每页显示条数变化的方法
const handleSizeChange = (val) => {
  // 更新每页显示条数
  pageSize.value = val
  // 重置当前页为第1页
  currentPage.value = 1
}

// 处理当前页变化的方法
const handleCurrentChange = (val) => {
  // 更新当前页码
  currentPage.value = val
}

// 组件挂载时执行的生命周期钩子
onMounted(async () => {
  try {
    // 请求获取表格列配置数据
    const headerData = await axios.get('/header.json')
    // 设置表格列配置
    tableColumns.value = headerData.data

    // 请求获取员工数据
    const PersonData = await axios.get('/data.json')
    // 获取员工数据
    const data = PersonData.data

    // 处理员工数据，添加总收入字段
    const processedData = data.map(item => ({
      // 保留原有数据
      ...item,
      // 计算总收入：工资+奖金-税额
      totalIncome: item.salary + item.bonus - item.tax
    }))

    // 设置处理后的表格数据
    tableData.value = processedData
  } catch (error) {
    // 错误处理：打印错误信息到控制台
    console.error('Error loading data:', error)
  }
})

// 处理编辑（刷新）操作的方法
const handleEdit = (index, row) => {
  // 打印日志到控制台
  console.log('刷新员工信息', index, row);
  // 调用注入的reload方法刷新页面
  reload();
}

// 处理删除操作的方法（未实现具体逻辑）
const handleDelete = (index, row) => {
  // TODO: 实现删除逻辑
  console.log('删除员工信息', index, row);
}
</script>

<style scoped>
.employee-table {
  padding: 10px;
  height: 100%;
}

:deep(.el-table) {
  font-size: 14px;
  height: 100%;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #333;
  font-weight: bold;
}
</style>