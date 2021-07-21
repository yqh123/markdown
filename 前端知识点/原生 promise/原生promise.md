# 原生promise
promise 是 javascript 异步编程的一种非常流行的解决方式。

- 了解 promise 基本实现原理
- 深入掌握 promise 的使用细节
- 了解 promise 未来新的标准


## promise 类
promise 的构造函数必须接收一个函数参数（也就是需要执行异步任务的函数），该函数将在传人后立即调用，并传入 promise 对象下的两个函数方法 resolve 和 reject

## promse 状态
每个 promise 对象都存在一下三种状态：

- pending：进行中（promise 初始状态）
- fulfilled：已成功
- rejected：已失败

每个 promise 对象只能由 pending 状态变成 fulfilled 或者 rejected，且状态发生变化后就不能在改变了

一个 promise 对象的状态变化并不由 promise 对象本身来决定，而应该是由我们传入的异步任务完成情况来决定的，promise 提供了两个用来改变状态的方法 resolve 和 reject

```
new Promise((resolve, reject) => {
  setTimeout(_ => {
    console.log('执行了')
    resolve('参数')
  }, 1000);
}).then(res => {
  console.log(res)
})
```


## 写一个自己的 Mypromise

**1、建壳子**

- 声明构造函数 Mypromise
- 对参数做异常处理判断
- 传入的函数理解执行

```
class Mypromise {
  constructor(handler) {
    // 参数类型判断
    if(typeof handler !== 'function') throw new TypeError('请传入函数参数')

    // 立即执行函数
    handler()
  }
}

new Mypromise(() => {
  setTimeout(() => {
    console.log('我执行了')
  }, 1000)
})
```

**2、填内容**

- 声明三种静态属性：PENDING、FULFILLED、REJECTED
- 提供改变静态属性的静态方法：_resolve 和 _reject
- 判断状态一但改变就不能在改变

```
class Mypromise {
  static PENDING = 'PENDING' // 等待中
  static FULFILLED = 'FULFILLED' // 成功
  static REJECTED = 'REJECTED' // 失败

  constructor(handler) {
    // 参数类型判断
    if(typeof handler !== 'function') throw new TypeError('请传入函数参数')

    // 赋值初始状态
    this.status = Mypromise.PENDING

    // 在这里要用 bind 方法修正指向，否则在 _resolve 和 _reject 中通过 this.status 来修改状态会报错（this 指向 undefined）
    handler(this._resolve.bind(this), this._reject.bind(this))
  }

  // 通知成功执行函数，改变 status 状态
  _resolve(res) {
    this.status = Mypromise.FULFILLED
    console.log(this) // Mypromise({status: "FULFILLED"})
  }

  // 通知失败执行函数，改变 status 状态
  _reject(err) {
    this.status = Mypromise.REJECTED
    console.log(this) // Mypromise({status: "REJECTED"})
  }
}

new Mypromise((resolve, reject) => {
  setTimeout(() => {
    console.log('我执行了')
    resolve()
  }, 1000)
})
```

但是上面这样写会有一个问题，就是状态可以被多次改变，和原生 promise 违背，原生 promise 状态一但改变，就是不可逆的，如下：

```
let p1 = new Mypromise((resolve, reject) => {
  setTimeout(() => {
    resolve()
    reject()
  }, 1000)
})
```

当你在空中台打印 p1 时你会发现，打印了两个值 Mypromise({status: "FULFILLED"}) 和 Mypromise({status: "REJECTED"})；状态由 FULFILLED => REJECTED，就因为我在 setTimeout 中执行了 reject 方法。

所以要在 _resolve 和 _reject 两个静态方法中都加上一个判断，判断一但状态不是初始值，就停止执行

```
_resolve(res) {
  if (this.status !== Mypromise.PENDING) return
  this.status = Mypromise.FULFILLED
}

_reject(err) {
  if (this.status !== Mypromise.PENDING) return
  this.status = Mypromise.REJECTED
}
```


**3、实现 then 方法**

