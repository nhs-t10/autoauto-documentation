---
tags: Docs
title: Reserved Identifiers
description: Certain important variable names
---

# Reserved Identifiers

Certain identifiers are "reserved" for runtimes. There are two types: syntax-usable and non-syntax-usable.
Non-syntax-usable variables may not be set by users, but both types should be treated as normal variables. The only "security feature" for NSU variables is their names.

## Syntax-Usable Variables

### `this`

When a function is called as a property of a table (for example, as in [Figure F](#figure-f)), `this` refers to the table.

```aa
let table = [fu: func() { log(this.num) }, num: 2],
//this will print `2`
table.fu()
```

### `module_args` 

`module_args` is set when `delegate()` is called to yield to another file. It refers to an array-like table representing any *extra* arguments for `delegate()`. See [`delegate()`'s documentation](/built-ins#h-delegate-function) for more detail.

In `a.autoauto`:

```aa
delegate("b", 2, 4)
```

In `b.autoauto`:

```aa
//logs `[0 = 2, 1 = 4]` and `4`.
log(module_args, module_args[1])
```

### arguments

Inside functions, `args` is an array-like table representing the arguments. This can be used to make functions with a dynamic number of arguments!

```aa
function foo() {
    log(args)
},
//logs `[0 = 3, 1 = "james"`
foo(3, "james")
```

## Non-Syntax-Usable Variables

!> **In general:** variables with `@`, `--`, or `\t` are reserved for the runtime.

Some common useful variables include:

### `\t@returned`

Used in some systems to return a value.

### `\t@exported`

Used in some systems by [`provide()`](/built-ins#h-provide-function).

### `--statepathName`

Used in some systems to store the current statepath's name

### `--stateNumber`

Used in some system to store the index of the current state.