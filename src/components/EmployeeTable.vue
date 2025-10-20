<template>
  <div class="employee-table">
    <el-table :data="paginatedData" style="width: 100%" border :default-sort="{ prop: 'date', order: 'ascending' }">

      <el-table-column prop="id" label="序号" width="80" fixed align="center" sortable />
      <el-table-column label="基本信息" fixed header-align="center">
        <el-table-column prop="name" label="姓名" width="120" sortable />
        <el-table-column prop="department" label="部门" width="120" sortable>
          <template #default="{ row }">
            <el-tag :type="getDepartmentType(row.department)">
              {{ row.department }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="职位" width="150" sortable />
        <el-table-column prop="level" label="职级" width="80" sortable />
        <el-table-column prop="status" label="状态" width="80" sortable>
          <template #default="{ row }">
            <el-text :type="row.status === '在职' ? 'success' : 'info'">{{ row.status }}</el-text>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- 其他列保持不变 -->
      <el-table-column v-for="column in scrollableColumns" :key="column.label" :label="column.label"
        header-align="center">
        <template v-if="column.em_header">
          <template v-for="subColumn in column.em_header" :key="subColumn.value || subColumn.label">
            <el-table-column v-if="!subColumn.em_header" :prop="subColumn.value" :label="subColumn.label"
              :width="subColumn.width || 150" sortable>
              <template #default="{ row }">
                <template v-if="subColumn.value === 'score'">
                  <el-rate :model-value="parseFloat(row[subColumn.value])" disabled :max="5" :allow-half="true" />
                </template>
                <template v-else-if="subColumn.value === 'attendanceRate'">
                  <el-tag
                    :type="row[subColumn.value] >= 90 ? 'success' : row[subColumn.value] >= 70 ? 'warning' : 'danger'"
                    effect="light">
                    {{ row[subColumn.value] }}%
                  </el-tag>
                </template>
                <template v-else-if="column.label === '财务信息'">
                  <span>￥{{ row[subColumn.value] }}</span>
                </template>
                <template v-else-if="subColumn.value === 'experience'">
                  <span>{{ row[subColumn.value] }}年</span>
                </template>
                <template v-else>
                  {{ row[subColumn.value] }}
                </template>
              </template>
            </el-table-column>
            <el-table-column v-else v-for="subSubColumn in subColumn.em_header"
              :key="subSubColumn.value || subSubColumn.label" :prop="subSubColumn.value" :label="subSubColumn.label"
              :width="subSubColumn.width || 150" sortable>
              <template #default="{ row }">
                <ProgressDisplay :value="row[subSubColumn.value]" />
              </template>
            </el-table-column>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            刷新
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

const tableData = ref([])
const tableColumns = ref([])

const currentPage = ref(1)
const pageSize = ref(20)
const reload = inject('reload');

const totalItems = computed(() => tableData.value.length)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

const scrollableColumns = computed(() => {
  return tableColumns.value.filter(column =>
    column.label !== '序号' && column.label !== '基本信息'
  )
})

// 部门类型映射表
const departmentTypeMap = {
  '技术部': 'primary',
  '研发部': 'primary',
  '运营部': 'success',
  '销售部': 'success',
  '市场部': 'warning',
  '产品部': 'warning',
  '人事部': 'danger'
}

// 获取部门对应的标签类型
const getDepartmentType = (department) => {
  return departmentTypeMap[department] || 'info'
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

onMounted(async () => {
  try {
    const headerData = await axios.get('/header.json')
    tableColumns.value = headerData.data

    const PersonData = await axios.get('/data.json')
    const data = PersonData.data

    const processedData = data.map(item => ({
      ...item,
      totalIncome: item.salary + item.bonus - item.tax
    }))

    tableData.value = processedData
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

const handleEdit = (index, row) => {
  console.log('刷新员工信息', index, row);
  reload();
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