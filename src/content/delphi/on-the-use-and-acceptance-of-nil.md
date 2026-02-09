---
author: Nick Hodges
publishDate: 2015-01-20
title: On the Use and Acceptance of nil
postSlug: on-the-use-and-acceptance-of-nil
featured: false
tags:
  - delphi
description: "Yesterday I made the following tweet: Never pass nil to a method, and don't let your methods accept nil as a parameter value."
---

Yesterday I made the following tweet:
Never pass nil to a method, and don't let your methods accept nil as a parameter value.

— Nick Hodges (@NickHodges) [January 19, 2015](https://twitter.com/NickHodges/status/557215356356689920)

and it started and interesting little discussion on Twitter.  (I was actually honored that the great [Mark Seemann](http://blog.ploeh.dk/) himself entered into the fray…) Naturally, the conversation tried to point out why I was wrong, and all the ways that it was fine to use nil.  That’s okay – if there it is one thing developers like better than making pronouncements, it’s finding exceptions and arguing against other developer’s pronouncements.

Well, I remain unconvinced and stand by my statement.  No surprise there, I know.

There are two parts to what I said and I’ll argue them one at a time.

First – “never pass nil to a method”.  Now people freak out about “never”, but it’s Twitter and you don’t have a lot of room for caveats.  First, sometimes I guess you have to pass nil to some methods  -- ShellExecute  comes to mind --  but I’d argue that those methods are poorly designed (as I’ll talk more about in a minute), and that you should pass nil only very, very reluctantly.  Again, I’m talking about your code, not other’s code.    You should never send nil to a place where a valid object will be accepted.  Never do that to someone’s code.  Returning nil is always a bad design decision.

The Robustness Principle states, in part, that you should be very precise in what you pass, and passing nil is not precise.  It misses the mark by as much as you can miss the mark.  The target is a valid, working instance of whatever the method is asking for, and passing nil is like turning 180 degrees around and firing your arrow away from the bulls-eye.  Nil should not be used as a “signal”, leaving the class you passed it to in a state where they can’t make use of what you’ve given them.  You should avoid like the plague allowing a  class to be in a state where it can’t do what it is designed to do, and if it asks for a object in a method or constructor, you are obligated to pass a working, constructed object that it can use without error.  To do anything else is to invite an exception or worse, an access violation.

The second part is this:  “Don’t let your methods – especially your constructors -- accept nil as a parameter value”.  Your classes should never let themselves get into an unusable state, and blindly accepting nil as a parameter will do that.  Instead, your classes should carefully guard against being passed nil and quickly – no, *immediately* – fail if passed a nil reference.  There is even a pattern – [the Guard Pattern](http://en.wikipedia.org/wiki/Guard_%28computer_science%29) – that is employed to ensure that a program won’t continue unless things are acceptable.  Getting nil is not acceptable:
```
    procedure TMyClass.constructor(aSomeClass: TSomeClass);
    begin
      if aSomeClass = nil then
      begin
        raise NoNilParametersException.Create('Don''t you dare pass me a nil reference.  Pass only valid instances');
      end;
      FSomeClass := aSomeClass;
    end;

```
Every single time you accept an object as a method parameter, you need to use the Guard Pattern to prevent your object from being placed in a bad state where it can't do what it is supposed to do. Fail fast and tell the user exactly what they did wrong and what they need to do to fix it. In fact, if a nil reference sneaks in, you'll eventually get an access violation when you try to use this nil reference, right? Sure, it’s work, but it is time well spent.  Knowing that your references are always valid makes for easier code, and actually can reduce the amount of nil checking that you have to do.  Who wants to check for nil every time you use an object?

Don’t pass nil references.  Don’t accept nil references.  This seems obvious to me and I confess I don’t understand objections to this aphorism that only results in cleaner code.   Why would you ever want to accept a nil object?  Why would you want your code in a state that is begging for an access violation to occur?  Insist that your objects are valid, and never impose invalid objects – nil – on others.  Seems blatantly obvious to me.

So I am going to guess that this will not make some of you happy.  So here is my challenge:  Show me code that you have written where nil is acceptable.  Don’t show me code that calls the Win32 API or the VCL, show me code *you have yourself written* where nil is acceptable and useful as a valid method parameter.  I’d love to see it – and then point out the problems that it will cause.  :-)