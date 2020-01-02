# 影响浏览器渲染方式的文档模式 #
每个浏览器都有自己的页面渲染引擎。渲染引擎包括两个部分：一部分负责 html、css 代码的解析和渲染（比如 blink 引擎或者浏览器内核）；另一部分负责 javascript 代码的解析（比如 v8 引擎）;

浏览器的渲染引擎主要对 css 解析有影响（对脚本也有一些影响），不同的渲染模式在 css 解析上存在差异，比如度盒模型的处理上。

不同的渲染模式是历史遗留问题。早期 W3C 没有统一标准，导致浏览器厂商自己决定如何渲染页面，标准出来后，现在的浏览器肯定和标准有不一样的地方。所以为了兼容，就出现了两种浏览器渲染模式：标准模式和怪异模式；如果 html 文档没有按照标准编写，那么就采用怪异模式渲染；

那么浏览器如何判定采用哪种模式渲染呢？实际上浏览器在渲染页面之前会先检查两个内容，一个是页面是否有 DOCTYPE（文档声明） 信息；另外一个是页面是否有 x-ua-compatible（这个是 IE8 专有的一个 meta 标签的属性，可以指定浏览器以怎样的模式渲染） 信息。

<pre>
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;UTF-8&quot; /&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot; /&gt;
    &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;ie=edge&quot; /&gt;
    &lt;title&gt;Document&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;&lt;/body&gt;
&lt;/html&gt;
</pre>

上面就是一个典型的采用标准的 html5 规范的页面

来看一个强制采用怪异盒模型渲染的样式：

<pre>
div {
  width: 100%;
  height: 100px;
  padding: 20px;
  background: #eee;
  box-sizing: border-box;	/* 启用怪异盒模型 */
}
</pre>

在浏览去里面可以看到，这个 div 在页面上所占用的宽度，并没有加上设置的 padding 值。


# HTML 解析过程 #
当用户在浏览器键入某网站地址时，网站首页文档 index.html 加载完成后，浏览器开始解析 html 文档。下面根据不同的 html 资源结构去分析整个解析过程。


## 1、纯 HTML 文档，无 CSS 和 JS ##
如果 HTML 文档没有 css 和 js 脚本的话，解析过程很简单。

**过程**：浏览器解析 HTML ---> 构建 DOM 树 ---> 触发 onload 事件 ---> 构建 render 树 ---> 布局和绘制页面


## 2、包含内联样式和内联脚本的 HTML 文档 ##
<pre>
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
  &lt;meta charset=&quot;UTF-8&quot;&gt;
  &lt;title&gt;Demo&lt;/title&gt;
  &lt;style&gt;
	内联样式
  &lt;/style&gt;
  &lt;script&gt;
  	内联脚本
  &lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</pre>

如果 HTML 文档中存在内联样式和脚本，这个时候，问题变得稍微复杂一些。

浏览器解析 HTML，构建 DOM 树时，当解析到 style 标签的时候，样式信息开始被解析，CSSOM（渲染树）被构建，但它并不会影响到 HTML 的解析和 DOM 树的构建。当 HTML 解析到 script 标签的时候，因为脚本语言很有可能会操作 DOM 节点，所以 HTML 解析必须等待脚本执行完毕后在继续解析，而脚本又很有可能操作 css 样式，所以脚本必须等待 CSS 解析完毕后才能执行。等到 CSS 解析完成后，脚本被交到 JS 引擎中，由 JS 引擎执行。当脚本执行完毕后，HTML 继续往下解析，直到全部的 HTML 解析完毕，DOM 树构建完成，触发 onload 事件，布局和绘制页面。

**过程：**浏览器解析 HTML ---> 解析 CSS，构建渲染树 ---> 解析 JS，阻塞 HTML 解析并且等待 CSS 解析 ---> 构建 DOM 树 ---> 触发 onload 事件 ---> 构建 render 树 ---> 布局和绘制页面

