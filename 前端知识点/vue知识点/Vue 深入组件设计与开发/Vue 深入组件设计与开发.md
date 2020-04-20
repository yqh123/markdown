# Vue 组件设计与开发
模仿 element-ui 自己设计和开发出一套类似的组件出来（表单 form 组件）

- Form
- FormItem
- Input 

用到的知识：

- 父子组件之间数据浅层传递：props、v-model
- 祖孙组件数据深层传递：provide、inject
- 事件的监听：this.$emit(触发事件)、this.$on(监听事件)
- 表单校验：async-validator

【element-ui 的表单组件形式如下】：

```
<template>
  <section>
    <el-form :model="model" :rules="rules" ref="ruleForm">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="model.name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="model.password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  data() {
    return {
      model: {
        name: '',
        password: ''
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  }
}
</script>
```

**需要考虑的几个问题**

1. Input 是自定义组件，它是怎么实现双向数据绑定的？
2. FormItem 是怎么知道执行校验的，它是怎么知道 Input 状态的？它是怎么获得对应的数据模型的？
3. Form 是怎么进行全局校验的？它用什么办法把数据模型和校验规则传递给内部组件的？


## 实现 Input 组件

- 任务1：实现自定义组件的双向数据绑定功能
	>v-model 是语法糖，实现自定义组件双向绑定需要指定 :value 和 @input 即可

- 任务2：值发生变化能够通知 FormInput 组件

【Input 组件代码如下】：

```
<template>
  <section>
    <input :type="type" :value="value" @input="onInput">
  </section>
</template>

<script>
export default {
  name: 'Input',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 派发事件，通知父组件输入的值变化了
    onInput(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
```

【外部引用】：

```
<Input type="text" v-model="model.name" />
<Input type="password" v-model="model.password" />

// 数据源
data() {
  return {
    model: {
      name: '',
      password: ''
    }
  }
}
```


## 实现 FormItem

- 任务1：给 Input 预留插槽 slot

	>匿名插槽
	
	```
	// 定义 parent 中的插槽
	<div>
		<slot></slot>
	</div>
	
	// 使用 parent 并指定插槽内容
	<parent>content</parent>
	```
	
	>具名插槽
	
	```
	// 定义 parent 中的插槽
	<div>
		<slot name="top"></slot>
		<slot></slot>
	</div>
	
	// 使用 parent 并指定插槽内容
	<parent>
		<template slot="top">top content</template>
		content
	</parent>
	```

- 任务2：能够展示 label 和校验信息
- 任务3：能够进行校验

【FormItem 代码如下】：

```
<template>
  <section>
    <!-- label -->
    <label v-if="label">{{label}}</label>

    <!-- 插槽 -->
    <slot></slot>

    <!-- 校验失败信息展示 -->
    <p v-if="error" style="color: red;">
      {{error}}
    </p>
  </section>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      error: '' // 组件内部的状态（成功 | 失败）
    }
  }
}
</script>
```

## Form
- 绑定数据源
- 绑定校验规则

【Form 代码如下】：

```
<template>
  <section>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'Form',
  props: {
    // 绑定数据源
    model: {
      type: Object,
      required: true
    },
    // 绑定校验规则
    rules: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
}
</script>
```


## 数据校验
- 思路：校验发生在 FormItem 身上，它需要知道何时校验（让 Input 通知它）；它还需要知道怎么校验（注入校验规则：通过 provide 和 inject 代码注入方式，让子组件能够获得父组件绑定的数据）

- 任务1：Input 通知校验

	```
	onInput(e) {
		this.$parent.$emit('validate')
	}
	```

- 任务2：FormItem 监听校验通知，获取规则并执行校验规则
	
	【Input 组件】
	
	```
	onInput(e) {
      // 通知父组件输入的值变化了
      this.$emit('input', e.target.value)
      // 通知父组件进行校验
      this.$parent.$emit('validate')
    }
	```
	
	【FormItem 组件】
	
	```
	export default {
	  name: 'FormItem',
	  inject: ['form'],
	  props: {
	    label: {
	      type: String,
	      default: ''
	    },
	    prop: {
	      type: String,
	      default: ''
	    }
	  },
	  mounted() {
	    this.$on('validate', this.validate)
	  },
	  data() {
	    return {
	      error: ''
	    }
	  },
	  methods: {
	    // 校验函数
	    validate() {
	      // 1.获取校验规则
	      console.log(this.form.rules[this.prop])
	      
	      // 2.获取数据源
	      console.log(this.form.model[this.prop])
	      
	      // 现在你应该知道了，为什么要在 FormItem 里面传人 prop 校验参数了吧，就是在这里为获取“匹配的校验规则”和“匹配的数据源”用的
	    }
	  }
	}
	```
	
	【Form 组件】
	
	```
	export default {
	  name: 'Form',
	  // 把表单实例作为参数传递下去，这样子代可以直接使用
	  provide() {
	    return {
	      form: this
	    }
	  },
	  props: {
	    // 绑定数据
	    model: {
	      type: Object,
	      required: true
	    },
	    // 绑定校验数据
	    rules: {
	      type: Object,
	      required: false,
	      default: () => {}
	    }
	  }
	}
	```
	
