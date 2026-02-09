---
author: Nick Hodges
publishDate: 2015-06-01
title: 'Review: FixInsight'
postSlug: review-fixinsight
featured: false
tags:
  - delphi
description: "A confession: I was given a free license to review FixInsight . A summation: I really like it."
---

**A confession:**  I was given a free license to review [FixInsight](http://sourceoddity.com/fixinsight/).

**A summation:**  I really like it.  It’s in a category tool that I think most Delphi developers don’t take advantage of.  

**A statement**:  It’s not as powerful as Delphi’s Code Audits, but it is more usable.  I presume that Roman Yankovsky will continue to improve it and eventually it will cover as many rules as Code Audits does.  Start using static analysis today, one way or another.

**Full Comments: **  FixInsight is a static code analysis tool.  A static tool is one that examines the code itself, apart from any runtime environment.  It uses a parser – in this case, [a fork of Jacob Thurman’s Pascal Parser](https://github.com/RomanYankovsky/DelphiAST) – to examine the code and apply a set of rules against the result.  Those rules can point to questionable constructs in your code that may be bugs or other problems.  You can use static analysis to enforce formatting rules,  find places where coding conventions have not been followed, and to enforce specific coding techniques.  The compiler will do a lot of this kind of thing for you, but there are certain things that the compiler won’t see that 

FixInsight does all of this for you in the IDE.  Once installed, it provides a menu item that brings up the following dialog:

[![image](http://www.codingindelphi.com/blog/wp-content/uploads/2015/06/image_thumb.png)](http://www.codingindelphi.com/blog/wp-content/uploads/2015/06/image.png)

From here, you can select or unselect the Conventions or Warnings that you want to verify.  Some of the Conventions and Warnings can be configured as shown above where you can set the maximum number of variables that will be allowed in a given method on the right side of the window.

Conventions are things that “should” be done a certain way; they might be described as enforcing a certain coding “style”.  For instance, Convention C107 ensures that all private field variables in a class start with ‘F’, a long time Delphi convention.  

Warnings are coding constructs that “look suspicious”.  Things like a destructor without an inherited call, or the dreaded “Empty EXCEPT block” – that is, things that are likely just wrong code and that could cause problems in the execution of your code.    A warning basically says “Something doesn’t look right here and you should take a close look to make sure that all is well and correct”. 

Running Fix Insight operates much like the compiler and produces Convention and Warning messages in – Surprise!  -- the Message Pane:

[![image](http://www.codingindelphi.com/blog/wp-content/uploads/2015/06/image_thumb1.png)](http://www.codingindelphi.com/blog/wp-content/uploads/2015/06/image1.png) 

If you double click on one of the items, it take you to the spot in your code where the problem occurs.   Nice.

FixInsight also includes a command line tool for inclusion in a continuous integration process.  In fact, I’d recommend this be the main way you use it.  It can be used to fail a build that finds code in your repository that doesn’t conform to your definition of “clean” code.  

You can tell FixInsight to ignore chunks of your code via the _FIXINSIGHT_ compiler directive.

The [documentation](http://sourceoddity.com/fixinsight/doc.html) is quite nice, with each rule clearly explained, though I found that FixInsight’s descriptions are very easy to understand, and you shouldn’t have any trouble figuring out what it is trying to tell you.  

Here’s how I recommend you use FixInsight:

- Establish a set of Conventions and Warnings that you want to enforce.- Use the IDE tooling to ensure that your code conforms to those rules and that you never check in code that violates any of your rules- Run the command line tool as part of your continuous integration process, and break the build if any checked in code violates your rules
Do that, and it will go a long way towards keeping your codebase clean and tidy.

You can download [a trial version of FixInsight here](http://sourceoddity.com/fixinsight/download.html)

I presume that Roman will add more Conventions and Warnings to future versions --- there’s a lot of room here to do some very cool things.

**Bottom Line**:  FixInsight is a fine entry into the Delphi Third-party market.  Whether you decide to use it or Delphi’s own tool, you should be including static code analysis into daily routine and your continuous integration.