- 接受两个参数，一个是成功后回调，一个是失败后回调
- 不管是成功回调还是失败回调，都必须在异步处理完成后在执行

```
let p1 = new Mypromise((resolve, reject) => {
  setTimeout(() => {
    console.log('我执行了')
    resolve('1')
  }, 1000)
})

p1.then(val => {
  console.log('成功后参数1为：'+ val)
}, err => {
  console.log('失败后参数1为：'+ err)
})

p1.then(val => {
  console.log('成功后参数2为：'+ val)
})
```

1、在 constructor 中创建成功、失败收集 then 和 catch 的数组队列

```
constructor(handler) {
  // 参数类型判断
  if(typeof handler !== 'function') throw new TypeError('请传入函数参数')

  // 创建成功、失败收集 then 和 catch 的数组队列
  this.resolveQueues = []
  this.rejectQueues = []

  ......
}
```

2、then 方法只是用来收集成功和失败回调，共队列循环使用

```
then(resolveHandler, rejectHandler) {
  resolveHandler && this.resolveQueues.push(resolveHandler)
  rejectHandler && this.rejectQueues.push(rejectHandler)
}
```

3、_resolve 和 _reject 两个静态函数在状态改变完成后，去分别执行对应的成功、失败队列，并且相应的队列执行一次就清除一次执行过的回调

```
// 通知成功执行函数，改变 status 状态
_resolve(res) {
  if (this.status !== Mypromise.PENDING) return
  this.status = Mypromise.FULFILLED

  // 执行成功回调队列，并且执行过一次的就清一次队列
  let handler;
  while(handler = this.resolveQueues.shift()) {
    handler(res)
  }
}

// 通知失败执行函数，改变 status 状态
_reject(res) {
  if (this.status !== Mypromise.PENDING) return
  this.status = Mypromise.REJECTED

  // 执行失败回调队列，并且执行过一次的就清一次队列
  while(handler = this.rejectQueues.shift()) {
    handler(res)
  }
}
```

注意：上的 _resolve 和 _reject 函数是有问题的，问题点在哪呢，就在于 new Mypromise 的时候，里面立马要执行的函数它可能不是异步的，这样就会导致，如果是同步的任务，那么在 resolve 或者 reject 被你调用后，收集 then 方法成功和失败回调的队列里面没东西，因为你立马执行的任务是同步的，而我也是同步的，如下：

```
class Mypromise {
  ......

  // 通知成功执行函数，改变 status 状态
  _resolve(res) {
    if (this.status !== Mypromise.PENDING) return
    this.status = Mypromise.FULFILLED
    
    console.log(this.resolveQueues) // []，注意看这里

    // 执行成功回调队列，并且执行过一次的就清一次队列
    let handler;
    while(handler = this.resolveQueues.shift()) {
      handler(res)
    }
  }

  // 通知失败执行函数，改变 status 状态
  _reject(res) {
    if (this.status !== Mypromise.PENDING) return
    this.status = Mypromise.REJECTED
    
    console.log(this.resolveQueues) // []，注意看这里

    // 执行失败回调队列，并且执行过一次的就清一次队列
    let handler;
    while(handler = this.rejectQueues.shift()) {
      handler(res)
    }
  }

  // then 方法
  then(resolveHandler, rejectHandler) {
    resolveHandler && this.resolveQueues.push(resolveHandler)
    rejectHandler && this.rejectQueues.push(rejectHandler)
  }
}

let p1 = new Mypromise((resolve, reject) => {
  console.log('我执行了')
  resolve('1')
})

p1.then(val => {
  console.log('成功后参数1为：'+ val)
}, err => {
  console.log('失败后参数1为：'+ err)
})

p1.then(val => {
  console.log('成功后参数2为：'+ val)
})
```

你会发现，then 方法没有被执行，主要是因为两个队列依然为空数组（因为 _resolve 和 _reject 是同步函数），所以处理方法就是把他们两个包装成异步处理就可以了，让异步列队收集器 resolveQueues 和 rejectQueues 先收集 then 方法里面的回调

