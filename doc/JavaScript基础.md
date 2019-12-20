# JavaScript基础

## 类型

- 基本类型
  - [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)（数字）基于 IEEE 754 标准的双精度 64 位二进制格式的值（-(2^53 -1) 到 2^53 -1）
  - [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)（字符串）
  - [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Boolean)（布尔）
  - [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)（符号）（ES2015 新增）
  - [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)（空）
  - [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)（未定义）
  - bigInt(任意大的整数)
- 引用类型
  - `Object`（对象）
    - [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Function)（函数）
    - [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array)（数组）
    - [`Date`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Date)（日期）
    - [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/RegExp)（正则表达式）
    - Error(错误)
    - ………………

### 堆内存与栈内存

在js引擎中对变量的存储主要有两种位置，**堆内存和栈内存**。

和java中对内存的处理类似，**栈内存**主要用于存储各种**基本类型的**变量.以及对象变量的指针

晚点说



## 函数

### 声明提升

函数一定要处于调用它们的域中，**但是**函数的声明可以被提升(出现在调用语句之后)，如下例：

```js
console.log(square(5)); // 25
/* ... */
function square(n) { return n*n }
```

#### 警告!!

**提示：**注意只有使用如上的语法形式（即 `function funcName(){}`）才可以。而下面的代码是无效的。就是说，函数提升仅适用于函数声明，而不适用于函数表达式。

```js
console.log(square); // square is hoisted with an initial value undefined.
console.log(square(5)); // TypeError: square is not a function
var square = function (n) { 
  return n * n; 
}
```

### 作用域

```js
function outside() {
  var x = 5;
  function inside(x) {
    return x * 2;
  }
  return inside;
}

outside()(10); // returns 20 instead of 10
```

命名冲突发生在`return x`上，`inside`的参数`x`和`outside`变量`x`发生了冲突。这里的作用链域是{`inside`, `outside`, 全局对象}。因此`inside`的`x`具有最高优先权，返回了20（`inside`的`x`）而不是10（`outside`的`x`）。

### 闭包

闭包是 JavaScript 中最强大的特性之一。

JavaScript 允许函数嵌套，并且内部函数可以访问定义在外部函数中的所有变量和函数，以及外部函数能访问的所有变量和函数。

**但是**，外部函数却不能够访问定义在内部函数中的变量和函数。这给内部函数的变量提供了一定的安全性。