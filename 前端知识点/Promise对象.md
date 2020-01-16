# Promise 的含义 #
所谓 promise，其实就是一个对象，用来传递异步操作的消息。它代表某个未来才会知道结果的事件（通常是一个异步操作），并且为该事件提供统一的 API，可供进一步处理。<br>
有了 Promise 对象，就可以把异步操作以同步的模式进行处理（有点像 Generator 函数），避免了层层嵌套回调函数的麻烦，并且 Promise 提供统一的接口，使得控制异步操作更加容易。


# Promise 的两个特点 #
1. **对象的状态不受外界影响**：promise 对象代表一个异步操作，它有3种状态，Pending（进行中）、Resolved（已完成）、Rejected（已失败）。只有异步操作之后的结果才能知道它是哪一种状态，任何其他的操作都无法改变这个状态。这也是 Promise 名字的由来，它的英文直译是“承诺”。
2. **一旦状态改变，就不会在变**：Promise 对象执行过程中，只会得到两种结果，要么成功，要么失败。只要其中一个发生了，那么状态就固定了，会一直保持这个状态，不会在改变。


# 基本用法 #
ES6 规定 Promise 对象是一个构造函数，用来统一生成 Promise 函数：

<pre>
var promise = new Promise(function(resolve, reject) {
  // ...some code

  if (/*异步操作成功*/) {
    resolve(value)
  } else {
    reject(error)
  }
})
</pre>

Promise 构造函数接收一个函数作为参数，该函数参数接收两个函数，resolve 和 reject，它们是由 Javascript 引擎提供，不用自己去部署。<br>
resolve 的作用是，将 Promise 对象的状态从 “未完成” => “已完成”，在异步操作成功时调用，并将异步操作的结果作为参数传递出去。<br>
reject 的作用是，将 Promise 对象的状态从 “未完成” => “已完成”，在异步操作失败时调用，并将异步操作失败的结果作为参数传递出去。<br>

Promise 对象实例生成后，可以使用 then 方法，分别指定异步操作的两种状态，resolve（成功）和 reject（失败），两个函数都接收 Promise 对象传出的值作为参数。

<pre>
promise.then(function(value){
  // 成功的回调
}, function(value) {
  // 失败的回调
})
</pre>

或者写成这样：

<pre>
promise.then(function(value){
  // 成功的回调
})

promise.catch(function(value){
  // 失败的回调
})
</pre>

看看下面这个简单的例子：

<pre>
function timeOut(ms) {
  return new Promise((resolve, reject)=>{
    setTimeout(resolve('异步函数执行成功'), ms, 'done')
  })
}

timeOut(1000).then((value)=>{
  console.log(value)	// 异步函数执行成功
})
</pre>

我们用 setTimeout 定时器模拟一个异步执行函数，它会在 1s 之后执行 promise 对象成功的回调函数 resolve 函数，resolve 成功执行后，会把参数传递给 then 方法的第一个函数参数，然后执行该函数参数方法。

在封装一个图片加载的 Promise 对象：

<pre>
function loadImageAsync (url) {
  return new Promise((resolev, reject)=&gt;{
    var image = new Image();

    // 图片加载成功
    image.onload = function() {
      resolev(image)
    }

    // 图片加载失败
    image.onerror = function() {
      reject(new Error(&#x27;图片加载失败&#x27;))
    }

    image.src = url;
  })
}

loadImageAsync(&#x27;图片地址&#x27;).then((value)=&gt;{
  console.log(value)
})

loadImageAsync(&#x27;图片地址&#x27;).catch((error)==&gt;{
  console.log(error)	
})
</pre>


# Promise 的嵌套使用 #
比如有一个 promise 对象，它内部如果返回的是一个 promise 对象，那么它的执行流程会是怎样的？看下面的实例：