```
// 通知成功执行函数
_resolve(res) {
  setTimeout(_ => {
    if (this.status !== Mypromise.PENDING) return
    
    // 改变 status 状态
    this.status = Mypromise.FULFILLED

    // 执行成功回调队列，并且执行过一次的就清一次队列
    let handler;
    while(handler = this.resolveQueues.shift()) {
      handler(res)
    }
  }, 0)
}

// 通知失败执行函数
_reject(res) {
  setTimeout(_ => {
    if (this.status !== Mypromise.PENDING) return
    
    // 改变 status 状态
    this.status = Mypromise.REJECTED

    // 执行失败回调队列，并且执行过一次的就清一次队列
    let handler;
    while(handler = this.rejectQueues.shift()) {
      handler(res)
    }
  }, 0)
}
```

这样就完了吗，还没有，看下面这个写法：

```
setTimeout(() => {
  console.log(3)
}, 0);

let p1 = new Mypromise((resolve, reject) => {
  console.log(1)
  resolve()
})

p1.then(val => {
  console.log(2)
})
```

执行结果为：1、3、2；这显然是不对的，then 按照原生 promise 应该是“微任务”，应该在“宏任务”先执行，答案应该是：1、2、3 才对。所以我们得改写上面的_resolve 和 _reject 方法，不能直接用“宏任务块” setTimeout 去包装，而应该用原生的一个“微任务块”去包装，也就是 postMessage

```
// 通知成功执行函数
_resolve(res) {
  window.addEventListener('message', _=> {
    if (this.status !== Mypromise.PENDING) return
    
    // 改变 status 状态
    this.status = Mypromise.FULFILLED

    // 执行成功回调队列，并且执行过一次的就清一次队列
    let handler;
    while(handler = this.resolveQueues.shift()) {
      handler(res)
    }
  })
  window.postMessage('') // window.addEventListener 绑定的函数被分配到“微任务队列”中
}
```

这样处理后，then 的执行等级就比 setTimeout 要高了


4、then 方法在执行后必须返回一个新的 promise 对象

注意不是直接返回 this，虽然直接返回 this，可以达到 then 方法的依次收集执行，但 then 的返回值却永远也只能是第一次 new Mypromise resolve 的参数了，如下

```
let p1 = new Mypromise((resolve, reject) => {
  resolve('参数')
})

p1.then(val => {
  console.log(1, val)
  return '第一个then的返回值'
}).then(val => {
  console.log(2, val)
  return '第二个then的返回值'
}).then(val => {
  console.log(3, val)
})
```

你会发现，then 里面的 console 中的 val 值都是“参数”，而不象原生 Promise 那样，then 方法如果有返回值，应该做为下一个 then 方法的参数传入，所以我们应该返回一个新的 Mypromise 对象，如下

```
class Mypromise {
  ......

  constructor(handler) {
    ......

    // 赋值初始状态
    this.status = Mypromise.PENDING

    // 参数值
    this.value;

    ......
  }

  // 通知成功执行函数
  _resolve(res) {
    window.addEventListener('message', _=> {
      ......

      // 赋值 value
      this.value = res

      // 执行成功回调队列，并且执行过一次的就清一次队列
      let handler;
      while(handler = this.resolveQueues.shift()) {
        handler(this.value)
      }
    })
    window.postMessage('')
  }

  // 通知失败执行函数
  _reject(res) {
    window.addEventListener('message', _=> {
      ......

      // 赋值 value
      this.value = res

      // 执行失败回调队列，并且执行过一次的就清一次队列
      let handler;
      while(handler = this.rejectQueues.shift()) {
        handler(this.value)
      }
    })
    window.postMessage('')
  }

  // then 方法
  then(resolveHandler, rejectHandler) {
    // 返回一个新的 Mypromise 对象
    return new Mypromise((resolve, reject) => {
      // 收集“成功”的回调，并把 then 方法的返回值做为下一个 then “成功”函数参数传入
      function newResolveHandler(val) {
        let result = resolveHandler(val) 
        resolve(result)
      }
      
      // 收集“失败”的回调，并把 then 方法的返回值做为下一个 then “失败”函数参数传入
      function newRejectHandler(val) {
        let result = rejectHandler(val) 
        reject(result)
      }

      resolveHandler && this.resolveQueues.push(newResolveHandler)
      rejectHandler && this.rejectQueues.push(newRejectHandler)
    }) 
  }
}
```

