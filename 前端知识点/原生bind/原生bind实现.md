# 原生 bind 实现原理
改变函数 this 指向的三个方法

- bind
- call
- apply

**三个方法的相同点**

1、目标函数被调用时，改变 this 的指向为指定的值

2、 三个方法都是函数方法，挂载在 Function.prototype 上

**三个方法的不同点**

1、目标函数调用 call 和 apply 后，会直接执行

2、传参有差异

3、目标函数调用 bind 后，不会立即执行，而是返回一个新的函数，调用新函数才会执行目标函数


## 先来看看ES6的 bind 
```
function func(...arg) {
  console.log(this, arg)
}

func.prototype.getName = function() {
  console.log('getName')
}

let newFunc1 = func.bind({a:1}, 1,2,3)
newFunc1() // {a: 1} (3) [1, 2, 3]

let newFunc2 = new newFunc1()
newFunc2.getName() // getName
```

可以看到，调用 bind 不会立即执行，而是返回一个新的函数，如果把这个新函数做为一个构造函数去使用，那它的构造函数就是 func 函数


## 实现一个自己的 myBind
要想原生实现一个自己的原生 bind，就需要分步实现

1、利用 Function.prototype 创建自己的 myBind

```
Function.prototype.myBind = function(thisArg, ...arg) {
  // 目标函数
  let self = this 

  // 返回的新函数
  let Bound = function() {
    console.log('我被执行了')
  }

  return Bound
}

function func(...arg) {
  console.log(this, arg)
}

let newFunc = func.myBind()
newFunc() // 打印：我被执行了

```

2、使用原生 call 或者 apply 方法去改变 this 指向

```
Function.prototype.myBind = function(thisArg, ...arg) {
  // 目标函数
  let self = this 

  // 返回的新函数
  let Bound = function(...res) {
    self.apply(thisArg, [...arg, ...res])
  }

  return Bound
}

function func(...arg) {
  console.log(this, arg) // 打印：{a: 1} (6) [1, 2, 3, 4, 5, 6]
}

let newFunc = func.myBind({a: 1}, 1,2,3)
newFunc(4,5,6) 
```

3、实现目标函数和返回的新函数之间的原型继承（记得修正 prototype.custrctor）

```
Function.prototype.myBind = function(thisArg, ...arg) {
  // 目标函数
  let self = this 

  // 返回的新函数
  let Bound = function(...res) {
    self.apply(thisArg, [...arg, ...res])
  }

  // 新函数继承目标函数原型，以及修正新函数 prototype.consturctor 指向
  Bound.prototype = Object.create(self.prototype)
  Bound.prototype.consturctor = self

  return Bound
}

function func(...arg) {
  console.log(this, arg) // 打印：{a: 1} (6) [1, 2, 3, 4, 5, 6]
}

func.prototype.getName = function() {
  console.log('我执行了') // 打印：我执行了
}

let newFunc = func.myBind({a: 1}, 1,2,3)
let newFunc2 = new newFunc(4,5,6) 
newFunc2.getName() 
```