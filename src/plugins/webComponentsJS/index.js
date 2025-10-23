import '../webComponents/zzf-button.js'
import '../webComponents/zzf-card.js'
import '../webComponents/zzf-dialog.js'

export default {
    install(app) {
        // 可以在这里添加全局配置或方法
        console.log('Web Components 插件已安装')

        // 可选：注册全局属性或方法
        app.config.globalProperties.$webComponents = {
            version: '1.0.0',
            getInfo: () => 'Web Components 集成'
        }
    }
}