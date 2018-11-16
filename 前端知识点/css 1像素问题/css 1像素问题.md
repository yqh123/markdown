# 移动端1px像素问题及解决办法 #
在移动端web开发中，UI设计稿中设置边框为1像素，前端在开发过程中如果出现border:1px，测试会发现在某些机型上，1px会比较粗，即是较经典的移动端1px像素问题。首选先看一下，pc时代和移动端时代对1px的对比。


# 为什么1px变粗了？ #
为什么移动端CSS里面写了1px，实际上在某些机型上看起来比1px粗；这里的原因要涉及到“设备物理像素”和“css逻辑像素”，它们对于1px的实现是不一样的，UI设计师要求的1px是指设备物理像素1px，而我们写的css代码1px是指逻辑像素，它们之间有一个转换关系：

<pre>
设备像素比 = 设备像素 / CSS像素(某一方向上)
</pre>

上面提到的“设备像素比”可以通过js程序 window.devicePixelRatio 获取，一般来说，在pc浏览器端这个设备像素比是为1的，也就是说，你css设置了1px，那么设备上看到的设备像素就是1px。而在web移动端，大多数机型的设备像素比都不是为1的，有可能是2或者3，这也就造成了你看到的设备像素比1px要大。<br>
以iphone5为例，它的设备像素比dpr为2，那么你在代码里设置的1px，在设备上的视觉效果就是2px，所以UI就要来跟你提BUG了。


# 视口viewport #
对于做移动端来说，我们都会在head里面加上 meta 标签
<pre>
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no&quot;&gt;
&lt;!--width=device-width：宽度为设备宽度--&gt;
&lt;!--initial-scale：缩放比为1--&gt;
&lt;!--user-scalable=no：是否允许用户自定义缩放--&gt;
</pre>

这句话定义了本页面的viewport的宽度为设备宽度，初始缩放值为1，最大缩放比例为1，最小缩放比例为1，并禁止了用户缩放。<br>
对于 iPhone 6 Plus 来说，设置这个meta标签可以得到视觉上的1px像素，但对于其他机型，这个 scale 缩放比例就需要在调整了。


# 移动端1px解决方案 #
> 有多种解决方案，看下面

## 媒体查询利用设备像素比缩放，设置小数像素 ##
IOS8下已经支持带小数的px值, media query对应devicePixelRatio有个查询值-webkit-min-device-pixel-ratio, css可以写成这样：
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


## viewport + rem ##
该方案是对上述方案的优化，整体思路就是利用viewport + rem + js 动态的修改页面的缩放比例，实现小于1像素的显示。在页面初始化时，在头部引入原始默认状态如下：

<pre>
&lt;meta http-equiv=&quot;Content-Type&quot; content=&quot;text/html;charset=UTF-8&quot;&gt;  
&lt;meta name=&quot;viewport&quot; id=&quot;WebViewport&quot; content=&quot;initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no&quot;&gt;
</pre>

接下来的任务就是js的动态修改缩放比 以及 实现rem根元素字体大小的设置。

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



## :before :after和transform （推荐: 很灵活）  ##
有很多种方式都可以实现1像素问题，但都有各自的缺点，而且也不够灵活，所以用接下来要将的方案是目前比较好的处理方式，也是用得比较多的。<br>
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
    -webkit-box-sizing: border-box; 
    box-sizing: border-box; 
    width: 200%; 
    height: 200%; 
    -webkit-transform: scale(0.5); 
    transform: scale(0.5); 
    -webkit-transform-origin: left top; 
    transform-origin: left top; 
}
</pre>

结合js来代码来判断是否是Retina屏：
<pre>
if(window.devicePixelRatio && devicePixelRatio >= 2){
	 document.querySelector('div').className = 'scale-1px';
}
</pre>

所有场景都能满足，支持圆角设置。









