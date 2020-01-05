# Vue 组件通信的几种方式
- 父子组件如何通信
- 祖孙组件如何通信
- 兄弟组件如何通信

【解决方案】：

- 父子组件如何通信：（数据：props、sync、v-model；事件：自定义事件、$refs）
- 祖孙组件如何通信：（数据：$attrs；事件：$listeners）
- 兄弟组件如何通信：（eventBus、Vuex）（$attrs、$listeners）


# 父子组件如何通信
- props 通信
- sync 通信
- v-model 通信

## props 通信
props 通信是 Vue 中典型的“单向数据流”通信机制，意思是，父组件传递给子组件的数据，子组件不能直接修改，必须通过 emit 监听来通知父组件，在由父组件修改指定的数据的一种方式。

实例：publicCompent.vue 父组件里面有一个 childrenCompent.vue 子组件；父组件传递给子组件一个数据 propsData，然后子组件里面通过点击按钮来改变这个数据。

【父组件：publicCompent.vue】代码如下：

```
<template>
	<section>
	   <h2>我是父组件</h2>
	   <p>{{ PropsData }}</p>
	   <ChildrenCompent 
	   	:propsData="propsData"
		@queryHandle="queryHandle" />
	</section>
</template>

<script>
import ChildrenCompent from '@/components/childrenCompent.vue'

export default {
	data() {
		return {
			propsData: '我是数据'
		}
	},
	components: {
		ChildrenCompent
	},
	methods: {
		// 子组件通过 emit 触发了自定义事件，并且父组件可以接受传给他的数据
    	queryHandle(val) {
			this.propsData = val
		}
	}
}
</script>
```

【子组件：childrenCompent.vue】代码如下：

```
<template>
	<section>
	   <h2>我是子组件</h2>
	   <button type="button" @click="queryClick">确定</button>
	</section>
</template>

<script>
export default {
	props: {
		propsData: {
	      type: String,
	      default: ''
	    }
	},
	methods: {
		// 通过 emit 通知绑定在子组件上面的自定义事件，并且可以传递数据过去
    	queryClick() {
			this.$emit('queryHandle', '我是子组件传给父组件的数据')
		}
	}
}
</script>
```

通过上面的代码可以看出来，子组件是无权擅自改动父组件传递的数据的，必须通过 emit 触发自定义事件，由父组件来改变，这也就是“单向数据流”的概念。

它的优点是，很好的保护了数据不被其他子组件污染。但它的缺点是过程有点复杂。所以 Vue 为我们提供了一个实现“同步”的，“双向”的数据绑定形式，用来更加方便的处理父子组件之间的通信：sync 和 v-model。

补充---父组件如果单纯的去触发子组件的事件的话，也可以使用 this.$refs[name].子组件事件名来触发，比如：

```
this.$refs['refAcom'].refsHandle()
```


## sync 和 v-model 通信
**(1)sync 同步通信**

sync 支持同步通信，也就子组件可以直接改变父组件的数据，而不必通过 emit 这种自定义事件的监听来实现。

实例：publicCompent.vue 父组件里面有一个 childrenCompent.vue 子组件；父组件传递给子组件一个数据 propsData，然后子组件里面通过点击按钮来改变这个数据。

【父组件：publicCompent.vue】代码如下：

```
<template>
	<section>
	   <h2>我是父组件</h2>
	   <p>{{ PropsData }}</p>
	   <ChildrenCompent 
	   	:propsData.sync="propsData" />
	</section>
</template>

<script>
import ChildrenCompent from '@/components/childrenCompent.vue'

export default {
	data() {
		return {
			propsData: '我是数据'
		}
	},
	components: {
		ChildrenCompent
	}
}
</script>
```

【子组件：childrenCompent.vue】代码如下：

```
<template>
	<section>
	   <h2>我是子组件</h2>
	   <button type="button" @click="queryClick">确定</button>
	</section>
</template>

<script>
export default {
	props: {
		propsData: {
	      type: String,
	      default: ''
	    }
	},
	methods: {
		// 通过 $emit('update: 数据名称', '改变的值') 来实现对数据的改变
    	queryClick() {
			this.$emit('update:propsData', '改变的值')
		}
	}
}
</script>
```

**(2)v-model 通信**

v-model 通信，和 sync 一样，都是可以在子组件里面，直接改变父组件传递的数据，只是它的实现方式不同。

