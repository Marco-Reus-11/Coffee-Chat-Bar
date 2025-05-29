// main.js
import { createApp } from 'vue'
import App from './App.vue'

// FontAwesome 引入部分
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 按需导入需要用的图标（例如 comment 和 eye）
import { faComment, faEye, faUsers, faStar, faGear, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

// 添加到库中
library.add(faComment, faEye, faUsers, faStar,faGear,faMagnifyingGlass)

// 注册全局组件
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')