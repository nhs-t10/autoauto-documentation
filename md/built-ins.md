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

These variables let you use PythonStyle or javastyle for your boolean capitalization.

### Math

The `Math` built-in is a table; its properties can be found in [the Math section](#h-math).

## Prototype Functions

Each type has different proto-properties, and therefore, different prototype functions.

### Global Prototype

The "Global Prototypes" are present on *every* value. 

#### toString()

Converts the value to a string. Tables use the following format:

`[prop1 = value1.toString(), nextProperty = value2.toString(), *...*]`