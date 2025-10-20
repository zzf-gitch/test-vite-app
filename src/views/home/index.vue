<script setup>
import EmployeeTable from '@/components/EmployeeTable.vue'
import IncomeChart from '@/components/IncomeChart.vue'
</script>

<template>
    <div class="app-container">
        <el-tabs type="border-card">
            <el-tab-pane label="员工表格">
                <EmployeeTable />
            </el-tab-pane>
            <el-tab-pane label="收入图表">
                <IncomeChart />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
.app-container {
    padding: 20px;
    max-width: 100%;
    margin: 0 auto;
    height: calc(100vh - 40px);
}

:deep(.el-tabs) {
    height: 100%;
}

:deep(.el-tabs__content) {
    height: calc(100% - 55px);
}

:deep(.el-tab-pane) {
    height: 100%;
    overflow-y: auto;
}

@media (max-width: 768px) {
    .app-container {
        padding: 10px;
        height: calc(100vh - 20px);
    }
}
</style>