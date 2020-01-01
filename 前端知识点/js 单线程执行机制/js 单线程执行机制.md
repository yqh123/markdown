# JavaScript 执行机制 #
javascript 是一门单线程的语言，什么是“单线程”？

打个比方，它就像一个只有一个窗口的银行，客户处理业务必须要一个一个的排队进行办理。同理 javascript 任务也需要一个一个的顺序执行。如果一个任务耗时过长，那么最后一个任务也必须等着。所以我们得出的结论是 javascript 是按照语句的顺序执行的。就像我们看到的最简单的 js 程序那样：

<pre>
var a = 1;
console.log(a)	// 1
var b = 2;
console.log(b)	// 2
</pre>

但由于我们的前端要处理的业务不可能这么简单，所以 js 代码可能是这样的：

<pre>
setTimeout(function(){
    console.log('1')
});

new Promise(function(resolve){
    console.log('2');
    for(var i = 0; i < 10000; i++){
        i == 99 && resolve();
    }
	console.log('3');
}).then(function(){
    console.log('4')
});

console.log('5');
</pre>

按照上面的理解，打印的结果应该是这样的： 1 2 3 4 5

但实际上得到是这样的结果：2 3 5 4 1

现在可以开始怀疑人生了，怎么和说好的不一样？


## javascript事件循环 ##
静下来好好想一下也能很好的理解，如果 js 是按照顺序执行的，那么在执行的过程中，有一个任务执行的耗时很长的话，那页面不得卡死吗，假如我们想浏览新闻，但是新闻包含的超清图片加载很慢，难道我们的网页要一直卡着直到图片完全显示出来？所以 javascript 又分出了 “同步任务” 和 “异步任务”。

当我们打开网站时，网页的渲染过程就是一大堆同步任务，比如页面骨架和页面元素的渲染。而像加载图片音乐之类占用资源大耗时久的任务，就是异步任务。

