/**
 * Created by liaolunhui on 2016/11/13.
 */
function M(arr,exports,realTimeModelName,middleWare){
    var instance=new baseM(arr,middleWare);
    if(exports){
        $.extend(exports,instance);
    }

    if(realTimeModelName){
        realTimeModel.set(realTimeModelName,instance)
    }
    return instance;
}


function baseM(arr,socketCurdEvent,emitSocketCurd,middleWare){
    this.socketCurdEvent=socketCurdEvent;
    this.emitSocketCurd=emitSocketCurd;
    this.condition={};
    this.all=arr;
    this.current=[];
    this.grids=[];
    this.socketCurdScope=[];
    this.filter();
    this.currentPage=1;
    this.middleWare=middleWare;
    this.applyMiddleWare();

}

baseM.prototype.applyMiddleWare=function(arr){
    arr=arr||this.all;
    if(this.middleWare){
        arr.forEach(this.middleWare);
    }
}


baseM.prototype.enablePage=function(){
    this._enablePage=true;
    return this.filter(this.condition);
}

baseM.prototype.disablePage=function(){
    this._enablePage=false;
    return this.filter(this.condition);
}

baseM.prototype.pageApply=function(){
    if(this._enablePage&&this.filterResult){

        if(!this.currentLimit)this.currentLimit=10;
        if(!this.quantityPerPage)this.quantityPerPage=10;

        this.pageTotal=Math.ceil(this.filterResult.length/this.quantityPerPage);
        this.pageSwitch(this.currentPage);
    }
    return this;
}

baseM.prototype.nextPage=function(){
    this.pageSwitch(++this.currentPage);
}

baseM.prototype.prevPage=function(){
    this.pageSwitch(--this.currentPage);
}

baseM.prototype.pageSwitch=function(page){
    var start=(page-1)*this.currentLimit;
    this.limit(start,this.quantityPerPage);
}

baseM.prototype.limit=function(start,quantity){
    if(!quantity){
        quantity=start;
        start=start||0;
    }
    var end=start+quantity;

    this.current.length=0;

    if(this.filterResult){

        var result=this.filterResult.slice(start,end);

        Array.prototype.push.apply(this.current,result);

    }
    return this.filter(this.condition);
}

baseM.prototype.applyAllScope=function(){
    //Vue trigger update view
    var ob=this.current.__ob__;
    if(ob){
       ob.dep&&ob.dep.notify&&ob.dep.notify()
    }

    var $scopes=this.socketCurdScope;
    for(var i=0;i<$scopes.length;i++){
        var $scope=$scopes[i];
        $scope.$evalAsync()
    }
    return this;
}

baseM.prototype.addGrid=function(grid){
    this.grids.push(grid);
    return this;
}

baseM.prototype.updateAllGrid=function(grid){

    for(var i=0;i<this.grids.length;i++){
        this.grids[i].jqxGrid('updatebounddata');
    }

    return this;
}

baseM.prototype.attach=function(options){
    var key=options.key||'id';
    var data=options.data;
    var that=this;
    data.forEach(function(item){
        var condition={};
        condition[key]=item[options.by];
        var target=that.findOne(condition);
        if(!target.attach)target.attach=[item]
        else target.attach.push(item);
    })
    return this.filter(this.condition);
}

baseM.prototype.add=function(data,method){
    if(!method||typeof method!='string')method='push';
    var arr;
    if(typeof data.length!="number"){
        arr=[data];
    }
    else arr=data;
    this.applyMiddleWare(arr);
    for(var i=0;i<arr.length;i++){
        var item=arr[i];
        this.all[method](item);
    }
    this.filter(this.condition);
    this.applySocketEvent('add',arguments);
    this.pageApply();
    return this;
}



baseM.prototype.unshift=function(data){
    this.add(data,'unshift')
}

baseM.prototype.removeById=function(id){
    this.remove({id:id});
    return this;
}

baseM.prototype.applySocketEvent=function(method,args){
    if(this.emitSocketCurd){

        //如果是来自socket触发，就不再触发，避免死循环
        if(args&&args[1]&&args[1]&&!args[1].fromSocket)return this;

        var eventName=this.socketCurdEvent[method];
        if(eventName){
            var argsArr=[];
            Array.prototype.push.apply(argsArr,args)
            argsArr.splice(0,0,eventName);
            socket.emit.apply(socket,argsArr);
        }
    }

    return this;
}

baseM.prototype.updateById=function(obj){
    this.applySocketEvent('updateById',arguments);
    this.update(obj,{id:obj.id});
    return this;
}

baseM.prototype.updateByIdOrAddOne=function(obj){
    var hasRecord=obj.id&&this.findOne({id:obj.id});
    if(hasRecord){
        this.updateById(obj);
    }else this.add(obj);
}

baseM.prototype.findOneByObj_id=function(obj){
    return this.findOne({_id:obj._id});
}

baseM.prototype.addSocketCurdScope=function($scope){
    this.socketCurdScope.push($scope);
    return this;
}

matchObj=baseM.prototype.match=function(row,condition,orCondition){

    for(var key in condition){
        var value=condition[key];
        if(typeof value=='function')return value(row[key]);
        else if(row[key]==value){
            if(orCondition)return true;
        }else{
            if(!orCondition)return false;
        }

    }
    if(!orCondition)return true;
    else false;
}



baseM.prototype.remove=function(condition,orCondition){

    for(var i=0;i<this.all.length;i++){
        var row=this.all[i];
        var isMatch=row&&this.match(row,condition,orCondition);

        if(isMatch){
            this.all.splice(i,1);
            i--;//删除后，数组位置向左移一位
        }

    }
    return this.filter(this.condition);
}

baseM.prototype.reset=function(arr){
    this.all.length=0;
    Array.prototype.push.apply(this.all,arr);
    this.applyMiddleWare();
    this.filter(this.condition);
    return this;
}


baseM.prototype.update=function(updateTo,condition,orCondition){

    for(var i=0;i<this.all.length;i++){
        var row=this.all[i];
        var isMatch=this.match(row,condition,orCondition);

        if(isMatch){
            for(var key in updateTo){
                var value=updateTo[key];
                row[key]=value;
            }
        }

    }

    this.updateAllGrid();
    return this.filter(this.condition);

}


baseM.prototype.filter=function(condition,orCondition,onlyCurrent){

    var dataToFilter=onlyCurrent?this.current:this.all;
    var filterResult=[];

    if(!condition)filterResult=dataToFilter;
    else{


        for(var i=0;i<dataToFilter.length;i++){

            var row=dataToFilter[i];
            if(this.match(row,condition,orCondition))filterResult.push(row);
        }
    }

    this.condition=condition;
    this.current.length=0;
    Array.prototype.push.apply(this.current,filterResult);

    this.filterResult=filterResult;
    this.applyAllScope();
    return this;
}


baseM.prototype.find=function(condition,orCondition,onlyCurrent,onlyOne){

    var dataToFilter=onlyCurrent?this.current:this.all;
    var filterResult=[];

    if(!condition)filterResult=dataToFilter;
    else{


        for(var i=0;i<dataToFilter.length;i++){

            if(onlyOne&&filterResult.length)return filterResult;

            var row=dataToFilter[i];
            if(row&&this.match(row,condition,orCondition))filterResult.push(row);
        }
    }

    return filterResult;
}


baseM.prototype.findOne=function(condition,orCondition,onlyCurrent){
    return this.find(condition,orCondition,onlyCurrent,1)[0];
}

Array.prototype.attachQuantity=function(options){
    for(var index in this){
        var item=this[index];
        item.quantity=item.quantity||new quantity(options);
    }
    return this;
}