<pre>
let p1 = new Promise((resolve, reject)=&gt;{
  setTimeout(()=&gt;{
    reject(&#x27;执行失败了&#x27;)
  }, 3000)
});

let p2 = new Promise((resolve, reject)=&gt;{
  setTimeout(()=&gt;{
    resolve(p1)
  }, 1000)
});

p2.then(value =&gt; console.log(value))  // 它没有执行
p2.catch(error =&gt; console.log(error)) // 打印 执行失败了
</pre>

通过上面的实例看到，p2 这个 promise 对象里面，异步执行了成功的回调 resolve，resolve 函数的参数是 p1 这个 promise 对象，那么它的内部发生了这样的变化呢？<br>

上面代码中，p1 的状态会传递给 p2，也就是说 p1 的状态觉定了 p2 的状态。如果 p1 的状态是进行中，那么 p2 的 then 回调函数就会等待 p1 状态的改变，等到 p1 的状态转变成 resolve 或者 reject 的时候，p2 的 then 或者 catch 的回调就会马上执行，并且执行的状态和 p1 保持同步。



# Promise.prototype.then #
Promise 对象的实例可以调用 then 方法，这是因为这个 then 方法是定义在 promise 对象原型对象上的，而且它返回一个新的 Promise 对象（不是原来那个），所以，then 方法可以链式调用，即 then 方法执行之后，在调用一个 then 方法：

<pre>
let promise = new Promise((resolve, reject)=&gt;{
  setTimeout(()=&gt;{
    resolve(&#x27;执行了&#x27;)
  }, 1000)
});

promise.then((value)=&gt;{
  console.log(value)  // 执行了
  return &#x27;then1&#x27;
}).then((value)=&gt;{
  console.log(value)  // then1
  return &#x27;then2&#x27;
}).then((value)=&gt;{
  console.log(value)  // then2    
  return &#x27;then3&#x27;
})
</pre>

上面代码中，promise 对象，执行成功后，调用一个 then 方法，第一个 then 方法执行完成后，会把返回的结果作为第二个 then 方法的成功函数参数传递进去，依次类推。


# Promise.prototype.catch #
catch 方法用于指定发生错误时的回调，如果 promise 对象的状态是 resolve，那么就会调用 then 方法的回调，如果状态是 reject，那么就会调用 catch 方法的回调。并且 Promise 对象的错误具有冒泡机制，会一直向后传递，直到被 catch 捕获为止。也就是说错误总会被下一个 catch 语句捕获。

<pre>
let promise = new Promise((resolve, reject)=&gt;{
  ......
});

promise.then((value)=&gt;{
  ......
}).then((value)=&gt;{
  ......
}).catch((error)=&gt;{
  console.log(error)  // 有一个地方执行发生了错误  
})
</pre>

虽然可以在 then 方法的第二个参数里面定义这个错误的回调，但一般不要这样做，最好都统一使用 catch 去捕获异常，并且把它放在 promise 回调的最后一步执行。这是因为，catch 的写法更直观，也更接近同步的写法，而且不用每一个 then 方法都写一个错误处理函数（它是可选的），只要用一个 catch 去捕获错误就够了。<br>
catch 方法同样返回的是一个新的 promise 对象，那么也就是说可以在 catch 语句后面继续跟进 then 方法，如果 catch 方法没有执行，那么就会继续往下执行，但我们都不会这么做的，因为下面如果有一个 then 方法报错的话，那么就与上面的 catch 无关了，它的错误只能被下一个 catch 所捕获，这也就是为什么 catch 总写在最后一行的原因。


# Promise.all #
这个方法用于将多个 Promise 实例包装成一个 Promise 实例：

<pre>
let p1 = new Promise((resolve, reject)=&gt;{
  var num = 10;
  resolve(num)
});

let p2 = new Promise((resolve, reject)=&gt;{
  var num = 20;
  resolve(num)
});

let p = Promise.all([p1, p2]);	// 接收的是一个数组
p.then((value)=&gt;{
  console.log(value)  // [10, 20]
})
</pre>

p 的状态由 p1 和 p2 决定，它分为两种情况：

1. 只有 p1 和 p2 的状态都变成 resolve 成功的时候，p 的状态才会变成 resolve 成功状态，此时 p1 和 p2 的返回值会组成一个新的数组传递给 p 成功的回调函数（then）。
2. 只要 p1 和 p2 中任何一个状态变成 reject 失败的话，那么 p 的状态也会失败，此时第一个被 reject 的实例返回的值会传递给 p 的回调函数（catch）。

所以你也可以理解为，多个 Promise 实例都必须执行成功后，在去执行一个统一的 Promise 实例；比如有这样一种情况：需要异步执行3个 promise 实例，然后等他们都执行完成后，并且都返回各自的值之后，再把这些返回的值拼接成一个数组，供一个统一的 Promise 实例调用。



# Promise.race #
同样是将多个 promise 实例包装成一个新的 promise 实例。

<pre>
let p1 = new Promise((resolve, reject)=&gt;{
  var num = 10;
  setTimeout(()=&gt;{
    resolve(num)
  }, 2000)
});

let p2 = new Promise((resolve, reject)=&gt;{
  var num = 20;
  setTimeout(()=&gt;{
    resolve(num)
  }, 1000)
});

let pAll = Promise.race([p1, p2]);
pAll.then((value)=&gt;{
  console.log(value)  // 20
})
</pre>

上面的代码中，只要 p1 和 p2 中谁优先进行状态改变（不管是成功还是失败），那么 p 的状态就跟着改变。那个率先改变状态的实例的返回值，就会传递给 p 的回调函数。



# Promise.resolve #
有时候需要将现有的方法转换为 Promise 对象，上面讲到的 all 和 race 方法，如果里面传人的数组参数成员中，不是 Promise 对象的话，它就会在内部使用该方法进行转换之后在执行。<br>

<pre>
var jsPromise = Promise.resolve($.ajax(url));
jsPromise.then((val)=>{
  console.log(val)
})
</pre>

上面就是将一个 jquery 生成的 deferred 对象转换成一个新的 Promise 对象。<br>
如果 Promise.resolve 方法的参数不具有 then 方法的话，则返回一个新的 Promise 对象，且状态为 Resolved。

<pre>
let p = Promise.resolve('hello');
p.then((val)=>{
  console.log(val)  // hello
})
</pre>

上面代码生成一个新的 Promise 对象实例，由于 hello 字符串不属于异步操作（判断方法是它不是具有 then 方法的对象），返回的 Promise 对象的状态直接变成 Resolved，所以回调函数会立即执行，同时将 Promise.resolve 方法的参数传递出去。<br>
如果 Promise.resolve 方法的参数就是一个 Promise 实例的话，那么就会原封不动地返回，等于什么也没做。


# Promise.reject #
也是返回一个新的 Promise 对象，状态为 rejected。用来直接抛出 Promise 的执行错误。

<pre>
let reject = Promise.reject('报错了');
console.log(reject) // Uncaught (in promise) 报错了
</pre>

上面的方法等价于下面的方法：

<pre>
let reject = new Promise((resolve, reject)=&gt;{
  reject(new Error(&#x27;报错了&#x27;))
}); 

reject.catch((error)=&gt;{
  console.log(error)
})
</pre>


# 两个有用的附加方法 #

## 1、done 方法 ##
Promise 对象的回调链，不管是 then 还是 catch 方法，如果最后一个方法报错了，那么就无法捕捉到错误信息，这是因为 Promise 内部的错误不会冒泡到全局中。所以可以封装一个 done 方法，来处理任何形式的报错，哪怕是最后一行的 catch 报错了，都可以捕捉到，并且会向全局抛出错误。

<pre>
Promise.prototype.done = function(onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
  .catch(function(reason) {
    // 抛出一个全局错误
    setTimeout(()=&gt;{ throw reason }, 0)
  })
}
</pre>

使用方式：在最后一行调用即可

<pre>
promise.then((value)=&gt;{

}).catch((error)=&gt;{

}).done()
</pre>


## 2、finally ##
不管 Promise 对象最后处理哪一种状态，都必须要执行的方法。

<pre>
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value =&gt; P.resolve(callback()).then(()=&gt;value),
    reason =&gt; P.resolve(callback()).then(()=&gt;{throw reason})
  )
}
</pre>

调用方式：写在最后一行即可（在 done 方法之前）

<pre>
let promise = new Promise((resolve, reject)=&gt;{
  setTimeout(()=&gt;{
    resolve(&#x27;执行成功&#x27;)
  }, 1000)
});

promise.then((value)=&gt;{
  console.log(value)  // 执行成功
  return &#x27;返回值&#x27;
}).then((value)=&gt;{
  console.log(value)  // 返回值
}).finally((value)=&gt;{
  console.log(&#x27;我执行了&#x27;) // 我执行了
})
</pre>


----------


# Promise 实现原理 #
查看文章：[https://segmentfault.com/a/1190000012664201](https://segmentfault.com/a/1190000012664201 "promise 原理")


【这是一个简化版的实现过程】：只实现了简单的 then 和 catch 方法

<pre>
const SPENING = "SPENING";
const RESOLVE = "RESOLVE";
const REJECT = "REJECT";
const isFunction = variable => typeof variable === "function";

class MyPromise {
  constructor(handle) {
    this._status = SPENING;
    this._value = undefined;

    if (isFunction(handle)) {
      handle(this._resolve.bind(this), this._reject.bind(this));
    } else {
      throw new ReferenceError("请传人函数作为 MyPromise 参数");
    }
  }

  // 添加成功方法
  _resolve(value) {
    if (this._status === SPENING) {
      this._status = RESOLVE;
      this._value = value;
    }
  }

  // 添加失败方法
  _reject(value) {
    if (this._status === SPENING) {
      this._status = REJECT;
      this._value = value;
    }
  }

  // 添加then方法
  then(resolveFn, rejectFn) {
    const { _value, _status } = this;
    return new MyPromise((resolveFnNext, rejectFnNext) => {
      let fulfilled = value => {
        try {
          if (!isFunction(resolveFn)) {
            resolveFnNext(value);
          } else {
            let res = resolveFn(value);
            resolveFnNext(res);
          }
        } catch (error) {
          rejectFnNext(error);
        }
      };

      let rejected = value => {
        try {
          if (!isFunction(rejectFn)) {
            rejectFnNext(value);
          } else {
            let res = rejectFn(value);
            rejectFnNext(res);
          }
        } catch (error) {
          rejectFnNext(error);
        }
      };

      switch (_status) {
        case RESOLVE:
          fulfilled(_value);
          break;
        case REJECT:
          rejected(_value);
          break;
      }
    });
  }

  // 添加catch方法
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

let person = new MyPromise(function(resolve, reject) {
  console.log("立即执行");
  resolve(1);
})
  .then(val => {
    console.log(val);
    return 2;
  })
  .then(val => {
    console.log(val);
  })
  .catch(error => {
    console.log(error);
  });
</pre>

【完整版实现过程】：

<pre>
// 判断变量否为function
const isFunction = variable => typeof variable === 'function'
// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor (handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
    // 添加状态
    this._status = PENDING
    // 添加状态
    this._value = undefined
    // 添加成功回调函数队列
    this._fulfilledQueues = []
    // 添加失败回调函数队列
    this._rejectedQueues = []
    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this)) 
    } catch (err) {
      this._reject(err)
    }
  }
  // 添加resovle时执行的函数
  _resolve (val) {
    const run = () => {
      if (this._status !== PENDING) return
      // 依次执行成功队列中的函数，并清空队列
      const runFulfilled = (value) => {
        let cb;
        while (cb = this._fulfilledQueues.shift()) {
          cb(value)
        }
      }
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = (error) => {
        let cb;
        while (cb = this._rejectedQueues.shift()) {
          cb(error)
        }
      }
      /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
        当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
      */
      if (val instanceof MyPromise) {
        val.then(value => {
          this._value = value
          this._status = FULFILLED
          runFulfilled(value)
        }, err => {
          this._value = err
          this._status = REJECTED
          runRejected(err)
        })
      } else {
        this._value = val
        this._status = FULFILLED
        runFulfilled(val)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }
  // 添加reject时执行的函数
  _reject (err) { 
    if (this._status !== PENDING) return
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this._status = REJECTED
      this._value = err
      let cb;
      while (cb = this._rejectedQueues.shift()) {
        cb(err)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }
  // 添加then方法
  then (onFulfilled, onRejected) {
    const { _value, _status } = this
    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      // 封装一个成功时执行的函数
      let fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value)
          } else {
            let res =  onFulfilled(value);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res)
            }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err)
        }
      }
      // 封装一个失败时执行的函数
      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error)
          } else {
              let res = onRejected(error);
              if (res instanceof MyPromise) {
                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                res.then(onFulfilledNext, onRejectedNext)
              } else {
                //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                onFulfilledNext(res)
              }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err)
        }
      }
      switch (_status) {
        // 当状态为pending时，将then方法回调函数加入执行队列等待执行
        case PENDING:
          this._fulfilledQueues.push(fulfilled)
          this._rejectedQueues.push(rejected)
          break
        // 当状态已经改变时，立即执行对应的回调函数
        case FULFILLED:
          fulfilled(_value)
          break
        case REJECTED:
          rejected(_value)
          break
      }
    })
  }
  // 添加catch方法
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }
  // 添加静态resolve方法
  static resolve (value) {
    // 如果参数是MyPromise实例，直接返回这个实例
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
  // 添加静态reject方法
  static reject (value) {
    return new MyPromise((resolve ,reject) => reject(value))
  }
  // 添加静态all方法
  static all (list) {
    return new MyPromise((resolve, reject) => {
      /**
        * 返回值的集合
        */
      let values = []
      let count = 0
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(res => {
          values[i] = res
          count++
          // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
          if (count === list.length) resolve(values)
        }, err => {
          // 有一个被rejected时返回的MyPromise状态就变成rejected
          reject(err)
        })
      }
    })
  }
  // 添加静态race方法
  static race (list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    })
  }
  finally (cb) {
    return this.then(
      value  => MyPromise.resolve(cb()).then(() => value),
      reason => MyPromise.resolve(cb()).then(() => { throw reason })
    );
  }
}
</pre>











