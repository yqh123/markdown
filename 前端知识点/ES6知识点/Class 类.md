# 概述 #
ES6 提供了更接近传统语言的写法（C++、Java），引入了 class 类这个概念，通过 class 关键字可以定义类。基本上，class 类可以看做是一种语法糖，它的绝大多数功能都可以通过 ES5 实现，新的 class 写法只是让对象原型的写法更清晰，更像传统语言的面向对象写法而已。

ES5 面向对象的写法如下：
<pre>
function Person(name,age) {
  this.name = name 
  this.age = age
}

Person.prototype.getUser = function() {
  var userInfo = '姓名：' + this.name + ' ;年龄：' + this.age
  console.log(userInfo)
}

var per = new Person('小明', 24);
    per.getUser()
</pre>

ES6 class 类的写法如下：
<pre>
class Person {
  constructor(name, age) {
    this.name = name 
    this.age = age
  }
  getUser() {
    var userInfo = '姓名：' + this.name + ' ;年龄：' + this.age
    console.log(userInfo)
  }
}

var per = new Person('小明', 24);
    per.getUser()
</pre>

可以看到，class 类的写法更加清晰，而且更符合模块化。定义方法时也不需要添加 function 关键字，直接可以使用 ES6 定义方法的方式，而且块与块之间不用逗号分隔，不然会报错。

<pre>
console.log(typeof Person)  // function
console.log(per.constructor)  // Person...
</pre>

上面代码表明，类的数据类型就是函数，类本身就是指向构造函数的。类的 prototype 属性继续存在，实际上类的所有方法也都是定义在 prototype 属性上的。

另外需要注意的是，在 class 类中定义的方法，都是不可以被枚举的，这一点与 ES5 是不一样的。<br>

ES5
<pre>
console.log(Object.keys(Person.prototype))  // ["getUser"]
console.log(Object.getOwnPropertyNames(Person.prototype))  // ["constructor", "getUser"]
</pre>

ES6
<pre>
console.log(Object.keys(Person.prototype))  // []
console.log(Object.getOwnPropertyNames(Person.prototype))  // ["constructor", "getUser"]
</pre>


# 类的 constructor #
类的 constructor 方法是类的默认方法，和 ES5 一样默认返回对象实例 this，通过 new 命令生成对象实例时，默认会调用该方法，如果没有显示的定义它，那么它就默认在类里面调用一个空的 constructor 方法。


# 类的表达式写法 #
<pre>
const Person = class {
  constructor(name, age) {
    this.name = name 
    this.age = age
  }
  getUser() {
    var userInfo = '姓名：' + this.name + ' ;年龄：' + this.age
    console.log(userInfo)
  }
}

var per = new Person('小明', 24);
    per.getUser()
</pre>


# 不存在变量提升 #
Class 不存在变量提升（或者说函数提升），这一点与 ES5 完全不一样：

ES5 可以这样写
<pre>
var per = new Person('小明', 24);

function Person(name,age) {
  ......
}
</pre>

ES6 不可以这样写，会报错
<pre>
var per = new Person('小明', 24);	// 报错

const Person = class {
  constructor(name, age) {
    ......
  }
  ......
}
</pre>


# 类中采用严格模式 #
类和模块的内部默认就是严格模式，考虑到未来代码其实都是运行在模块中的，所以 ES6 实际上把整个 javascript 语言提升到了严格模式。



# Class 类的继承 #
Class 类之间可以通过 extends 关键字实现继承，这比 ES5 通过调用父类的构造函数继承父类的属性，通过封装的继承方法去继承父类的方法要方便得多。

<pre>
class ExtendPerson extends Person {}
</pre>

<pre>
const Person = class {
  constructor(name, age) {
    this.name = name 
    this.age = age
  }
  getUser() {
    var userInfo = '姓名：' + this.name + ' ;年龄：' + this.age
    console.log(userInfo)
  }
}

class ExtendPerson extends Person {}

var extendPerson = new ExtendPerson('小红', 25);
    extendPerson.getUser()
</pre>

上面代码就是通过 extends 关键字去继承父类 Person 类的实现过程。它可以完美的继承父类的所有方法和属性。由于新的类没有添加任何属性和方法，所以就相当于重新复制了一个 Person 类。下面我们来为新的类去添加一些属性和方法。

<pre>
class ExtendPerson extends Person {
  constructor(name, age, sex) {
    super(name, age);
    this.sex = sex;
  }
  sexUser() {
    var userInfo = '姓名：' + this.name + ' ;年龄：' + this.age + ' ;性别：' + this.sex;
    console.log(userInfo)
  }
}

var extendPerson = new ExtendPerson('小红', 25, '女');
    extendPerson.sexUser()
</pre>

