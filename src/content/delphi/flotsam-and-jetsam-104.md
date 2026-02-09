---
author: Nick Hodges
publishDate: 2015-05-04
title: Flotsam and Jetsam #104
postSlug: flotsam-and-jetsam-104
featured: false
tags:
  - delphi
  - flotsam and jetsam
description: "Stefan chastises me for making another one of my pronouncements on “evil” programming techniques."
---

- [Stefan chastises me](http://www.codingindelphi.com/blog/flotsam-and-jetsam-103/#comment-1998420663) for making another one of my pronouncements on “evil” programming techniques.  I admit to a bit of hyperbole, but it’s not without a point.  The argument against my pronouncements is that the wise and judicious use of these so-called “evil” features or techniques is good.  I don’t agree.  I think that if a “feature” has the ability to be *easily* abused, then it should be avoided.  For instance, some make the argument that there places where the `with` statement makes sense.  Well, my counter argument to that is if you allow the `with` statement in a few places, it’s very easy to use it in just a few more places, and then the next thing you know, your code is full of `with` statements.  It’s a slippery slope that you should never start down.  The same is true for nested procedures.  Sure, there might be places where they “make sense”, but if you allow them in one place, what is to stop a junior programmer from getting the wrong idea and go crazy with them?  This is especially true for features that simply need not be used at all – such as `with` and nested procedures.  You can write beautiful code without them, so why risk sliding down the slope?  Better to ban their use altogether.  (Cue the “Then why don’t we all just use assembler” comments in 3..2…1….)- I’m a big user and proponent of the Spring for Delphi framework. If you are, too, then you might consider donating to the project.  [The website now has a PayPal donate button](https://bitbucket.org/sglienke/spring4d).- I recommend that you give a very careful read [to Marco’s post](http://blog.marcocantu.com/blog/2015_05_build_windows10_delphi_cppbuilder.html) about what was going on at the [Microsoft BUILD conference last week](http://www.buildwindows.com/).  Lots of interesting stuff there for us Delphi developers, both in the Windows and cross-platform realms.- [Torry.net](http://www.torry.net/) is [for sale](http://www.torry.net/sale.htm).  Hat tip to Olaf Hess in the non-tech group for this piece of information.