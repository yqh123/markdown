## v-cloak ##
它并不是表达式，它会在Vue实例结束编译时从绑定的html元素身上移除，它的作用是，当网速比较慢时，vue.js还没有加载完，这个时候，你在元素上通过 {{data}} 语句绑定数据时，页面会把它显示出来，这样用户会感觉到很奇怪，所以添加上这个指令，并且和css进行配合时，就不会出现这种情况了。<br>
不过在 vue-cli 中，如果html结构只有一个空的div元素时，剩余的内容都是有路由去挂载不同组件完成时，v-cloak 将发挥不了作用。

<pre>
// html
&lt;p v-cloak&gt;{{num}}&lt;/p&gt;

// css
[v-cloak] {display: none}
</pre>


## v-once ##
v-once这个指令不需要任何表达式，它的作用就是定义它的元素或组件只会渲染一次，包括元素或者组件的所有字节点。首次渲染后，不再随着数据的改变而重新渲染。也就是说使用v-once，那么该块都将被视为静态内容。<br>
这个指令很少在用到，除非你的产品需求有这个要求。


## v-model（单选框） ##
只需要在单选按钮上都绑定 v-model 那么在单选时，选中的那一项的value值，会同步到 v-model 绑定的数据上。同理，如果 v-model 绑定的数据和单选框的某一个value值一样，那么该单选框会被选中。
<pre>
&lt;div id=&quot;app&quot;&gt;
	&lt;input type=&quot;radio&quot; v-model=&quot;value&quot; value=&quot;css&quot;&gt; css
	&lt;input type=&quot;radio&quot; v-model=&quot;value&quot; value=&quot;js&quot;&gt; js
	&lt;p&gt;{{value}}&lt;/p&gt;
&lt;/div&gt;

&lt;script&gt;
var vm = new Vue({
	el: &#x27;#app&#x27;,
	data() {
		return {
			value: &#x27;&#x27;
		}
	}
})
&lt;/script&gt;
</pre>


## v-model（复选框） ##
和单选框用法差不多，只是 v-model 绑定的数据为数组形式，每选中一个，这个vue绑定的数据就会push一个选中的数据。如果 v-model 绑定的数据（数组）中，含有和复选框value一样的值，那么该复选框将会被选中。
<pre>
&lt;div id=&quot;app&quot;&gt;
	&lt;input type=&quot;checkbox&quot; v-model=&quot;value&quot; value=&quot;css&quot;&gt; css
	&lt;input type=&quot;checkbox&quot; v-model=&quot;value&quot; value=&quot;js&quot;&gt; js
	&lt;p v-show=&quot;value.length&quot;&gt;{{value}}&lt;/p&gt;
&lt;/div&gt;

&lt;script&gt;
var vm = new Vue({
	el: &#x27;#app&#x27;,
	data() {
		return {
			value: [&#x27;css&#x27;]
		}
	}
})
&lt;/script&gt;
</pre>


## $nextTick ##
vue 有一个“异步更新列队”的机制，vue在观察到数据发生变化时，并不是直接更新DOM节点，而是开启一个列队，把同一事件的循环中发生的所有数据改变做统一处理，在列队的缓存时期会进行去除重复数据，从而避免不必要的计算和DOM操作。比如你用一个for循环动态改变数据10000次，其实它只会应用最后一次的改变，也就是说，vue观察到了最后一次同一数据的改变时，在更新到 viewModel 视图模型上，然后在更新到视图上，并不会直接更新视图10000次。<br>
所以当数据发生变化时，如果马上操作DOM节点，该DOM节点是获取不到的，因为这个时候正是vue进入“异步列队”的时期，你只有等“异步列队”执行完之后才能操作DOM节点。<br>
**所以数据发生变化，需要马上操作DOM节点，那么所有的DOM操作都应该放在 $nextTick 里面**，因为该方法的执行，一定是在“异步列队”执行完之后才执行的函数。
<pre>
&lt;div id=&quot;app&quot;&gt;
	&lt;p v-if=&quot;isIf&quot; id=&quot;text&quot;&gt;这是一段文本&lt;/p&gt;
	&lt;button type=&quot;button&quot; @click=&quot;getText&quot;&gt;获取文本内容&lt;/button&gt;
&lt;/div&gt;

&lt;script&gt;
var vm = new Vue({
	el: &#x27;#app&#x27;,
	data() {
		return {
			isIf: false
		}
	},
	methods: {
		getText() {
			this.isIf = true	// 这里数据发生变化，开启异步列队
			this.$nextTick(function() {
				let text = document.getElementById(&#x27;text&#x27;).innerHTML
				console.log(text)
			})
		}
	}
})
&lt;/script&gt;
</pre>

