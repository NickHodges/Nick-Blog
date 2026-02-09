---
author: Nick Hodges
publishDate: 2014-12-28
title: Never Assume Your Paths Have Ending Delimiters
postSlug: never-assume-your-paths-have-ending-delimiters
featured: false
tags:
  - delphi
description: "I think I’ve mentioned that I have a “challenging” codebase that I deal with in my day job."
---

I think I’ve mentioned that I have a “challenging” codebase that I deal with in my day job.  It’s a classic Delphi legacy app, worked on by numerous different people over the years with multiple different styles and techniques. Part of the product includes the use of an Address Engine – a third-party utility that “scrubs” addresses and ensures that they exist and that they are in a Post Office acceptable form.

Recently, we’ve had to change Address Engine providers.  It should have been easy – I had created an interface to isolate the engine before the switch.  So I got the new engine all plugged in, ready to go, and it all should have worked.  But try as I might, I couldn’t get anything but garbage data out of the engine.  Argh.  It simply wouldn’t return any data.  Now mind you, the DLL in question was written in C, and I had a translation of the *.h file that I was pretty confident in.  It all should have worked.

But the problem was much simpler than that – the `*.ini` file that had an entry for the path to the postal data was missing an ending backslash.  That was it.  I put the trailing backslash on the entry (why didn’t the installer do that?) and it all worked.

Which brings me to the point of this blog post:  **Always assume that your paths don’t have that trailing delimiter, and that it is your responsibility to put it there**.

In fact, the RTL provides a routine that allows you to do that very thing:
```
function IncludeTrailingPathDelimiter(const S: string): string; overload;
```
`IncludeTrailingPathDelimeter` will place either a backslash or a forward slash on the end of a path, depending on the operating system’s definition of a path delimiter if there isn’t one there.  If there is, it will do nothing.   You should use it to ensure that every path string you use has a delimiter on the end of it.  Your code should thus assume that all paths have that trailing backslash on it.  If you have code that looks like this:
```
MyFilenameWithPath := SomePath + ‘\’ + ‘somefile.txt’;
```
this should be changed to
```
MyFilenameWithPath := IncludingTrailingPathDelimiter(SomePath) + ‘somefile.txt’;
```
The former code can be buggy – what if `SomePath` already has a trailing delimiter?  You’ll end up with an invalid path.  The latter code has no such problem.  It is safe both ways – with and without the trailing delimiter.  This is especially necessary when your paths come as a result of user input, such as that `*.ini` file above.

The moral of the story:  Never assume that your path variables have a trailing delimiter, and always wrap them up with `IncludeTrailingPathDelimiter` to ensure that they do.