**注意：**onload 事件只和 HTML 的加载和解析有关，一旦 HTML 解析完成，这个事件就会被触发，不管此时还有没有 CSS 的解析、图片的下载或者异步脚本的加载和执行。DOM 树一旦构建完成，就会开始构建 render 树，并不管 CSS 是否解析完毕。如果构建 render 树的时候，CSS 还没有解析完成，那么 render 树会用占位符代替应该有的 CSSOM 节点，当该节点加载解析好后，再重新计算样式。

但是同步脚本的执行会阻塞 HTML 的解析，从而会影响到 onload 事件的触发。同时又要注意，CSS 会阻塞 JS 脚本的执行，从而间接影响到 HTML 的解析和 onload 事件的触发。


## 3、HTML 文档中加载图片，音频、视频等资源 ##
HTML 文档中对于图片，音频、视频等资源的加载并不会阻塞页面的解析，它是遇到比如图片 image 的时候，去 src 的地址上去加载资源，但页面继续往下解析，等到资源加载完成后，就回过头来显示该资源。如果因为图片尺寸发生了变化，导致页面排版和布局受影响的话，浏览器会重新布局页面（页面重排）。


## 4、包含外部 CSS 和 JS 的 HTML 文档 ##
如果 HTML 文档中存在外联样式表和脚本，问题变得更复杂一点。HTML 文档加载完成后，浏览器首先扫描 HTML 文档，查看有哪些外部资源需要启动 network operation 来请求资源，并在 HTML 解析的同时，发送所有的请求。CSS 资源加载完毕后，会立即开始解析构建 CSSOM。（同步脚本加载完毕后，并不能立刻执行。）当 HTML 解析到 script 标签，先确认脚本加载完毕了没，如果没，那得等；如果加载好了，还得看 CSS 解析好了没。如果没，那还得等；如果 CSS 解析好了，那就能把脚本交给 JS 引擎去执行了。当 JS 执行完毕，HTML 继续解析，DOM 继续构建，直到全部构建完成，onload 事件被触发。紧接着，就是构建 render 树，布局和绘制页面。

如果脚本有 async 属性，问题就又不一样了。async 属性默认该脚本不会影响到 DOM 内容，所以只要脚本下载完成，（相关）CSS 解析完毕，脚本立刻执行，不用等着 HTML 解析到 script 标签再开始执行。同样，HTML 也不会等着脚本执行完毕再解析。仿佛两者看不到对方，只管做自己的事情就行了。

<pre>
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
  &lt;meta charset=&quot;UTF-8&quot;&gt;
  &lt;title&gt;Demo&lt;/title&gt;
  &lt;!-- link 加载资源不会阻塞页面 --&gt;
  &lt;link rel=&quot;stylesheet&quot; href=&quot;xxxxx&quot;&gt;	
  &lt;!-- script 加载资源会阻塞页面，但它的执行要等到 link 资源构建完毕 --&gt;
  &lt;script src=&quot;/javascripts/application.js&quot;&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</pre>

所以通过上面可以看到，如果用一个 js 程序去控制一个元素在 onload 事件的时候，隐藏该元素，那么页面最开始是看不到该元素的，因为 onload 事件被触发后，才会构建  render 树，最后才是布局和绘制页面。



# 总结 #
1. 确定浏览器渲染模式（标签模式还是非标准模式）：通过 DOCTYPE 或者 x-ua-compatible（IE8专用）
2. 确定标码格式比如：meta charset="UTF-8"
3. 解析 CSS 样式：不管是内联样式还是外部资源，都不会阻塞页面解析
4. 解析 JS 脚本：不管是内联脚本还是外部资源，都会阻塞页面解析，并且它还要等待 CSS 解析完成后，才会移交给 JS 引擎处理，JS 引擎处理完后，在继续解析 HMTL 文档。
5. HTML 解析完成，构建 DOM 树，触发 onload 事件
6. 构建 render 树，如果 CSS 还没有解析完成，那么会用占位符代替应该有的 CSSOM 节点，当该节点加载解析好后，再重新计算样式
7. 布局和绘制页面