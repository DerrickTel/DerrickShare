# this的绑定(i)

我们知道this绑定规则一共有5种情况：

- 1、默认绑定（严格/非严格模式）
- 2、隐式绑定
- 3、显式绑定
- 4、new绑定
- 5、箭头函数绑定

## 默认绑定

- **独立函数调用**，可以把默认绑定看作是无法应用其他规则时的默认规则，this指向**全局对象**。
- **严格模式**下，不能将全局对象用于默认绑定，this会绑定到`undefined`。只有函数**运行**在非严格模式下，默认绑定才能绑定到全局对象。

## 隐式绑定

当函数引用有**上下文对象**时，隐式绑定规则会把函数中的this绑定到这个上下文对象。对象属性引用链中只有上一层或者说最后一层在调用中起作用。

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

> 隐式丢失

被隐式绑定的函数特定情况下会丢失绑定对象，应用默认绑定，把this绑定到全局对象或者undefined上。

```js
// 虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身。
// bar()是一个不带任何修饰的函数调用，应用默认绑定。
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // 函数别名

var a = "oops, global"; // a是全局对象的属性

bar(); // "oops, global"
```

参数传递就是一种隐式赋值，传入函数时也会被隐式赋值。回调函数丢失this绑定是非常常见的。

```js
function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    // fn其实引用的是foo
    
    fn(); // <-- 调用位置！
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // a是全局对象的属性

doFoo( obj.foo ); // "oops, global"

// ----------------------------------------

// JS环境中内置的setTimeout()函数实现和下面的伪代码类似：
function setTimeout(fn, delay) {
    // 等待delay毫秒
    fn(); // <-- 调用位置！
}
```

立即执行函数也没有指定上下文, 所以也是隐式丢失. 应用默认绑定

```javascript
var a = 0;
function foo(){
    (function test(){
        console.log(this.a);
    })()
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo();//0
```

## 显式绑定

通过`call(..)` 或者 `apply(..)`方法。第一个参数是一个对象，在调用函数时将这个对象绑定到this。因为直接指定this的绑定对象，称之为显示绑定。

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

foo.call( obj ); // 2  调用foo时强制把foo的this绑定到obj上
```

显示绑定无法解决丢失绑定问题。

解决方案：

- 1、硬绑定

创建函数bar()，并在它的内部手动调用foo.call(obj)，强制把foo的this绑定到了obj。这种方式让我想起了**借用构造函数继承**，没看过的可以点击查看 [JavaScript常用八种继承方案](https://juejin.im/post/5bcb2e295188255c55472db0)

```js
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

var bar = function() {
    foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// 硬绑定的bar不可能再修改它的this
bar.call( window ); // 2
```

典型应用场景是创建一个包裹函数，负责接收参数并返回值。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = function() {
    return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

创建一个可以重复使用的辅助函数。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

// 简单的辅助绑定函数
function bind(fn, obj) {
    return function() {
        return fn.apply( obj, arguments );
    }
}

var obj = {
    a: 2
};

var bar = bind( foo, obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

ES5内置了`Function.prototype.bind`，bind会返回一个硬绑定的新函数，用法如下。

```js
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

- 2、API调用的“上下文”

JS许多内置函数提供了一个可选参数，被称之为“上下文”（context），其作用和`bind(..)`一样，确保回调函数使用指定的this。这些函数实际上通过`call(..)`和`apply(..)`实现了显式绑定。

```js
function foo(el) {
	console.log( el, this.id );
}

var obj = {
    id: "awesome"
}

var myArray = [1, 2, 3]
// 调用foo(..)时把this绑定到obj
myArray.forEach( foo, obj );
// 1 awesome 2 awesome 3 awesome
```

在前面的学习中，有默认绑定、显式绑定、隐式绑定、new绑定，这4种规则当中，默认绑定的优先级一定是最低的，那么其它三个规则的优先级到底是怎么样的呢？

## 绑定优先级

### 显式绑定 VS 隐式绑定
例子：

```js
function foo() {
    console.log(this.a)
}


var obj1 = {
    a: 2,
    foo: foo
}

var obj2 = {
    a: 3,
    foo: foo
}

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call(obj2);    // 3
obj2.foo.call(obj1);    // 2
```

这个例子中，foo如果是单纯的隐式绑定到obj1或者是obj2的话，都是可以被绑定到指定的对象中的。但是如果隐式绑定和显式绑定都同时存在的情况下，从结果来看，是显式绑定的优先级比较高的，它覆盖了隐式绑定的行为。

 

### new绑定 VS 隐式绑定
例子：

```js
function foo(something) {
    this.a = something;
}

var obj1 = {
    foo: foo
}

var obj2 = {}

obj1.foo(2);
console.log(obj1.a);  // 2

obj1.foo.call(obj2, 3);
console.log(obj2.a);    // 3

var bar = new obj1.foo(4);  // this指向bar
console.log(obj1.a);    // 2
console.log(bar.a);     // 4
```


这个例子中，由于foo在前面隐式绑定了obj1，执行之后，obj1被创建了一个a属性，值为2。后面new一个obj1.foo(4),这里this被绑定到了bar这个新创建的对象上了。

所以得出的结论是：new绑定比隐式绑定的优先级高。

 

### 显示绑定 VS new绑定
例子：由于new和call、apply无法一起使用，那么这边就使用硬绑定：bind的方式来测试，因为硬绑定也是显示绑定的一种

```js
function foo(something) {
    this.a = something;
}

var obj1 = {};

var bar = foo.bind(obj1);   // bar的this绑定到了obj1对象上
bar(2);
console.log(obj1.a);    // 2

var baz = new bar(3);
console.log(obj1.a);    // 2
console.log(baz.a);     // 3
```

例子中，obj1在前面已经由foo的隐式绑定创建了一个属性a，值为2；然后bar的this被指向到了obj1对象上。后面，new bar(3)，最后输出的结果是obj1.a还是2，baz.a是3。说明new绑定比显示绑定的优先级还要高。

 

### 总结
根据上面的比较可以得出结论，优先级最高的是new绑定，接着是显示绑定，然后是隐式绑定，最后是默认绑定。
