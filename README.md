## [中文文档](README_chinese.md)   QQ交流群：210661226

# javascript-data-model
An easier way to update DOM (Base on MVVM , Angular/Vue).You can add,delete,update,find,filter,paging data.It will render to Dom without refreshing. Hope saving your time.

## Demo

### Angular demo

[Host on China Server](http://liaolunhui.hhappkf.com/javascript-data-model/demo/angular.html)

[Host on github.io](https://liaolunhui.github.io/javascript-data-model/demo/angular.html)

### Vue demo

[Host on China Server](http://liaolunhui.hhappkf.com/javascript-data-model/demo/vue.html)

[Host on github.io](https://liaolunhui.github.io/javascript-data-model/demo/vue.html)

(https://liaolunhui.github.io/javascript-data-model/demo/vue.html)

## Getting Start
Import `javascript-data-model.js` in your project;
``` html
<script src="../javascript-data-model.js"></script>
```

use `M(array)` to generate your data model instance with an Array that contain objects;
``` js
var data=[{id:1,time:1479049721429,type:"init"},{id:2,time:1479049722163,type:"init"},{id:3,time:1479049722594,type:"init"}];
var dataModel=M(data);
```

Bind data model's `current` property to your mvvm data;

``` js
$scope.list=dataModel.current;
```

Done , Now you can handle data like server side,it will also update the dom;
## Property
### all
 all data of the data model,contain filter out data.
### current
current data ,doesn't contain filter out data.

## Methods
### add(object)
add an object to the data model
``` js
dataModel.add({id:4,time:1479050063675,type:'new'})
```

### delete(condition,orCondition)
delete objects from data model
- **condition** should be an object that specify what do you want to delete. if condition are not specified,it will delete all data.
``` js
dataModel.delete({type:'init'})
//it will delete all data that `type` property is `init`
```
- **orCondition** shoud be an Bool that specify logic `AND` or `OR`,default `AND`
``` js
dataModel.delete({id:2,type:'new'},true)
//it will delete all data that `type` property is `init` or `id` is `2`
```

### update(updateTo,condition,orCondition)
update object that match `condition`
- **updateTo** specify what property do you want to update to,support multi property;
``` js
dataModel.update({type:'wiki'})
//update all data's `type` property to `wiki`
```

- **condition** similar to `delete` method


- **orCondition** similar to `delete` method

### find/select(condition,orCondition,onlyCurrent,onlyOne)
find data match `condition`,return an array;
- **condition** similar to `delete` method;
- **orCondition** similar to `delete` method
- **onlyCurrent** Bool value specify if find from `current` data only. defalut `false`
- **onlyOne** Bool value specify if find One only;
``` js
var matchData=dataModel.select({type:'init'})
//return data that's `type` property is `init`
```

### findOne/selectOne(condition,orCondition,onlyCurrent)
similar to select,only return first match data ( `object`)

### filter(condition,orCondition,onlyCurrent)
find data that match `condition` from `all` property,and put it to `current` property

### reset(arr)
reset `all` property and filter arr to `current`

### enablePage(quantityPerPage)
enable paging
`quantityPerPage` how many data per page,default `10`;

### nextPage
go next page
### prevPage
go previous page

### pageSwitch(page)
go page specify by `page` argument
