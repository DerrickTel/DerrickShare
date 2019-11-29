# this的绑定(iii)

- call()
- apply()
- bind()

## call()和apply()

`call()`和`apply()`的区别在于, `call()`的参数是**零个或多个**, 而`apply()`的参数是一个数组或`类数组对象`, 这个数组的元素可以是**零个或多个**

### 类数组对象

本着一句话必须句句明白, 吃透一切的心态, 我们一起了解一下什么是类数组对象.

> 1）拥有length属性，其它属性（索引）为非负整数（对象中的索引会被当做字符串来处理）;
>
> 2）不具有数组所具有的方法；
>
> 类数组是一个普通对象，而真实的数组是Array类型。
>
> 常见的类数组有: 函数的参数 arguments, DOM 对象列表(比如通过 document.querySelectorAll 得到的列表), jQuery 对象 (比如 $("div")).



## call的模拟实现

先看下面一个简单的例子

```js
var value = 1;
var foo = {
    value: 2
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 2
```

通过上面的介绍我们知道，`call()`主要有以下两点

- 1、`call()`改变了this的指向
- 2、函数 `bar` 执行了

### 模拟实现第一步

如果在调用`call()`的时候把函数 `bar()`添加到`foo()`对象中，即如下

```js
var value = 1;
var foo = {
    value: 2,
    bar: function() {
        console.log(this.value);
    }
};

foo.bar(); // 2
```

这个改动就可以实现：改变了this的指向并且执行了函数`bar`。

但是这样写是有副作用的，即给`foo`额外添加了一个属性，怎么解决呢？

解决方法很简单，用 `delete` 删掉就好了。

所以只要实现下面3步就可以模拟实现了。

- 1、将函数设置为对象的属性：`foo.fn = bar`
- 2、执行函数：`foo.fn()`
- 3、删除函数：`delete foo.fn`

代码实现如下：

```js
// 第一版
Function.prototype.call1 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this; 		// foo.fn = bar
    context.fn();			// foo.fn()
    delete context.fn;		// delete foo.fn
}

// 测试一下
var value = 1;
var foo = {
    value: 2
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 2
```

完美！

### 模拟实现第二步

第一版有一个问题，那就是函数 `bar` 不能接收参数，所以我们可以从 `arguments`中获取参数，取出第二个到最后一个参数放到数组中，为什么要抛弃第一个参数呢，因为第一个参数是 `this`。

> `slice() 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的**浅拷贝**（包括 `begin`，不包括`end`）。原始数组不会被改变。

所以说第二个版本就实现了，代码如下：

```js

    // 第二版
    Function.prototype.call2 = function(context) {
        // 首先要获取调用call的函数，用this可以获取
        debugger
        context.fn = this; 		// foo.fn = bar
        const args = [...arguments].slice(1)
        context.fn(...args);			// foo.fn()
        delete context.fn;		// delete foo.fn
    }
    
    // 测试一下
    var value = 1;
    var foo = {
        value: 2
    };
    
    function bar() {
      console.log(this.value);
    }
    
    bar.call2(foo); // 2
    
    bar()
```

### 模拟实现第三步

第二版还有几个细节没有注意

- 1、this 参数可以传 `null` 或者 `undefined`，此时 this 指向 window
- 2、this 参数可以传基本类型数据，原生的 call 会自动用 Object() 转换
- 3、函数是可以有返回值的
- 4、不是函数调用的话要抛出一个错误
- 有没有fn这个属性



实现:

```js
Function.prototype.call3 = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context ? Object(context) : window;// 实现细节 1 和 2
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}
```

完美！！！

## apply的实现

`apply` 的实现也类似，区别在于对参数的处理，所以就不一一分析思路了

```js
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context ? Object(context) : window;
  context.fn = this
  let result
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

## bind的实现

`bind` 方法与 `call / apply` 最大的不同就是前者返回一个绑定上下文的**函数**，而后两者是**直接执行**了函数。

来个例子说明下

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    return {
		value: this.value,
		name: name,
		age: age
    }
};

bar.call(foo, "Jack", 20); // 直接执行了函数
// {value: 1, name: "Jack", age: 20}

var bindFoo1 = bar.bind(foo, "Jack", 20); // 返回一个函数
bindFoo1();
// {value: 1, name: "Jack", age: 20}

var bindFoo2 = bar.bind(foo, "Jack"); // 返回一个函数
bindFoo2(20);
// {value: 1, name: "Jack", age: 20}
```

通过上述代码可以看出`bind` 有如下特性：

- 1、可以指定`this`
- 2、返回一个函数
- 3、可以传入参数
- 4、柯里化

### 模拟实现第一步

对于第 1 点，使用 `call / apply` 指定 `this` 。

对于第 2 点，使用 `return` 返回一个函数。

结合前面 2 点，可以写出第一版，代码如下：

```js
// 第一版
Function.prototype.bind2 = function(context) {
    var self = this; // this 指向调用者
    return function () { // 实现第 2点
        return self.apply(context); // 实现第 1 点
    }
}
```

测试一下

```js
// 测试用例
var value = 2;
var foo = {
    value: 1
};