子组件通过 v-model 绑定数据，然后在子组件里面通过 props[value] 值来接受，在通过 emit 去监听 input 事件来做的。并且 v-model 的权限要比 sync 高。

实例：publicCompent.vue 父组件里面有一个 childrenCompent.vue 子组件；父组件传递给子组件一个数据 propsData，然后子组件里面通过点击按钮来改变这个数据。

【父组件：publicCompent.vue】代码如下：

```
<template>
	<section>
	   <h2>我是父组件</h2>
	   <p>{{ PropsData }}</p>
	   <ChildrenCompent 
	   	v-model="propsData" />
	</section>
</template>

<script>
	......
</script>
```

【子组件：childrenCompent.vue】代码如下：

```
<template>
	<section>
	   <h2>我是子组件</h2>
	   <button type="button" @click="queryClick">确定</button>
	</section>
</template>

<script>
export default {
	props: {
		// 这里必须写成 value
		value: {
	      type: String,
	      default: ''
	    }
	},
	methods: {
		// 通过 $emit('input', '改变的值') 来实现对数据的改变
    	queryClick() {
			this.$emit('input', '改变的值')
		}
	}
}
</script>
```


# 祖孙组件的通信
上面的实例都是在父子组件之间的通信（props、sync、v-model），但是如果是向子组件的子组件传递信息呢？显然我们需要换一种更加简单的方式实现祖孙组件之间的数据传输。

- $attrs
- $listeners

## $attrs
包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。

总结一句话：接收除了 props 声明外的所有绑定属性

【实例】：比如有一个祖父级组件 Parent，他里面有一个子组件 Childe，而这个 childe 组件里面又有两个子组件 A 和 B（A 和 B是兄弟组件）。parent 组件里面有一系列数据，要把这些数据分别传递给他下面所有的组件。

【Parent 组件代码如下】：

```
<template>
  <div>
    <h2>我是 Parent 组件</h2>
    <childe :name="name" :age="age" :sex="sex" :add="add" />
  </div>
</template>

<script>
export default {
  components: {
    Childe
  },
  data() {
  	// 现在要把这些数据分别传递给他下面所有的组件去用
    return {
      name: '小明',
      age: 24,
      sex: '男',
      add: '杭州市'
    }
  }
}
</script>
```

【Childe 组件代码如下】：

```
<template>
  <div>
    <h2>我是 Childe 组件</h2>
    <p>姓名：{{name}}</p>
    <p>年龄：{{age}}</p>
    
    <!-- 所有的子组件都需要通过 v-bind="$attrs" 去获取传下来的数据 -->
    <A v-bind="$attrs" />
    <B v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  props: ['name', 'age'],
  created() {
    console.log(this.$attrs) // { "sex": "男", "add": "杭州市" }
  },
  components: {
    A, B
  }
}
</script>
```

【A/B 组件代码如下】：

```
<p>性别：{{$attrs.sex}}</p>
<p>地址：{{$attrs.add}}</p>

$attrs = {sex: "男", add: "杭州市"}
```

可以看到 $attrs 这个对象里面包含了 A/B 组件获取的 name 和 age 属性之外所有的其他属性。到这里属性在祖孙之前的传递就解决了，那么事件呢？


## $listeners
包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。

【Parent 组件代码如下】：

```
<template>
  <div>
    <h2>我是 Parent 组件</h2>
    <childe 
    	:name="name" 
		:age="age" 
		:sex="sex" 
		:add="add"
		@queryHandleA="queryHandleA" 
      	@queryHandleB="queryHandleB" />
  </div>
</template>

<script>
export default {
  components: {
    Childe
  },
  data() {
  	// 现在要把这些数据分别传递给他下面所有的组件去用
    return {
      name: '小明',
      age: 24,
      sex: '男',
      add: '杭州市'
    }
  },
  methods: {
  	// 现在要把这些绑定在一级组件 Childe 上的事件分别传递给他下面所有的组件去用
	queryHandleA() {
      console.log('触发 queryHandleA 事件')
    },
    queryHandleB() {
      console.log('触发 queryHandleB 事件')
    }
  }
}
</script>
```

【Childe 组件代码如下】：

