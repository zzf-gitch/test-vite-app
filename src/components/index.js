import test from './test.vue'

export const MyTest = {
    install(app) {
        app.component('MyTest', test)
    }
}