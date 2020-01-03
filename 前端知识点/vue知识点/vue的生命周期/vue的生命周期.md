# Vue 实例的生命周期 #
Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。通俗说就是 Vue 实例从创建到销毁的过程，就是生命周期。

在实例中分别在每个生命周期钩子中 console.log('钩子名称',this.number) 我们发现，第一次页面加载时触发了beforeCreate, created, beforeMount, mounted 这几个钩子，data 数据在 created 中可获取到。

再去 console.log('mounted: ', document.getElementsByTagName('p')[0]) ，DOM 渲染在 mounted 中已经完成。<br>

我们再试着去更改 input 输入框中的内容，可以看到输入框上方的数据同步发生改变，这就是数据绑定的效果，在更新数据时触发 beforeUpdate 和 updated 钩子，且在 beforeUpdate 触发时，数据已更新完毕。

而 destroy 仅在调用app.$destroy();时触发，对 vue 实例进行销毁。销毁完成后，我们再重新改变 number 的值，vue 不再对此动作进行响应了。但是原先生成的dom元素还存在，可以这么理解，执行了destroy操作，后续就不再受vue控制了。

<img src="./img1.jpg" width="100%" />

## Vue.nextTick ##
在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

<pre>
Vue.nextTick(function () {
  // DOM 更新了
})
</pre>

官方还提供了一种写法，vm.$nextTick，用 this 自动绑定到调用它的实例上

<pre>
created() {
    setTimeout(() =&gt; {
          this.number = 100
          this.$nextTick(() =&gt; {
            console.log(&#x27;nextTick&#x27;, document.getElementsByTagName(&#x27;p&#x27;)[0])
          })
    },100)
}
</pre>

**什么时候需要到Vue.nextTick()**

在 Vue 生命周期的 created() 钩子函数进行的 DOM 操作一定要放在 Vue.nextTick() 的回调函数中。原因是什么呢，原因是

在 created() 钩子函数执行的时候 DOM 其实并未进行任何渲染，而此时进行 DOM 操作无异于徒劳，所以此处一定要将 DOM 操作

的 js 代码放进 Vue.nextTick() 的回调函数中。与之对应的就是 mounted 钩子函数，因为该钩子函数执行时所有的 DOM 挂载和
渲染都已完成，此时在该钩子函数中进行任何DOM操作都不会有问题。 

所以，在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的 DOM 结构的时候，这个操作都应该放进 Vue.nextTick() 的回调函数中。


## 总结 ##
Vue实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模板、挂载Dom、渲染→更新→渲染、销毁等一系列过程，我们称这是Vue的生命周期。通俗说就是Vue实例从创建到销毁的过程，就是生命周期。总共分为8个阶段如下所示：

1. beforeCreate----创建前：组件实例被创建时，组件属性计算之前，数据对象data都为undefined，未初始化。
2. created----创建后：组件实例创建完成，属性已经绑定，数据对象data已存在，但dom未生成，$el未存在。
3. beforeMount---挂载前：vue实例的$el和data都已初始化，挂载之前为虚拟的dom节点，data.message未替换。
4. mounted-----挂载后：vue实例挂载完成，data.message成功渲染。
5. beforeUpdate----更新前：当data变化时，会触发beforeUpdate方法。
6. updated----更新后：当data变化时，会触发updated方法。
7. beforeDestory---销毁前：组件销毁之前调用。
8. destoryed---销毁后： 组件销毁之后调用，对data的改变不会再触发周期函数，vue实例已解除事件监听和dom绑定，但dom结构依然存在。


## 应用 ##

- beforecreate : 可以在这加个loading事件，在加载实例时触发 
- created : 初始化完成时的事件写在这里，如在这结束loading事件，异步请求也适宜在这里调用
- mounted : 挂载元素，获取到DOM节点
- updated : 如果对数据统一处理，在这里写上相应函数
- beforeDestroy : 可以做一个确认停止事件的确认框
- nextTick : 更新数据后立即操作dom

























