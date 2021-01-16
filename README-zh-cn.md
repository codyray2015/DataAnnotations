# data-annotations

提供了一些常用的对象属性限制器，以及可自定义化的限制器注入

> [中文文档](https://github.com/wmm-xs/DataAnnotations/blob/master/README-zh-cn.md) 
> 
> [English](https://github.com/wmm-xs/DataAnnotations/blob/master/README.md)

内置三种常见限制器
> 1. Required   应用于需要必填字段时的限制
> 2. Range 它可以让你的数字处于某个区间 例如 2-10
> 3. RegularExpression 它能在String类型的属性中匹配正则

## Installation

```
npm install data-annotations --save
```

## Usage

### 使用内置限制器

内置限制器的使用特别方便，您只需要在您需要限制的地方简单的加上一个修饰器就能调出，就像这样

``` ts
    export class Test{
        @Required               <-----
        public TestStr:string;
    }
```

**关键** 如果您使用了修饰型的限制器(就像上面这个)，你需要在对象构建后调用 `DataAnnotations.LimiterInit(obj)` 进行初始化，方能使限制器生效

``` ts
    export class Test{
        constructor(){
            DataAnnotations.LimiterInit(this);    <-----
        }
        @Required               
        public TestStr:string;
    }
```

当我们需要检查限制器时只需简单的调用一个 `DataAnnotations.IsValid(obj)` 即可，like this

``` ts
    function foo(){
        const obj = new Test();
        const result = DataAnnotations.IsValid(obj);
        console.log(result.Success)
    }
```

------

#### 搞基技巧

你可以使用内置的 `DataAnnotations.DefineLimiter()` 向任何对象的属性动态的设置自定义的限制器，哪怕是匿名对象，看这，存在错误时返回**错误内容**，通过返回**Null**

``` ts
    const obj = { test:'123' }

    function foo(){
        DataAnnotations.DefineLimiter("MyLimiter",obj, "test", (arg) => {
            if (arg == "123") {
                return "you can't input '123'";
            }
            return null;
        })
    }
```

内置限制器为动态注入提供了一个`Factory`您可以使用此方法来进行动态的注入内置拦截器或是修改错误提示

------

#### 搞基技巧 Plus

你可以设置你的ErrorMsg使你在一些表单绑定属性使快速获取反馈信息，例如

``` ts
    export class Test{
        @Required("you need input Phone or Email")  <-----
        public TestStr:string;
    }

```

同样可以在外层实例化时替换错误提示

``` ts
    function foo(){
        const obj = new Test();
        RequiredFactory("Email will do")(obj,"TestStr");  <------
    }

```
------
#### 搞基技巧 Plus Plus

我们有时甚至想让错误提示自己出现而不去手动触发

``` ts
    function foo(){
        const obj = new Test();
        RequiredFactory("Email will do",(e)=>{
            //....Do something

        })(obj,"TestStr");
    }
```
-------
#### 搞基技巧 Plus Plus Plus

你可以使用内置的 `DataAnnotations.SetChangeListener()` 向任何对象的属性设置变更监听器，当然，匿名也是可行的, 但前提是目标属性至少需要有一个限制器，无论用何种方式去设置他

``` ts
    const obj = { test:'123' }

    function foo(){
        DataAnnotations.SetChangeListener(obj,'test',(s)=>{
                console.log(s);
        })
    }
```
