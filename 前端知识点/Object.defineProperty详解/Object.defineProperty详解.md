# Object.defineProperty() #
> Object.defineProperty() 用于对对象定义一个新的属性，或者修改一个对象现有的属性，并且可以设置该属性的一些特性，并返回这个对象。

<pre>
let obj = {
  name: "小红",
  age: 20
};
Object.defineProperty(obj, "name", {
  // 设置对该 name 属性的一些操作或特性
});
</pre>

它接收3个参数分别是：对象，属性，属性描述符

## 属性描述符默认值 ##
<table border style="width: 100%; text-align: center;">
  <tr>
    <th>属性</th>
    <th>默认值</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>configurable</td>
    <td>false</td>
    <td>描述属性是否可以被删除，默认为 false</td>
  </tr>
  <tr>
    <td>enumerable</td>
    <td>false</td>
    <td>描述属性是否可以被for...in或Object.keys枚举，默认为 false</td>
  </tr>
  <tr>
    <td>writable</td>
    <td>false</td>
    <td>描述属性是否可以修改，默认为 false</td>
  </tr>
  <tr>
    <td>get</td>
    <td>undefined</td>
    <td>当访问属性时触发该方法，默认为undefined</td>
  </tr>
  <tr>
    <td>set</td>
    <td>undefined</td>
    <td>当属性被修改时触发该方法，默认为undefined</td>
  </tr>
  <tr>
    <td>value</td>
    <td>undefined</td>
    <td>属性值，默认为undefined</td>
  </tr>
</table>


【实例】：

<pre>
let obj = {};

Object.defineProperty(obj, "name", {
  value: "Jack"
});

console.log(obj); // {name: "Jack"}
</pre>

可以看出，给一个对象添加属性，可以是原来比较简单的方式，直接添加，也可以是这种通过 Object.defineProperty 方法去添加，而且通过 Object.defineProperty 添加的属性，可以进行描述符的一些设置（看上表）。

<pre>
let obj = {};

Object.defineProperty(obj, "name", {
  value: "Jack",
  configurable: false
});

delete obj.name; // 无法删除该属性

console.log(obj); // {name: "Jack"}
</pre>

描述符可以让你访问这些属性的时候添加一些自己的逻辑判断。在特定的情况下有特殊的处理，比如看下面一个有意思的判断：

<pre>
console.log(a === 1 && a === 2);
</pre>

让上面的条件为 true：

<pre>
let num = 0;
Object.defineProperty(window, "a", {
  get: function() {
    return ++num;
  }
});

console.log(a === 1 && a === 2); // true
</pre>

这个列子就是利用了对象属性的获取拦截来做的，当然还有其他一些方法可以做的，比如 valueOf 方法等。