注意上面代码中 this.value 的声明和赋值操作，这操作也就是解决 then 方法回调参数的值的地方。最终打印的结果为

```
1 "参数1"
2 "第一个then的返回值"
3 "第二个then的返回值"
```

经过这样改写后，虽然能满足我们上面所写的那种情况的调用（就是 then 的返回值是一个普通的值），但它满足不了 then 返回的如果是一个新的 promise 对象的情况，如下

```
let p1 = new Mypromise((resolve, reject) => {
  resolve('参数1')
})

p1.then(val => {
  console.log(1, val)
  return new Mypromise((resolve, reject) => {
    setTimeout(() => {
      alert('我执行了')
      resolve('第一个then的返回值')
    }, 1000)
  })
}).then(val => {
  console.log(2, val)
})
```

执行后会发现，第二个 then 第一个成功函数参数的 val 参数，是一个 Mypromise 对象，不是你想的应该返回 resolve 里面的 “第一个then的返回值”，所以我们要在 then 方法里面对 result 进行类型判断分别处理

```
then(resolveHandler, rejectHandler) {
  // 返回一个新的 Mypromise 对象
  return new Mypromise((resolve, reject) => {
    // 收集“成功”的回调，并把 then 方法的返回值做为下一个 then “成功”函数参数传入
    function newResolveHandler(val) {
      let result = resolveHandler(val) 

      // 对返回结果做判断，因为它有可能是一个新的 Mypromise 对象
      if (result instanceof Mypromise) {
        result.then(resolve, reject)
      } else {
        resolve(result)
      }
    }
    
    // 收集“失败”的回调，并把 then 方法的返回值做为下一个 then “失败”函数参数传入
    function newRejectHandler(val) {
      let result = rejectHandler(val) 

      // 对返回结果做判断，因为它有可能是一个新的 Mypromise 对象
      if (result instanceof Mypromise) {
        result.then(resolve, reject)
      } else {
        reject(result)
      }
    }

    resolveHandler && this.resolveQueues.push(newResolveHandler)
    rejectHandler && this.rejectQueues.push(newRejectHandler)
  }) 
}
```

```
let p1 = new Mypromise((resolve, reject) => {
  resolve('参数1')
})

p1.then(val => {
  console.log(1, val)
  return '第一个then的返回值'
}).then(val => {
  console.log(2, val)
  return new Mypromise((resolve, reject) => {
    setTimeout(() => {
      alert('我执行了')
      resolve('第二个then的返回值')
    }, 1000)
  })
}).then(val => {
  console.log(3, val)
})

执行结果为：
1 "参数1"
2 "第一个then的返回值"
...过了 1s 后弹窗 alert('我执行了')
3 "第二个then的返回值"
```


## catch 方法
.catch  方法是 .then(null, rejection) 或 .then(undefined, rejection)的别名，用于指定发生错误时的回调函数

通过上面这句话，就可以很容易的写出 catch 方法，其实就是它调用了 .then(undefined, rejection) 这种形式

```
catch(rejectHandler) {
  // 返回一个新的 Mypromise 对象
  return this.then(undefined, rejectHandler)
}
```

因为 .then 方法第一个参数为 undefined，所以还要对 then 方法里面使用 trycatch 做一个容错处理

