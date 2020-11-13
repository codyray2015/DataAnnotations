# data-annotations

提供了一些常用的对象属性限制器，以及可自定义化的限制器注入

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

```
    export class Test{
        @Required               <-----
        public TestStr:string;
    }
```

当我们需要检查限制器时只需简单的调用一个 `DataAnnotations.IsValid(obj)` 即可，like this

```
    function foo(){
        const obj = new Test();
        const result = DataAnnotations.IsValid(obj);
        console.log(result.Success)
    }
```

#### 搞基技巧

你可以使用内置的 `DataAnnotations.DefineLimiter()` 向任何对象的属性设置限制器，哪怕是匿名对象，看这

```
    const obj = { test:'123' }

    function foo(){
        DataAnnotations.DefineLimiter(obj, "test", (arg) => {
            if (arg == "123") {
                return "you can't input '123'";
            }
            return null;
        })
    }
```

#### 搞基技巧 Plus

你可以使用内置的 `DataAnnotations.SetChangeListener()` 向任何对象的属性设置变更监听器，当然，匿名也是可行的, 但前提是目标属性至少需要有一个限制器，无论用何种方式去设置他

```
    const obj = { test:'123' }

    function foo(){
        DataAnnotations.SetChangeListener(obj,'test',(s)=>{
                console.log(s);
        })
    }
```
