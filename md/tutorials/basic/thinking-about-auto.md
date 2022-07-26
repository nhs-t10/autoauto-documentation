---
title: Thinking About Auto
tags: Tutorial, Basic
description: A starter for how to think about an autonomous.
homepage: true
---


## Introduction: The Scenario

In order to learn about autonomous, we should have a challenge to work on. I'm not going to use an official FTC challenge (they're too complex to quickly explain)-- instead, here's a sample challenge called Seawall:

%> boardScenario: seawall; mode: static; setup: field,robot; team: blue

You're on the blue team. Your robot, Cockroach, starts in the blue Start Box; your goal is to push the yellow ball into your blue Goal Zone.

^> It's not *required* for the competition, but a robot's name & pronouns are very important! It's important to like your robot :) they're just lil computer friends. I named the tutorial bot Cockroach because he happens to be brown.

## A Basic Plan

Whenever you make an autonomous, you first need a basic plan. This can be *very* basic, but it's important to have an idea of where you want the robot to go.

Here, I've drawn a line of where Cockroach should go:

%> boardScenario: seawall; mode: static; setup: field,robot; team: blue; drawLine: M 2.1742511,7.2397088 C 2.3457115,6.943659 2.3635094,6.5810278 2.5229504,6.2815704 2.6191273,6.1009338 2.8634392,6.0598282 3.053542,6.0127295 3.2730133,5.9583546 3.6489761,5.951831 3.6679035,5.6965622 3.691299,5.3810336 3.6095885,5.0664337 3.5931315,4.7520631 3.5779596,4.4622411 3.7703854,4.1263658 3.610825,3.882169 3.4981125,3.7096698 3.2966568,3.6674688 3.1927962,3.4478583 3.0897312,3.22993 3.049679,2.9855601 3.082026,2.7472303 3.1129506,2.5193809 3.2025093,2.319697 3.28978,2.1173757 3.3745667,1.920813 3.5210197,1.760912 3.6005263,1.5675332 3.7226221,1.2705674 4.0662405,1.3081267 4.3149303,1.1988915 4.5590716,1.0916542 4.8247616,1.0648266 5.0902879,1.0870714 5.3040775,1.1049819 5.5071797,1.0584391 5.7201787,1.026093 5.8623308,1.0045057 6.0066021,1.008909 6.1498872,1.009039

## Breaking a Plan into Steps

Robots don't like freeform movement.  In autonomous, you should try to use **straight lines** in **cardinal directions** (forwards, backwards, left, or right)[1] as much as possible.

Now that you have your freeform-line plan, you need to break it down into straight lines. 

%> boardScenario: seawall; mode: static; setup: field,robot; team: blue; drawLine: M 2, 7.25 h 2 v -5 h -0.5 v -1 h 2

Here's the previous freeform plan, broken down into **steps**. Each straight line that you see here is a step!

## Listing Your Steps

We have the steps in a *graphical* representation (lines), but you need them in a *textual* representation-- something like: 

1. Move right 2ft
2. Move forwards 5ft
3. Move left 0.5ft
4. Move forwards 1ft
5. Move right 2ft

These numbers don't need to be exact, but you should try to get the directions and proportions down.

!> If your robot turns, make sure that you're using the *robot's* "forward", not yours!

## Next

With your list of steps, you can move on to the next tutorial, where you'll write some code!

)> [States](./states)

---

[1]: Diagonal movement can be unreliable-- it's *very* easy for weight distribution to throw a robot off. It's doable, but try to avoid it.