```
<template>
  <div>
    <h2>我是 Childe 组件</h2>
    <p>姓名：{{name}}</p>
    <p>年龄：{{age}}</p>
    <button type="button" @click="clickA">触发 queryHandleA 事件</button>
    <button type="button" @click="clickB">触发 queryHandleB 事件</button>
    
    <!-- 所有的子组件都需要通过 v-on="$listeners" 去获取传下来的事件 -->
    <A v-bind="$attrs" v-on="$listeners" />
    <B v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
export default {
  props: ['name', 'age'],
  created() {
    console.log(this.$attrs) // { "sex": "男", "add": "杭州市" }
  },
  components: {
    A, B
  },
  methods: {
    clickA() {
      this.$emit('queryHandleA') // 通过统一的 API 去调用即可触发
    },
    clickB() {
      this.$emit('queryHandleB') // 通过统一的 API 去调用即可触发
    }
  }
}
</script>
```

【A/B 组件代码如下】：

```
<template>
  <section>
    <h2>A/B 组件</h2>
    <button type="button" @click="clickA">触发 queryHandleA 事件</button>
    <button type="button" @click="clickB">触发 queryHandleB 事件</button>
  </section>
</template>

<script>
export default {
  methods: {
    clickA() {
      this.$emit('queryHandleA')
    },
    clickB() {
      this.$emit('queryHandleB')
    }
  }
}
```


# 兄弟组件之间的通信
如果是兄弟组件之间的通信，采用了上面的常规的通信方式，比如 emit，这样会让组件之间的代码变得很复杂而且容易出错。所以 Vue 提供了方便兄弟组件之间通信的方法。

- eventBus
- Vuex

当然上面说的 $attrs 和 $listeners 也可以作为兄弟组件之间的通信，而且也比较常用，只要把数据都让他们的父组件提供和改变就可以了。


## eventBus
它是通过 Vue 实例对象上提供的共有属性，$root.$emit 和 $root.$on，来实现的，可以写在全局下，也可以写在单独的组件里面。

- 优点：不管是父子组件还兄弟组件，也不管你嵌套了多少层，都可以用它来通信。
- 缺点1：所有组件都可以改变数据，造成数据不可预测和调试。
- 缺点2：监听的事件名很容易重复，造成事件覆盖。

【实例】：组件 Allcom 里面引入 Acom 和 Bcom 组件，Acom 组件通过点击事件，来通知 Bcom 组件，并回传数据给 Bcom

【AllCom 组件代码如下】：

```
<template>
  <section>
    <h2>我是 AllCom 组件</h2>
    <button type="button" @click="queryClick">确定</button>
    
    <Acom />
    <Bcom />
  </section>
</template>

<script>
import Acom from '@/components/Acom.vue'
import Bcom from '@/components/Bcom.vue'

export default {
  name: 'Allcom',
  components: {
    Acom,
    Bcom
  },
  methods: {
    queryClick() {
      this.$root.$emit('queryAll', '我是 Allcom 传递的数据')
    }
  }
}
</script>
```

【Acom 组件代码如下】：

```
<template>
  <section>
    <h2>Acom 组件</h2>
    <button type="button" @click="queryClick">确定</button>
  </section>
</template>

<script>
export default {
  name: 'Acom',
  created() {
  	// 接收到父组件 Allcom 传递过来的数据
	this.$root.$on('queryAll', (val) => {
		console.log(val)
	})
  },
  methods: {
  	// 通知 Bcom 组件监听的 queryHandle 事件，去接受 Acom 传递的数据
    queryClick() {
      this.$root.$emit('queryHandle', '我是 Acom 组件传过来的数据')
    }
  }
}
</script>
```

【Bcom 组件代码如下】：

```
<template>
  <section>
    <h2>Bcom 组件</h2>
    <p>{{content}}</p>
  </section>
</template>

<script>
export default {
  name: 'Bcom',
  data() {
    return {
      content: ''
    }
  },
  created() {
  	// 这个是父组件 Allcom 传递的数据
  	this.$root.$on('queryAll', (val) => {
      this.content = val
    })
    
    // 这个是兄弟组件 Acom 传递的数据
    this.$root.$on('queryHandle', (val) => {
      this.content = val
    })
  }
}
</script>
```

由于上面的组件都是在根实例 this.$root 上绑定的监听事件，所以结合上面的缺点，一般不推荐使用，如果真要用 eventBus 去达到组件之间的通信，建议在 main.js 里面去注册一个新的 vue 实例对象：

```
import Vue from 'vue'

Vue.use({
	install(Vue) {
		Vue.prototype.$eventBus = new Vue;
	}
})
```

然后把各个组件的 this.$root 替换成 this.$eventBus 即可


## Vuex
也称为状态管理，主要是用来管理公共数据的，比如用户信息等



