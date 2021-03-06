# vue笔记 #
> Vue是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，它采用声明式渲染，组件化机制，模块化等一系统的MVVM框架。

<pre>
<a href="#lifeCycle">实例生命周期钩子</a>  <a href="#mustache">“Mustache”语法</a>  <a href="#butDisable">button的disabled属性</a>  <a href="#expression">使用JavaScript表达式</a>  <a href="#computed">计算属性computed的妙用</a>  <a href="#styles">v-bind:style的妙用</a> 
 <a href="#keys">用key管理可复用的元素</a>  <a href="#vshow">v-show使用注意点</a>  <a href="#ifShow">什么情况下使用v-if和v-show</a>  <a href="#forKey">v-for中的key值</a>  <a href="#testing">数组更新检测</a>  <a href="#testingObj">对象更改检测注意事项</a>
<a href="#vFor">一个组件的v-for</a>  <a href="#events">事件对象的获取</a>  <a href="#vModel">v-model修饰符</a>  <a href="#comps">基础组件的自动化全局注册</a>  <a href="#danlus">组件的单向数据流</a>  <a href="#namegf">组件自定义事件名规范</a>  <a href="#eventIs">自定义组件的is属性</a>
<a href="#keepAlive">keep-alive缓存组件</a>  <a href="#keepAliveCmp">keep-alive</a>  <a href="#keepAliveDist">keep-alive的两个缓存自定义组件属性</a>  <a href="#yibuCmp">异步组件</a>  <a href="#routerLjz">vue路由页面的懒加载</a>  <a href="#routerModel">关于路由页面的分模块配置</a>  
<a href="#scrollTop">记录页面滚动位置</a>  <a href="#setTitle">vue动态title</a>  <a href="#imgLazy">图片懒加载</a>  <a href="#directives">自定义指令</a>  <a href="#filter">自定义过滤器</a>
</pre>  
<pre>
<a href="#vux">vuex的使用</a>  <a href="#axios">axios的使用</a>  <a href="#inputCursor">移动端input光标覆盖其他元素</a> <a href="#preventDefault">页面滚动限制</a>
</pre>

## <h2 id="lifeCycle">实例生命周期钩子</h2> ##
> 每个Vue实例在被创建之前都要经过一系列的初始化过程,这个过程就是vue的生命周期。这个过程包含了8个阶段，beforeCreate（实例创建前）、created（实例创建后）、beforeMount(实例载入前)、mounted（实例载入后）、beforeUpdate（数据更新前）、updated（数据更新后）、beforeDestroy（实例销毁前）、destroyed（实例销毁后）

