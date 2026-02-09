---
author: Nick Hodges
publishDate: 2011-02-27
title: Fun With Testing DateUtils.pas #1
postSlug: fun-with-testing-dateutils-pas-1
featured: false
tags:
  - uncategorized
description: 'Note: This is a "reprint" of content from my blog on Embarcadero.com when I was working there.'
---

***Note: **This is a "reprint" of content from my blog on Embarcadero.com when I was working there.  They've since shut down my blog and the content is gone.  I'm republishing it here.  See the [main article](http://www.codingindelphi.com/blog/page/My-Embarcadero-Blog-Content) for more information.*

Okay, so I’m a Development Manager. My job is to see to the health, welfare, productivity, effectiveness, and proper tasking of a big chunk of the RAD Studio development team. I share these duties with the excellent and capable Mike Devery.  I mainly manage the guys that work on the IDE, the RTL, and the frameworks.  I do things like make sure they are working on the right thing via our SCRUM interations, that they have good machines, nice chairs, vacations when they want them, the right keyboard, etc.  I manage the development process in that we on the “War Team” spend a lot of time triaging bugs, managing and defining requirements, tracking progress, finding better ways to write better code – you know, development manager stuff.

But, like all good development managers, my heart really is in coding.  And I don’t do much of that anymore.  So I’ve tried to keep my fingers in things by taking on some small development tasks where I can keep my skills up, stimulate my brain in that way, and not cause too much damage. 

What better way to do that than to write unit tests?  I’m a bit weird in that I actually like to write unit tests. I find them challenging and enjoy the “puzzle solving” aspect of it.  I like to try to find corner and edge cases where the tests might fail.  I like knowing that ever test I write means less work down the road because any regressions will be found sooner – hopefully immediately.  And I can write tests to my hearts content without worrying about breaking the product.   

So I started in on DateUtils.pas.  This is a pretty cool unit with a lot of good functionality, and it’s ripe for expanding on our unit tests.  It was written a while ago, and its unit test coverage wasn’t where it should be.  So in my “spare time” (hehe….) I’ve been writing unit tests for the routines in that unit.  It’s been pretty fun, and I think, too, that it’s been illustrative of how beneficial unit testing can be.  So I thought I’d write a series of blog posts about it, and this is the first one. 

So, one of the first things I realized was that I needed to be able to generate dates.  Now, I realized that you don’t want that many non-deterministic tests (or maybe you don’t want any at all – it depends).  But I need to be sure that many of the DateUtils.pas routines can pass with any date.  So I wrote the following routine to generate a legitimate but random date:

```delphi
/// 
///   This creates a random, valid date from year 1 to aYearRange
/// 
function CreateRandomDate(aMakeItLeapYear: Boolean = False; 
        aYearRange: Word = 2500): TDateTime;
var
  AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond: Word;
begin
  AYear := Random(aYearRange) + 1;
  if (not IsLeapYear(AYear)) and (aMakeItLeapYear) then
  begin
    repeat
      Inc(AYear);
    until IsLeapYear(AYear);
  end;
  AMonth := Random(MonthsPerYear) + 1;
  if IsLeapYear(AYear) and (AMonth = 2) then
  begin
    ADay := Random(29) + 1;
  end else begin
    ADay := Random(28) + 1;
  end;
  AHour := Random(HoursPerDay) - 1;
  AMinute := Random(MinsPerHour) - 1;
  ASecond := Random(SecsPerMin) - 1;
  AMilliSecond := Random(MSecsPerSec);
  Result := EncodeDateTime(AYear, AMonth, ADay, AHour, 
                 AMinute, ASecond, AMilliSecond);
end;
```

Now I’ll bet that you guys can come up with a better algorithm, but this works just fine for testing purposes and is pretty clear in what it does.  I use it to test, say, 1000 random dates against a routine that takes a Date as a parameter.  (By the way, it uses some constants from SysUtils and from DateUtils.)  I mix that in with tests that used constant dates every time.  I debated whether to do the random date thing (if a test fails, you can’t necessarily reproduce it), but I decided in favor of it because I’ll make sure all the tests clearly report the date that was failing, and because I wanted to test to make sure that any date would be handled correctly, and you simply can’t do that with a limited, fixed set of dates.  Constantly running a large set of random dates is as close as you can come to testing “every” date.

Another thing that I knew I’d need was to generate to do date testing is valid “Leap Days’”, that is, a valid February 29 date.  When you unit test, you are constantly looking for corner cases, and Leap Days are a corner case for dates.  Naturally, I’ll utilize CreateRandomDate to help out:

```delphi
function GetRandomLeapDay: TDate;
begin
  Result := DateOf(CreateRandomDate(True));
  Result := RecodeDate(Result, YearOf(Result), 2, 29);
end;
```

So, now I can generate random dates, and easily create corner case LeapDays. I’ll probably also eventually add a GenerateRandomTime routine as well. That’s it for now – next time I’ll talk about the basics of how I got tests up and running. By the way, I am using DUnit.  We use DUnit extensively internally.