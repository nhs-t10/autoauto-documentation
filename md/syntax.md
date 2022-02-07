---
tags: Docs
title: Syntax
description: The syntax and structure of Autoauto
---

## An Autoauto Program

Each Autoauto program is a **representation of a "state machine"**. It has several "states", and at any point, it's in one of those states.

Only the code in the *current* state gets run. 

### A Quick Note on Audience

This is meant as a tutorial for people who *already* know a programming language. It should be pretty readable as long as you've taken Algebra 1, though some things might be confusing.

## Statepaths

Each state is grouped into a "statepath", also known as a "section". The following program has two; `first` and `second`. 

```aa
#first:
//do things

#second:
//do things 
```

Every time the runtime moves to a new statepath, it starts at the first state (state 0). When your program starts, the runtime picks the first statepath as the "initial" statepath.

### Unlabeled Statepath

If you want to, you may have an **unlabeled** statepath as the first.

```aa
//do things here

#second:
//do more things
```

## States

Within its statepath, each state does *not* have a name. It's only identified by its number.

States are ended with a semicolon (`;`).

```aa
#first:
log("I'm state 0");
log("I'm state 1");
#second
log("I'm state 0 in #second");
log("I'm state 1 in #second");
```

It's *very* important to note that **the runtime will not "move off" of a state until it is instructed to**. Unlike normal programing languages, where something like `log(1); log(2)` will log `1 2`, *Autoauto will log `1 1 1 1 1`... forever*. This is a purposeful design choice! Robots need to run the same same code to update.

Look

## Statements

Each state can have multiple **statement**s. They are separated by a comma (`,`):

```aa
#first:
log("I'm state 0"), callSomeFunction(); //this state has 2 statements
log("I'm state 1"), if(shouldGoNextBeforeTimeIsUp()) next, callSomeOtherFunction(); //this state has 3 statements
#second
log("I'm state 0 in #second"); //this state just has 1 statement
```

### `if` statement

Autoauto's `if` statement lets you run different code depending on a value. It has several forms, so pick whichever one you want.

The first one is the **basic form**. This is the quickest and easiest to type.

Syntax
: `if(*value test*) *statement if_true*`<br>
Example
: `if(true) log("This should work!")`

There's also the **block form**

- `if(*value test*) { *statement if_true*, *statement if_true* }`

and the **else form**. Note that using `else` requires brackets!

- `if(*value test*) { *statement if_true* } else { *statement if_false* }`

### `let` statement

The `let` statement is the *only* way to modify variables. Although other languages let you do things like `var = 3`, this won't work in Autoauto! 

You can also set properties with the `let` statement:

```aa
let tooptoop = 2, //tooptoop is 2
let tooptoop = [2], //tooptoop is an array-table with 1 element: 2
let tooptoop[0] = 4, //tooptoop is an array-table with 1 element: 4
let tooptoop[1] = "sam", //tooptoop is an array-table with 2 elements: 4 and "sam"
let tooptoop.o = false, //tooptoop has 3 elements: 4, "sam", and its "o" property is false
let tooptoop = "F" //tooptoop is "F"
```

### `goto` statement

The `goto` statement lets you move between sections. There is **no other way** to switch the current statepath.

When you `goto` a new statepath, Autoauto starts at the first state.

```aa
#firstPart
    goto pspsps; //goes to fifi() in #pspsps

#pspsps:
    fifi();
    lol();
    thirdOne();
```

### `skip` statement

`skip *n*` moves `*n*` states forwards. `skip 0` will do nothing, and `skip 1` is the same as `next`: moving to the next state. 

Skipping will "wrap around"; skipping past the end of the section goes to the other end. For example,

```aa
#wrap1:
    skip -1; //will skip to lastState
    something();
    somethingElse();
    lastState(); 

#wrap2:
    skip 4; //will skip to `something()`, because 4 % 3 is 1
    something(); 
    thereareATotalOfThreeStates();
```

?> If you don't understand skip-wrapping, that's okay. It's not commonly used, and you *shouldn't* really use it.


### `next` statement

`next` lets you move to the *next* state! In usual code formatting, this means moving to the next line.

This code logs `3` once

```aa
log(3), next;
pass
```

