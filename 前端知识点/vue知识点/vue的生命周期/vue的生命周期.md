# Vue 实例的生命周期 #
Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模板、挂载Dom→渲染、更新→渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。通俗说就是 Vue 实例从创建到销毁的过程，就是生命周期。<br>

在实例中分别在每个生命周期钩子中 console.log('钩子名称',this.number) 我们发现，第一次页面加载时触发了beforeCreate, created, beforeMount, mounted 这几个钩子，data 数据在 created 中可获取到。<br>

再去 console.log('mounted: ', document.getElementsByTagName('p')[0]) ，DOM 渲染在 mounted 中已经完成。<br>

我们再试着去更改 input 输入框中的内容，可以看到输入框上方的数据同步发生改变，这就是数据绑定的效果，在更新数据时触发 beforeUpdate 和 updated 钩子，且在 beforeUpdate 触发时，数据已更新完毕。<br>

而 destroy 仅在调用app.$destroy();时触发，对 vue 实例进行销毁。销毁完成后，我们再重新改变 number 的值，vue 不再对此动作进行响应了。但是原先生成的dom元素还存在，可以这么理解，执行了destroy操作，后续就不再受vue控制了。<br>


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

<pre>
在 Vue 生命周期的 created() 钩子函数进行的 DOM 操作一定要放在 Vue.nextTick() 的回调函数中。原因是什么呢，原因是
在 created() 钩子函数执行的时候 DOM 其实并未进行任何渲染，而此时进行 DOM 操作无异于徒劳，所以此处一定要将 DOM 操作
</pre>

的 js 代码放进 Vue.nextTick() 的回调函数中。与之对应的就是 mounted 钩子函数，因为该钩子函数执行时所有的 DOM 挂载和
渲染都已完成，此时在该钩子函数中进行任何DOM操作都不会有问题。<br>

所以，在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的 DOM 结构的时候，这个操作都应该放进 Vue.nextTick() 的回调函数中。


# 生命周期小结 #

- beforecreate : 可以在这加个loading事件，在加载实例时触发 
- created : 初始化完成时的事件写在这里，如在这结束loading事件，异步请求也适宜在这里调用
- mounted : 挂载元素，获取到DOM节点
- updated : 如果对数据统一处理，在这里写上相应函数
- beforeDestroy : 可以做一个确认停止事件的确认框
- nextTick : 更新数据后立即操作dom

