```
then(resolveHandler, rejectHandler) {
  // 返回一个新的 Mypromise 对象
  return new Mypromise((resolve, reject) => {
    // 收集“成功”的回调，并把 then 方法的返回值做为下一个 then “成功”函数参数传入
    function newResolveHandler(val) {
      try {
        let result = resolveHandler(val) 

        // 对返回结果做判断，因为它有可能是一个新的 Mypromise 对象
        if (result instanceof Mypromise) {
          result.then(resolve, reject)
        } else {
          resolve(result)
        }
      } catch (error) {
        reject(val)
      }
    }
    
    // 收集“失败”的回调，并把 then 方法的返回值做为下一个 then “失败”函数参数传入
    function newRejectHandler(val) {
      try {
        let result = rejectHandler(val) 

        // 对返回结果做判断，因为它有可能是一个新的 Mypromise 对象
        if (result instanceof Mypromise) {
          result.then(resolve, reject)
        } else {
          reject(result)
        }
      } catch (error) {
        reject(val)
      }
    }

    this.resolveQueues.push(newResolveHandler)
    this.rejectQueues.push(newRejectHandler)
  }) 
}
```

最终效果如下

```
let p1 = new Mypromise((resolve, reject) => {
  resolve('我成功了')
  // reject('我失败了')
})

p1.then(val => {
  console.log(1, val)       // 1，我成功了
  throw new Error('报错了')
}).catch(err => {
  console.log(2, err)       // 2，我成功了 或者 我失败了
})
```


## finally 方法 
它的实现原理同上，而且更简单，就是重新声明一个 finallyQueues 队列去收集它，然后在 _resolve 或 _reject 最后去执行即可

```
// 通知成功执行函数
_resolve(res) {
  window.addEventListener('message', _=> {
    ......

    // 执行 _finally
    this._finally(this.value)
  })
  window.postMessage('')
}

// 通知失败执行函数
_resolve(res) {......}

// 不管成功还是失败，在执行完 then 或 catch 后就立马执行它
_finally(res) {
  window.addEventListener('message', _=> {
    let handler;
    while(handler = this.finallyQueues.shift()) {
      handler()
    }
  })
  window.postMessage('')
}

// finally 方法
finally(callback) {
  this.finallyQueues.push(callback)
}
```

或者你也可以这样处理，这样也更简单点

```
// finally 方法
finally(callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
```


## 关于 Mypromise 对象静态方法的调用
在 Mypromise 类中添加静态方法即可

```
......
// Mypromise 相关静态方法
static resolve(res) {
  return new Mypromise((resolve, reject) => {
    resolve(res)
  })
}

static reject(res) {
  return new Mypromise((resolve, reject) => {
    reject(res)
  })
}

static finally(res) {
  return new Mypromise((resolve, reject) => {
    resolve()
  }).finally(res)
}

static all(iterator) {
  if (iterator.constructor !== Array) throw new TypeError('请传入数组参数')

  let len = iterator.length
  let index = 0
  let vals = []

  return new Mypromise((resolve, reject) => {
    iterator.forEach(item => {
      if (item instanceof Mypromise) {
        item.then(val => {
          index++
          vals.push(val)
          if (index === len) resolve(vals)
        }).catch(err => {
          reject(err)
        })
      } else {
        index++
        vals.push(item)
        if (index === len) resolve(vals)
      }
    })
  })
}
....


Mypromise.resolve(1).then(val => {
  console.log(val)
})

Mypromise.reject(1).then(val => {
  console.log(val)
})

Mypromise.finally(_ => {
  console.log(1)
})

Mypromise.all([
  new Mypromise((resolve, reject) => { 
    setTimeout(resolve, 100, 'one')
  }),
  new Mypromise((resolve, reject) => {
    reject('three')
  })
]).then(val => { 
  console.log('执行成功', val)
}).catch(err => { 
  console.log('执行失败', err)
})
```

# 一个简易版的 Promise
我们就已经简单的实现了一个自己的原生 Promise 对象，这个对象里面有 then、catch、finally 以及一些简单的静态方法，如 Mypromise.resolve()、Mypromise.reject()、Mypromise.finally()、Mypromise.all() 方法

