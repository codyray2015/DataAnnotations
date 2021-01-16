# data-annotations

Some common object property limiters and customizable limiter injection are provided

> [中文文档](https://github.com/wmm-xs/DataAnnotations/blob/master/README-zh-cn.md) 
> 
> [English](https://github.com/wmm-xs/DataAnnotations/blob/master/README.md)

Built in three common limiters
> 1. `Required`   Restrictions applied when required fields
> 2. `Range` It can put your numbers in a certain range, like 2-10
> 3. `RegularExpression` It can match regular in string type properties

## Installation

```
npm install data-annotations --save
```

## Usage

### Use built-in limiter

The built-in limiter is particularly convenient to use, you only need to simply add a modifier to the place you need to limit to call it up, like this

``` ts
    export class Test{
        @Required               <-----
        public TestStr:string;
    }
```

**Warning!** If you use a modified limiter (like the one above), you need to call `DataAnnotations.LimiterInit(obj)` to initialize after the object is constructed to make the limiter effective

``` ts
    export class Test{
        constructor(){
            DataAnnotations.LimiterInit(this);    <-----
        }
        @Required               
        public TestStr:string;
    }
```

When we need to check the limiter, we simply call a `DataAnnotations.IsValid(obj)`, like this

``` ts
    function foo(){
        const obj = new Test();
        const result = DataAnnotations.IsValid(obj);
        console.log(result.Success)
    }
```

------

### Advanced skills

You can use the built-in `DataAnnotations.DefineLimiter()` to dynamically set a custom limiter to the properties of any object, even anonymous objects. if there is an error, it returns **error content**, by return **Null**

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

The built-in limiter provides a `Factory` for dynamic injection. You can use this method to dynamically inject the built-in interceptor or modify the error message

------

#### Advanced skills Plus

You can set your ErrorMsg to bind properties to some forms to quickly get feedback information, for example

``` ts
    export class Test{
        @Required("you need input Phone or Email")  <-----
        public TestStr:string;
    }

```

The error message can also be replaced when the outer layer is instantiated

``` ts
    function foo(){
        const obj = new Test();
        RequiredFactory("Email will do")(obj,"TestStr");  <------
    }

```
------
#### Advanced skills Plus Plus

We sometimes even want to let the error prompt appear by itself instead of manually trigger

``` ts
    function foo(){
        const obj = new Test();
        RequiredFactory("Email will do",(e)=>{
            //....Do something

        })(obj,"TestStr");
    }
```
-------
#### Advanced skills Plus Plus Plus

You can use the built-in `DataAnnotations.SetChangeListener()` to set a change listener to the properties of any object. Of course, anonymous is also possible, but the premise is that the target property needs at least one limiter, no matter how you set it

``` ts
    const obj = { test:'123' }

    function foo(){
        DataAnnotations.SetChangeListener(obj,'test',(s)=>{
                console.log(s);
        })
    }
```
