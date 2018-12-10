# 移动端1px像素问题及解决办法 #
在移动端web开发中，UI设计稿中设置边框为1像素，前端在开发过程中如果出现border:1px，测试会发现在某些机型上，1px会比较粗，即是较经典的移动端1px像素问题。首选先看一下，pc时代和移动端时代对1px的对比。


# 为什么1px变粗了？ #
在web端CSS里面写了1px，实际上在某些机型上看起来比1px粗；这里的原因要涉及到“设备物理像素”和“css逻辑像素”，它们对于1px的实现是不一样的，UI设计师要求的1px是指设备物理像素1px，而我们写的css代码1px是指逻辑像素，它们之间有一个转换关系：

<pre>
设备像素比 = 设备物理像素 / CSS逻辑像素	// 某一方向上
</pre>

上面提到的“设备像素比”可以通过js程序 window.devicePixelRatio 获取，一般来说，在pc浏览器端这个设备像素比是为1的，也就是说，你css设置了 1px，那么设备上看到的设备像素就是 1px。而在web移动端，大多数机型的设备像素比都不是为1的，有可能是2或者3，这也就造成了你看到的设备像素比1px 要大的根本原因。

以 iphone5 为例，它的设备像素比 dpr 为 2(iphone X 为 3)，那么你在代码里设置的 1px，在设备上的视觉效果就是 2px，所以 UI 就要来跟你提BUG了。


# 视口viewport #
对于做移动端来说，我们都会在 head 里面加上 meta 标签
<pre>
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no&quot;&gt;
&lt;!--width=device-width：宽度为设备宽度--&gt;
&lt;!--initial-scale：缩放比为1--&gt;
&lt;!--user-scalable=no：是否允许用户自定义缩放--&gt;
</pre>

这句话定义了本页面的 viewport 的宽度为设备宽度，初始缩放值为1，最大缩放比例为1，最小缩放比例为1，并禁止了用户缩放。

对于 iPhone 6 Plus 来说，设置这个meta标签可以得到视觉上的1px像素，但对于其他机型，这个 scale 缩放比例就需要在调整了。


# 移动端1px解决方案 #
> 有多种解决方案，看下面

## 媒体查询利用设备像素比缩放，设置小数像素 ##
IOS8 下已经支持带小数的px值, media query 对应 devicePixelRatio 有个查询值 -webkit-min-device-pixel-ratio, css可以写成这样：
<pre>
.border { border: 1px solid #999 }
@media screen and (-webkit-min-device-pixel-ratio: 2) {
    .border { border: 0.5px solid #999 }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
    .border { border: 0.333333px solid #999 }
}
</pre>

【缺点】 对设备有要求，小数像素目前兼容性较差。


## viewport + rem （推荐: 兼容各种像素）##
该方案是对上述方案的优化，整体思路就是利用 viewport + rem + js 动态的修改页面的缩放比例，实现小于1像素的显示。在页面初始化时，在头部引入原始默认状态如下：

<pre>
&lt;meta http-equiv=&quot;Content-Type&quot; content=&quot;text/html;charset=UTF-8&quot;&gt;  
&lt;meta name=&quot;viewport&quot; id=&quot;WebViewport&quot; content=&quot;initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no&quot;&gt;
</pre>

接下来的任务就是js的动态修改缩放比 以及实现 rem 根元素字体大小的设置。这样就实现了所有 css 像素在不同设备的缩放情况，不仅是解决 1px 问题。

<pre>
var viewport = document.querySelector(&quot;meta[name=viewport]&quot;)
if (window.devicePixelRatio == 1) {
    viewport.setAttribute(&#x27;content&#x27;, &#x27;width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no&#x27;)
} 
if (window.devicePixelRatio == 2) {
    viewport.setAttribute(&#x27;content&#x27;, &#x27;width=device-width, initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no&#x27;)
} 
if (window.devicePixelRatio == 3) {
    viewport.setAttribute(&#x27;content&#x27;, &#x27;width=device-width, initial-scale=0.333333333, maximum-scale=0.333333333, minimum-scale=0.333333333, user-scalable=no&#x27;)
} 

var docEl = document.documentElement;
var fontsize = 10 * (docEl.clientWidth / 320) + &#x27;px&#x27;;
docEl.style.fontSize = fontsize;
</pre>

【缺点】以为缩放涉及全局的rem单位，比较适合新项目，对于老项目可能要涉及到比较多的改动。



## :before :after和transform （推荐: 新老项目都可以使用）  ##
有很多种方式都可以实现1像素问题，但都有各自的缺点，而且也不够灵活，所以用接下来要讲的方案是一种比较灵活的方案，新老项目都可以用。<br>
原理是把原先元素的 border 去掉，然后利用 :before 或者 :after 重做 border ，并 transform 的 scale 缩小一半，原先的元素相对定位，新做的 border 绝对定位。

**单条border样式设置：**
<pre>
.scale-1px{
     position: relative;
     border:none;
 } 
.scale-1px:after{
     content: '';
     position: absolute; 
     bottom: 0; 
     background: #000; 
     width: 100%; 
     height: 1px;
     -webkit-transform: scaleY(0.5); 
     transform: scaleY(0.5); 
     -webkit-transform-origin: 0 0; 
      transform-origin: 0 0; 
}
</pre>

**四条border样式设置：**
<pre>
.scale-1px{ 
    position: relative; 
    margin-bottom: 20px; border:none;
} 
.scale-1px:after{ 
    content: ''; 
    position: absolute;
    top: 0; 
    left: 0;
    border: 1px solid #000; 
    box-sizing: border-box; 
    width: 200%; 
    height: 200%; 
    transform: scale(0.5); 
    transform-origin: left top; 
	-webkit-box-sizing: border-box; 
	-webkit-transform: scale(0.5); 
	-webkit-transform-origin: left top; 
}
</pre>

结合js来代码来判断是否是 Retina 屏：
<pre>
if(window.devicePixelRatio && devicePixelRatio >= 2){
	 document.querySelector('div').className = 'scale-1px';
}
</pre>

所有场景都能满足，也支持圆角设置。但是对于圆角的设置比较麻烦，因为在 :after 的时候其实元素的 border 已经去掉了，所以你在元素身上在添加 border-radius 的时候并不能起效果（通过内联样式也不行），因为在你添加这个样式的时候，border 的控制权已经全部交给了这个样式的 :after 伪类，所以你必须把圆角的设置写在 :after 伪类里面才能执行。

如果是这样的话，那么就太麻烦了，你得写很多样式出来，去支持不同的圆角设置。而且除了 1px 外，对项目特别严格的话，大于 1px 的线用这种方式就不好处理了。不过庆幸的是，对于大于1像素的 css 像素设置，在物理设备像素的显示上还行，问题没有1像素那么明显，所以在大多数项目上，项目的要求都是针对 1px 的。



# 综上 #

- 如果项目是新项目的话，可以使用：viewport + rem 的方式去全局定义，之后就正常写 border 样式就可以了
- 如果是现有项目的话，一般圆角可能就那么几个，所以你可以使用 :before、:after 和 transform 去统一设置一些 （1px + 各种圆角）的样式。但如果要兼容所有 css 像素的话，还是建议用第一种方式。









