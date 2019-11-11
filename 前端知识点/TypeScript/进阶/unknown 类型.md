# unknown 类型 #
> TypeScript 3.0 引入了新的unknown 类型，它是 any 类型对应的安全类型。
> 
> unknown 和 any 的主要区别是 unknown 类型会更加严格：在对 unknown 类型的值执行大多数操作之前，我们必须进行某种形式的检查。而在对 any 类型的值执行操作之前，我们不必进行任何检查。


## any 类型 ##
它代表所有可能的 JavaScript 值 — 基本类型，对象，数组，函数，Error，Symbol，以及任何你可能定义的值。

在 TypeScript 中，任何类型都可以被归为 any 类型。这让 any 类型成为了类型系统的 顶级类型 (也被称作 全局超级类型)，也可以说任何类型都是 any 类型的子集。

any 类型的代码示例：

<pre>
let value: any;

value = "Hello World";    // OK
value = 42;               // OK
value = true;             // OK
value = null;             // OK
value = undefined;        // OK
value = [];               // OK
value = {};               // OK
value = Math.random;      // OK
value = new TypeError();  // OK
value = Symbol("type");   // OK
</pre>

any 类型本质上是类型系统的一个逃逸舱。作为开发者，这给了我们很大的自由：TypeScript允许我们对 any 类型的值执行任何操作，而无需事先执行任何形式的检查。

也正是没有了任何的类型检测机制，any 类型在某些操作过程中也会出现令人匪夷所思的地方，比如下面的例子：

<pre>
let value: any = 3;

let value2: any = value;       // OK
let value3: boolean = value;   // OK
let value4: number = value;    // OK
let value5: string = value;    // OK
let value6: object = value;    // OK
let value7: any[] = value;     // OK
let value8: Function = value;  // OK
</pre>

value 的类型是 any，初始化值是数字类型 3，这样的话，任何类型的赋值如果是它的话，就会变得很矛盾。所以 unknown 类型慢慢被开发出来。

能有顶级类型也能默认保持安全，这就是 unknown 到来的原因。


## unknown 类型 ##
就像所有类型都可以被归为 any，所有类型也都可以被归为 unknown。这使得 unknown 成为 TypeScript 类型系统的另一种顶级类型（另一种是 any）。

这是我们之前看到的相同的一组赋值示例，这次使用类型为 unknown 的变量：

<pre>
let value: unknown;

value = "Hello World";    // OK
value = 42;               // OK
value = true;             // OK
value = null;             // OK
value = undefined;        // OK
value = [];               // OK
value = {};               // OK
value = Math.random;      // OK
value = new TypeError();  // OK
value = Symbol("type");   // OK
</pre>

对 value 变量的所有赋值都被认为是类型正确的。

<pre>
let value: unknown = 3;

let value1: unknown = value;   // OK
let value2: any = value;       // OK
let value3: boolean = value;   // Error
let value4: number = value;    // Error
let value5: string = value;    // Error
let value6: object = value;    // Error
let value7: any[] = value;     // Error
let value8: Function = value;  // Error
</pre>

unknown 类型只能被赋值给 any 类型和 unknown 类型本身。只有能够保存任意类型值的容器才能保存 unknown 类型的值。毕竟我们不知道变量 value 中存储了什么类型的值。

下面是一个 any 类型与 unknown 类型获取属性和执行方法时的一些比较：

<pre>
let value: any;

value.foo.bar;  // OK
value.trim();   // OK
value();        // OK
new value();    // OK
value[0][1];    // OK
</pre>

<pre>
let value: unknown;

value.foo.bar;  // Error
value.trim();   // Error
value();        // Error
new value();    // Error
value[0][1];    // Error
</pre>

将 value 变量类型设置为 unknown 后，这些操作都不再被认为是类型正确的。通过改变 any 类型到 unknown 类型，我们的默认设置从允许一切翻转式的改变成了几乎什么都不允许。

<pre>
let value: unknown;

value = '123';

if (value.length) {
  console.log(value.length)
}

// 类型“unknown”上不存在属性“length”
</pre>

这是 unknown 类型的主要价值主张：TypeScript 不允许我们对类型为 unknown 的值执行任意操作。相反，我们必须首先执行某种类型检查以缩小我们正在使用的值的类型范围。


