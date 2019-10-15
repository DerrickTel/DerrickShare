

# JavaScript事件循环

### 执行 & 运行

首先我们需要声明下，`JavaScript` 的执行和运行是两个不同概念的，**执行，一般依赖于环境**，比如 `node`、浏览器、`Ringo` 等， **JavaScript 在不同环境下的执行机制可能并不相同**。而今天我们要讨论的 `Event Loop` 就是 `JavaScript` 的一种执行方式。

### 关于 JavaScript

我们只需要牢记一句话: **JavaScript 是单线程语言** ，无论`HTML5` 里面 `Web-Worker` 还是 node 里面的`cluster`都是“纸老虎”，而且 `cluster` 还是进程管理相关。

既然 `JavaScript` 是单线程语言，那么就会存在一个问题，所有的代码都得一句一句的来执行。

### 概念梳理

![img](https://user-gold-cdn.xitu.io/2019/9/29/16d7ace2eda820a8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 宏任务(MacroTask)、微任务(MicroTask)

`JavaScript` 的任务不仅仅分为同步任务和异步任务，同时从另一个维度，也分为了宏任务(`MacroTask`)和微任务(`MicroTask`)。

我们仅仅需要记住几个 `MicroTask` 即可，排除法！别的都是 `MacroTask`。`MicroTask` 包括：`Process.nextTick`、`Promise.then catch finally`(注意我不是说 Promise)、`MutationObserver`。

![clipboard.png](https://segmentfault.com/img/bVboDPr?w=1468&h=1230)

1. 检查macrotask队列是否为空，非空则到2，为空则到3
2. 执行macrotask中的一个任务
3. 继续检查microtask队列是否为空，若有则到4，否则到5
4. 取出microtask中的任务执行，执行完成返回到步骤3
5. 执行视图更新



### 小试牛刀

```javascript
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```

第一轮事件循环流程分析如下：

- 整体script作为第一个宏任务进入主线程，遇到console.log，输出1。
- 遇到setTimeout，其回调函数被分发到宏任务Event Queue中。我们暂且记为setTimeout1。
- 遇到process.nextTick()，其回调函数被分发到微任务Event Queue中。我们记为process1。
- 遇到Promise，new Promise直接执行，输出7。then被分发到微任务Event Queue中。我们记为then1。
- 又遇到了setTimeout，其回调函数被分发到宏任务Event Queue中，我们记为setTimeout2。

*宏任务Event Queue* | **微任务Event Queue**

*setTimeout1* | **process1**

*setTimeout2* | **then1**

- 上表是第一轮事件循环宏任务结束时各Event Queue的情况，此时已经输出了1和7。
- 我们发现了process1和then1两个微任务。
- 执行process1,输出6。
- 执行then1，输出8。

好了，第一轮事件循环正式结束，这一轮的结果是输出1，7，6，8。那么第二轮时间循环从setTimeout1宏任务开始：

- 首先输出2。接下来遇到了process.nextTick()，同样将其分发到微任务Event Queue中，记为process2。new
  Promise立即执行输出4，then也分发到微任务Event Queue中，记为then2。

*宏任务Event Queue* | **微任务Event Queue**
*setTimeout2* | **process2**
*null* | **then2**

- 第二轮事件循环宏任务结束，我们发现有process2和then2两个微任务可以执行。
- 输出3。
- 输出5。
- 第二轮事件循环结束，第二轮输出2，4，3，5。
- 第三轮事件循环开始，此时只剩setTimeout2了，执行。
- 直接输出9。
- 将process.nextTick()分发到微任务Event Queue中。记为process3。
- 直接执行new Promise，输出11。
- 将then分发到微任务Event Queue中，记为then3。

*宏任务Event Queue* | **微任务Event Queue**

*null* | **process3**
*null* | **then3**

- 第三轮事件循环宏任务执行结束，执行两个微任务process3和then3。
- 输出10。
- 输出12。
- 第三轮事件循环结束，第三轮输出9，11，10，12。

整段代码，共进行了三次事件循环，完整的输出为1，7，6，8，2，4，3，5，9，11，10，12。(请注意，node环境下的事件监听依赖libuv与前端环境不完全相同，输出顺序可能会有误差)

