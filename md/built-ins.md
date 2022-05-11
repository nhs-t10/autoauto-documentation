---
tags: Docs
title: Built-Ins
description: Built-in variables available in Autoauto
---

## What is a built-in?

A built-in exists in all Autoauto environments, and has certain behaviours. Examples are `Math`, `driveOmni`, and the **prototype functions**. Built-ins may not be overriden.

### Prototype Functions

Prototypes are special built-ins: they're stored in **proto-properties**, which are like properties, but on *every* value. For example, the `toString()` prototype function converts something to a string:

```aa
log(3.toString()) //logs "3"
```

A prototype function is indistinguishable from its proto-property. Doing a "store-and-call-later" operation *may fail*:

```aa
let ts = 3.toString,
log(ts()) //depending on the environment, this may do whatever it wants!
```

## Top-Level Functions

There are 6 top-level built-ins; these all serve "linguistic" purposes.

### log() function

`log()` will add its arguments to the console, log, telemetry, or whatever the equivalent is. If the environment doesn't have a log, `log` won't do anything.

### len() function

The `len()` function's behavior depends on its argument's type.

**If you call `len()` with a string:** It will return the number of characters; the same as `*string*.length`.

**If you call `len()` with a table:** It will return the number of properties that the table has.

### delegate() function

Calling `delegate(*filename*)` will "delegate" to that file. For every time it is evaluated, one loop will be called on the other file. The other file does *not* have access to the "delegater"'s variables.

<strong>Calling multiple `delegate()`s in the same state is NOT recommended, for performance reasons.</strong>

Make sure that the other file is <em>relative</em> to this one. For example, see the following file structure:

<pre>
&#128193;
&boxvr;&boxh;&#32;&#128193;&#32;&#102;&#111;&#108;&#100;&#101;&#114;&#49;
&boxv;&#32;&#32;&boxur;&#32;&#104;&#101;&#108;&#112;&#102;&#117;&#108;&#45;&#109;&#111;&#100;&#117;&#108;&#101;&period;&#97;&#117;&#116;&#111;&#97;&#117;&#116;&#111;
&boxvr;&boxh;&#32;&#128193;&#32;&#102;&#111;&#108;&#100;&#101;&#114;&#50;
&boxv;&#32;&#32;&boxur;&#32;&#98;&period;&#97;&#117;&#116;&#111;&#97;&#117;&#116;&#111;
&boxur;&#32;&#97;&period;&#97;&#117;&#116;&#111;&#97;&#117;&#116;&#111;
</pre>

If `delegate("helpful-module.autoauto")` is called in `a.autoauto`, it will cause an error. You need to use `delegate("folder1/helpful-module.autoauto")`.

Meanwhile, `b.autoauto` can NOT have access to `helpful-module.autoauto`. Be careful with your directory structures! There's no way to go "up" the folder structure.

`delegate` will return the *most recent* `provide`d value.

### provide() function

`provide()` is `delegate()`'s pair: the export to its import. `provide()`ing a value gives the "importer" access to a value *from* the "importee".

For example, this code will log `"Fins!"`:

```aa
//a.autoauto
log(delegate("b.autoauto"))
```

```aa
//b.autoauto
provide("Fins!")
```

Functions can also be provided! They will still have access to the "importer"'s variables:

```aa
//a.autoauto
let importedFunction = delegate("b.autoauto"),
log(importedFunction())
```

```aa
//b.autoauto
let myVar = 232,
provide(func() { return(myVar) })
```

### return() function

The `return()` function serves the same purpose as the `return` statement in other languages. The main difference in Autoauto is that **return() does not halt the function.**

### typeof() function

The `typeof()` function returns a string depending on what *type* its first argument is.

