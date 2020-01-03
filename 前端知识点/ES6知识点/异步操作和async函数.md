# 前言 #
异步编程对 javascript 及其重要，因为 javascript 只有一个线程，如果没有异步的操作，那么程序甚至会卡死，基本没法用。

在 ES6 之前，前端处理异步操作的方式主要有：回调函数、事件处理程序、Promise 对象等。

ES6 将异步操作带人了一个全新的领域，而 ES7 中的 async 更是给出了异步操作的终极处理方案。随然 async 是 ES7 中的内容，但是目前主流的转码器 Babel 等转换器都对它做了转换处理。


# 什么是异步 #
所谓异步，简单的说就是将一个任务分成多段执行，比如先执行其中一个任务，然后等待时机成熟时，在去执行其他任务。

javascript 对异步的实现其实就是回调函数。所谓回调函数，就是把任务的第二段写在一个函数中，等到时机成熟时，在去调用这个函数即可实现异步的操作。


# 为什么说 async 是异步的最佳方案 #
**回调函数**：多次回调，代码臃肿，不便于维护和梳理

**Promise**：就是因为回调函数的弊端，所以 Promise 出现了，它不是新的语法功能，而是一种新的写法。它是对回调函数的改进，它的最大问题也是 then 方法使用过多时操作代码比较沉余，不管什么操作，一眼望去都是一堆的 then 方法，原来的语义也变得不是很清晰。

**Generator 函数**：它是 ES6 中新产出的一种处理异步操作的方法，最大的特点就是可以交出函数的执行权利（yield 语句：暂停执行），使用 next 方法继续沿着上次执行的地方继续往下执行。它的每一次执行不会返回结果，而是返回一个对象指针，调用 next 方法就是移动指针的意思。它的问题有，代码在某些处理函数中变得相对复杂，不易读懂，也不易管理流程。而且原生不能支持一次执行，必须借助 co 等模块去处理。


# async 函数 #
async 使得异步操作更加方便，它是 Generator 函数的一种语法糖

<pre>
function fn1() {
  return new Promise((resolve, reject)=>{
    resolve(1)
  })
}
function fn2() {
  return new Promise((resolve, reject)=>{
    resolve(2)
  })
}

var generators = async function () {
  var f1 = await fn1()
  var f2 = await fn2()
  console.log(f1) // 1
  console.log(f2) // 2
  return f1 + f2
}

generators().then((val)=>{
  console.log(val)  // 3
})
</pre>

从上面的例子可以看出，async 函数其实就是 Generator 函数的另一种实现方式，它把 * 号换成了 async，把 yield 语句换成了 await 语句，仅此而已。


**async 函数对 Generator 函数的改进体现在以下4点中：**

1. 内置执行器：Generator 函数的一次执行必须依靠执行器，所以才有了 co 模块，而 async 自带执行器。比如下面的代码，不使用 co 模块就可以完成 Generator 函数的一次遍历执行
	<pre>
	var generators = async function () {
	  var f1 = await fn1()
	  var f2 = await fn2()
	}
	var result = generators()	// 全部执行了 next 方法
	</pre>
2. 更好的语义：async 表示函数里面有异步操作，await 表示紧跟在后面的表达式需要等待执行结果（一旦遇到 await 就会先返回，等到触发的异步操作完成后，在接着执行函数体内后面的语句）
3. 返回值是 Promise 对象：如果 async 函数其实返回的也是一个新的 Promise 对象，可以和 Promise 使用方式一样，处理 generator 函数调用的后续操作。


## await 语句使用注意点 ##

1. 因为 await 后面跟着的 promise 对象，可能会执行 reject，所以建议把 await 语句放在 try...catch 语句中：

	<pre>
	var generators = async function () {
	  try {
	    var f1 = await fn1()
	  } catch(err) {
	    console.log(err);
	  }

	  try {
	    var f2 = await fn2()
	  } catch(err) {
	    console.log(err); // 抛出错误
	  }
	
	  return f1 + f2
	}
	
	generators().then((val)=>{
	  console.log(val)  // NaN
	})
	</pre>
2. await 不能用在普通函数中，否则报错
3. ES6 中 await 为保留字，在 ES6 中使用它去声明变量会报错（ES5 中是可以的）


# 一个动画的实例 #
假设有这么一个动画，后一个动画需要等待前一个动画执行完毕后在执行，比如透明度从 0-1 之间的来回变化把。<br>

jquery 的传统回调写法：

<pre>
$(&#x27;#box&#x27;).animate({opacity: 0}, 100, function() {
  $(this).animate({opacity: 1}, 100, function() {
    $(this).animate({opacity: 0}, 100, function() {
      $(this).animate({opacity: 1}, 100, function() {
        $(this).animate({opacity: 0}, 100, function() {
          $(this).animate({opacity: 1}, 100, function() {
            console.log(&#x27;动画执行完成&#x27;)
          });
        });
      });
    });
  });
});
</pre>

async 函数写法：

<pre>
async function animates() {
  let oBox = $('#box')
  await oBox.animate({opacity: 0}, 100)
  await oBox.animate({opacity: 1}, 100)
  await oBox.animate({opacity: 0}, 100)
  await oBox.animate({opacity: 1}, 100)
}

animates()
</pre>

你觉得哪个简单，且易懂？


