# 链判断运算符
编程实务中，如果读取对象内部的某个属性，往往需要判断一下该对象是否存在。比如，要读取person.user.name，安全的写法是写成下面这样：

```
let personData = null
let isPsName = (
  personData
  && personData.user
  && personData.user.name
) || 'default'

console.log(isPsName) // default
```

这样的层层判断非常麻烦，因此 ES2020 引入了“链判断运算符” ?. ，简化上面的写法。

```
let isPsName = personData?.user?.name || 'default'

console.log(isPsName) // default
```

这样写简洁明了，上面代码使用了?.运算符，直接在链式调用的时候判断，当左侧的对象通过点运算符查找不到时，就不再往下运算，而是返回 undefined。


## 链判断运算符有三种用法

- obj?.prop // 对象属性
- obj?.[prop] // 对象属性
- func?.(...args) // 函数或对象方法的调用


下面是判断对象方法是否存在，如果存在就立即执行的例子。

```
let obj = {}

console.log(obj.sum?.()) // undefined
console.log(obj.sum()) // 报错
```

上面代码中，obj.sum 如果有定义，就会调用该方法，否则直接返回 undefined。

下面是这个运算符常见的使用形式，以及不使用该运算符时的等价形式。

```
a?.b
// 等同于
a == null ? undefined : a.b

a?.[x]
// 等同于
a == null ? undefined : a[x]

a?.b()
// 等同于
a == null ? undefined : a.b()

a?.()
// 等同于
a == null ? undefined : a()
```

上面代码中，特别注意后两种形式，如果a?.b()里面的a.b不是函数，不可调用，那么a?.b()是会报错的。a?.()也是如此，如果a不是null或undefined，但也不是函数，那么a?.()会报错。除非你使用 ?. 做多层判断：

```
let a = 1
a?.b?.() // undefined
```

使用这个运算符，有几个注意点。

(1) 短路机制

```
a?.[++x]
// 等同于
a === null ? undefined : a[++x]
```

上面代码中，如果a是undefined或null，那么x不会进行递增运算。也就是说，**链判断运算符一旦为真，右侧的表达式就不再求值。**

(2) delete 运算符

```
delete a?.b
// 等同于
a == null ? undefined : delete a.b
```

上面代码中，如果a是undefined或null，会直接返回undefined，而不会进行delete运算。

（3）括号的影响

如果属性链有圆括号，链判断运算符对圆括号外部没有影响，只对圆括号内部有影响。

```
(a?.b).c
// 等价于
(a == null ? undefined : a.b).c
```

上面代码中，?.对圆括号外部没有影响，不管a对象是否存在，圆括号后面的.c总是会执行。**一般来说，使用?.运算符的场合，不应该使用圆括号。**

（4）报错场合

以下写法是禁止的，会报错。

```
// 构造函数
new a?.()
new a?.b()

// 链判断运算符的右侧有模板字符串
a?.`{b}`
a?.b`{c}`

// 链判断运算符的左侧是 super
super?.()
super?.foo

// 链运算符用于赋值运算符左侧
a?.b = c
```

（5）右侧不得为十进制数值

为了保证兼容以前的代码，允许foo?.3:0被解析成foo ? .3 : 0，因此规定如果?.后面紧跟一个十进制数字，那么?.不再被看成是一个完整的运算符，而会按照三元运算符进行处理，也就是说，那个小数点会归属于后面的十进制数字，形成一个小数。

```
let foo = true
let boo = foo?.3:0

console.log(boo) // 0.3
```


# Null 判断运算符
读取对象属性的时候，如果某个属性的值是null或undefined，有时候需要为它们指定默认值。常见做法是通过 || 运算符指定默认值。

```
const result = null
const a = result || 'default'
```

但是这样写是错的。开发者的原意是，只要属性的值为null或undefined，默认值就会生效，但是属性的值如果为空字符串或 false 或 0，默认值也会生效。

```
const result = false
const a = result || 'default'

console.log(a) // default
```

为了避免这种情况，ES2020 引入了一个新的 Null 判断运算符??。它的行为类似||，但是只有运算符左侧的值为null或undefined时，才会返回右侧的值。

```
const result1 = false
const a = result1 ?? 'default'

const result2 = null
const b = result2 ?? 'default'

console.log(a) // false
console.log(b) // default
```

这个运算符的一个目的，就是跟链判断运算符?.配合使用，为null或undefined的值设置默认值。比如：

```
const obj = {
  name: false
}
const name = obj?.name || 'default'

console.log(name) // default
```

如果使用传统的 ||，那么上面这个就返回错了，应该是返回 false 才对，使用 NULL 运算符去修改：

```
const obj = {
  name: false
}
const name = obj?.name ?? 'default'
const age = obj?.age ?? 'default'

console.log(name) // false
console.log(age) // default
```

??有一个运算优先级问题，它与&&和||的优先级孰高孰低。现在的规则是，**如果多个逻辑运算符一起使用，必须用括号表明优先级，否则会报错。**

```
// 报错
lhs && middle ?? rhs
lhs ?? middle && rhs
lhs || middle ?? rhs
lhs ?? middle || rhs
```

上面四个表达式都会报错，必须加入表明优先级的括号。

```
(lhs && middle) ?? rhs;
lhs && (middle ?? rhs);

(lhs ?? middle) && rhs;
lhs ?? (middle && rhs);

(lhs || middle) ?? rhs;
lhs || (middle ?? rhs);

(lhs ?? middle) || rhs;
lhs ?? (middle || rhs);
```


# 总结
- 可选链判断符：常用于 if 判断语句，避免对象属性不存在而导致报错
- NUll判断符：常用于返回是 null 或者 undefined 赋值默认值操作（后端接口返回数据，经常返回 null）





