```
class Mypromise {
  static PENDING = 'PENDING' // 等待中
  static FULFILLED = 'FULFILLED' // 成功
  static REJECTED = 'REJECTED' // 失败

  constructor(handler) {
    // 参数类型判断
    if(typeof handler !== 'function') throw new TypeError('请传入函数参数')

    // 创建成功、失败收集 then 方法 成功 和 失败 的数组队列
    this.resolveQueues = []
    this.rejectQueues = []

    // 创建一定会执行的 finally 数组队列
    this.finallyQueues = []

    // 赋值初始状态
    this.status = Mypromise.PENDING

    // 参数值
    this.value;

    // 在这里要用 bind 方法修正指向，否则在 _resolve 和 _reject 中通过 this.status 来修改状态会报错（this 指向 undefined）
    handler(this._resolve.bind(this), this._reject.bind(this))
  }

  // 通知成功执行函数
  _resolve(res) {
    window.addEventListener('message', _=> {
      if (this.status !== Mypromise.PENDING) return

      // 改变 status 状态
      this.status = Mypromise.FULFILLED

      // 赋值 value
      this.value = res

      // 执行成功回调队列，并且执行过一次的就清一次队列
      let handler;
      while(handler = this.resolveQueues.shift()) {
        handler(this.value)
      }

      // 执行 _finally
      this._finally(this.value)
    })
    window.postMessage('')
  }

  // 通知失败执行函数
  _reject(res) {
    window.addEventListener('message', _=> {
      if (this.status !== Mypromise.PENDING) return

      // 改变 status 状态
      this.status = Mypromise.REJECTED

      // 赋值 value
      this.value = res

      // 执行失败回调队列，并且执行过一次的就清一次队列
      let handler;
      while(handler = this.rejectQueues.shift()) {
        handler(this.value)
      }

      // 执行 _finally
      this._finally(this.value)
    })
    window.postMessage('')
  }

  // 不管成功还是失败，在执行完 then 或 catch 后就立马执行它
  _finally(res) {
    window.addEventListener('message', _=> {
      let handler;
      while(handler = this.finallyQueues.shift()) {
        handler(res)
      }
    })
    window.postMessage('')
  }
  
  // Mypromise 相关静态方法
  static resolve(res) {
    return new Mypromise((resolve, reject) => {
      resolve(res)
    })
  }

  static reject(res) {
    return new Mypromise((resolve, reject) => {
      reject(res)
    })
  }

  static finally(res) {
    return new Mypromise((resolve, reject) => {
      resolve()
    }).finally(res)
  }
  
  static all(iterator) {
    if (iterator.constructor !== Array) throw new TypeError('请传入数组参数')

    let len = iterator.length
    let index = 0
    let vals = []

    return new Mypromise((resolve, reject) => {
      iterator.forEach(item => {
        if (item instanceof Mypromise) {
          item.then(val => {
            index++
            vals.push(val)
            if (index === len) resolve(vals)
          }).catch(err => {
            reject(err)
          })
        } else {
          index++
          vals.push(item)
          if (index === len) resolve(vals)
        }
      })
    })
  }
  
  // then 方法
  then(resolveHandler, rejectHandler) {
    // 返回一个新的 Mypromise 对象
    return new Mypromise((resolve, reject) => {
      // 收集“成功”的回调，并把 then 方法的返回值做为下一个 then “成功”函数参数传入
      function newResolveHandler(val) {
        try {
          let result = resolveHandler(val) 

          // 对返回结果做判断，因为它有可能是一个新的 Mypromise 对象
          if (result instanceof Mypromise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(val)
        }
      }
      
      // 收集“失败”的回调，并把 then 方法的返回值做为下一个 then “失败”函数参数传入
      function newRejectHandler(val) {
        try {
          let result = rejectHandler(val) 

          // 对返回结果做判断，因为它有可能是一个新的 Mypromise 对象
          if (result instanceof Mypromise) {
            result.then(resolve, reject)
          } else {
            reject(result)
          }
        } catch (error) {
          reject(val)
        }
      }

      this.resolveQueues.push(newResolveHandler)
      this.rejectQueues.push(newRejectHandler)
    }) 
  }

  // catch 方法
  catch(rejectHandler) {
    // 返回一个新的 Mypromise 对象
    return this.then(undefined, rejectHandler)
  }

  // finally 方法
  finally(callback) {
    this.finallyQueues.push(callback)
  }
}
```