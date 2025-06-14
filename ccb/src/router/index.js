import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import ChatView from '../components/ChatView.vue'
import ChatBox from '../components/ChatBox.vue'
import ChatHall from '../views/ChatHall.vue'
import ChatRoom from '../views/ChatRoom.vue'
import Content from '../views/Content.vue'
import Assistant from '../views/Assistant.vue'

const routes = [
  { path: '/',
    component: ChatView, 
    children:[{
      path:"/chatdetail",
      component:Content
    },
      {
    path:"/chat-ai",
    component:Assistant
  }
  ],
    meta:{requiresAuth:true}
  },
  { path: '/chatbox', 
    component: ChatBox, 
    children:[{
      path:"",
      redirect:"/chatbox/chathall"
    },

    {
      path:"chathall",
      component:ChatHall
    },

    {
      path:"chatroom",
      component:ChatRoom
    }
  ],
    meta:{requiresAuth:true}
  },
  {
    path:"/login",
    component:Login
  },

  {
    path: '/:catchAll(.*)',  // 通配符路由,如果访问错误url,自动重定向到主页
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to,from,next)=>{
  const isLoggedIn = localStorage.getItem('token')
  
  if(to.meta.requiresAuth && !isLoggedIn){
    next("/login")
  }
  else{
    next()
  }
})

export default router