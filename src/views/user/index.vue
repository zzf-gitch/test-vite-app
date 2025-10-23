<template>
    <div>
        <MyTest />
        <h2>在 Vue 中使用 Web Components</h2>

        <!-- 基本使用 -->
        <zzf-button @zzf-click="handleButtonClick">
            点击我
        </zzf-button>

        <!-- 使用属性 -->
        <zzf-card name="张三" avatar="https://192.168.1.10/ctiapi/agent/uploads/head/1001.png"
            email="zhangsan@example.com" role="管理员">
            <div slot="actions">
                <!-- <button @click="editUser">编辑</button> -->
                <zzf-button @zzf-click="editUser">
                    编辑
                </zzf-button>
            </div>
        </zzf-card>

        <!-- 使用带方法的组件 -->
        <zzf-dialog ref="modalRef" title="用户信息" @modal-open="handleModalOpen" @modal-close="handleModalClose">
            <p>这是模态框的内容</p>

            <div slot="footer">
                <zzf-button @zzf-click="closeModal">
                    取消
                </zzf-button>
                <zzf-button @zzf-click="confirmAction">
                    确认
                </zzf-button>
                <!-- <button @click="closeModal">取消</button> -->
                <!-- <button @click="confirmAction">确认</button> -->
            </div>
        </zzf-dialog>

        <button @click="openModal">打开模态框</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const modalRef = ref(null)

const handleButtonClick = (event) => {
    console.log(event)
    console.log('按钮点击事件:', event.detail)
}

const editUser = () => {
    console.log('编辑用户')
}

const openModal = () => {
    if (modalRef.value) {
        modalRef.value.open()
    }
}

const closeModal = () => {
    if (modalRef.value) {
        modalRef.value.close()
    }
}

const confirmAction = () => {
    console.log('确认操作')
    closeModal()
}

const handleModalOpen = () => {
    console.log('模态框打开')
}

const handleModalClose = () => {
    console.log('模态框关闭')
}
</script>