## 双向数据绑定 ##
可以查看这篇文章：[https://segmentfault.com/a/1190000015427628](https://segmentfault.com/a/1190000015427628 "双向数据绑定")

1. 数据劫持：是对数据对象的 Setter 和 Getter 实现的劫持。
2. 发布-订阅模式：当监控的数据对象被更改后，这个变更会被广播给所有订阅该数据的watcher，然后由该 watcher 实现对页面的重新渲染。

**订阅/发布模式：观察者模式**

可以查看这篇文章：[https://segmentfault.com/a/1190000015405468](https://segmentfault.com/a/1190000015405468 "观察者模式")


下面是一个简化版的 订阅/发布模式：
<pre>
// 发布者
let publisher = {
  // 订阅者列表：里面有提供的服务和所有订阅了该服务的订阅者
  registration: {
    type1: [],
    type2: []
  },

  // 收集订阅者，把他们保存在 registration 对象里面
  subscribe: function(type, fn) {
    if (Object.keys(this.registration).includes(type)) {
      this.registration[type].push(fn);
    } else {
      console.error(`error：对不起 ${fn.name}，我们还没有提供这个服务！`);
      // throw new ReferenceError("对不起，我们还没有提供这个服务！");
    }
  },

  // 取消订阅
  unSubscribe: function(type, name) {
    if (Object.keys(this.registration).includes(type)) {
      let index = -1;
      this.registration[type].forEach(function(func, idx) {
        if (func.name === name) {
          index = idx;
        }
      });
      index > -1 ? this.registration[type].splice(index, 1) : null;
    } else {
      throw new ReferenceError("对不起，你没有订阅该项服务！");
    }
  },

  // 发布订阅
  publish: function(type, message) {
    if (Object.keys(this.registration).includes(type)) {
      for (let fn of this.registration[type]) {
        fn(message);
      }
    } else {
      console.error("error：我们还没有提供该服务，请发布者先检查下！");
    }
  }
};

// 订阅者
let personA = function(message) {
  console.log(`订阅者A：${message}`);
};
let personB = function(message) {
  console.log(`订阅者B：${message}`);
};
let personC = function(message) {
  console.log(`订阅者C：${message}`);
};

// 订阅者开始订阅消息
publisher.subscribe("type1", personA);
publisher.subscribe("type1", personB);
publisher.subscribe("type2", personB);
publisher.subscribe("type1", personC);
publisher.subscribe("type3", personC);

// 发布者发布消息
publisher.unSubscribe("type1", personC.name);
publisher.publish("type1", "我是发布者发布的消息 1！");
publisher.publish("type2", "我是发布者发布的消息 2！");
publisher.publish("type3", "我是发布者发布的消息 3！");

// 打印结果
// 订阅者A：我是发布者发布的消息 1！
// 订阅者B：我是发布者发布的消息 1！
// 订阅者B：我是发布者发布的消息 2！
// error：对不起 personC，我们还没有提供这个服务！
// error：我们还没有提供该服务，请发布者先检查下！
</pre>


**模拟vue的双向数据绑定**

<pre>
// html 结构
&lt;h1 id=&quot;h1&quot;&gt;&lt;/h1&gt;
&lt;input type=&quot;text&quot; id=&quot;inp&quot; onkeyup=&quot;inputChange(event)&quot; /&gt;
&lt;input type=&quot;button&quot; value=&quot;加&quot; onclick=&quot;btnAdd()&quot; /&gt;

// 数据源
let vm = {
  value: 0
};

// 定义一个Dep，用于存储watcher
let Dep = function() {
  let list = [];
  this.add = function(watcher) {
    list.push(watcher);
  };
  this.notify = function(newValue) {
    list.forEach(function(fn) {
      fn(newValue);
    });
  };
};

// 模拟 vue 的 compile，通过对 Html 的解析生成一系列订阅者（watcher）
function renderInput(newValue) {
  let el = document.getElementById("inp");
  if (el) {
    el.value = newValue;
  }
}

function renderTitle1(newValue) {
  let el = document.getElementById("h1");
  if (el) {
    el.innerHTML = newValue;
  }
}

// 将解析出来的watcher存入Dep中待用
let dep = new Dep();
dep.add(renderInput);
dep.add(renderTitle1);

// 使用 Object.defineProperty 定义一个 Observer
function observer(vm, key, value) {
  Object.defineProperty(vm, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      console.log("Get");
      return value;
    },
    set: function(newValue) {
      if (value !== newValue) {
        value = newValue;
        console.log("Update");

        //将变动通知给相关的订阅者
        dep.notify(newValue);
      }
    }
  });
}

//页面引用的方法
function inputChange(ev) {
  let value = Number.parseInt(ev.target.value);
  vm.value = Number.isNaN(value) ? 0 : value;
}

function btnAdd() {
  vm.value = vm.value + 1;
}

//数据初始化方法
function initMVVM(vm) {
  Object.keys(vm).forEach(function(key) {
    observer(vm, key, vm[key]);
  });
}

//初始化数据源
initMVVM(vm);

//初始化页面，将数据源渲染到UI
dep.notify(vm.value);
</pre>


























