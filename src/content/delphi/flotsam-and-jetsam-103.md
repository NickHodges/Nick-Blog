---
author: Nick Hodges
publishDate: 2015-05-01
title: Flotsam and Jetsam #103
postSlug: flotsam-and-jetsam-103
featured: false
tags:
  - delphi
  - flotsam and jetsam
description: "Stefan Glienke has two interesting polls going on: Let's do some demographics of the Delphi developers - how old are you."
---

- Stefan Glienke has two interesting polls going on:
- [Let's do some demographics of the Delphi developers - how old are you?](http://bit.ly/1DLJ6p9) - [How long ago did you start using Delphi?](http://bit.ly/1z20hae) 
- [Here’s a blog post](http://www.teamten.com/lawrence/projects/turbo_pascal_compiler/) from a guy that has written [a mostly-working Turbo Pascal compiler](https://github.com/lkesteloot/turbopascal) written in Javascript.  Kind of cool.  - [Ten Tips For Migrating From C# And .NET To Multi Platform Object Pascal And Delphi Firemonkey](http://www.fmxexpress.com/ten-tips-for-migrating-from-c-and-net-to-multi-platform-object-pascal-and-delphi-firemonkey/)- Another entry in the “They are evil” category: nested routines.   Just don’t.  In my codebase at work, there are methods that six, seven, even eight nested methods. I have even seen nested routines with nested routines.  Argh.  Despite being a formatting nightmare – how are you supposed to read and understand that? – a bunch of nested routines screams “Make me into a class”.  If you have a bunch of methods at all should be grouped together, isn’t that pretty much the definition of what a class is?  Anyway, nested routines should be banished.