|Value|Returned String|Note|
|-|-|-|
|`typeof("")`|"string"|
|`typeof(3)`|"numeric"|
|`typeof(3ms)`|"unit"|
|`typeof(typeof)`|"function"|
|`typeof(true)`|"boolean"|
|`typeof([])`|"table"|
|`typeof([2])`|"table"|
|`typeof([a = "p"])`|"table"|Regardless of what syntax was used to make it, `table`s are the same type.|
|`typeof(f = 2)`|"numeric"|`typeof`ing a relation is the same as `typeof`ing its [.value](/syntax#h-relations). |

## Top-level Variables

These *top-level variables* are all defined in any program.

### pi

`pi` is equal to `3.141592...`.

### e

`e` is equal to `2.7182...`; the base of the natural log.

### True, TRUE, False, and FALSE

These variables let you use PythonStyle or javastyle for your boolean capitalization. The canonical spellings *are* `true` and `false`.

### Math

The `Math` built-in is a table; you call its methods like `Math.sin()` or `Math.random()`.

In short, `Math` is a direct copy of ES6's `Math`. The following section has every `Math` property; it is taken under CC-BY-SA from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math):

#### Math.E

Euler's constant and the base of natural logarithms; approximately 2.718.

#### Math.LN2

Natural logarithm of 2; approximately 0.693.

#### Math.LN10

Natural logarithm of 10; approximately 2.303.

#### Math.LOG2E

Base-2 logarithm of E; approximately 1.443.

#### Math.LOG10E

Base-10 logarithm of E; approximately 0.434.

#### Math.PI

Ratio of a circle's circumference to its diameter; approximately 3.14159.

#### Math.SQRT1_2

Square root of 0.5; approximately 0.707.

#### Math.SQRT2

Square root of 2; approximately 1.414.

#### Math.abs(x)

Returns the absolute value of x.

#### Math.acos(x)

Returns the arccosine of x.

#### Math.acosh(x)

Returns the hyperbolic arccosine of x.

#### Math.asin(x)

Returns the arcsine of x.

#### Math.asinh(x)

Returns the hyperbolic arcsine of a number.

#### Math.atan(x)

Returns the arctangent of x.

#### Math.atanh(x)

Returns the hyperbolic arctangent of x.

#### Math.atan2(y, x)

Returns `atan(y/x)`, but more efficiently.

#### Math.cbrt(x)

Returns the cube root of x.

#### Math.ceil(x)

Returns the smallest integer greater than or equal to x.

#### Math.clz32(x)

Returns the number of leading zero bits x will have when converted to a 32-bit integer.

#### Math.cos(x)

Returns the cosine of x.

#### Math.cosh(x)

Returns the hyperbolic cosine of x.

#### Math.exp(x)

Returns e^x, where x is the argument, and e is Euler's constant (2.718..., the base of the natural logarithm).

#### Math.expm1(x)

Returns subtracting 1 from exp(x).

#### Math.floor(x)

Returns the largest integer less than or equal to x.

#### Math.fround(x)

Returns the nearest single precision float representation of x.

#### Math.hypot(a, b)

Solves the Pythagorean theorem (`a^2 + b^2 = c^2`) for its arguments. Returns `c`.

#### Math.imul(x, y)

Returns the result of the 32-bit integer multiplication of x and y.

#### Math.log(x)

Returns the natural logarithm (log<sub>e</sub>) of x.

#### Math.log1p(x)

Returns the natural logarithm (log<sub>e</sub>) of 1 + x.

#### Math.log10(x)

Returns the base-10 logarithm of x.

#### Math.log2(x)

Returns the base-2 logarithm of x.

#### Math.max(a, b, ...)

Returns the largest of two or more numbers.

#### Math.min(a, b, ...)

Returns the smallest of two or more numbers.

#### Math.pow(x, y)

Returns `x^y`. The same as the built-in `x^y` or `x**y` operation.

#### Math.random()

Returns a pseudo-random number between 0 and 1 (inclusive, exclusive: it *may* return 0, but will *never* return 1).

#### Math.round(x)

Returns the number x rounded to the nearest integer.

#### Math.sign(x)

If `x<0`, returns `-1`. 
If `x==0`, returns `0`.
If `x>0`, reutrns `1`.

#### Math.sin(x)

Returns the sine of x.

#### Math.sinh(x)

Returns the hyperbolic sine of x.

#### Math.sqrt(x)

Returns the square root of x.

#### Math.tan(x)

Returns the tangent of x.

#### Math.tanh(x)

Returns the hyperbolic tangent of x.

#### Math.trunc(x)

Returns the integer portion of x, removing any fractional digits.


## Prototype Functions

Each type has different proto-properties, and therefore, different prototype functions.

### Global Prototype

The "Global Prototypes" are present on *every* value. 

#### toString()

Converts the value to a string. Tables use the following format:

`[prop1 = value1.toString(), nextProperty = value2.toString(), *...*]`