---
tags: Docs
title: Bytecode Format
description: A description of Autoauto's bytecode representation
---

## Bytecode

In addition to its syntax, Autoauto has a **canonical bytecode**. This is only defined here for the purpose of interoperability of optimizers.

Not all `[Compiler Modes](compiler-modes)` use the bytecode format.

## Format

Each bytecode takes up only 1 32-bit **integer**. The bytecodes don't have operands, so they work directly on a [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type\)).

By convention, in the **pop/push tables**, the top of the stack is on the **right**.

## Jump Codes

### pass: `0x000`

|Pop|Push|
|-|-|

Does nothing.

### jmp_i: `0x001`

|Pop|Push|
|-|-|
|*index*|

Pops a number off of the stack; jumps to that **instruction**, treating the program as an array (starting at index 0).

### jmp_l: `0x002`

|Pop|Push|
|-|-|
|*label*|

Pops a string off of the stack; jumps to that **label**.

### jmp_l_cond: `0x003`

|Pop|Push|
|-|-|
|*condition*, *label*|

Pops a value and a string off of the stack; if that value is **truthy**, jumps to the **label** represented by the string.

### jmp_i_cond: `0x004`

|Pop|Push|
|-|-|
|*condition*, *index*|

Pops a value and a string off of the stack; if that value is **truthy**, jumps to the **label** represented by the string.

### yield_to: `0x005`

|Pop|Push|
|-|-|
|*label*|

Yields control to the environment, resuming at the **label** represented by the string. This should be liberally peppered by any compiler! The FTC SDK will complain if not.

### ret: `0x006`

|Pop|Push|
|-|-|
|*v*||

Pops a value and `return`s it from the current function. If this is not inside a function (i.e. there is no caller), then this serves the same as `pop`. This should be at the end of any function.

## Stack Manipulation Codes

### pop: `0x100`

|Pop|Push|
|-|-|
|*val*|

Pops a value off the stack and discards it

### dup: `0x101`

|Pop|Push|
|-|-|
|*val*|*val*, *val*|

Takes the top value and places a duplicate of it on the stack

### swap: `0x102`

|Pop|Push|
|-|-|
|*val1*, *val2*|*val2*, *val1*|

Swaps the top two values on the stack

## Math Operators

### add: `0x200`

|Pop|Push|
|-|-|
|*a*, *b*|*a + b*|

### subtr: `0x201`

|Pop|Push|
|-|-|
|*a*, *b*|*a - b*|

### mul: `0x202`

|Pop|Push|
|-|-|
|*a*, *b*|*a \* b*|

### div: `0x203`

|Pop|Push|
|-|-|
|*a*, *b*|*a / b*|

### mod: `0x204`

|Pop|Push|
|-|-|
|*a*, *b*|*a % b*|

### exp: `0x205`

|Pop|Push|
|-|-|
|*a*, *b*|*a \*\* b*|

### cmp_lt: `0x206`

|Pop|Push|
|-|-|
|*a*, *b*|*a < b*|

### cmp_lte: `0x207`

|Pop|Push|
|-|-|
|*a*, *b*|*a <= b*|

### cmp_eq: `0x208`

|Pop|Push|
|-|-|
|*a*, *b*|*a == b*|

### cmp_neq: `0x209`

|Pop|Push|
|-|-|
|*a*, *b*|*a != b*|

### cmp_gte: `0x20A`

|Pop|Push|
|-|-|
|*a*, *b*|*a >= b*|

### cmp_gt: `0x20B`

|Pop|Push|
|-|-|
|*a*, *b*|*a > b*|

### abs_dif: `0x20C`

|Pop|Push|
|-|-|
|*a*, *b*|*abs(a - b)*|

## Variable and Value Handling

### setvar: `0x300`

|Pop|Push|
|-|-|
|*var*, *value*||

Sets the variable *var* to *value*

### getvar: `0x301`

|Pop|Push|
|-|-|
|*var*|*value*|

Gets the variable represented by *var* and pushes it onto the stack

### spec_setvar: `0x302`

|Pop|Push|
|-|-|
|*var*, *value*||

Similar to `setvar`, but sets a read-only "special" variable. Used internally by certain built-ins. Does *not* perform any validation on the `var`.

