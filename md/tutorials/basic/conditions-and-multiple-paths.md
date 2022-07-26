---
title: Conditions and Multiple Paths
tags: Tutorial, Basic
description: A tutorial on conditionals in Autoauto, and how to use them to jump between multiple paths
---

## Adding Conditions to the Challenge 

In the previous tutorials, you've been working on a challenge without any conditions; just simple movement. Our robot, Cockroach, has to bring the yellow ball into the blue square.

%> boardScenario: seawall; mode: static; setup: field,robot; team: blue; drawLine: M 2, 7.25 h 2 v -5 h -0.5 v -1 h 2

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 5ft next; //Move forwards for 5ft
driveOmni(h = -1), after 0.5ft next; //Move left for 0.5ft
driveOmni(v = 1), after 1ft next; //Move forwards for 1ft
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni() //stop
```


We're going to add a **condition**: Cockroach has to do one of two different things, depending on the field setup. If the ball is yellow, then he'll still bring it into the square, but if it's *orange*, then he'll leave it alone.

%> boardScenario: seawall_orangeball; mode: static; setup: field,robot; team: blue; drawLine: M 2, 7.25 h 2 v -2

We can't code that with our old style! There's more than one "path" of steps!

## Identifying the Branching Paths

We need to split the steps into paths. **A path is a series of steps that requires no choices or splits.**

In this challenge, there's one choice (bring the ball or leave it), with two outcomes (yellow or orange).

Although there's two outcomes, we need to start on *one* path. A robot can only do one thing at once. Two outcomes, plus one initial path, gives us *three* paths.

Cockroach needs to look at the ball to decide, so he'll *always* need to go up to the ball. "Going up to the ball" can be the first path. That gives us 3!

1. Go up to the ball
2. (if the ball is yellow) Move the ball into the square
3. (if the ball is orange) Do nothing

## Code Each Path

Once you have all the paths, you need to write out the steps required for each.

Going up to the ball requires Cockroach to go right, then forwards a little bit:

1. Go right 2ft
2. Go forwards 2ft

which translates to this code:

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 2ft next; //Move forwards for 2ft
//... what colour is the ball?
```

For now, don't worry about how the paths get connected. We'll code each path first.

If the ball is yellow, then we'll need to go forwards, move to the ball's left, and push it in:

1. Go forwards 3ft
2. Go left 0.5ft
3. Go forwards 1ft
4. Go right 2ft

Note that this one only needs to go forwards 3ft, since we're already at the ball!

In code, that looks like this:

```aa
driveOmni(v = 1), after 3ft next;
driveOmni(h = -1), after 0.5ft next;
driveOmni(v = 1), after 1ft next;
driveOmni(h = 1), after 2ft next;
```

If the ball is orange, we'll stay still. 

1. Stop

```aa
driveOmni() //Stop
```

## Connect the Paths Together

Each path will get a "state-path ID", which you decide. It may be any word.

The first path **doesn't need** an ID, so start the file with the first path's code.

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 2ft next; //Move forwards for 2ft
//... what colour is the ball?
```

The second path *does* need an ID. It's the path for a yellow ball, so let's call it `yellowball`.

Add its label (which is a hashtag `#`, the ID, and a colon `:`), and then add the path's code:

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 2ft next; //Move forwards for 2ft
//... what colour is the ball?

#yellowball:
driveOmni(v = 1), after 3ft next;
driveOmni(h = -1), after 0.5ft next;
driveOmni(v = 1), after 1ft next;
driveOmni(h = 1), after 2ft next;
```

A label acts like a seperator, just like a comma `,` seperates the `driveOmni(...)` instructions from the `after` instructions. After the label, all code belongs to the `yellowball` path until there's another label.

If you want, you can **indent** the `yellowball` path's code to make this more clear, like a paragraph. The next example does this!

The third path's ID will be `orangeball`, so its label will be `#orangeball:`. Add its label, and then the code:

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 2ft next; //Move forwards for 2ft
//... what colour is the ball?

#yellowball:
    driveOmni(v = 1), after 3ft next;
    driveOmni(h = -1), after 0.5ft next;
    driveOmni(v = 1), after 1ft next;
    driveOmni(h = 1), after 2ft next;

#orangeball:
    driveOmni() //Stop
```

## Decide Which Path to Go To

Making a decision can requires two things: 

1. the answer to a question
2. what to do for each outcome

In this case, the question is "is the ball yellow?". To get the answer, I've added a special function, `canSeeYellowBall()` which checks if it's yellow or not.

$> [To make a specific Computer Vision method/function, follow this documentation](https://github.com/nhs-t10/yog22-knowledge/tree/master/software/cv)

`driveOmni(...)` instructions are actually functions too! We just don't *care* about the question that they answer, so we treat them as instructions.

In this case, `canSeeYellowBall()` is a **boolean function**, meaning that it returns one of 2 special values: `true` (i.e. "yes") or `false` (i.e. "no").

To actually use the answer, Autoauto provides you with an `if` statement, which lets you run different instructions based on what the robot knows! Here's some sample code that will drive **forwards** for a yellow ball and **backwards** for an orange one.

```aa
if(canSeeYellowBall() == true) { driveOmni(v = 1) }, if(canSeeYellowBall() == false) { driveOmni(v = -1) }
```

Try to read through one of these `if` instructions and see what it's actually doing! Hint: the instructions inside the curly brackets (`{}`) will be ran if the equation is correct.

Having a lot of `if` statements is harder to read, so I'll simplify it with an `else` clause. An `else` clause will only run if the `if` statement **didn't** run.

```aa
if(canSeeYellowBall() == true) { driveOmni(v = 1) }
    else { driveOmni(v = -1) }
//you COULD put them on the same line and still have valid code, but I like to break it up. 
//It works the same way.
```

!> Note that there's no comma before the `else`. That's because it's not its own instruction: it's only a clause of the `if`!

The final thing we need is a way to "jump" to a different path. Autoauto gives you a `goto` instruction for that: `goto yellowball` will jump to the `yellowball` path.

```aa
goto yellowball;

#yellowball:
    driveOmni(v = 1), after 3ft next;
    driveOmni(h = -1), after 0.5ft next;
    driveOmni(v = 1), after 1ft next;
    driveOmni(h = 1), after 2ft next;
```

You can also put a `goto` "inside" an `if`; that's what we're going to do here!

Here's the final, working code:

```aa
driveOmni(h = 1), after 2ft next; //Move right for 2ft
driveOmni(v = 1), after 2ft next; //Move forwards for 2ft
//... what colour is the ball?
if(canSeeYellowBall() == true) goto yellowball
else goto orangeball;

#yellowball:
    driveOmni(v = 1), after 3ft next;
    driveOmni(h = -1), after 0.5ft next;
    driveOmni(v = 1), after 1ft next;
    driveOmni(h = 1), after 2ft next;

#orangeball:
    driveOmni() //Stop
```

Great job!

(> [States](./states)