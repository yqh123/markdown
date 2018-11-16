# html5 视频、音频 #
> 原生html新增了视频和音频组件，不用再用恶心的flash了；只是在各个系统下、pc和wap下，视频和音频在原生方面的兼容性还有待提高，尤其是在做移动端的时候


## 参考资料 ##
- MDN: video：[https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video "video")
- HTML 的媒体支持:audio 和 video 元素：[https://developer.mozilla.org/zh-CN/docs/Web/HTML/Supported_media_formats](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Supported_media_formats "video")
- HTML 5 视频/音频参考手册：[http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp](http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp "video")


## 视频、音频支持格式 ##
.avi、.flv、.mp4、.mkv、.ogv等


## 编解码器 ##
> 每个浏览器所采用的编解码器都可能不一样，这样就导致了，样式可能不一样，能够解析的视频或音频格式也不一样。原始的视频容器非常大，添加需编码，播放需解码。
> 
> 音频编解码器：AAC、MPEG-3、Ogg Vorbis
> 
> 视频编解码器：H.264、VP8、Ogg Theora


## 视频、音频标签 ##
- video---视频：&lt;video src=&quot;视频&quot;&gt;&lt;/video&gt;
- audio---音频：&lt;audio src=&quot;音频&quot;&gt;&lt;/audio&gt;
- source--兼容其他浏览器的标签：&lt;video&gt;&lt;source src=&quot;兼容格式1&quot;&gt;&lt;/source&gt;&lt;source src=&quot;兼容格式2&quot;&gt;&lt;/source&gt;&lt;/video&gt;


## source标签 ##
> 由于各个浏览器编解码器可能不一样，所以支持的视频或者音频格式也打不相同，尤其是在做pc端的时候，所以才有了 source 标签来解决这个问题

<pre>
// 如果视频格式支持第一种，就播放第一个视频格式，如果不支持就走下面的视频2格式
&lt;video controls&gt;
	&lt;source src=&quot;格式1&quot;&gt;&lt;/source&gt;
	&lt;source src=&quot;格式2&quot;&gt;&lt;/source&gt;
&lt;/video&gt;
</pre>



# HTML5 Video 完全指南 #
> 由于原生 video 用的比较多，而且兼容问题也很多，所以这部分都是介绍 video 的内容，
> HTML <video> 元素 用于在 HTML 或者 XHTML 文档中嵌入视频内容。

## 属性 ##
**controls**
> 设置或返回视频是否应该显示控件（比如播放/暂停等）

<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls&gt;&lt;/video&gt;
</pre>

**autoplay**
> 设置或返回是否在就绪（加载完成）后自动播放视频
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls autoplay&gt;&lt;/video&gt;
</pre>

**nodownload**
- 置是否去除去除下载按钮
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls controlslist=&quot;nodownload&quot;&gt;&lt;/video&gt;
</pre>

**nofullscreen**
- 设置是否去除全屏显示按钮
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls controlslist=&quot;nodownload nofullscreen&quot;&gt;&lt;/video&gt;
</pre>

**poster**
- 设置视频的封面
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls poster=&quot;&lt;YOUR_URL&gt;&quot;&gt;&lt;/video&gt;
</pre>

**muted**
- 设置是否静音（注意：移动端非静音模式下无法自动播放）
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls muted&gt;&lt;/video&gt;
</pre>

**loop**
- 设置循环播放
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls loop&gt;&lt;/video&gt;
</pre>

**preload**
- 视频预加载模式
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls preload&gt;&lt;/video&gt;
</pre>

**volume**
- 音量控制，区间范围在 0-1
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls id=&quot;volume&quot;&gt;&lt;/video&gt;
</pre>
<pre>
var time = document.getElementById(&quot;time&quot;);
time.currentTime = 60; // 秒
</pre>

**播放时间控制**
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls preload id=&quot;time&quot;&gt;&lt;/video&gt;
&lt;script type=&quot;text/javascript&quot;&gt;
  var time = document.getElementById(&quot;time&quot;);
  time.currentTime = 60; // 秒
&lt;/script&gt;
</pre>

**播放地址切换**
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls preload id=&quot;_src&quot;&gt;&lt;/video&gt;
&lt;script type=&quot;text/javascript&quot;&gt;
  var _src = document.getElementById(&quot;_src&quot;);
  functionchangeSrc(){
    _src.src = &quot;&lt;YOUR_URL&gt;&quot;;
  }
&lt;/script&gt;
</pre>

**备用地址切换**
<pre>
&lt;video width=&quot;100%&quot; controls id=&quot;_source&quot;&gt;
    &lt;source src=&quot;&lt;YOUR_URL&gt;&quot; type=&quot;video/mp4&quot;&gt; // 错误地址
    &lt;source src=&quot;&lt;YOUR_URL&gt;&quot; type=&quot;video/mp4&quot;&gt;
&lt;/video&gt;
&lt;script type=&quot;text/javascript&quot;&gt;
    var _source = document.getElementById(&quot;_source&quot;);
    setTimeout(function () {
        console.log(_source.currentSrc); // 获取当前url
    },2000)
&lt;/script&gt;
</pre>

**播放速度**
<pre>
&lt;video src=&quot;&lt;YOUR_URL&gt;&quot; width=&quot;100%&quot; controls preload id=&quot;_speed&quot;&gt;&lt;/video&gt;
&lt;script type=&quot;text/javascript&quot;&gt;
    var _speed = document.getElementById(&quot;_speed&quot;);
    _speed.playbackRate = 0.5;
&lt;/script&gt;
</pre>


## 事件 ##

**loadstart**
- 当浏览器开始寻找指定的音频/视频时，会发生 loadstart 事件。即当加载过程开始时
<pre>
v.addEventListener(&quot;loadstart&quot;, function(e) {
  console.log(&quot;loadstart&quot;);
});
</pre>

**durationchange**
- 音频/视频的时长
<pre>
v.addEventListener(&quot;durationchange&quot;, function(e) {
  console.log(&quot;时长&quot;, v.duration);
});
</pre>

**loadedmetadata**
- 当浏览器已经加载完成视频
<pre>
v.addEventListener(&quot;loadedmetadata&quot;, function(e) {
  console.log(&quot;loadedmetadata&quot;);
});
</pre>

**loadeddata**
- 当浏览器已加载视频的当前帧时
<pre>
v.addEventListener(&quot;loadeddata&quot;, function(e) {
  console.log(&quot;loadeddata&quot;);
});
</pre>

**progress**
- 当浏览器正在下载视频
<pre>
v.addEventListener(&quot;progress&quot;, function(e) {
  console.log(&quot;progress&quot;);
});
</pre>

**canplay**
- 判断是否可以播放
<pre>
v.addEventListener(&quot;canplay&quot;, function() {
  console.log(&quot;canplay&quot;);
});
</pre>

**canplaythrough**
- 判断是否可以流畅播放
<pre>
v.addEventListener(&quot;canplaythrough&quot;, function() {
  console.log(&quot;canplaythrough&quot;);
});
</pre>

**play**
- 视频播放
<pre>
v.addEventListener(&quot;play&quot;, function() {
  console.log(&quot;play&quot;);
});
或者
v.play()
</pre>

**pause**
- 视频暂停
<pre>
v.addEventListener(&quot;pause&quot;, function() {
  console.log(&quot;pause&quot;);
});
或者
v.pause()
</pre>

**seeking**
- 当用户开始移动/跳跃到音视频中的新位置时
<pre>
v.addEventListener(&quot;seeking&quot;, function() {
  console.log(&quot;seeking&quot;);
});
</pre>

**waiting**
- 当视频由于需要缓冲下一帧而停止，等待
<pre>
v.addEventListener(&quot;waiting&quot;, function() {
  console.log(&quot;waiting&quot;);
});
</pre>

**playing**
- 当视频在已因缓冲而暂停或停止后已就绪时
<pre>
v.addEventListener(&quot;playing&quot;, function() {
  console.log(&quot;playing&quot;);
});
</pre>

**timeupdate**
- 目前的播放位置已更改时，播放时间更新
<pre>
v.addEventListener(&quot;timeupdate&quot;, function() {
  console.log(&quot;timeupdate&quot;);
});
</pre>

**ended**
- 播放结束
<pre>
v.addEventListener(&quot;ended&quot;, function() {
  console.log(&quot;ended&quot;);
});
</pre>

**error**
- 播放错误
<pre>
v.addEventListener(&quot;error&quot;, function(e) {
  console.log(&quot;error&quot;, e);
});
</pre>

**volumechange**
- 当音量已更改时
<pre>
v.addEventListener(&quot;volumechange&quot;, function() {
  console.log(&quot;volumechange&quot;);
});
</pre>

**stalled**
- 当浏览器尝试获取媒体数据，但数据不可用时
<pre>
v.addEventListener(&quot;stalled&quot;, function() {
  console.log(&quot;stalled&quot;);
});
</pre>

**ratechange**
- 当视频的播放速度已更改时
<pre>
v.addEventListener(&quot;ratechange&quot;, function() {
  console.log(&quot;ratechange&quot;);
});
</pre>


## 以下是 video 常用的方法封装 ##
**全屏播放视频**
<pre>
functioin fullscreen(elem) {
	var prefix = &#x27;webkit&#x27;;
	if (elem[prefix + &#x27;EnterFullScreen&#x27;]) {
		return prefix + &#x27;EnterFullScreen&#x27;;
	} else if (elem[prefix + &#x27;RequestFullScreen&#x27;]) {
		return prefix + &#x27;RequestFullScreen&#x27;;
	};
	return false;
}
</pre>
<pre>
// 使用方式
var fullscreenvideo = fullscreen(视频元素);
视频元素.[fullscreenvideo]();
</pre>

**退出视频全屏**
<pre>
视频元素.webkitExitFullScreen()
</pre>


## video 使用注意点 ##
- 在pc端，视频默认是全屏播放的，但是在退出全屏状态下，在安卓机型下视频的层级永远是最高的（非常恶心的问题），所以在移动端使用video时，都是使用障眼法，用设置好的视频封面图和播放按钮，使用常css3旋转视频元素到不可见的角度，然后在点击播放时，在把视频元素转回到可见角度（注意，不要用 display 去控制视频元素的显示和隐藏，安卓手机下没有问题，但ios手机下有bug，视频没有画面，所以采用css3，transform:'rotate()'  去设置视频元素的旋转角度去显示和隐藏视频元素）