上面代码中，constructor 方法中出现了一个 super 方法，它指代父类的实例（即父类的  this 对象），在子类中，可以通过 super 关键字很方便的去调用父类的方法。所以我们可以给子类在添加一个新的方法，这个方法去调用父类的 getUser 方法。

<pre>
class ExtendPerson extends Person {
  constructor(name, age, sex) {
    super(name, age);
    this.sex = sex;
  }
  sexUser() {
    var userInfo = '姓名：' + this.name + ' ;年龄：' + this.age + ' ;性别：' + this.sex;
    console.log(userInfo)
  }
  getAdd() {
    super.getUser()
  }
}

var extendPerson = new ExtendPerson('小红', 25, '女');
    extendPerson.getAdd() // 姓名：小红 ;年龄：25
</pre>

需要注意的是，**通过 extends 关键字继承而来的子类，是没有 this 对象的**，它的 this 对象是通过调用 super 关键字继承而来的，然后在对继承来的 this 进行加工在变成自己的。所以，子类的 constructor 中必须调用 super，否则新建实例会报错。

ES5 的继承实质上是先创建子类的 this，然后再将父类的方法添加到 this 上（Parent.apply(this)）;

ES6 的继承机制则完全不同，它是先创建父类的 this，然后再用子类 constructor 方法去调用 super 去获得父类的 this，最后才修改为自己的 this。

<pre>
class ExtendPerson extends Person {
  constructor(name, age, sex) {
    console.log(this) // 报错
    super(name, age);
    console.log(this) 
  }
  ......
}
</pre>


所以，可以通过运算符得知，子类 extendPerson 同时是 Person 和 ExtendPerson 的实例。
<pre>
console.log(extendPerson instanceof ExtendPerson) // true
console.log(extendPerson instanceof Person) // true
</pre>



# 类的静态方法 #
在方法前面添加 static 关键字，表示该方法是类的静态方法，它可以被构造函数方法直接调用，但是不能被类的实例对象调用，并且也不能在类的其他方法中调用。

0、普通方法，可以在类的内部直接通过 this 关键字调用：
<pre>
const Person = class {
  constructor(props) {
    ......
  }
  classMethods() {
    return 1
  }
  getClassMethods() {
    var count =  2 + this.classMethods()
    console.log(count)
  }
}

var personHandle = new Person();
    personHandle.getClassMethods()	// 3
</pre>

1、添加 static 关键字后，类的内部方法也不能直接调用：
<pre>
const Person = class {
  constructor(props) {
    
  }
  static classMethods() {
    console.log('这是类里面才可以调用的方法')
    return 1
  }
  getClassMethods() {
    var count =  2 + this.classMethods()  // 报错
    console.log(count)
  }
}

var personHandle = new Person();
    personHandle.getClassMethods()
</pre>

2、添加 static 关键字后，类的构造函数方法可以调用：
<pre>
const Person = class {
  constructor(props) {
    
  }
  static classMethods() {
    console.log('这是类里面才可以调用的方法')
    return 1
  }
}

var personHandle = new Person();
    Person.classMethods() // 这是类里面才可以调用的方法
</pre>

3、添加 static 关键字后，类的实例不能调用：
<pre>
const Person = class {
  constructor(props) {
    
  }
  static classMethods() {
    console.log('这是类里面才可以调用的方法')
    return 1
  }
}

var personHandle = new Person();
    personHandle.classMethods() // 报错
</pre>

4、父类的静态方法可以被子类通过 extends 关键字继承，子类中的调用方法：
<pre>
super.静态方法()
</pre>


# 类的静态属性 #
ES6 明确规定，class 类内部只有静态方法，没有静态属性，所以类的静态属性，必须写再类的外面：

<pre>
const Person = class {
  ......
}

Person.prop = '我是 Person 类的静态属性';
</pre>


# new.target #
在类的构造函数中，返回 new 命令所作用的构造函数，如果类的实例对象不是通过 new 创建的，那么它返回 undefined。所以可以通过它来判断，一个类的创建方式。

ES5 写法中可以判断，但 ES6 中强制必须使用 new 去调用类，否则直接报错：
<pre>
function Person(name) {
  if (new.target === Person) {
    this.name = name
  } else {
    throw new Error('必须使用 new 生成实例对象')
  }
}

var personHandle = new Person('小明');
</pre>

new.target 如果被子类继承，那么它指向子类的构造函数。可以通过这个属性，去写一个只能通过继承去调用的类：

<pre>
const Person = class {
  constructor(name) {
    if (new.target === Person) {
      throw new Error('本类只能通过继承去调用')
    } else {
      this.name = name
    }
  }
  getName() {
    console.log('姓名：' + this.name)
  }
}

class PersonExtend extends Person {
  constructor(name) {
    super(name)
  }
}

var PersonExtendHandle = new PersonExtend('小明');
    PersonExtendHandle.getName()  // 姓名：小明
</pre>

