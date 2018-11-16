/*
  去掉字符前后空格
*/
function strTrim(str) { return str.replace(/(^\s*)|(\s*$)/g, "") }


/*
  时间转换
  使用方式：that.format(new Date(后台返回时间未转换数据), '转换格式（pattern）')
  pattern： yyyy-MM-dd 或者 yyyy.MM.dd 等自定义格式
*/
format: function (date, pattern) {
  pattern = pattern || 'yyyy-MM-dd';
  function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
  };
  return pattern.replace(SIGN_REGEXP, function ($0) {
    switch ($0.charAt(0)) {
      case 'y': return padding(date.getFullYear(), $0.length);
      case 'M': return padding(date.getMonth() + 1, $0.length);
      case 'd': return padding(date.getDate(), $0.length);
      case 'w': return date.getDay() + 1;
      case 'h': return padding(date.getHours(), $0.length);
      case 'm': return padding(date.getMinutes(), $0.length);
      case 's': return padding(date.getSeconds(), $0.length);
    }
  });
}


/*
  电话号码中间4位显示*
*/
uphone: function (arrData) {
  arrData.forEach((item)=>{
    item.phone = item.phone.substring(0, 3) + "****" + item.phone.substring(7, 11)
    return item
  })
}

/*
  转义特殊字符串，比如后台传的数据里面有特殊字符  "<"、">"、"→"、" ' "等
*/
function decodeHtml(html) {
  let txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

/*
	解析URL参数
*/
function getLoctionUrl(url) { 
  var search = url.substring(url.lastIndexOf("?") + 1); 
  var obj = {}; 
  var reg = /([^?&=]+)=([^?&=]*)/g; 
  search.replace(reg, function (rs, $1, $2) { 
    var name = decodeURIComponent($1); 
    var val = decodeURIComponent($2); 
    val = String(val); 
    obj[name] = val;
    return rs; 
  }) 
  return obj;
}



/*
  返回方法名
*/
module.exports = {
  format: format,
  uphone: uphone,
  getLoctionUrl: getLoctionUrl
}