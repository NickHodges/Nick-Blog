---
author: Nick Hodges
publishDate: 2011-08-09
title: Delphi Pretty Good Practices #1
postSlug: delphi-pretty-good-practices-1
featured: false
tags:
  - delphi
description: "This article was originally published on Mon, 04/19/2010 - 16:38 on my Embarcadero blog."
---

*This article was originally published on Mon, 04/19/2010 - 16:38 on my Embarcadero blog.*
**
A while back someone (I can’t remember who, sadly, sorry to the person who made the suggestion…) suggested that someone do a series of articles about “the best practices on how to develop a Delphi application”.  That’s a good idea.  There are a lot of ways to do things, and clearly there are some good way and some bad ways, some okay ways and some really cool ways to develop with Delphi.
This series of articles will cover my personal ideas behind a good way to organize and build a Delphi application.  I’ll build a small application that does a few things.  I’ll organize the application in such a way that it illustrates some techniques that I believe are a good way to organize things.  I will explain my reasoning and in doing so I hope that you guys learn something.  This won’t be an exhaustive list or collection of ideas.

What I will not do is pretend that what I do and the way I do it is the only way to do things.  Heck, it may be that you end up thinking the way I do things is ridiculous.  I’ll let you all be the judge of that.   If you guys have different ideas, please feel free to express them.  If you like what you see, let me know.  I’ve been using Delphi for a long time, and so I think I’ve learned a thing or two along the way, but I’m not the world’s greatest Delphi developer and I certainly won’t claim to be the final arbiter of how things should be done.  I generally don’t like the term “Best Practices”, so I’ve titled this using “Pretty Good Practices”.

My goal here, really, is to be informative and stimulative and to evoke conversation and discussion.  I have developed a way of doing things over the years and I’ll be outlining them in this series of articles.  I don’t believe that this series will be all inclusive – that is, I won’t be covering every single aspect of every single development practice that I’ve ever thought of. Again, I hope merely to stimulate some discussion and do my humble part to  improve the way Delphi applications are developed.

The application I’ll use as an illustration is one that I use practically every day.  I call it “TextScrubber”, and it is a simple application that resides in the tray and let’s me “clean up text”, either by removing formatting, removing line breaks, or both.  I use it when I copy text from the web or from an MS Word document that contains formatting information that I in turn want to paste into another document when I don’t want the formatting to come along.  I copy the text, click on the icon in the tray, and the text is “scrubbed” and put back on the clipboard.  (It is basically a much simpler version of [PureText](http://www.stevemiller.net/puretext/) – a product that I heartily recommend that you use if you want this kind of functionality.)  TextScrubber is actually a very simple application with not a lot of code, but I’ve laid it out in such a way that it illustrates many of the methods that I have developed over the years.  Thus, I hope it will suffice to illustrate the things I want to discuss.

To start, I’ll talk about a few general ideas that drive how I do things. These are the general ideas that drive what I do when I develop:

- Any code of consequence at all should be managed under source control, even if I am the only one using and writing the code.  I use Subversion for this. I actually run the Subversion server on my local machine, but you don’t need to do that.  You can manage a Subversion repository merely as a set of local files, if you want.  But even if you develop all alone, I think using source control is a great idea.
- I want everything I write to be easily expandable and scalable.  I try to organize and write code that can easily be extended and enhanced.  I try to write classes that have a sensible hierarchy and that can be easily inherited from.
- I want my code to be testable.  I want to write it in such a way that it is conducive to writing unit tests.  I want it to be easy to isolate and easy to find problems if they crop up. 
- To as large a degree as possible, I separate the logic of an application from the user interface.  I don’t go full bore into an MVC application usually – that almost requires a special framework, but I do try very hard to separate out functionality into separate, testable classes.
- I want my code to be well modularized.  That is, I want each class and each unit to have a single purpose, and be linked to other units and classes as loosely as possible. 

What would you add to this list?  What are some of the general rules you try to follow when developing an application?