function bar() {
	return this.value;
}

var bindFoo = bar.bind2(foo);

bindFoo(); // 1
```

### 模拟实现第二步

四点特性：

- 1、可以指定`this`
- 2、返回一个函数
- 3、可以传入参数
- 4、柯里化

对于第 3 点，使用 `arguments` 获取参数数组并作为 `self.apply()` 的第二个参数。

对于第 4 点，获取返回函数的参数，然后同第3点的参数合并成一个参数数组，并作为 `self.apply()` 的第二个参数。

```js
// 第二版
Function.prototype.bind2 = function (context) {

    var self = this;
    // 实现第3点，因为第1个参数是指定的this,所以只截取第1个之后的参数
	// arr.slice(begin); 即 [begin, end]
    var args = Array.prototype.slice.call(arguments, 1); 

    return function () {
        // 实现第4点，这时的arguments是指bind返回的函数传入的参数
        // 即 return function 的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply( context, args.concat(bindArgs) );
    }
}
```

测试一下：

```js
// 测试用例
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    return {
		value: this.value,
		name: name,
		age: age
    }
};

var bindFoo = bar.bind2(foo, "Jack");
bindFoo(20);
// {value: 1, name: "Jack", age: 20}
```

### 模拟实现第三步

到现在已经完成大部分了，但是还有一个难点，`bind` 有以下一个特性

> 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器，提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

来个例子说明下：

```js
var value = 2;
var foo = {
    value: 1
};
function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'Jack');
var obj = new bindFoo(20);
// undefined
// Jack
// 20

obj.habit;
// shopping

obj.friend;
// kevin
```

上面例子中，运行结果`this.value` 输出为 `undefined`，这不是全局`value` 也不是`foo`对象中的`value`，这说明 `bind` 的 `this` 对象失效了，`new` 的实现中生成一个新的对象，这个时候的 `this`指向的是 `obj`。（【进阶3-1期】有介绍new的实现原理，下一期也会重点介绍）

这里可以通过修改返回函数的原型来实现，代码如下：

```js
// 第三版
Function.prototype.bind2 = function (context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        
        // 注释1
        return self.apply(
            this instanceof fBound ? this : context, 
            args.concat(bindArgs)
        );
    }
    // 注释2
    fBound.prototype = this.prototype;
    return fBound;
}
```

- 注释1：
  - 当作为构造函数时，this 指向实例，此时 `this instanceof fBound` 结果为 `true`，可以让实例获得来自绑定函数的值，即上例中实例会具有 `habit` 属性。
  - 当作为普通函数时，this 指向 `window`，此时结果为 `false`，将绑定函数的 this 指向 `context`
- 注释2： 修改返回函数的 `prototype` 为绑定函数的 `prototype`，实例就可以继承绑定函数的原型中的值，即上例中 `obj` 可以获取到 `bar` 原型上的 `friend`。

注意：这边涉及到了原型、原型链和继承的知识点，可以看下我之前的文章。

[JavaScript常用八种继承方案](https://juejin.im/post/5bcb2e295188255c55472db0)

### 模拟实现第四步

上面实现中 `fBound.prototype = this.prototype`有一个缺点，直接修改 `fBound.prototype` 的时候，也会直接修改 `this.prototype`。

来个代码测试下：

```js
// 测试用例
var value = 2;
var foo = {
    value: 1
};
function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';

var bindFoo = bar.bind2(foo, 'Jack'); // bind2
var obj = new bindFoo(20); // 返回正确
// undefined
// Jack
// 20

obj.habit; // 返回正确
// shopping

obj.friend; // 返回正确
// kevin

obj.__proto__.friend = "Kitty"; // 修改原型

bar.prototype.friend; // 返回错误，这里被修改了
// Kitty
```

解决方案是用一个空对象作为中介，把 `fBound.prototype` 赋值为空对象的实例（原型式继承）。

```js
var fNOP = function () {};			// 创建一个空对象
fNOP.prototype = this.prototype; 	// 空对象的原型指向绑定函数的原型
fBound.prototype = new fNOP();		// 空对象的实例赋值给 fBound.prototype
```

这边可以直接使用ES5的 `Object.create()`方法生成一个新对象

```js
fBound.prototype = Object.create(this.prototype);
```

不过 `bind` 和 `Object.create()`都是ES5方法，部分IE浏览器（IE < 9）并不支持，Polyfill中不能用 `Object.create()`实现 `bind`，不过原理是一样的。

第四版目前OK啦，代码如下：

```js
// 第四版，已通过测试用例
Function.prototype.bind2 = function (context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(
            this instanceof fNOP ? this : context, 
            args.concat(bindArgs)
        );
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

### 模拟实现第五步

到这里其实已经差不多了，但有一个问题是调用 `bind` 的不是函数，这时候需要抛出异常。

```js
if (typeof this !== "function") {
  throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
}
```

所以完整版模拟实现代码如下：

```js
// 第五版
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```