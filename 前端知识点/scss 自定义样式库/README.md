# scss 自定义样式库
所有常用的自定义样式都加了 !important 权重，统一全项目编写样式风格

## css 代码智能提示
你在元素上输入 class="" 时，vscode 智能的提示出由 scssScript.scss 文件生成的 class 或 id 名称（需要先安装 easy-sass 插件）

### 安装 easy-sass 插件
1. 运行命令：command+shift+p
2. 选择：compile all Scss/Sass files in the project
3. 将打包出的 scssScript.min.css 全局正则替换 \{.+?\} 替换成 {}，如有其他 xxx.min.css 打包出来了，请删除
4. 将替换完成的无属性的提示文件 放入你自己新建的 snippets 文件夹下面的 snippets.css 中 (注意 不要引入此文件，它只做 vscode css 智能提示用的)
5. 编译器将会读取这份文件，并为你提供代码提示


## 目录结构
- scss/_base.scss：单独的公共样式文件
- scss/_variables.scss：scssScript.scss 用到的常用变量、数组、map 对象
- scss/scssScript.scss：循环遍历生成自定义常用样式

## 常用样式介绍
**_base.scss**

- clearfix：清浮动
- border-radius-circle：50% 圆角
- border-none：清除边框
- border-block: 显示边框

**scssScript.scss**

- display 样式集合

```
.display-none => display: none;
.display-block => display: block;
.display-inline => display: inline;
.display-inline-block => display: inline-block;
.display-flex => display: flex;
.display-inline-flex => display: inline-flex;
```

- font-size 【字体大小】（最大值为 50）

```
.fs-20 => font-size: 20px;
```

- margin 【外边距】（最大值为 50）

```
.m-10 =>  margin: 10px;
.m-t-10 =>  margin-top: 10px; 
.m-r-10 =>  margin-rigth: 10px; 
.m-b-10 =>  margin-bottom: 10px; 
.m-l-10 =>  margin-left: 10px; 

.m-f-l-10 =>  margin-left: -10px; 
......
```

- padding 【内边距】（最大值为 50）

```
.p-10 =>  padding: 10px;
.p-t-10 =>  padding-top: 10px; 
.p-r-10 =>  padding-rigth: 10px; 
.p-b-10 =>  padding-bottom: 10px; 
.p-l-10 =>  padding-left: 10px; 

.p-f-l-10 =>  padding-left: -10px; 
......
```

- border-radius 【圆角】（最大值为 30）

```
.bd-radius-10 => border-radius: 10px;
```

- font-size-color 【字体颜色】

```
.fs-color-default => color: #737373;
.fs-color-primary => color: #1890ff;
.fs-color-danger => color: #ff4d4f;
.fs-color-white => color: #ffffff;

// 字体颜色可以自行在 scss/_variables.scss 文件里面的 $COLOR 里面修改或者新增
```

- border 【全边框】（最大值为 3）

```
.bd-solid-default-1 => border: 1px solid #737373;
.bd-dotted-primary-1 => border: 1px dotted #1890ff;
.bd-dashed-danger-1 => border: 1px dashed #ff4d4f;

// -solid 边框样式可以在 scss/_variables.scss 文件里面的 $BORDER_STYLE 里面修改或者新增
// -primary 边框颜色可以在 scss/_variables.scss 文件里面的 $COLOR 里面修改或者新增
```

- border 【单边框】（最大值为 3）

```
.bd-top-solid-2 => border-top: 2px solid #737373;
.bd-right-dotted-2 => border-right: 2px dotted #737373;
.bd-bottom-dashed-2 => border-bottom: 2px dashed #737373;
.bd-left-solid-2 => border-left: 2px solid #737373;

// 单边框都统一采用默认 default 颜色，如需修改单边框颜色值，可以使用下面要介绍的边框颜色设置 border-color
```

- border 【边框颜色】

```
.bd-color-default => border-color: #737373;
.bd-color-primary => border-color: #1890ff;
.bd-color-danger => border-color: #ff4d4f;
.bd-color-white => border-color: #ffffff;

// 边框颜色可以自行在 scss/_variables.scss 文件里面的 $COLOR 里面修改或者新增
```

- position 【定位方式】

