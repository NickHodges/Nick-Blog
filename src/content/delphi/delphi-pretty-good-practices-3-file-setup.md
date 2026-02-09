---
author: Nick Hodges
publishDate: 2011-08-09
title: Delphi Pretty Good Practices #3 – File Setup
postSlug: delphi-pretty-good-practices-3-file-setup
featured: false
tags:
  - delphi
description: "Okay, hopefully by now you’ve read the introduction of this series, and you’ve downloaded (or better yet, pulled from source control) the latest versi..."
---

Okay, hopefully by now you’ve read the introduction of this series, and you’ve downloaded (or better yet, pulled from source control) the latest version of TextScrubber and given it a once over.  In this installment, I’m going to discuss the file structure of the project and why I did things the way I did.

First, an admin note:  I’ve made some small changes to the code for TextScrubber.  You can get these by going to the main directory for your code and typing svn up.  They aren’t any big deal – comments, some cleanup and organization, but it sure is easy to get the latest changes, isn’t it.

Taking a look at the file set that makes up the TextScrubber project, you see a number of different files, each with a particular purpose. I’ll describe each file in turn, telling what its purpose is and why it exists.  Future installements will go in depth a bit more.

![](https://lh3.googleusercontent.com/YtU6_7bF3kcDSnri3Y7wbLwSCettA9LXA-fY_og_7swbESLrGwpk1PUUoaRDQa3-5mGRGGmTqFzeIXdygGI7ihO9L4pa_FHfD3tPNnkkzE9GzPhIxg8)

FileName
Discussion

frmAboutBox.pas
Every Application should have an About Box.  The About Box should display the Application Icon, give Version information, copyright notices, and contain a short description of what the application is or does. 

frmStraightText.pas
This is the “main form” for the application, but since TextScrubber doesn’t have a main for, but it simply a container for some non-visual controls.

frmTextScrubberOptions.pas
Every application should have a single dialog that allows the user to set all the configurable options and preferences for the application.

NixUtils.pas
NixUtils.pas is a general purpose file of handy utilities and routines that I’ve built up over the years.  I use it in TextScrubber, so I’ve included it in the project.  Normally, I keep this file in a separate directory.

uTextScrubber.pas
This is the “workhorse” unit that contains the class that does all the work of the application.

uTextScrubberConsts.pas
This file has one and only one purpose:  To hold all the constants for the project. It will include all constant declarations, as well as the strings declared with resourcestring.

uTextScrubberTypes.pas
This file contains all the types declarations for the project, including classes, enumerations, records, etc.

uTextScrubberUtils.pas
This file contains those little, standalone, “helper” routines that you use to build the product.  Routings that go into this unit are often considered as candidates to end up in NixUtils.pas, but most often, they are very specific to a purpose of the project.

## 
A Note About Naming Conventions
For this project, I’ve used a pretty simple naming convention. For filenames, I put ‘frm’ at the front of forms, ‘u’ at the beginning of standalone units. DataModules would get ‘dm’. Constants start with ‘c’, and resourcestrings start with ‘str’.  Parameters are prefixed with ‘a’, and all local variables (well, almost all) are prefaced with ‘Temp’.  Those latter two help keep things straight inside class methods.  I try to make my identifiers descriptive, and I never worry about their length.  A well named identifier makes code clearer, and Code Completion can do all the work if you are worried about typing.  (But in my view, you should never worry about typing if typing less means writing unclear code…..)

I use those as a general set of rules, but I’m not dogmatic about it.  I try to be consistent for my and your benefit.  The exact rules of naming aren’t nearly as important as having a naming convention.  My recommendation is to find a system that you like and stick with it.  Naming conventions are a great source of religious debates. I generally leave that to others, and simply recommend that you find something that works for you and stick with it. 

## More Detail to Come
I’ll be talking a bit more specifically about each of the files in future installments.  This entry should just give you a brief rundown on the basics.