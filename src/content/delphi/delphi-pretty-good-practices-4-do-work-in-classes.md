---
author: Nick Hodges
publishDate: 2011-08-09
title: Delphi Pretty Good Practices #4 – Do Work in Classes
postSlug: delphi-pretty-good-practices-4-do-work-in-classes
featured: false
tags:
  - uncategorized
description: "This page was orginally published on Wed, 05/05/2010 - 10:29 on my Embarcadero blog."
---

*This page was orginally published on Wed, 05/05/2010 - 10:29 on my Embarcadero blog.*

The next principle for the “Pretty Good Practices” we’ll discuss is this notion:  Whenever possible and as much as possible, put functionality in a class –  preferably a class that can be easily unit tested, reused, and separated from any user interface.

TextScrubber demonstrates this via the use of the TTextScrubber class in the uTextScrubber.pas unit.  TTextScrubber is a simple TObject descendant that does all the work for the whole application, really.  It is a standalone class – you could take the uTextScrubber.pas unit and use it in most any project you cared to.  Because of this, it is also very easy to write unit tests for this class.  (We covered unit testing in my previous series “Fun with Testing DateUtils.pas”, but I’ll discuss Unit Testing in a later post in this series as well.)  The class attempts to follow the “[Law of Demeter](http://en.wikipedia.org/wiki/Law_of_Demeter)”, which says that classes should know as little as possible about outside entities.  The three principles of the Law of Demeter are as follows:

- Each class should have only limited or hopefully no knowledge of other classes.
- If a class must have knowledge of other classes, it should only have connections to classes that know about it as well.
- Classes should never “reach through” one class to talk to a third class

In the case of TTextScrubber, it only knows about and utilizes the TClipboard class and nothing else.  It doesn’t try to grab things out of TClipboard or attach to or require any other class.  It pretty much minds its own business, utilizes the services of the clipboard, and provide an easy way to get at its functionality.  It endeavors to do one thing:  scrub text, by both straightening and “un-formatting” it.  It has short, sweet method bodies, and ensures that it doesn’t try to do too much beyond exactly what it is supposed to do.  Following the Law of Demeter tends to make your code more maintainable and reusable. By reducing dependencies, you ensure that a class is as flexible as possible and that changes to it don’t tend to have far reaching consequences. 

So, to as large a degree as possible, you should endeavor to put the functionality of your program into classes.  One way to tell you are not doing this is if you tend to do “OnClick” programming, or relying on event handlers to do the work of your application.  The Pretty Good Practices way of programming would dictate that your event handlers would contain code that merely instantiated and used other classes instead of having the actual code in them to do the work of your application.

So for instance, most of the work in TextScrubber gets done in an OnClick event of the TTrayIcon component.  That code looks like this:

```
procedure TStraightTextMainForm.MainTrayIconClick(Sender: TObject); 
begin 
  MainTrayIcon.Animate := True; 
  case TextScrubberOptions.ClickChoice of 
    ccStraightenText: begin
                               DoStraightenText; 
                             end; 
    ccScrubClipboard: begin 
                                DoPurifyText; 
                              end; 
  end; 
end;
```

class to do the work.  It’s not always entirely possible, but I try to make as many of  my event handlers and methods follow this pattern of merely utilizing the functionality of external classes.  Doing so enables a few things:

- It means that functionality is much easier to unit test.  Isolated classes with specific functionality make unit testing really easy.
- Functionality is easier to share and reuse.  An isolated, decoupled class can easily be moved to new applications as it has few or no dependencies.
- Lean event handlers mean that your user interface isn’t tightly coupled to the work code.  This means that adjusting or altering your UI is easier to do, and adjusting and altering the work code doesn’t mean a change in the way the UI works.

So, to sum up – always try to build standalone classes to do the work or your application.