导图地址：[https://user-gold-cdn.xitu.io/2017/11/21/15fdd88994142347?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2017/11/21/15fdd88994142347?imageView2/0/w/1280/h/960/format/webp/ignore-error/1 "图片1")

- 同步和异步任务分别进入不同的执行场所，同步任务进入主线程；异步任务进入 Event Table 并注册函数
- 当指定事件完成时，Event Table（事件表） 会将这个函数移入到 Event Queue（事件队列）
- 主线程内的任务执行完毕为空时，主线程会去 Event Queue（事件队列） 里面读取对应的函数，并移入到主线程中执行
- 上述过程会不断重复，直到主线程中为空，也就是 javascript 线程里面的 Event loop（事件循环）
  
我们不禁要问了，那怎么知道主线程执行栈为空啊？ js 引擎存在 monitoring process（监听进程），会持续不断的检查主线程执行栈是否为空，一旦为空，就会去 Event Queue（事件队列） 那里检查是否有等待被调用的函数。

分析一下下面这段代码：
<pre>
$.ajax({
    url:www.javascript.com,
    data:[],
    success:() => {
        console.log('发送成功');
    }
})
console.log('2');
</pre>

解析过程：

1. 代码执行到 ajax 时，ajax 进入异步的 Event Table（事件表）中，并注册回调函数 success
2. console.log('2') 进入主线程中（你可以理解它进入了【宏任务（同步）】列队里面）
3. ajax 事件完成，回调函数 success 进入 Event Queue（事件队列）（你可以理解它进入了【宏任务（异步）】列队里面）

执行过程：

1. 开始先开始执行主线程【宏任务（同步）】列队中的任务 console.log('2')
2. 主线程【宏任务（同步）】列队为空时，从 Event Queue（【宏任务（异步）】列队里面） 中读取回调函数 success 并执行

所以执行结果为：2、发送成功


## setTimeout ##
大名鼎鼎的setTimeout无需再多言，大家对他的第一印象就是异步可以延时执行，我们经常这么实现延时3秒执行：

<pre>
setTimeout(() => {
    task()
},3000)

sleep(10000000)	// 这是一个同步函数
</pre>

按照定时器设置的时间，应该是 3s 后就会执行 task() 函数，但是实际中发现，task() 函数的执行时期远远超过 3s，这是为什么？先来看一下这段代码的执行过程：

1. task()进入Event Table并注册,计时开始。
2. 执行sleep函数，很慢，非常慢，但计时仍在继续中。
3. 3秒到了，计时事件 setTimeout 完成，task() 进入 Event Queue【宏任务（异步）】列队，但是 sleep 太慢了，还没执行完，只好等着主线程【宏任务（同步）】列队空闲能够空闲下来。
4. sleep 终于执行完了，task() 终于从 Event Queue【宏任务（异步）】列队进入了主线程执行，并开始执行

上述的流程走完，我们知道 setTimeout 这个函数，是经过指定时间后，把要执行的任务(本例中为task())加入到 Event Queue【宏任务（异步）】列队中，又因为是单线程任务要一个一个执行，如果前面的任务需要的时间太久，那么只能等着，导致真正的延迟时间远远大于3秒。

我们还经常遇到setTimeout(fn,0)这样的代码，0秒后执行又是什么意思呢？是不是可以立即执行呢？

答案是不会的，setTimeout(fn,0)的含义是，指定某个任务在主线程最早可得的空闲时间执行，意思就是不用再等多少秒了，只要主线程执行栈内的同步任务全部执行完成，栈为空就马上执行。举例说明：

<pre>
setTimeout(() => {
  console.log('2')
},0);
console.log('1');
</pre>

得到的结果依然是：1、2

关于 setTimeout 要补充的是，即便主线程为空，0毫秒实际上也是达不到的。根据HTML的标准，最低是4毫秒，某些浏览器的 js 引擎也可能是 10ms 或者 16ms。


## setInterval ##
上面说完了setTimeout，当然不能错过它的孪生兄弟setInterval。他俩差不多，只不过后者是循环的执行。对于执行顺序来说，setInterval会每隔指定的时间将注册的函数置入Event Queue【宏任务（异步）】列队，如果前面的任务耗时太久，那么同样需要等待。

唯一需要注意的一点是，对于 setInterval(fn,ms) 来说，我们已经知道**不是每过 ms 秒会执行一次 fn，而是每过 ms 秒，会有 fn 进入 Event Queue【宏任务（异步）】列队**。


## Promise 和 async ##
先看一下下面这段代码：

<pre>
setTimeout(function() {
    console.log('setTimeout');
})

new Promise(function(resolve) {
    console.log('promise');
}).then(function() {
    console.log('then');
})

console.log('console');
</pre>

这里 setTimeout 和 Promise 都是异步的，它们都会进入到 Event Table 中，并进入到 Event Queue【宏任务（异步）】列队 里面，那么它们两个谁先执行呢？

除了广义的同步任务和异步任务，js 对任务有更精细的定义：

> 提示：其实宏任务中包括 “整体js代码”，但为了更好的理解“【宏任务（同步）】列队”和“【宏任务（异步）】列队”，我们把它先排除掉，不然理解起来太饶。比如真正的理解是这样的：

<pre>
1. 先找到【宏任务（同步）】任务，先执行它里面的【宏列队】，执行完后在执行它里面的【微列队】
2. 然后在按顺序找到【宏任务（异步）】任务（异步任务可能有多个），先执行它里面的【宏列队】，执行完后在执行它里面的【微列队】

宏任务（同步）：{ 
  宏列队：
  微列队：
}

宏任务（异步1：）：{
  宏列队：
  微列队：
}

宏任务（异步2：）：{
  宏列队：
  微列队：
}
</pre>

- macro-task（宏任务）：包括 整体代码script、setTimeout，setInterval
- micro-task（微任务）：Promise（then方法）或者 async（then方法和第二个后面的 awiat）（这个下面有讲）

不同类型的任务会进入对应的任务列队中，比如 setTimeout 和 setInterval 会进入【宏任务（异步）】列队里面。而 Promise 的 then 方法会进入微任务列队里面。

事件循环（Event loop）的顺序，决定 js 代码的执行顺序：看下面的解析过程

<pre>
setTimeout(function() {
  console.log(1);
}, 1000);

new Promise(function(resolve) {
  console.log(2);
  resolve();
}).then(function() {
  console.log(3);
});

setTimeout(function() {
  new Promise(function(resolve) {
    console.log(4);
    resolve();
  }).then(function() {
    console.log(5);
  });
}, 2000);

console.log(6);
</pre>

- 这段代码作为宏任务，进入主线程
- 先遇到 setTimeout，那么将其回调函数注册后分发到【宏任务（异步）】的事件列队中
- 接下来遇到了 Promise，new Promise立即执行，then 函数分发到【宏任务（同步）】列队里面的微任务列队中
- 遇到console.log()，分发到【宏任务（同步）】列队里面的宏任务列队中
- 排列完毕，开始第一轮循环，从【宏任务（同步）】开始，先执行【宏列队】，完了之后在执行【微列队】
- 然后在执行【宏任务（异步）】列队，先执行【宏列队】，完了之后在执行【微列队】
- 事件循环结束

<pre>
宏任务（同步）：{ 
  宏列队：console.log(2)、console.log(6);
  微列队：console.log(3)
}

宏任务（异步 setTimeout 1000）：{
  宏列队：console.log(1)
  微列队：
}

宏任务（异步 setTimeout 2000）：{
  宏列队：console.log(4)
  微列队：console.log(5)
}
</pre>

导图地址：[https://user-gold-cdn.xitu.io/2017/11/21/15fdcea13361a1ec?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2017/11/21/15fdcea13361a1ec?imageView2/0/w/1280/h/960/format/webp/ignore-error/1 "img2")

**我们来分析一段较复杂的代码：**
<pre>
console.log('1');

setTimeout(function() {
  console.log('2');

  new Promise(function(resolve) {
    console.log('3');
    resolve();
    console.log('4');
  }).then(function() {
    console.log('5')
  })
})

new Promise(function(resolve) {
  console.log('6');
  resolve();
  console.log('7');
}).then(function() {
  console.log('8')
})

console.log('9');
</pre>

解析：
<pre>
宏任务（同步）：{
  宏列队：1 6 7 9
  微列队：8
}

宏任务（异步）：{
  宏列队：2 3 4
  微列队：5
}
</pre>

从上面可以看出，先去区分【宏任务（同步）】和【宏任务（异步）】，然后在区分【宏任务（同步、异步）】里面的宏列队和微列队。

第一轮循环：从【宏任务（同步）】中开始先执行宏列队，然后在执行微列队

第二轮循环：从【宏任务（异步）】中开始先执行宏列队，然后在执行微列队

执行结果：1、6、7、9、8、2、3、4、5



**现在我们又加深下难度：添加两个 setTimeout**
<pre>
console.log("1");

setTimeout(function() {
  console.log("2");

  new Promise(function(resolve) {
    console.log("3");
    resolve();
  }).then(function() {
    console.log("4");
  });
}, 2000);

new Promise(function(resolve) {
  console.log("5");
  resolve();
}).then(function() {
  console.log("6");
});

setTimeout(function() {
  console.log("7");

  new Promise(function(resolve) {
    console.log("8");
    resolve();
  }).then(function() {
    console.log("9");
  });
}, 1000);

console.log("10");
</pre>


解析：
<pre>
宏任务（同步）：{
  宏列队：1 5 10
  微列队：6
}

宏任务（异步：setTimeout 1000）：{
  宏列队：7 8
  微列队：9
}

宏任务（异步：setTimeout 2000）：{
  宏列队：2 3
  微列队：4
}
</pre>


执行结果：（1、5、10、6）---（7、8、9）---（2、3、4）

**值得注意的地方是两个 setTimeout 中都有各自的 “微任务”，它们是不会在分解的，而是在各自的 setTimeout 中全部执行完毕。当宏任务中第一个 setTimeout 内部执行完后，才开始执行第二个 setTimeout。**

**需要注意的另外一点是，到底哪个 setTimeout 先进入事件循环，有两个因素：第一看它们的代码顺序，靠前的先执行；第二，看延时时间，时间越小，越先进入事件循环。**

关于定时器的【宏任务（异步）】添加执行列队的顺序请看下面这个列子：

<pre>
console.log(1);

setTimeout(() => {
  console.log(2);
}, 2000);

new Promise((resolve, reject) => {
  console.log(3);
  resolve();
}).then(() => {
  console.log(4);
});

setTimeout(() => {
  console.log(5);
  setTimeout(() => {
    console.log(6);
  }, 3000);
}, 1000);
</pre>

注意 1000ms 的定时器里面还有一个 3000ms 的定时器，按顺序解析如下：

<pre>
宏任务（同步）：{
  宏列队：1 3
  微列队：4
}

宏任务（异步：setTimeout 1000）：{
  宏列队：5
  微列队：
}

宏任务（异步：setTimeout 2000）：{
  宏列队：2
  微列队：
}

宏任务（异步：setTimeout 3000）：{
  宏列队：6
  微列队：
}
</pre>

从上面可以看出，不管你有多少个定时器的异步任务，我都是按照你的时间顺序来排列【宏任务（异步）】的

执行结果：（1、3、4）---（5）---（2）---（6）


## Generator ##
Generator 函数是 ES6 提供的一种异步编程的解决方案（它不是异步函数，它可以理解为一个异步任务的容器）。

<pre>
setTimeout(function(){
  console.log(1)
},0)

function * sun() {
  yield console.log(2)
}

var sunG = sun();
sunG.next()	// 这里会立马执行 yield 后面的同步程序

console.log(3);
</pre>

执行结果为：2、3、1

现在改一下代码，把 yield 后面执行的函数改成异步的：

<pre>
var fn = function() {
  setTimeout(() => {
    console.log(3);
  }, 2000);
};

function* sun() {
  console.log(1);
  yield fn();
}

setTimeout(function() {
  console.log(2);
}, 1000);

var sunG = sun();
sunG.next();

console.log(4);
</pre>

看代码就有点迷糊了，直接按上面的【宏任务（同步、异步）】来解析看下：

<pre>
宏任务（同步）：{
  宏列队：1 4
  微列队：
}

宏任务（异步：setTimeout 1000）：{
  宏列队：2
  微列队：
}

宏任务（异步：setTimeout 2000）：{
  宏列队：3
  微列队：
}
</pre>

定时器还是只看它的执行时间，这样就容易排列任务列队了

执行结果为：1、4、2、3

通过上面的测试我们发现，Generator 函数，如果 yield 语句是同步的，那么就是主线程中执行的同步函数；如果是异步的，那么它的执行更两个因素有关，执行顺序和执行耗时：

- 执行耗时一样的话，上面的先执行
- 执行耗时不一样的话，耗时小的先执行

其实根本原因还是上面的 【宏任务（同步）】 和 【宏任务（异步）】 的执行顺序。


## async 和 awiate ##
async 它是 Generator 函数的语法糖，代表里面有异步程序。同时 async 函数的调用会立即返回一个 Promise() 对象。

async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。

<pre>
async function sum() {
  console.log(1);
  await fn1();
  await console.log(99);
  console.log(100)
}

function fn1() {
  return new Promise((resolve, reject) => {
    console.log(2);
    resolve();
  }).then(() => {
    console.log(3);
  });
}

sum();

setTimeout(() => {
  console.log(4);
}, 1000);

console.log(5);
</pre>

解析：

<pre>
宏任务（同步）：{
  宏列队：1 2 5
  微列队：3 99 100
}

宏任务（异步 setTimeout 1000）：{
  宏列队：4
  微列队：
}
</pre>

上面有个疑惑的点，就是 await 应该是 Promise 对象 then 的语法糖，按道理来说，await 的执行应该在【微列队】里面，但第一个执行的 await 并没有体现出来，而是直接放在了【宏列队】里面，从第二个开始才把它都放到【宏任务（同步）】里面的【微列队】里面，而且 await 之后的代码，如果是同步的，都在【宏任务（同步）】里面的【微列队】里面；如果是异步的，那就要放到【宏任务（异步）】里面去在执行

<pre>
async function sum() {
  console.log(1);
  await fn1();
  await fn2();
  console.log(99);
}

function fn1() {
  return new Promise((resolve, reject) => {
    console.log(2);
    resolve();
  }).then(() => {
    console.log(3);
  });
}

function fn2() {
  return new Promise((resolve, reject) => {
    console.log(4);
    resolve();
  }).then(() => {
    console.log(5);
  });
}

new Promise((resolve, reject) => {
  console.log(6);
  resolve();
}).then(() => {
  console.log(7);
});

setTimeout(() => {
  console.log(9);
}, 0);

sum();

console.log(10);
</pre>

从上面可以看出，async 返回了一个 Promise，然后马上执行它的代码，它的第一个 await 被放入了【宏任务（同步）】里面执行；而之后的 await 被放入了【宏任务（异步）】里面去执行，并且执行权要远高于所有的定时器

解析过程：

<pre>
宏任务（同步）：{
  宏列队：6 1 2 10
  微列队：7 3
}

宏任务（异步 第二个 await）：{
  宏列队：4
  微列队：5
}

宏任务（异步 第二个 await 之后）：{
  宏列队：99
  微列队：
}

宏任务（异步 setTimeout 0）：{
  宏列队：9
  微列队：
}
</pre>


## 总结 ##
1. 先区分出【宏任务（同步）】和【宏任务（异步）】；【宏任务（同步）】先执行完成后在执行【宏任务（异步）】
2. 【宏任务（同步、异步）】的任务里面，在区分【宏列队】和【微列队】；【宏列队】执行完成后在执行【微列队】
3. 定时器添加进入宏任务执行列队的顺序是按照它的时间来排列的
4. 对于特殊的 async 函数的第一个 await 会被放入【宏任务（同步）】里面执行，后面的都会放入【宏任务（异步）】里面去执行

<pre>
宏任务（同步）：{ 
  宏列队：
  微列队：
}

宏任务（异步1：）：{
  宏列队：
  微列队：
}

宏任务（异步2：）：{
  宏列队：
  微列队：
}
</pre>