### setprop: `0x303`

|Pop|Push|
|-|-|
|*value*, *prop*, *propvalue*||

Sets the `prop` property of `value` to `propvalue`

### getprop: `0x304`

|Pop|Push|
|-|-|
|*value*, *prop*, |*propvalue*|

Gets the `prop` property of `value` and pushes it onto the stack.

### callfunction: `0x305`

|Pop|Push|
|-|-|
|*fn*, *arg1*, *arg2* ... *arg`L`*, *L*, *argname1*, *argval1*, *argname2*, *argval2*, ... *argnameN*, *argvalN*, *N* |*returnValue*|

Calls the value of `fn` as a function with `L` "positional" arguments and `N` "named" arguments.

For example, if a function `function f (a, b, c, d) { *...* }` is on the stack, `f("apple", "bear", a = "bapple")` would be translated into this bytecode:

|Bytecode|Note|
|-|-|
|`loadconst("apple")`|
|`loadconst("bear")`|
|`loadconst(2)`|There are two positional arguments|
|`loadconst("a")`|
|`loadconst("bapple")`|
|`loadconst(1)`|Although there are two items on the stack, there is only 1 named argument.|
|`callfunction`|

Named arguments override positional ones, so the value for `a` would be `"bapple"`. However, the `callfunction` bytecode doesn't need to know the argument-names of its function-- resolving which ones overlap is left to the runtime.

After execution, this pushes `fn`'s return value onto the stack.

### makefunction_l: `0x306`

|Pop|Push|
|-|-|
|*lbl*, *argname1*, *argDefaultValue1*, *argname2*, *argDefaultValue2*, ... *argname`L`*, *argDefaultValue`L`*, *L*|*function*|

Bundles the *lbl* label into a function. The *argname*s should be `string`s, while the *argDefaultValue*s may be any value (including `undefined`).

Functions have a different operand stack, so the function body will not modify the current stack.

### unit_currentv: `0x307`

|Pop|Push|
|-|-|
|*unitvalue*|*value*|

Gets the current measure of a unit. Allowed units are implementation-defined, but *must* support `cm`, `ms`, and `degs`.

### construct_table: `0x308`

|Pop|Push|
|-|-|
|*key1*, *value1*, *key2*, *value2*, ... *keyL*, *value`L`*, *L*|*table*|

Constructs a `table` value, popping each element of the table and pushing the result.

### construct_relation: `0x309`

|Pop|Push|
|-|-|
|*title*, *value*|*relation*|

Pops a `title` and `value`; uses them to create an immutable `relation`.

To a user's code, the relation must behave as if it has two properties: `title` and `value`. They may not be modified; modifications should silently fail. 

### makefunction_i: `0x30A`

|Pop|Push|
|-|-|
|*index*, *argname1*, *argDefaultValue1*, *argname2*, *argDefaultValue2*, ... *argname`L`*, *argDefaultValue`L`*, *L*|*function*|

Creates a function whose code starts at the *index* index. The *argname*s should be `string`s, while the *argDefaultValue*s may be any value (including `undefined`).

Functions have a different operand stack, so the function body will not modify the current stack.

## Constant-Loading Code Family

### loadint: `0x0E??????`

|Pop|Push|
|-|-|
||*number*|

Pushes the last 3 bytes of its instruction, as an integer. The integer is interpreted with the least significant byte first.

### loadconst: `0x0F??????`

|Pop|Push|
|-|-|
||*constVal*|

This is the only way to acquire a general constant. The first byte of the 4-byte instruction identifies a `loadconst` instruction, while the remaining 3 bytes are used as an identifier.

An implementation may use any extralinguistic method to map a constant to its identifier; the only restriction is that each unique constant must have a unique identifier.

?> Yes, this is a *horribly* inconsistent method for constant mapping. Remember, though, that this spec is only supposed to help optimizers work on more than 1 autoauto format! In a final form, the mapping method should be standardized beyond this.

It's important to note that `loadconst` pushes a *syntax representation* which has been converted to a value: this is critical for a language like Autoauto, where properties can be set on all primitives. For property-setting purposes, `loadconst_34` and `loadconst_34` don't refer to the same *value in memory*, but they *will* compare equal with `cmp_eq`.