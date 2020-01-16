# Vue-router
手动自己实现一个模拟的 vue-router 路由功能，了解其中的实现原理。


## Vue-router 官方实现过程
```
import Vue from 'vue'
import VueRouter from 'vue-router' // 注意点

Vue.use(VueRouter) // 注意点

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({ // 注意点
  routes
})

export default router
```

通过上面的实例可以看出，vue-router 的实现过程是：

1. 引入 vue-router 模块
2. 通过 Vue.use 注册该模块
3. 通过 new VueRouter 的方式注入路由模块


## Vue.use
>用户执行 Vue.use 的时候，实际执行的是模块的 install 函数方法，会把 Vue 的实例传递进去（这是 Vue 官方的解释）

## 第一步：创建路由入口文件
在 src 下面创建 myRouter/index.js 路由入口文件

```
let Vue;

class MyRouter {
  static install(_Vue) {
  	// 缓存 Vue 实例对象
    Vue = _Vue
    
    // 对 Vue 本身做扩展（扩展实例创建之前 beforeCreate 钩子函数）
    // mixin 混入，可以借助混入模式来给 vue 实例添加属性
    Vue.mixin({
      beforeCreate() {
        Vue.prototype.$kkbrouter = 'Hello MyRouter'
      }
    })
  }
}

export default MyRouter
```

上面的 myRouter/index.js 模块就是你自己创建的一个路由模块，接下来需要在 router/index.js 路由管理模块里面去使用


## 第二步：导入路由并使用 Vue.use 注册插件
在 router/index.js 路由管理模块里面去导入

```
import Vue from 'vue'
import MyRouter from '@/myRouter/index.js'

// 实际执行的是 MyRouter 模块里面的 install 方法
Vue.use(MyRouter)

export default new MyRouter()
```

这样其他模块或组件就可以通过 $kkbrouter 去获得你注册之后的路由信息了

```
{{$kkbrouter}} // Hello MyRouter
```


**配置我们的路由模块**

在 router/index.js 路由管理模块里面去配置

```
........

export default new MyRouter({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    }
  ]
})
```

## 前置知识：路由跳转的两种模式
- hash 模式

	>使用 url# 后面的锚点来区分组件，hash 改变的时候，页面不会重新加载，只是触发了 widnow 的 hashchange 事件

- hishtory 模式

	>这种模式充分利用了 html5 history interface 中新增的 pushState() 和replaceState() 方法。这两个方法应用于浏览器记录栈，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL，但浏览器并不会立即向后端发送请求。


## 第三步：初始化 MyRouter 模块
```
let Vue;

class MyRouter {
  constructor(options) {
    this.options = options
    this.routeMap = {}
    // 使用 Vue 提供的响应式机制，等路由变化的时候去做一些响应
    this.app = new Vue({
      data: {
        current: '/' // 默认根目录
      }
    })
  }

  // install 方法
  static install(_Vue) {
    // 缓存 Vue 实例对象
    Vue = _Vue
    	
	// this.init() 如果直接在静态方法里面去执行它的其他非静态方式是会报错的
    
    // 所以借助 vue 的混入模式（mixin）来直接执行 init() 方法
    Vue.mixin({
      beforeCreate() {
        // 启动路由
        if (this.$options.router) {
          this.$options.router.init()
        }
      }
    })
  }

  // 启动整个路由（由插件 use 负责启动）
  init() {}
}

export default MyRouter
```


## 第四步：完善 MyRouter 模块
1. 监听 load、hashchange 事件
2. 处理路由表

以上这些都是为下一步通过路由 path 匹配相应组件用的

```
let Vue;

class MyRouter {
  ........

  // 启动整个路由（由插件 use 负责启动）
  init() {
    // 1. 监听 load、hashchange 事件
    this.bindEvents()

    // 2. 处理路由表
    this.createRouteMap()

    // 3. 初始化 <router-view> 和 <router-link>
  }

  // 监听 load、hashchange 事件
  bindEvents() {
    window.addEventListener('load', function (e) {
      console.log(e)
    }, false)
    window.addEventListener('hashchange', function (e) {
      console.log(e)
    }, false)
  }

  // 处理路由表
  createRouteMap() {
    this.options.routes.forEach(item => {
      this.routeMap[item.path] = item
    });
  }
}

export default MyRouter
```


## 第五步：匹配路由模块
初始化自定义的 router-view 和 router-link

- my-router-view
- my-router-link

【App.vue】

```
<template>
  <div id="app">
    <a href="./#home">Home</a> / <a href="./#about">About</a>
    
    <my-router-view/>
  </div>
</template>
```

【myRouter/index.js】

