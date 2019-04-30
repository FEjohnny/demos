### 基于node的单元测试
参考地址：https://github.com/tmallfe/tmallfe.github.io/issues/37

#### 普通测试，异步测试，延迟测试，代码覆盖率（istanbul）等
代码覆盖率测试，只需要用istanbul来启动macha就可以了（当使用istanbul运行Mocha时，istanbul命令自己的参数放在--之前，需要传递给Mocha的参数放在--之后）
```
./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --delay
```
statements：可执行语句执行情况
branches：分支执行情况，比如if就会产生两个分支，我们只运行了其中的一个
Functions：函数执行情况
Lines：行执行情况

### 关于覆盖率测试
覆盖率不再是100%了，这时候我想看看哪些代码被运行了，哪些没有，怎么办呢？
运行完成后，项目下会多出一个coverage文件夹，这里就是放代码覆盖率结果的地方，它的结构大致如下：
##### ├── coverage.json
##### ├── lcov-report
##### │   ├── base.css
##### │   ├── index.html
##### │   ├── prettify.css
##### │   ├── prettify.js
##### │   ├── sort-arrow-sprite.png
##### │   ├── sorter.js
##### │   └── test
##### │       ├── index.html
##### │       └── index.js.html
##### └── lcov.info

##### coverage.json和lcov.info：测试结果描述的json文件，这个文件可以被一些工具读取，生成可视化的代码覆盖率结果，这个文件后面接入持续集成时还会提到。
##### lcov-report：通过上面两个文件由工具处理后生成的覆盖率结果页面，打开可以非常直观的看到代码的覆盖率

#### 页面测试