## 缩小 unknown 类型范围 ##
我们可以通过不同的方式将 unknown 类型缩小为更具体的类型范围，包括 typeof 运算符，instanceof 运算符和自定义类型保护函数。所有这些缩小类型范围的技术都有助于 TypeScript 的 基于控制流的类型分析：[https://mariusschulz.com/blog/control-flow-based-type-analysis-in-typescript](https://mariusschulz.com/blog/control-flow-based-type-analysis-in-typescript "基于控制流的类型分析")。

<pre>
let value: unknown;

value = '123';

if (typeof value === 'string') {
  console.log(value.length)
} else if (value instanceof Number) {
  console.log(value.toString().length)
}
</pre>

如何使用 typeof，instanceof 来说服 TypeScript 编译某个值具有某种类型。这是将 “unknown” 类型指定为更具体类型的安全且推荐的方法。


## 对 unknown 类型使用类型断言 ##
如果要强制编译器信任类型为 unknown 的值为给定类型，则可以使用类似这样的类型断言：

<pre>
const value: unknown = "Hello World";
const someString: string = value as string;
const otherString = someString.toUpperCase();  // "HELLO WORLD"
</pre>

请注意，TypeScript 事实上未执行任何特殊检查以确保类型断言实际上有效。类型检查器假定你更了解并相信你在类型断言中使用的任何类型都是正确的。

如果你犯了错误并指定了错误的类型，这很容易导致在运行时抛出错误：

<pre>
const value: unknown = 42;
const someString: string = value as string;
const otherString = someString.toUpperCase();  

// someString 不存在 toUpperCase() 方法
</pre>


## 联合类型中的 unknown 类型 ##
在联合类型中，unknown 类型会吸收任何类型。这就意味着如果任一组成类型是 unknown，联合类型也会相当于 unknown。这条规则的一个意外是 any 类型。如果至少一种组成类型是 any，联合类型会相当于 any：

<pre>
type UnionType1 = unknown | null;       // unknown
type UnionType2 = unknown | undefined;  // unknown
type UnionType3 = unknown | string;     // unknown
type UnionType4 = unknown | number[];   // unknown

type UnionType5 = unknown | any;  // any
</pre>

所以为什么 unknown 可以吸收任何类型（any 类型除外）？让我们来想想 unknown | string 这个例子。这个类型可以表示任何 unkown 类型或者 string 类型的值。就像我们之前了解到的，所有类型的值都可以被定义为 unknown 类型，其中也包括了所有的 string 类型，因此，unknown | string 就是表示和 unknown 类型本身相同的值集。因此，编译器可以将联合类型简化为 unknown 类型。


## 交叉类型中的 unknown 类型 ##
在交叉类型中，任何类型都可以吸收 unknown 类型。这意味着将任何类型与 unknown 相交不会改变结果类型：

<pre>
type IntersectionType1 = unknown & null;       // null
type IntersectionType2 = unknown & undefined;  // undefined
type IntersectionType3 = unknown & string;     // string
type IntersectionType4 = unknown & number[];   // number[]
type IntersectionType5 = unknown & any;        // any
</pre>

<pre>
type type1 = unknown & null; 

let num: type1 = 123;

// 不能将类型“123”分配给类型“null”
</pre>

让我们回顾一下 IntersectionType3：unknown & string 类型表示所有可以被同时赋值给 unknown 和 string 类型的值。由于每种类型都可以赋值给 unknown 类型，所以在交叉类型中包含 unknown 不会改变结果。我们将只剩下 string 类型。


## 使用类型为 unknown 的值的运算符 ##
unknown 类型的值不能用作大多数运算符的操作数。这是因为如果我们不知道我们正在使用的值的类型，大多数运算符不太可能产生有意义的结果。

你可以在类型为 unknown 的值上使用的运算符只有四个相等和不等运算符：

- ===
- ==
- !==
- !=

**如果要对类型为 unknown 的值使用任何其他运算符，则必须先用 typeOf 或者 instanceof 指定类型（或使用类型断言强制编译器信任你）**


## 示例：从 localStorage 中读取JSON ##
假设我们要编写一个从 localStorage 读取值并将其反序列化为 JSON 的函数。如果该项不存在或者是无效 JSON，则该函数应返回错误结果，否则，它应该反序列化并返回值。

因为我们不知道在反序列化持久化的 JSON 字符串后我们会得到什么类型的值。我们将使用 unknown 作为反序列化值的类型。这意味着我们函数的调用者必须在对返回值执行操作之前进行某种形式的检查（或者使用类型断言）。

实现函数：

<pre>
type Result =
  | { success: true, value: unknown }
  | { success: false, error: Error };

function tryDeserializeLocalStorageItem(key: string): Result {
  const item = localStorage.getItem(key);

  if (item === null) {
    // 该项不存在，因此返回错误结果。
    return {
      success: false,
      error: new Error(`Item with key "${key}" does not exist`)
    };
  }

  let value: unknown;

  try {
    value = JSON.parse(item);
  } catch (error) {
    // 该项不是有效的json，因此返回错误结果
    return {
      success: false,
      error
    };
  }

  // 一切都很好，因此返回一个成功的结果
  return {
    success: true,
    value
  };
}
</pre>

返回值类型 Result 是一个被标记的联合类型。

tryDeserializeLocalStorageItem 的函数调用者在尝试使用 value 或 error 属性之前必须首先检查 success 属性：

<pre>
const result = tryDeserializeLocalStorageItem("dark_mode");

if (result.success) {
  // 我们已将“success”属性缩小为“true”，
  // 所以我们可以访问'value'属性
  const darkModeEnabled: unknown = result.value;

  if (typeof darkModeEnabled === "boolean") {
    // 我们把“未知”类型缩小为“布尔”类型，
    // 所以我们可以安全地使用'darkmodeenabled'作为布尔值
    console.log("Dark mode enabled: " + darkModeEnabled);
  }
} else {
  // 我们已将“success”属性缩小为“false”，
  // 所以我们可以访问“error”属性
  console.error(result.error);
}
</pre>

请注意，tryDeserializeLocalStorageItem 函数不能简单地通过返回 null 来表示反序列化失败，原因如下：

1. null 值是一个有效的 JSON 值。因此，我们无法区分是对值 null 进行了反序列化，还是由于缺少参数或语法错误而导致整个操作失败。
2. 如果我们从函数返回 null，我们无法同时返回错误。因此，我们函数的调用者不知道操作失败的原因。


为了完整性，这种方法的更成熟的替代方案是使用类型解码器进行安全的 JSON 解析。解码器需要我们指定要反序列化的值的预期数据结构。如果持久化的JSON结果与该数据结构不匹配，则解码将以明确定义的方式失败。这样，我们的函数总是返回有效或失败的解码结果，就不再需要 unknown 类型了。