```
// 启动整个路由（由插件 use 负责启动）
init() {
  // 1. 监听 load、hashchange 事件
  this.bindEvents()

  // 2. 处理路由表
  this.createRouteMap()

  // 3. 初始化 router-view 和 router-link
  this.initComponent()
}

// 监听 load、hashchange 事件
bindEvents() {...}

// 处理路由表
createRouteMap() {...}

// 初始化自定义 router-view 和 router-link
initComponent() {
  // 注册 <my-router-view> 自定义标签
  Vue.component('my-router-view', {
    render: h => {
      if (this.routeMap[this.app.current]) {
        let component = this.routeMap[this.app.current].component
        return h(component)
      } else {
        console.error('没有匹配到相应到路由模块')
      }
    }
  })
}
```

这样，url 访问 /home 的时候，对应的组件也就渲染出来了。接下来要做的就是，路由发送变化时（url 改变时），同理，也要渲染出对应的组件出来。

至于如何通过 hash 值的变化来匹配路由组件，其实只需要改变 this.app.current 就可以，因为 this.app 是通过 new Vue 来生成的，所以有 vue 的相应式机制；只要 this.app.current 值改变，就会触发 vue 的 render 函数重新渲染。

```
// 监听 load、hashchange 事件
bindEvents() {
  window.addEventListener('load', this.onHashChange.bind(this), false)
  window.addEventListener('hashchange', this.onHashChange.bind(this), false)
}

// hash 值改变时触发
onHashChange(e) {
  // 获取当前 hash 值
  let hash = `/${window.location.hash.slice(1)}` || '/'
  this.app.current = hash
}
```

完成上面的操作，就可以正式使用了

```
<template>
  <div id="app">
    <a href="./home">Home</a>
    <a href="./about">About</a>

    <my-router-view/>
  </div>
</template>
```



## 第六步：实现自定义的 router-link

```
<my-router-link tag="a" to="/home">Home</my-router-link>
<my-router-link tag="a" to="/about">About</my-router-link>

<my-router-view/>
```

```
// 注册 <my-router-link> 自定义标签
Vue.component('my-router-link', {
  props: {
    to: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'a'
    }
  },
  render(h) {
    return h(this.tag, {
      attrs: {
        href: `#${this.to.slice(1)}`
      }
    }, [this.$slots.default])
  }
})
```

--------

# 以上完整代码如下

【src/router/index.js】:

```
import Vue from 'vue'
import MyRouter from '@/myRouter/index.js'

// 实际执行对是 MyRouter 模块里面的 install 方法
Vue.use(MyRouter)

export default new MyRouter({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    }
  ]
})
```

【src/myRouter/index.js】：

```
let Vue;

class MyRouter {
  constructor(options) {
    this.options = options
    this.routeMap = {}
    // 使用 Vue 提供的响应式机制，等路由变化的时候去做一些响应
    this.app = new Vue({
      data: {
        current: '/home' // 默认 home 目录
      }
    })
  }

  // install 方法
  static install(_Vue) {
    // 缓存 Vue 实例对象
    Vue = _Vue

    // 对 Vue 本身做扩展（扩展实例创建之前 beforeCreate 钩子函数）
    Vue.mixin({
      beforeCreate() {
        // 启动路由
        if (this.$options.router) {
          this.$options.router.init()
        }
      }
    })
  }

  // 启动整个路由（由插件 use 负责启动）
  init() {
    // 1. 监听 load、hashchange 事件
    this.bindEvents()

    // 2. 处理路由表
    this.createRouteMap()

    // 3. 初始化自定义 router-view 和 router-link
    this.initComponent()
  }

  // 监听 load、hashchange 事件
  bindEvents() {
    window.addEventListener('load', this.onHashChange.bind(this), false)
    window.addEventListener('hashchange', this.onHashChange.bind(this), false)
  }

  // hash 值改变时触发
  onHashChange(e) {
    // 获取当前 hash 值
    let hash = `/${window.location.hash.slice(1)}`
    // 由于 this.app 是通过 new Vue 来生成的，所以有 vue 的相应式机制
    // this.app.current 值改变，触发 vue render 重新渲染
    this.app.current = hash
  }

  // 处理路由表
  createRouteMap() {
    this.options.routes.forEach(item => {
      this.routeMap[item.path] = item
    });
  }

  // 初始化自定义 router-view 和 router-link
  initComponent() {
    // 注册 <my-router-view> 自定义标签
    Vue.component('my-router-view', {
      render: h => {
        console.log(this.app.current)
        if (this.routeMap[this.app.current]) {
          let component = this.routeMap[this.app.current].component
          return h(component)
        } else {
          console.error('没有匹配到相应到路由模块')
        }
      }
    })

    // 注册 <my-router-link> 自定义标签
    Vue.component('my-router-link', {
      props: {
        to: {
          type: String,
          default: ''
        },
        tag: {
          type: String,
          default: 'a'
        }
      },
      render(h) {
        return h(this.tag, {
          attrs: {
            href: `#${this.to.slice(1)}`
          }
        }, [this.$slots.default])
      }
    })
  }
}

