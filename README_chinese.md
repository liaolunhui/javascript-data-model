# javascript-data-model
一个MVVM（Angular,Vue等）的数据模型，让你可以像服务器端ORM一样增删改查数据，筛选数据，分页数据等。
## Demo

### Angular 样板实例

[部署在国内服务器](http://liaolunhui.hhappkf.com/javascript-data-model/demo/angular.html)

[部署在 github.io](https://liaolunhui.github.io/javascript-data-model/demo/angular.html)

### Vue 样板实例

[部署在国内服务器](http://liaolunhui.hhappkf.com/javascript-data-model/demo/vue.html)

[部署在 github.io](https://liaolunhui.github.io/javascript-data-model/demo/vue.html)

(https://liaolunhui.github.io/javascript-data-model/demo/vue.html)

## 最简使用
引入 `javascript-data-model.js` 到你的项目;
``` html
<script src="../javascript-data-model.js"></script>
```

使用数据（一个数组包含多个对象）创建一个数据模型实例。
``` js
var data=[{id:1,time:1479049721429,type:"init"},{id:2,time:1479049722163,type:"init"},{id:3,time:1479049722594,type:"init"}];
var dataModel=M(data);
```
绑定数据模型的`current`属性到你的MVVM数据中。

``` js
$scope.list=dataModel.current;
```

好了，现在你可以像服务器端ORM一样对数据进行操作了，你操作数据，会自动更新到DOM；

## 属性
### all

模型中所有的数据,包括过滤掉的数据.
### current
当前数据，不包括过滤掉的数据.
current data ,doesn't contain filter out data.

## 方法
### add(object)
添加一条对象数据到数据模型中
``` js
dataModel.add({id:4,time:1479050063675,type:'new'})
```

### delete(condition,orCondition)
从数据模型中删除数据
`condition` 一个`对象`类型的条件，指定想要删除的数据。如果不指定条件，将删除全部数据。
``` js
dataModel.delete({type:'init'})
//删除所有`type`熟悉为`init`的数据
```
`orCondition` 一个`Bool`类型的参数，制定是否逻辑`或者`，默认逻辑`并且`
``` js
dataModel.delete({id:2,type:'new'},true)
//删除所有`type`属性等于`init`或者`id`等于`2`的数据
```

### update(updateTo,condition,orCondition)
更新满足`condition`条件的数据
`updateTo` 指定你想更新数据的哪些属性为什么值,可以更新多个属性;
``` js
dataModel.update({type:'wiki'})
//update all data's `type` property to `wiki`
//更新所有数据中的`type`熟悉为`wiki`值
```

`condition` 与 `delete` 方法的`condition`类似
`orCondition` 与 `delete` 方法的`orCondition`类似

### find/select(condition,orCondition,onlyCurrent,onlyOne)
查找满足条件的数据，返回一个数组。
`condition` 与 `delete` 方法的`condition`类似
`orCondition` 与 `delete` 方法的`orCondition`类似
`onlyCurrent` `Bool` 值指定是否从`current`中查找（从结果中查找），默认`false`（从`all`中查找）
`onlyOne` `Bool` 值指定是否之查出第一条;
``` js
var matchData=dataModel.select({type:'init'})
//返回所有`type`属性为`init`的数据（数组类型）
```

### findOne/selectOne(condition,orCondition,onlyCurrent)
类似`select`方法。不同的是，只返回第一条数据（对象类型）

### filter(condition,orCondition,onlyCurrent)

find data that match `condition` from `all` property,and put it to `current` property
过滤数据，从`all`中查找符合`condition`条件的数据，并且放到`current`属性中，实现过滤。

### reset(arr)
重置`all`里面的数据，并且重新生成`current`（根据之前的filter条件，如果有）

### enablePage(quantityPerPage)
开启分页
`quantityPerPage` 每页显示多少条数据，默认10条。;

### nextPage
下一页
### prevPage
上一页

### pageSwitch(page)
跳转到指定页面
