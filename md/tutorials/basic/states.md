---
title: States
tags: Tutorial, Basic
description: A tutorial on writing Autoauto from a list of states
---

## A List Of Steps

Whenever you plan out an auto, you should have a list of steps before you write code. In the [last tutorial](./thinking-about-auto), we made that list.

The task is to have Cockroach move the yellow ball into the blue Target Zone.

%> boardScenario: seawall; mode: static; setup: field,robot; team: blue; drawLine: M 2, 7.25 h 2 v -5 h -0.5 v -1 h 2

1. Move right 2ft
2. Move forwards 5ft
3. Move left 0.5ft
4. Move forwards 1ft
5. Move right 2ft

## Translating Steps to Code: Driving

Each step will translate into an Autoauto **statement**. For now, you can ignore the measurements; simply use the directions.

Autoauto's driving function is `driveOmni(v, h, r)`. It has 3 arguments. `v` stands for vertical; `h` for horizontal, and `r` for rotation.

You can either use the **name syntax**: `driveOmni(v = 1)`, or the **positional syntax**: `driveOmni(1, 0, 0)`. This tutorial will use the name syntax, as it's more readable.

Let's translate "left" into a `driveOmni` call. It's a horizontal direction, so we'll use `h`. Right is positive (like a number line), so "Move left" becomes use `driveOmni(h = -1)`.

!> An incorrectly configured robot might result in incorrect movement. If `h = -1` makes your robot move forwards, backwards, or turn, then check the configuration!

```aa
driveOmni(h = 1); //Move right
driveOmni(v = 1); //Move forwards
driveOmni(h = -1); //Move left
driveOmni(v = 1); //Move forwards
driveOmni(h = 1); //Move right
```

?> In the real world, 1 is the fastest speed, which can make a robot overshoot! Need finer control? Try a smaller number.

## Translating Steps to Code: Distance

Autoauto has a built-in way to deal with distance. Each state (line of code) will only "move on" if you tell it to, so you can "move on" to the next state when the robot has gone enough distance.

For that, we'll add an `after` statement to each line of code. Make sure that the `driveOmni` call and the `after` statement are seperated with a comma (`,`)! 

`driveOmni(h = 1)` -> `driveOmni(h = 1), after 2ft next;`

An Autoauto compiler can deal with many, many units (any unit on Wikipedia!). Unit conversion is automatic. We'll use feet here because it's easy to understand.

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 5ft next; //Move forwards for 5ft
driveOmni(h = -1), after 0.5ft next; //Move left for 0.5ft
driveOmni(v = 1), after 1ft next; //Move forwards for 1ft
driveOmni(h = 1), after 2ft next; //Move right for 2ft
```

Notice that the last line still has a `next` keyword. Since there *is* no next line, `next` will wrap around to the start! We don't want that!

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 5ft next; //Move forwards for 5ft
driveOmni(h = -1), after 0.5ft next; //Move left for 0.5ft
driveOmni(v = 1), after 1ft next; //Move forwards for 1ft
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni() //stop
```

To fix the wrapping issue, add a "stopping" line: a `driveOmni` with no directions. If you prefer the positional style, use `driveOmni(0,0,0)`.

## Finished Code!

Congrats! This code is a basic, but complete, ball-moving program!!

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 5ft next; //Move forwards for 5ft
driveOmni(h = -1), after 0.5ft next; //Move left for 0.5ft
driveOmni(v = 1), after 1ft next; //Move forwards for 1ft
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni() //stop
```

Next, we'll be investigating branching logic; how can you have Autoauto make decisions depending on some sensor?

)> Next: [Conditions](./conditions)