However, this code logs `3` *forever*.

```aa
log(3)
```

`next` is exactly the same as `skip 1`. For some of the edge cases, see the [skip statement's section](#h-skip-statement).

### `function` statement

See the [section on `function` values](#h-functions). 

Example (taken from the `function` value section):

```aa
function wubbo(arg1 = 23) {
    log("Hah, I'm Wubbo!"),
    log("And i'm a function!! Here's the first argument: " + arg1)
},
//this does the exact same thing
let wubbo = func(arg1 = 23) {
    log("Hah, I'm Wubbo!"),
    log("And i'm a function!! Here's the first argument: " + arg1)
},
wubbo(), //will log "Hah! I'm Wubbo!", then "And i'm a function!! Here's the first argument: 23"
wubbo("a string") //will log "Hah! I'm Wubbo!", then "And i'm a function!! Here's the first argument: a string"
```


### `after` statement

`after` is the most important part of writing Autoauto for a robot. It lets you wait a certain *time*, *distance*, or *rotation* before running code.

Syntax:

- `after *unit-value* *statement*`
- `after *unit-value* { *statement*, *statement 2* }`

For example, this code will log `1` for 2 seconds, and then log `2`.

```aa
log(1), after 2s next
log(2)
```

### `pass` statement

The `pass` statement does nothing. That's what it's for. 

?> Why is it here? Python has a `pass` statement that does nothing, so Autoauto does too.

This code does nothing.

```aa
if(true) pass
```

## Values

There are 8 types of value in Autoauto. All of them are **property-bearing**, meaning that you can set properties on them!

```aa
let number = 3,
let number.isThree = true,
log(number), //prints "3" to the log
log(number.isThree) //prints "true" to the log
```

However, please note that syntax-wise, the same primitive will refer to *different* memory locations: `3.isThree = true` will not make *all* `3`s have an `isThree` property.

The properties you set called "own properties". They are *not* preserved when you do math operations:

```aa
let numA = 3,
let numA.someProp = "foob",
let numB = numA * 2,
log(numB.someProp) //prints "undefined"
```

The `==` operator only compares the "basic" value, *except* for [tabular values](#h-tabulars-).

### Booleans

`true` or `false`.

### Numerics

Autoauto doesn't split numbers up by integer/float/double; there's only one `Numeric` value-type. 

&> Numerics have a special property where you can call them as a function, and they'll return themselves: for example, ` 3() == 3`. This *only* exists so that `string.length` (JS-style) will equal `string.length()` (Java-style).

`3`, `2.0`, `2.423`, `0xff` (hexidecimal), and `3e9` are all numerics.

### UnitValues

UnitValues are made of a number and a *unit*. Autoauto supports 3 types of units; rotation, distance, and time, and it can freely convert between them. Most common units (and many uncommon ones) are supported.

UnitValues are, *technically*, numbers, so you can add/subtract/etc them:

```aa
2in + 10in == 1ft
```

`3s`, `3000ms`, `2in`, `100cm`, `1m`, `20ft`, `10jiffies`, and `1fathom` are all unit-values.

### Strings

Strings are text data. They can contain any text, including Unicode or emojis. 

Unlike in Java, a string is *not* an object-- they're a primitive value of their own.

`"Forp"`, `"SwooSwoo"`, and `"James? Why are you in that teapot?!"` are all strings.

### undefined

`undefined` is a special value. It's used when calculations have some "indeterminate" output; you can also refer to it directly with `undefined`.

Any math operations using `undefined` will return undefined. Calling `undefined` as a function will return `undefined`. Trying to access any properties on `undefined` will return `undefined`.

```aa
log(Math.thisIsNotAMathProperty), //will print "undefined" to the log
log(undefined.someProperty), //will print "undefined" to the log
log(undefined()), //will print "undefined" to the log
log(undefined * 2) //will print "undefined" to the log
```

`undefined`, `typeof(someVariableThatDoesntExist)`, `undefined * 2`, and `0 / 0` are all `undefined`.

### Relations

A Relation is a special data-type that contains 2 other values: a `title` and a `value`. You'll usually use them to make objects, but they're also values of their own!

This code will store `foul = [3]` in the variable `foo`.

```aa
let foo = (foul = [3])
```

In the relation `feep = 3`, `"feep"` is the title, and the value is `3`. `feep = 3` and `"feep" = 3` are the same. When comparing with `==`, the comparison *only* operates on the value: `(feep = 3) == (foop = 3)` will be `true`.

To access the title and value separately, you can use `.title` and `.value`:

```aa
let exampleRelation = (bok = "chicken noise"),
let title = exampleRelation.title,
let value = exampleRelation.value
```

`foul = [3]`, `"foofoo": 2`, `2 = 39032` are all relations.

### Tabulars 

Tabular values (a.k.a. tables) are Autoauto's "objects" *and* Autoauto's "arrays". They are "loosely typed", meaning that you don't need to define their properties in advance.

In order to make an array-esque table, you can use this syntax:

```aa
let arraylikeExample = ["I'm a string at index 0!", 128, youCanCallFunctionsToo(), orAddVariablesIn, 32, 1in, false]
let arrayLikeExample[7] = "New element!"
```

As you can see, all types can be mixed & matched inside a table. Accessing the values is array-like too: `arraylikeExample[1] == 128`.

An object-like table looks like this:

```aa
let objectLikeExample = [property1 = "This is the first property.", property2 = 3, anotherOne = 2323], 
let objectLikeExample.newProperty = "and i oop sksksksk"
```

This is *exactly* the same as an array-like, but with `relation`s as elements. You can also mix & match array-like and object-like syntax. Accessing object-like properties works like this: `objectLikeExample.property2 == 3`.

### Functions

Autoauto's functions are values, just like any other! You can store a function in a normal variable: `let ln = Math.log`. Functions can be called like this: `*someFunction*()`, and arguments go in-between the parentheses. You can also *name* the arguments; for example, `driveOmni` has 3 arguments: `h`, `v`, and `r`. You can call it like `driveOmni(0,1,0)` *or* `driveOmni(v = 1)`!

To make a function of your own, use the **function definition statement** or a **function literal**:

```aa
function wubbo(arg1 = 23) {
    log("Hah, I'm Wubbo!"),
    log("And i'm a function!! Here's the first argument: " + arg1)
},
//this does the exact same thing
let wubbo = func(arg1 = 23) {
    log("Hah, I'm Wubbo!"),
    log("And i'm a function!! Here's the first argument: " + arg1)
},
wubbo(), //will log "Hah! I'm Wubbo!", then "And i'm a function!! Here's the first argument: 23"
wubbo("a string") //will log "Hah! I'm Wubbo!", then "And i'm a function!! Here's the first argument: a string"
```

## Mathematical Operations and Such

Most mathematical operations are exactly like Java. 

|Operator|Name|Example|Java Usage|Note|
|-|-|-|
|`>`|Greater-than|`3>2 == true`|`3>2 == true`||
|`<`|Less-than|`3<2 == false`|`3<2 == false`||
|`<=`|Less-than-equals<br>Lequals|`3<=2 == false`|`3<=2 == false`||
|`>=`|Greater-than-equals<br>Grequals|`2>=2 == true`|`2>=2 == true`||
|`==`|Equals|`2==2 == true`|`2==2 == true`|Unlike in Java, `==` also works on objects.|
|`!=`|Not Equals<br>Nequals|`2!=2 == false`|`2!=2 == false`||
|`+`|Add Together|`2+2 == 4`<br>`2+"e"=="2e"`<br>`[a=2]+[b=6]==[a=2,b=6]`|`2+2 == 4`<br>`2+"e"=="2e"`|`+` can add together objects.|
|`-`|Subtraction|`2-2==0`|`2-2==0`||
|`/`|Division|`2/3==0.666`|`2.0/3.0==0.666`||
|`\*`|Multiplication|`2\*3==6`|`2\*3==6`||
|`\*\*`|Exponent|`3\*\*2==9`|`Math.pow(3,2)==9`|Same as `^`; for people familiar with ES7/Python|
|`\^`|Exponent|`3^2==9`|`Math.pow(3,2)==9`|If you want Java's `^`, see [`Math.xor`](/built-ins#Math-xor).|
|`%`|Modulo|`3%2==1`|`3%2==1`|