export default MyRouter
```

【App.vue】:

```
<template>
  <div id="app">
    <my-router-link tag="a" to="/home">MyHome</my-router-link>
    /
    <my-router-link tag="a" to="/about">MyAbout</my-router-link>

    <my-router-view/>
  </div>
</template>
```


# 生命周期
路由跳转之前或之后，执行的特定方法


## 第一步：配置路由模块生命周期钩子函数
【src/router/index.js】：

```
const router = new MyRouter({
  routers: [
    {
      path: '/home',
      component: () => import ('../views/Home.vue'),
      beforeEnter(from, to, next) {
        console.log('路由跳转生命周期 beforeEnter')
        console.log('跳转之前的路由：' + from)
        console.log('跳转之后的路由：' + to)
        console.log('路由跳转根据 next 参数决定')
      }
    },
    {
      path: '/about',
      component: () => import ('../views/About.vue')
    }
  ]
})
```


## 第二步：监听我们的路由生命周期

【src/myRouter/index.js】：

```
// hash 值改变时触发
onHashChange(e) {
  let hash = `/${window.location.hash.slice(1)}`
  
  // 路由跳转生命周期执行
  let routerData = this.routerMap[hash]
  if(routerData.beforeEnter) {
    routerData.beforeEnter()
  }
  
  this.app.current = hash
}
```

可以看到，我们在路由模块里面定义的钩子函数已经可以执行了，只是里面的参数目前都是 undefined

**完善上的代码，获取 from 和 to**

```
// 获取路由变化时返回的 url 参数
getFrom(e) {
  let from, to;
  if (e.newURL) {
    from = e.oldURL.split('#')[1]
    to = e.newURL.split('#')[1]
  } else {
    from = ''
    to = e.target.location.hash.slice(1)
  }

  return { from, to }
}

// 路由跳转时触发
onHashChange(e) {
  let hash = e.target.location.hash.slice(1)

  // 路由跳转生命周期执行
  let routerData = this.routerMap[hash]
  let {from, to} = this.getFrom(e)
  if(routerData.beforeEnter) {
    routerData.beforeEnter(from, to)
  }

  this.app.url = hash
}
```


## 第三步：路由拦截 next 参数
通过在 beforeEnter(from, to, next) 钩子函数里面配置 next 参数，来告诉当前路由，什么时候跳转，是否允许跳转，已经要跳转到哪个路由页面。

```
const router = new MyRouter({
  routers: [
    {
      path: '/home',
      component: () => import ('../views/Home.vue'),
      beforeEnter(from, to, next) {
        // 1s 钟之后，等我处理完其他任务时在告诉你是否跳转，已经跳转到哪里
        setTimeout(() => {
          if (num = 1) {
          	next()
          } else if(num = 2) {
          	next(false)
          } else if (num = 3) {
          	next('/404')
          }
        }, 1000);
      }
    },
    {
      path: '/about',
      component: () => import ('../views/About.vue')
    }
  ]
})
```

```
// 路由变化时触发
onHashChange(e) {
  let hash = e.target.location.hash.slice(1)

  // 路由跳转生命周期执行
  let routerData = this.routerMap[hash]
  let {from, to} = this.getFrom(e)
  if(routerData.beforeEnter) {
    routerData.beforeEnter(from, to, () => {
      // 这里只简单的写一些判定逻辑
      if (stat === false) {
        this.app.url = from
        window.location.hash = from
      } else {
        this.app.url = hash
      }
    })
  } else {
    this.app.url = hash
  }
}
```

上面只是一个简单版的，当然你可以在里面加入自己的逻辑来完成更复杂化的路由 next 拦截判定，还可以加入其他的路由生命钩子函数。



# 实现自定义编程式导航
通过 this.$myRouter.push 等方式实现

```
<button @click="$myRouter.push('/home')">点击跳转 home 页面</button>
<button @click="$myRouter.push('/about')">点击跳转 about 页面</button>
```


**第一步：绑定自定义编程 $myRouter 变量到 class MyRouter 类实例对象上**

```
static install(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 绑定自定义编程 $myRouter 变量到 class MyRouter 实例对象上
        Vue.prototype.$myRouter = this.$options.router

        this.$options.router.initView()
      }
    }
  })
}
```

**第二步：给 class MyRouter 类添加 push 方法**

```
push(url) {
  // 1. hash 模式可以直接复制
  window.location.hash = url

  // 2. history 模式要按照 html5 提供到 API 来，比如 pushStat 等
}
```

这样一个简单版本的 router 路由就完成了































