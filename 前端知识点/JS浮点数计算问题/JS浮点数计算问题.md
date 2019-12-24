# JS浮点数计算问题 #
> 对于浮点数的四则运算，几乎所有的编程语言都会有类似精度误差的问题，只不过在 C++/C#/Java 这些语言中已经封装好了方法来避免精度的问题，
> 
> 而 JavaScript 是一门弱类型的语言，从设计思想上就没有对浮点数有个严格的数据类型，所以精度误差的问题就显得格外突出。

<pre>
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 == 0.3); // false
</pre>

从上面的运行结果可以得知 0.1 + 0.2 != 0.3

# 出现的原因 #
其根本原因是因为某些小数没法用二进制精确表示出来（JS 使用的是 IEEE754 双精度浮点规则），能被计算机读懂的是二进制，而不是十进制，所以我们先把 0.1 和 0.2 转换成二进制看看：

<pre>
0.1==》0.1.toString(2)==》0.0001100110011(无限循环..)
0.2==》0.2.toString(2)==》0.001100110011(无限循环..)
</pre>

双精度浮点数的小数部分最多支持 52 位，所以两者相加之后得到这么一串0.0100110011001100110011001100110011001100110011001100 因浮点数小数位的限制而截断的二进制数字，这时候，我们再把它转换为十进制，就成了 0.30000000000000004。

那怎么解决这个问题呢？我想要的结果就是 0.1 + 0.2 === 0.3


# 浮点数精度问题的解决方法1 #
有种最简单的解决方案，就是给出明确的精度要求，在返回值的过程中，计算机会自动四舍五入，这也是比较常用的一种方法：

<pre>
var num1 = 0.1; 
var num2 = 0.2; 
alert(parseFloat((num1 + num2).toFixed(2))); // 0.30
</pre>


# 浮点数精度问题的解决方法2 #
在没有明确精度的情况下，也要得到比较精确的运算，可以采用下面的方法。

#### ㈠ 简单解决方案 ####
将小数转成整数来运算，之后再转回小数。

<pre>
// 加法
const accAdd = function(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  let dec1, dec2, times;
  try {
    dec1 = countDecimals(num1) + 1;
  } catch (e) {
    dec1 = 0;
  }
  try {
    dec2 = countDecimals(num2) + 1;
  } catch (e) {
    dec2 = 0;
  }
  times = Math.pow(10, Math.max(dec1, dec2));
  // let result = (num1 * times + num2 * times) / times;
  let result = (accMul(num1, times) + accMul(num2, times)) / times;
  return getCorrectResult("add", num1, num2, result);
  // return result;
};

// 减法
const accSub = function(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  let dec1, dec2, times;
  try {
    dec1 = countDecimals(num1) + 1;
  } catch (e) {
    dec1 = 0;
  }
  try {
    dec2 = countDecimals(num2) + 1;
  } catch (e) {
    dec2 = 0;
  }
  times = Math.pow(10, Math.max(dec1, dec2));
  // let result = Number(((num1 * times - num2 * times) / times);
  let result = Number(
    (accMul(num1, times) - accMul(num2, times)) / times
  );
  return getCorrectResult("sub", num1, num2, result);
  // return result;
};

// 除法
const accDiv = function(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  let t1 = 0,
    t2 = 0,
    dec1,
    dec2;
  try {
    t1 = countDecimals(num1);
  } catch (e) {}
  try {
    t2 = countDecimals(num2);
  } catch (e) {}
  dec1 = convertToInt(num1);
  dec2 = convertToInt(num2);
  let result = accMul(dec1 / dec2, Math.pow(10, t2 - t1));
  return getCorrectResult("div", num1, num2, result);
  // return result;
};

// 乘法
const accMul = function(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  let times = 0,
    s1 = num1.toString(),
    s2 = num2.toString();
  try {
    times += countDecimals(s1);
  } catch (e) {}
  try {
    times += countDecimals(s2);
  } catch (e) {}
  let result =
    (convertToInt(s1) * convertToInt(s2)) / Math.pow(10, times);
  return getCorrectResult("mul", num1, num2, result);
  // return result;
};

// 计算小数位的长度
const countDecimals = function(num) {
  let len = 0;
  try {
    num = Number(num);
    let str = num.toString().toUpperCase();
    if (str.split("E").length === 2) {
      // scientific notation
      let isDecimal = false;
      if (str.split(".").length === 2) {
        str = str.split(".")[1];
        if (parseInt(str.split("E")[0]) !== 0) {
          isDecimal = true;
        }
      }
      let x = str.split("E");
      if (isDecimal) {
        len = x[0].length;
      }
      len -= parseInt(x[1]);
    } else if (str.split(".").length === 2) {
      // decimal
      if (parseInt(str.split(".")[1]) !== 0) {
        len = str.split(".")[1].length;
      }
    }
  } catch (e) {
    throw e;
  } finally {
    if (isNaN(len) || len < 0) {
      len = 0;
    }
    return len;
  }
};

// 将小数转成整数
const convertToInt = function(num) {
  num = Number(num);
  let newNum = num;
  let times = countDecimals(num);
  let temp_num = num.toString().toUpperCase();
  if (temp_num.split("E").length === 2) {
    newNum = Math.round(num * Math.pow(10, times));
  } else {
    newNum = Number(temp_num.replace(".", ""));
  }
  return newNum;
};

// 确认我们的计算结果无误，以防万一
const getCorrectResult = function(type, num1, num2, result) {
  let temp_result = 0;
  switch (type) {
    case "add":
      temp_result = num1 + num2;
      break;
    case "sub":
      temp_result = num1 - num2;
      break;
    case "div":
      temp_result = num1 / num2;
      break;
    case "mul":
      temp_result = num1 * num2;
      break;
  }
  if (Math.abs(result - temp_result) > 1) {
    return temp_result;
  }
  return result;
};
</pre>

** 基本用法： **

<pre>
加法： accAdd(0.1, 0.2)  // 得到结果：0.3
减法： accSub(1, 0.9)    // 得到结果：0.1
除法： accDiv(2.2, 100)  // 得到结果：0.022
乘法： accMul(7, 0.8)    // 得到结果：5.6

countDecimals()方法：计算小数位的长度
convertToInt()方法：将小数转成整数
getCorrectResult()方法：确认我们的计算结果无误，以防万一
</pre>


#### ㈡ 使用特殊进制类型类库 ####
如果你需要非常精确的结果，可以考虑使用特殊的进制数据类型，如下面的这个叫 bignumber 的类库：

<pre>
https://github.com/MikeMcl/bignumber.js
</pre>


# 总结 #
JS 浮点数计算精度问题是因为某些小数没法用二进制精确表示出来。JS 使用的是 IEEE754双精度浮点规则。

而规避浮点数计算精度问题，可通过以下几种方法：

- 调用 round() 方法四舍五入或者 toFixed() 方法保留指定的位数（对精度要求不高）
- 将小数转为整数再做计算，即上面提到的那个简单的解决方案（对精度要求相对较高）
- 使用特殊的进制运算库（对精度要求很高）

