--------

## Form 表单外部引入整体代码
```
<template>
  <section>
    <Form :model="model" :rules="rules" ref="formRules">
      <form-item label="用户名" prop="name">
        <Input type="text" v-model="model.name" />
      </form-item>
      <form-item label="密码" prop="password">
        <Input type="password" v-model="model.password" />
      </form-item>
    </Form>
  </section>
</template>

<script>
import Form from '../components/Form.vue'
import Input from '../components/Input.vue'
import FormItem from '../components/FormItem.vue'

export default {
  components: {
    Form,
    Input,
    FormItem
  },
  data() {
    return {
      model: {
        name: '',
        password: ''
      },
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  }
}
</script>
```

--------

## Form 组件整体代码

```
<template>
  <section>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'Form',
  // 把表单实例作为参数传递下去，这样子代可以直接使用
  provide() {
    return {
      form: this
    }
  },
  props: {
    // 绑定数据
    model: {
      type: Object,
      required: true
    },
    // 绑定校验数据
    rules: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
}
</script>
```

--------

## FormItem 组件整体代码

```
<template>
  <section>
    <!-- label -->
    <label v-if="label">{{label}}</label>

    <!-- 插槽 -->
    <slot></slot>

    <!-- 校验失败信息展示 -->
    <p v-if="error" style="color: red;">
      {{error}}
    </p>
  </section>
</template>

<script>
export default {
  name: 'FormItem',
  inject: ['form'],
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.$on('validate', this.validate)
  },
  data() {
    return {
      error: ''
    }
  },
  methods: {
    // 校验函数
    validate() {
      // 1.获取校验规则
      console.log(this.form.rules[this.prop])

      // 2.获取数据源
      console.log(this.form.model[this.prop])
      
      // 如何进行校验？往下走
    }
  }
}
</script>
```

--------

## Input 组件整体代码

```
<template>
  <section style="display: inline-block;">
    <input :type="type" :value="value" @input="onInput">
  </section>
</template>

<script>
export default {
  name: 'Input',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    onInput(e) {
      // 通知父组件输入的值变化了
      this.$emit('input', e.target.value)
      
      // 通知父组件进行校验
      this.$parent.$emit('validate')
    }
  }
}
</script>
```

--------

## 如何校验
1. 安装插件：表单验证 async-validator

```
npm install async-validator
```

2. FormItem 引入

```
import Schema from 'async-validator'
```

3. FormItem 监听事件 validate 使用

```
// 校验函数
validate() {
  // 1.获取校验规则
  const rulse = this.form.rules[this.prop]

  // 2.获取数据源
  const model = this.form.model[this.prop]

  // 3.获取校验对象
  const descriptor = {[this.prop]: rulse}

  // 4.创建校验器
  const schema = new Schema(descriptor)

  // 5.执行校验
  schema.validate({[this.prop]: model}, errors => {
    if (errors) {
      this.error = errors[0].message
    } else {
      this.error = ''
    }
  })
}
```

操作完上面的步骤，表单组件和表单校验就基本完成了，还剩下最后一步，就是，点击提交按钮，做一次整体校验：

```
<form-item>
  <button @click="submit('formRules')">提交</button>
</form-item>

submit(formName) {
  this.$refs[formName].validate((valid) => {
    if (valid) {
      alert('提交成功!');
    } else {
      console.log('error submit!!');
      return false;
    }
  })
}
```


【Form 组件添加校验整体规则】：

```
<script>
import AsyncValidator from 'async-validator'

export default {
  name: 'Form',
  // 把表单实例作为参数传递下去，这样子代可以直接使用
  provide() {
    return {
      form: this
    }
  },
  props: {
    // 绑定数据
    model: {
      type: Object,
      required: true
    },
    // 绑定校验数据
    rules: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  methods: {
    validate(callBack) {
      if (typeof callBack !== 'function') {
        console.error('请输入函数作为参数！')
        return
      }
      
      // 执行 fromItem 各自的校验
      this.validateFromItem()
      
      // 进行整体校验
      this.validateData().then((val) => {
        if (!val) {
          callBack(true)
        } else {
          callBack(false)
        }
      }).catch(error => {
        callBack(false)
      })
    },
    
    // 执行 fromItem 各自的校验
    validateFromItem() {
      // 1.刷选一级带有 prop 属性的子元素
      let fromItemProp = this.$children.filter((v) => {
        return v.prop
      })

      // 2.循环执行带有 prop 属性的一级子元素身上的 validate 校验方法
      fromItemProp.map((item) => {
        item.validate()
      })
    },
    
    // 整体校验
    validateData() {
      let { model, rules } = this
      let validateRuler = new Promise(function (resolve, reject) {
        let schema = new AsyncValidator(rules)
        schema.validate(model, (errors, fields) => {
          resolve(errors)
        })
      })

      return validateRuler
    }
  }
}
</script>
```

综上，就完成了一个拥有表单验证功能 form 的完整组件。


--------

# 实现一个 notify 消息提示弹窗组件
可以在 JS 中直接调用

```
this.$notify.info({
  message: '提示语',
  duration: 1000
})
```











































