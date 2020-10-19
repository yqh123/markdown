# TypeScript 模块化
ts 也支持模块化，而且它的出现比 es6 模块化还要早，ts 的模块实现也有一些地方与其他模块化系统不一样的地方，但是随着 ts 的更新，同时 es6 标准本身也越来越成熟，所以当下和未来 ts 的模块化也会与 es6 越来越接近。

## 模块
无论是 js 还是 ts 都是以一个文件作为模块的最小单元

- 任何一个包含了顶级 import 或者 export 的文件都被当成一个模块
- 相反的一个文件不带有顶级的 import 或者 export，那么它的内容就是全局可见的

### 全局模块
如果一个文件不带有顶级的 import 或者 export，那么它的内容就是整个项目可见的。

```
// a.ts
let a = 1;
let b = 2;

// b.ts
let a = 3; // error：ts 提示变量 a 已经定义
```

### 模块用法
```
// a.ts
let a = 1;
export default {
  a: a
}

// b.ts
import data from './a';

let a = 2;
console.log(data)
```


### 模块编译
ts 编译器能够根据相应的编译配置参数（tsconfig.json 里面的 module 配置），把代码编译成指定的模块系统使用的代码，比如 AMD、CMD、ESM、CommonJs、System 等。

在 ts 编译选项中，module 选项是用来指定生产哪种类型的模块系统的代码的，可设置的值有："CommonJS", "AMD", "System", "UMD", "ES6", "ES2015", "ES2020", "ESNext", "None"。

- target="es3 / es5" 时，默认使用 commonjs
- 其他情况默认使用 es6

```
{
  "compilerOptions": {
    ......
    "module": "ES6"
  }
}
```


### 加载非 TS 文件
有的时候，我们需要引入一些非 .ts 后缀的文件，比如 .js 文件，或者引入一些第3方使用的 js，它们都是非 ts 编写的模块，默认情况下 tsc 是不对其进行编译的（tsc 默认只处理 .ts 后缀的模块），所以我们需要在 tsconfig.json 中配置 allowJs 告诉 tsc 需要处理非 ts 模块：

```
{
  "compilerOptions": {
  	......
    "allowJs": true
  }
}
```

这样配置之后，就可以正常导入或者导出这类模块了。


### 非 ESM 模块中的默认值问题
在 esm 中的模块是可以设置默认导出的：

**注意：以下设置只能当 module 不为 es6+ 的情况下有效**

```
export default '数据';
```

但是在 CommonJs、AMD 中是没有默认导出设置的，它们导出的是一个对象（exports）:

```
module.exports.obj = {
  data: '数据'
}
```

1. 第一种方式：在 ts 中导入这类模块会出现“模块没有默认导出”的错误提示，简单的处理方式：

```
import * as m from '非esm模块文件地址'
```

2. 第二种方式（推荐）：通过配置选项解决：

```
{
  "compilerOptions": {
    ......
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

通过这种配置后，就可以不使用第一种方式的写法了：

```
import m from '非esm模块文件地址'
```

### 加载 json 格式文件
把 JSON 文件作为一个模块进行加载，需要配置

```
{
  "compilerOptions": {
    ......
    "moduleResolution": "node",
    "resolveJsonModule": true
  }
}
```

```
import * as data from './data.json'
console.log(data)
```