![vue生命周期](https://img.tthunbohui.cn/zhuanti/19554/lifecycle.png)

<pre>
el: &#x27;#app&#x27;,
data() {
	return {
		message: &#x27;数据&#x27;
	}
},

beforeCreate: function() {
  console.group(&#x27;------beforeCreate创建前状态------&#x27;);
  console.log(this.$el);	//undefined
  console.log(this.$data); 	//undefined 
  console.log(this.message) 	//undefined 
},
created: function() {
  console.group(&#x27;------created创建完毕状态------&#x27;);
  console.log(this.$el); 	//undefined
  console.log(this.$data); 	//已被初始化 
  console.log(this.message); 	//已被初始化
},
beforeMount: function() {
  console.group(&#x27;------beforeMount挂载前状态------&#x27;);
  console.log(this.$el); 	//已被初始化
  console.log(this.$data); 	//已被初始化  
  console.log(this.message); 	//已被初始化  
},
mounted: function() {
  console.group(&#x27;------mounted 挂载结束状态------&#x27;);
  console.log(this.$el); 	//已被初始化
  console.log(this.$data); 	//已被初始化  
  console.log(this.message); 	//已被初始化  
},
beforeUpdate: function () {
  console.group(&#x27;beforeUpdate 更新前状态===============》&#x27;);
  console.log(&#x27;数据发生变化前&#x27;); 
},
updated: function () {
  console.group(&#x27;updated 更新完成状态===============》&#x27;);
  console.log(&#x27;数据发生变化了&#x27;);  
},
beforeDestroy: function () {
  console.group(&#x27;beforeDestroy 销毁前状态===============》&#x27;);
  console.log(&#x27;vue销毁前状态&#x27;);
},
destroyed: function () {
  console.group(&#x27;destroyed 销毁完成状态===============》&#x27;);
  console.log(&#x27;vue被销毁了&#x27;);
}
</pre>

这里提供一篇比较不错的文章，如果你不知道vue的生命周期如果在项目中使用，请看这里：[https://segmentfault.com/a/1190000008771768?_ea=1739750](https://segmentfault.com/a/1190000008771768?_ea=1739750 "vue生命周期使用方法")

**生命周期小结**<br>
- beforecreate : 可以在这加个loading事件，在加载实例时触发 <br>
- created : 初始化完成时的事件写在这里，常用于更新数据<br>
- mounted : 挂载元素，获取到DOM节点<br>
- updated : 如果对数据统一处理，在这里写上相应函数<br>
- beforeDestroy : 可以做一个确认停止事件的确认框<br>
- nextTick : 更新数据后立即操作dom，(this.$nextTick(() => {})<br>

**为什么说如果数据更新，你需要立即操作DOM元素的话，vue始终建议你使用 nextTick**<br>
**Vue 异步执行 DOM 更新**。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。<br>
如果同一个 watcher 被多次触发，只会被推入到队列中一次。<br>
例如，当你设置 vm.someData = 'new value' ，该组件不会立即重新渲染。当刷新队列时，组件会在事件循环队列清空时的下一个“tick”更新。<br>
多数情况我们不需要关心这个过程，但是如果你想在 DOM 状态更新后做点什么，这就可能会有些棘手。虽然 Vue.js 通常鼓励开发人员沿着“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。
<pre>
data () {
    return {
        message: &#x27;没有更新&#x27;
    }
},
methods: {
    updateMessage () {
        this.message = &#x27;更新完成&#x27;
        console.log(this.$el.textContent) // =&gt; &#x27;没有更新&#x27;
        this.$nextTick(function () {
            console.log(this.$el.textContent) // =&gt; &#x27;更新完成&#x27;
        })
    }
}
</pre>

## <h2 id="mustache">“Mustache”语法 (双大括号)使用注意点</h2> ##
> 你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击（跨站脚本攻击）。请只对可信内容使用 HTML 插值，绝不要对用户提供的内容使用插值。比如，你的这个元素内容将要被传输给后台数据库时，建议使用 v-html：
<pre>
&lt;p&gt;{{message}}&lt;/p&gt;		// 容易被xss攻击
&lt;p v-html=&quot;message&quot;&gt;&lt;/p&gt;	// 避免被xss攻击
</pre>

## <h2 id="butDisable">button的disabled属性</h2> ##
> 如果 isButtonDisabled 的值是 null、undefined 或 false，则 disabled 特性甚至不会被包含在渲染出来的 button 元素中。常用做button点击按钮是否被禁用上。如果你不使用button按钮来做点击处理，那你需要自己去绑定一个数据，让这个属性来判断是否需要绑定一个事件函数。
<pre>
&lt;button v-bind:disabled=&quot;isButtonDisabled&quot;&gt;Button&lt;/button&gt;
</pre>

## <h2 id="expression">使用 JavaScript 表达式</h2> ##
> 对于所有的数据绑定，Vue.js 都提供了完全的 JavaScript 表达式支持。有个限制就是，每个绑定都只能包含单个表达式；并且模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date ，你不应该在模板表达式中试图访问用户定义的全局变量。
<pre>
&lt;p&gt;{{ message.split(&#x27;&#x27;).reverse().join(&#x27;&#x27;) }}&lt;/p&gt;
&lt;p&gt;{{ new Date() }}&lt;/p&gt;
</pre>

## <h2 id="computed">计算属性computed的妙用</h2> ##
> 对于任何复杂逻辑，你都应当使用计算属性，并且它是双向数据绑定的，在你的数据发生变化时，计算属性会重新计算。反之，如果你的数据没有发生变化，那么计算属性函数将不会执行，而是使用之前缓存的结果返回给你，大大提高了代码执行效率。其实调用methods里面的方法同样可以达到计算属性的效果，但methods函数，在每次调用时都会重新执行一次。
<pre>
computed: {
    reversedMessage () {
        return this.message.split(&#x27;&#x27;).reverse().join(&#x27;&#x27;)
    }
}
</pre>
如果你逻辑中，比如需要给一个元素绑定复杂一点的class属性，不仿试试computed。
<pre>
&lt;div v-bind:class=&quot;classObject&quot;&gt;&lt;/div&gt;

computed: {
  classObject: function () {
    return {
      active: this.isActive &amp;&amp; !this.error
    }
  }
}
</pre>

## <h2 id="styles">v-bind:style的妙用</h2> ##
> 当 v-bind:style 使用需要添加浏览器引擎前缀的 CSS 属性时，如 transform，Vue.js 会自动侦测并添加相应的前缀。但这个东东一般不怎么用。
<pre>
&lt;div v-bind:style=&quot;styleObject&quot;&gt;&lt;/div&gt;

data: {
  styleObject: {
    color: 'red',
    fontSize: '13px',
    transform: '......'
  }
}
</pre>

## <h2 id="keys">用 key 管理可复用的元素</h2> ##
> Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。但这样的设计也会带来一些弊端，比如下面的代码：
<pre>
&lt;template v-if=&quot;loginType&quot;&gt;
  &lt;label&gt;Username&lt;/label&gt;
  &lt;input placeholder=&quot;用户名&quot;&gt;
&lt;/template&gt;
&lt;template v-else&gt;
  &lt;label&gt;Email&lt;/label&gt;
  &lt;input placeholder=&quot;邮箱地址&quot;&gt;
&lt;/template&gt;

&lt;button @click=&quot;changeLoginType&quot;&gt;点击切换&lt;/button&gt;
</pre>
> 那么在上面的代码中切换 loginType 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，input 不会被替换掉——仅仅是替换了它的 placeholder，这样做也是为了更加高效的渲染。所以你如果想要让其中的 input 元素是独立的，在每次切换的时候，value 值得到重新渲染，那么就要用到key值，让 input 元素独立出来，像下面这样，在每次切换时，input 的 value 值都会得到更新，而不是保留之前 input 的 value 值。
<pre>
&lt;template v-if=&quot;loginType&quot;&gt;
  &lt;label&gt;Username&lt;/label&gt;
  &lt;input placeholder=&quot;用户名&quot; key=&quot;username&quot;&gt;
&lt;/template&gt;
&lt;template v-else&gt;
  &lt;label&gt;Email&lt;/label&gt;
  &lt;input placeholder=&quot;邮箱地址&quot; key=&quot;email&quot;&gt;
&lt;/template&gt;

&lt;button @click=&quot;changeLoginType&quot;&gt;点击切换&lt;/button&gt;
</pre>

## <h2 id="vshow">v-show使用注意点</h2> ##
> 带有 v-show 的元素始终会被渲染并保留在 DOM 中。v-show 只是简单地切换元素的 CSS 属性 display。但是，注意，v-show 不支持 template 元素，也不支持 v-else。所以不要像下面这样使用：
<pre>
&lt;template v-show=&quot;loginType&quot;&gt;
  &lt;p&gt;不要这样用 v-show&lt;/P&gt;
&lt;/template&gt;
</pre>

## <h2 id="ifShow">什么情况下使用 v-if 和 v-show</h2> ##
> v-if 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。相比之下，v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
> 
> 所以，一般来说，v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

## <h2 id="forKey">v-for 中的 key 值</h2> ##
> 我们都知道，v-for 指令即可以渲染数组，也可以渲染对象，它是按照ES6中的Object.keys()方法进行渲染的：
<pre>
渲染数组:
&lt;ul&gt;
  &lt;li v-for=&quot;(item, index) in dataList&quot; :key=&quot;index&quot&gt;
    {{ index }} - {{ item.message }}
  &lt;/li&gt;
&lt;/ul&gt;

渲染对象:
&lt;ul&gt;
  &lt;li v-for=&quot;(value, key, index) in objectStyle&quot; :key=&quot;index&quot;&gt;
    {{index}}：{{ key }} - {{ value }}
  &lt;/li&gt;
&lt;/ul&gt;
</pre>

> 在上面的代码中可以看到，vue的官方文档也建议我们在使用 v-for 时加上key值，这是因为在进行 v-for 渲染时，如果数据发生变化，要导致重新渲染时，vue不会重头开始渲染，而是使用一个diff比较函数，去判断哪些数据节点发生了变化，然后以最高效的方法去渲染，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素。<br>
> 所以 vue 建议尽可能在使用 v-for 时提供 key 值，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。

## <h2 id="testing">数组更新检测</h2> ##
> Vue 包含一组观察数组的变异方法，所以它们也将会触发视图更新。下面这些方法都是 vue 经过重新封装的：<br>
> push()<br>
> pop()<br>
> shift()<br>
> unshift()<br>
> splice()<br>
> sort()<br>
> reverse()<br>
> 变异方法 ，顾名思义，会改变被这些方法调用的原始数组。相比之下，也有非变异方法，例如：filter(), concat() 和 slice() 。这些不会改变原始数组，但总是返回一个新数组。

**注意事项：由于 JavaScript 的限制，Vue 不能检测以下变动的数组：**<br>
1. 当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue <br>
2. 当你修改数组的长度时，例如：vm.items.length = newLength <br>

**为了解决第一类问题，请使用 Vue.set()方法，同时也将触发状态更新：**<br>
<pre>
&lt;button @click=&quot;changeArrayItem(2)&quot;&gt;点击改变数组中的某一项值&lt;/button&gt;

methods: {
	changeArrayItem() {
		Vue.set(数组, 下标值, 新值)
	}
}
</pre>
**为了解决第二类问题，你可以使用 splice：**<br>
<pre>
数组.splice(newLength)
</pre>

## <h2 id="testingObj">对象更改检测注意事项</h2> ##
> 还是由于 JavaScript 的限制，Vue 不能检测对象属性的添加或删除，所以往往看到在处理对象数据时，需要把所有要用到的属性，都一一添加到data数据中，但也可以使用 Vue.set() 方法向嵌套对象添加响应式属性。
<pre>
Vue.set(object, key, value)
</pre>

**有时你可能需要为已有对象赋予多个新属性，比如使用 Object.assign()。在这种情况下，你应该用两个对象的属性创建一个新的对象。所以，如果你想添加新的响应式属性，不要像这样：**<br>
<pre>
Object.assign(vm.userProfile, {
  age: 27,
  name: &#x27;小明&#x27;
})
</pre>

**你应该这样做：**<br>
<pre>
data里面的对象数据 = Object.assign({}, vm.userProfile, {
  age: 27,
  name: &#x27;小明&#x27;
})
</pre>

## <h2 id="vFor">一个组件的 v-for</h2> ##
> 2.2.0+ 的版本里，当在组件中使用 v-for 时，key 现在是必须的。<br>
<pre>
&lt;my-template v-for=&quot;(item, index) in dataList&quot; :key=&quot;index&quot;&gt;&lt;/my-template&gt;
</pre>

## <h2 id="events">事件对象的获取</h2> ##
> 有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 $event 把它传入:

<pre>
&lt;button v-on:click=&quot;warn(&#x27;message&#x27;, $event)&quot;&gt;Submit&lt;/button&gt;	

methods: {
  warn: function (message, event) {
    // 现在我们可以访问原生事件对象
    if (event) event.preventDefault()
    alert(message)
  }
}
</pre>

## <h2 id="vModel">v-model 修饰符</h2> ##
1. lazy：在默认情况下，v-model 在每次 input 事件触发后将输入框的值与数据进行同步 。你可以添加 lazy 修饰符，从而转变为使用 change 事件进行同步：<br>
	<pre>
	在“change”时而非“input”时更新
	&lt;input v-model.lazy=&quot;msg&quot; &gt;
	</pre>
2. number：如果想自动将用户的输入值转为数值类型
	<pre>
	&lt;input v-model.number=&quot;age&quot; type=&quot;number&quot;&gt;
	</pre>
3. trim：自动过滤用户输入的首尾空白字符
	<pre>
	&lt;input v-model.trim=&quot;msg&quot;&gt;
	</pre>

## <h2 id="comps">基础组件的自动化全局注册</h2> ##
> 可能你的许多组件只是包裹了一个输入框或按钮之类的元素，是相对通用的。我们有时候会把它们称为基础组件，它们会在各个组件中被频繁的用到。如果你不用自动化全局注册，那么你需要在没个用到它的组件里面都去导入并注册一次，很麻烦，所以全局注册这些基础组件是很有必要的。
<pre>
import Vue from &#x27;vue&#x27;
import upperFirst from &#x27;lodash/upperFirst&#x27;
import camelCase from &#x27;lodash/camelCase&#x27;

const requireComponent = require.context(
  // 基础组件目录的相对路径
  &#x27;./components/base&#x27;,
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName =&gt; {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 剥去文件名开头的 &#x60;&#x27;./&#x60; 和结尾的扩展名
      fileName.replace(/^\.\/(.*)\.\w+$/, &#x27;$1&#x27;)
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 &#x60;export default&#x60; 导出的，
    // 那么就会优先使用 &#x60;.default&#x60;，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
</pre>
<pre>
// 其他需要用到这些基础组件的页面，可以不用import去导入，而是直接使用
</pre>

## <h2 id="danlus">组件的单向数据流</h2> ##
> 所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。
> 
> 额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。
> 
> 所以通常的做法是，子组件通过 props 接收父组件的数据，而用 data 或者计算属性 computed 去初始化为自己的数据。
> 
<pre>
props: [&#x27;initialCounter&#x27;, &#x27;size&#x27;],
data () {
  return {
    counter: this.initialCounter
  }
},
computed: {
  normalizedSize: function () {
    return this.size.toLowerCase()
  }
}
</pre>
> 如果需要改变父级组件的数据，子组件就必须通过自定义事件的形式去触发父组件的事件，用父组件的事件去改变父组件的数据。
<pre>
methods: {
    changeParentData () {
        this.$emit(&#x27;changeData&#x27;, &#x27;传给父组件的数据&#x27;)
    }
}
</pre>

## <h2 id="namegf">组件自定义事件名规范</h2> ##
> 跟组件和 prop 不同，事件名不会被用作一个 JavaScript 变量名或属性名，所以就没有理由使用 camelCase 或 PascalCase 了。并且 v-on 事件监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)，所以 v-on:myEvent 将会变成 v-on:myevent——导致 myEvent 不可能被监听到。因此，vue 推荐你始终使用 kebab-case 的事件名。
<pre>
&lt;my-component v-on:my-event=&quot;doSomething&quot;&gt;&lt;/my-component&gt;

methods: {
    myEvent () {
        ........
    }
}
</pre>

## <h2 id="eventIs">自定义组件的is属性</h2> ##
> 自定义组件可以通过 v-bind 去绑定一个 is 属性，用来明确这个组件是否应该被渲染出来。
<pre>
&lt;component-a v-bind:is=&quot;isComponets==a&quot;&gt;&lt;/component-a&gt;
&lt;component-b v-bind:is=&quot;isComponets==b&quot;&gt;&lt;/component-b&gt;
</pre>

## <h2 id="keepAlive">keep-alive缓存组件</h2> ##
> 如果你进行组件的来回切换时，组件在切换回来之后的状态是不会被保存的，vue 会把组件重新渲染一遍，这样你的组件里面，比如有一个input输入框什么的话，原来在里面输入的内容在每次切换回来时都会被重新渲染，无法保存 value 值，所以你可以通过 keep-alive 来保存组件的状态。
<pre>
&lt;keep-alive&gt;
  &lt;component v-bind:is=&quot;isComponents&quot;&gt;&lt;/component&gt;
&lt;/keep-alive&gt;
</pre>

## <h2 id="keepAliveCmp">keep-alive</h2> ##
> **keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。**keep-alive 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。
> 
> 当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。
> 
> 当引入keep-alive的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated，**退出时触发deactivated。当再次进入（前进或者后退）时，只触发activated。**
> 
> 我们知道keep-alive之后页面模板第一次初始化解析变成HTML片段后，再次进入就不在重新解析而是读取内存中的数据，即，只有当数据变化时，才使用VirtualDOM进行diff更新。故，页面进入的数据获取应该在activated中也放一份。数据下载完毕手动操作DOM的部分也应该在activated中执行才会生效。
所以，应该activated中留一份数据获取的代码，**或者不要created部分，直接将created中的代码转移到activated中**。

## <h2 id="keepAliveDist">keep-alive 的两个缓存自定义组件属性</h2> ##
1. include - 字符串或正则表达式。只有匹配的组件会被缓存。
2. exclude - 字符串或正则表达式。任何匹配的组件都不会被缓存。

<pre>
export default {
  name: &#x27;test-keep-alive&#x27;,
  data () {
    return {
        includedComponents: &quot;test-keep-alive&quot;
    }
  }
}
</pre>
<pre>
&lt;keep-alive include=&quot;test-keep-alive&quot;&gt;
  &lt;!-- 将缓存name为test-keep-alive的组件 --&gt;
  &lt;component&gt;&lt;/component&gt;
&lt;/keep-alive&gt;

&lt;keep-alive include=&quot;a,b&quot;&gt;
  &lt;!-- 将缓存name为a或者b的组件，结合动态组件使用 --&gt;
  &lt;component :is=&quot;view&quot;&gt;&lt;/component&gt;
&lt;/keep-alive&gt;

&lt;keep-alive exclude=&quot;test-keep-alive&quot;&gt;
  &lt;!-- 将不缓存name为test-keep-alive的组件 --&gt;
  &lt;component&gt;&lt;/component&gt;
&lt;/keep-alive&gt;
</pre>

**结合router，缓存部分页面：**<br>
1. 使用$route.meta的keepAlive属性：
<pre>
&lt;keep-alive&gt;
    &lt;router-view v-if=&quot;$route.meta.keepAlive&quot;&gt;&lt;/router-view&gt;
&lt;/keep-alive&gt;
&lt;router-view v-if=&quot;!$route.meta.keepAlive&quot;&gt;&lt;/router-view&gt;
</pre>

2. 需要在 router 中设置路由元信息meta：
<pre>
export default new Router({
  routes: [
    {
      path: &#x27;/&#x27;,
      name: &#x27;Hello&#x27;,
      component: Hello,
      meta: {
        keepAlive: false // 不需要缓存
      }
    },
    {
      path: &#x27;/page1&#x27;,
      name: &#x27;Page1&#x27;,
      component: Page1,
      meta: {
        keepAlive: true // 需要被缓存
      }
    }
  ]
})
</pre>

**如果你的路由页面已经全局设置了keep-alive 但又不好在去向上面那样去结合router去做匹配的话，可以在不需要缓存的页面，去做销毁处理：**
<pre>
// 页面中使用生命周期销毁函数 deactivated 
deactivated () {
    this.$destory()
}
</pre>

## <h2 id="yibuCmp">异步组件</h2> ##
> 导入的自定义组件一开始不会加载，只有条件成立时才加载(webpack利用的是jsonp的原理实现的)。
<pre>
// 自定义组件
&lt;template&gt;
  &lt;div&gt;
    &lt;public-vue&gt;&lt;/public-vue&gt;
  &lt;/div&gt;
&lt;/template&gt;
</pre>

<pre>
// 需要用到该组件的路由页面
&lt;script&gt;
import publicVue from &#x27;该组件地址&#x27;
	
export default {
  components: {
    publicVue(resolve){
      setTimeout(()=&gt;{
        resolve(publicVue)    // 或者=&gt; resolve( require(&#x27;该组件地址&#x27;) )	
      }, 3000)
    }
  }
}
&lt;/script&gt;
</pre>

## <h2 id="routerLjz">vue 路由页面的懒加载</h2> ##
> 只有访问到该路由页面时，才加载该页面对应的文件，对于提升页面初始加载速度有很大帮助，经常用于中大型项目的开发中。

**使用场景：每个路由页面组件都是单独的js文件加载的**
<pre>
// 组件懒加载，以前是这样写的：import About from '路由地址'，现在改写成下面这样，使用方法不变
let Home = (resolve) =&gt; {
  return require.ensure([], ()=&gt;{
    resolve(require(&#x27;路由地址&#x27;))
  })
}

// 或者也可以写成这种形式：
let Home = () =&gt; {
  return import(&#x27;路由地址&#x27;)
}

// 导入路由信息
let router = new VueRouter({
  mode: &#x27;history&#x27;,
  routes: [
    {
      path: &#x27;/home&#x27;,
      name: &#x27;Home&#x27;,
      component: Home
    }
  ]
})
</pre>

## <h2 id="routerModel">关于路由页面的分模块配置</h2> ##
> 有时候在router的index.js文件里面配置所有的路由信息，在大中型项目中，未免有些臃肿，所有可以使用 使用ES6扩展运算符，分割路由，去分模块引入。

1. /src/router/ 下新建person.js文件，按项目功能划分好的功能文件夹（里面都是对应的功能模块路由，比如个人中心路由模块，与它关联的路由页面可能有好几个，假设这个文件夹在 src/module/person/index）:
	<pre>
	// 个人中心，相关路由规则(src/module/person/index.js)
	export default [
	  {
	    path: '/person',
	    name: 'Person',
	    component: resolve => require(['@/module/person/index'], resolve),
	    children: [
	      ......
	    ]
	  }
	]
	</pre>
2. 修改 /src/router/index.js 文件，引入路由配置文件:
	<pre>
	import Vue from &#x27;vue&#x27;
	import Router from &#x27;vue-router&#x27;
	import person from &#x27;./person&#x27;	// 个人中心模块路由
	
	Vue.use(Router)
	
	export default new Router({
	  mode: &#x27;history&#x27;,
	  routes: [
	    ...person
	  ]
	})
	</pre>


## <h2 id="scrollTop">记录页面滚动位置</h2> ##
<pre>
// 点击浏览器前进后退或者用路由切换视图的时候触发
scrollBehavior (to, from, savePosition) {   
  console.log(to)           // 要进入的目标路由对象
  console.log(from)         // 离开的目标路由对象
  console.log(savePosition) // 记录滚动条的坐标(点击浏览器前进后退按钮时记录)
  if (savePosition) {	    // 记录滚动条位置判断代码
    return savePosition
  } else {
    return { x: 0, y: 0 }
  }
}
</pre>

## <h2 id="setTitle">vue 动态title</h2> ##
<pre>
// 每个导航进入之后的执行函数，需要先设置路由元信息meta
vue实例.afterEach((to,from)=&gt;{            
  if(to.meta.title){
    window.document.title = to.meta.title;
  }else{
    window.document.title = &#x27;项目统一名称&#x27;;
  }
})
</pre>

## <h2 id="imgLazy">图片懒加载</h2> ##
> 图片出现在页面视口时才加载原有图片

1. 安装：npm install vue-lazyload
2. man.js里面引入以下代码
	<pre>
	import VueLazyload from &#x27;vue-lazyload&#x27;
	Vue.use(VueLazyload, {  
	 error: &#x27;图片地址&#x27;,
	 loading: &#x27;图片地址&#x27;
	})
	</pre>
3. 将img的 src 或 :src 改成 v-lazy
	<pre>
	&lt;img v-lazy=&quot;地图地址或数据&quot;&gt;
	</pre>


## <h2 id="directives">自定义指令</h2> ##
> Vue 也允许注册自定义指令。有的情况下，你需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。比如让一个 input 元素自动获得焦点。

当页面加载时，该元素将获得焦点 (注意：autofocus 在移动版 Safari 上不工作)。事实上，只要你在打开这个页面后还没点击过任何内容，这个输入框就应当还是处于聚焦状态。现在让我们用指令来实现这个功能：更多自定义指令请查看文档
<pre>
// 注册一个全局自定义指令 &#x60;v-focus&#x60;
Vue.directive(&#x27;focus&#x27;, {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
</pre>
如果想注册局部指令，组件中也接受一个 directives 的选项：
<pre>
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
</pre>
然后你可以在模板中任何元素上使用新的 v-focus 属性，如下：
<pre>
&lt;input v-focus&gt;
</pre>

## <h2 id="filter">自定义过滤器</h2> ##
> Vue.js 允许你自定义过滤器，可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和 v-bind 表达式 (后者从 2.1.0+ 开始支持)。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符号指示：详情请查看文档
<pre>
&lt;!-- 在双花括号中 --&gt;
{{ message | capitalize }}

&lt;!-- 在 &#x60;v-bind&#x60; 中 --&gt;
&lt;div v-bind:id=&quot;rawId | formatId&quot;&gt;&lt;/div&gt;
</pre>



# <h1 id="vux">vuex的使用</h1> #
专为Vue.js应用程序开发的“状态管理模式”；采用集中式存储管理应用的所有组件的状态；以相应的规则保证状态以一种可预测的方式发生变化。<br>
什么情况下使用Vuex:<br>
1. 多个视图依赖于同一个状态<br>
2. 来自不同视图的行为需要变更同一状态<br>

**使用步骤:**<br>
1. 安装vuex模块：npm install vuex --save<br>
2. 作为插件使用：Vue.use(Vuex)<br>
3. 定义容器：new Vuex.Store()<br>
4. 注入跟实例：{ store }<br>

在store的index.js里面配置vuex
<pre>
mport Vue from &#x27;vue&#x27;        	// 引入vue
import Vuex from &#x27;vuex&#x27;     	// 引入vuex
Vue.use(Vuex)       		// vuex作为插件使用

let store = new Vuex.Store({    // 定义一个容器
    state:{
    	count:&#x27;我是数据&#x27;
    },
    mutations:{
    	func1(state,payload){
    		console.log(&#x27;执行函数&#x27;)
    	}
    },
    actions: {        
        func111(context){
            setTimeout( ()=&gt; {      // 改变状态，提交mutations
                context.commit(&#x27;func1&#x27;)
            } ,1000)
        }
    }    
})
export default store;       // 吐出store接口
</pre>

在min.js里面注入store
<pre>
import store from '@/store/index'	// 引入store接口
......
// 启动Vue
new Vue({
    el: '#app',
    store: store,			// 注入store
    template: '<App />',
    components: {App}
})
</pre>

在其他组件页面
<pre>
&lt;template&gt;
  &lt;div @click=&quot;eventFn&quot;&gt;{{count}}&lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
  import {mapState,mapMutations,mapActions} from &#x27;vuex&#x27;
  
  exprot default {
    computed:{
        ...mapState([&#x27;count&#x27;])
    },
    methods:{
      ...mapMutations({
          eventFn:&#x27;func1&#x27;
      }),
      ...mapActions({
          .......
      })
    }
  }
&lt;/script&gt;
</pre>


# <h1 id="axios">axios的使用</h1> #
> 线上文档：[https://www.kancloud.cn/yunye/axios/234845](https://www.kancloud.cn/yunye/axios/234845 "axios")

# <h1 id="inputCursor">移动端input光标覆盖其他元素</h1> #
>移动端在 input 输入框获得焦点时，如果页面上有其他定位元素，在页面滚动时，input 所在区域如果会被那个定位元素覆盖的话，那么在 input 输入框获得焦点时，input 框上面的光标会覆盖在页面上，导致光标随着页面滚动而滚动，并且设置层级也无效。所以在处理这个问题的时候，可以使用 touchmove 事件，让页面或者 input 所在区域元素在滚动时，让这个元素失去焦点就可以解决这个问题。
<pre>
// 布局 这个div会随页面滚动，并且在滚动到上面某个位置的时候，会被其他元素覆盖
&lt;div @touchmove=&quot;inputWheel&quot;&gt;
   &lt;input type=&quot;text&quot; placeholder=&quot;请输入内容&quot; value=&quot;&quot;&gt;
&lt;/div&gt;

// vue.js
inputWheel(event) {             
    $(&#x27;input元素&#x27;).blur()
}
</pre>


# <h1 id="preventDefault">页面滚动限制</h1> #
> Vue 弹出层时 禁止页面滑动
<pre>
/***滑动限制***/
stop(){
  var mo = function(e){e.preventDefault();};
  document.body.style.overflow =&#x27;hidden&#x27;;
  document.addEventListener(&quot;touchmove&quot;,mo,false);//禁止页面滑动
},
/***取消滑动限制***/
move(){
  var mo = function(e){e.preventDefault();};
  document.body.style.overflow =&#x27;&#x27;;//出现滚动条
  document.removeEventListener(&quot;touchmove&quot;,mo,false);
},
</pre>