```
.pis-relative => position: relative;
.pis-absolute => position: absolute;
.pis-fixed => position: fixed;
.pis-static => position: static;
.pis-inherit => position: inherit;

// 定位属性可以自行在 scss/_variables.scss 文件里面的 $POSITION_SX 里面修改或者新增
```

- position 【定位值】(最大值为 -100 ～ +100)

```
.pis-top-10 => top: 10px;
.pis-right-20 => right: 20px;
.pis-bottom-30 => bottom: 30px;
.pis-left-40 => left: 40px;

// 它须和 position 【定位方式】结合使用
```

- ellipsis 多行显示省略号...（最大值为 10）

```
.text-ellipsis-1 => 单行显示省略号...
.text-ellipsis-2 => 大于 2 行文本时显示...
.text-ellipsis-3 => 大于 3 行文本时显示...
```

- float 【浮动】

```
.float-left => float: left;
.float-right => float: right;
```

- vertical-align 【对齐方式】

```
.v-a-baseline => vertical-align: baseline;
.v-a-sub => vertical-align: sub;
.v-a-super => vertical-align: super;
.v-a-text-top => vertical-align: text-top;
.v-a-text-bottom => vertical-align: text-bottom;
.v-a-top => vertical-align: top;
.v-a-middle => vertical-align: middle;
.v-a-bottom => vertical-align: bottom;
.v-a-inherit => vertical-align: inherit;
```

- width & height 【宽高集合】（最大值为 -100 ～ +100）

```
.w-px-10 => width: 10px;
.w-em-20 => width: 20em;
.w-rem-30 => width: 30rem;
.w-vw-40 => width: 40vw;
.w-vh-50 => width: 50vh;
.w-bfb-60 => width: 60%;

.h-px-10 => width: 10px;
......

// 单位可以自行在 scss/_variables.scss 文件里面的 $UNIT 里面修改或者新增
```


## flex 布局
- flex-direction 【容器的属性】

```
.flex-direction-row => flex-direction: row;
.flex-direction-row-reverse => flex-direction: row-reverse;
.flex-direction-column => flex-direction: column;
.flex-direction-column-reverse => flex-direction: column-reverse;
```

- flex-wrap 【轴线排布方式】

```
.flex-wrap-nowrap => flex-wrap: nowrap;
.flex-wrap-wrap => flex-wrap: wrap;
.flex-wrap-wrap-reverse => flex-wrap: wrap-reverse;
```

- justify-content【主轴上的对齐方式】

```
.justify-content-flex-start => justify-content: flex-start;
.justify-content-flex-end => justify-content: flex-end;
.justify-content-center => justify-content: center;
.justify-content-space-between => justify-content: space-between;
.justify-content-space-around => justify-content: space-around;
```

- align-items 【交叉轴上如何对齐】

```
.align-items-flex-start => align-items: flex-start;
.align-items-flex-end => align-items: flex-end;
.align-items-center => align-items: center;
.align-items-baseline => align-items: baseline;
.align-items-stretch => align-items: stretch;
```

- align-content 【多根轴线的对齐方式】

```
.align-content-flex-start => align-content: flex-start;
.align-content-flex-end => align-content: flex-end;
.align-content-center => align-content: center;
.align-content-space-between => align-content: space-between;
.align-content-space-around => align-content: space-around;
.align-content-stretch => align-content: stretch;
```

1. order 【项目的排列顺序。数值越小，排列越靠前】（最大值为10）
2. flex-grow 【项目的放大比例】（最大值为10）
3. flex-shrink 【项目的缩小比例】（最大值为10）

```
.order-1 => order: 1;
.flex-grow-1 => flex-grow: 1;
.flex-shrink-1 => flex-shrink: 1;
```

- flex 【flex-grow, flex-shrink 和 flex-basis的简写】

```
.flex-none => flex: none;
.flex-auto => flex: auto;
```

- align-self 【不一样的对齐方式】

```
.align-self-auto => align-self: auto;
.align-self-flex-start => align-self: flex-start;
.align-self-flex-end => align-self: flex-end;
.align-self-center => align-self: center;
.align-self-baseline => align-self: baseline;
.align-self-stretch => align-self: stretch;
```


































