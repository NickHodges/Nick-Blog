---
author: Nick Hodges
publishDate: 2011-04-26
title: Fun With Testing DateUtils.pas #3
postSlug: fun-with-testing-dateutils-pas-3
featured: false
tags:
  - uncategorized
description: 'Note: This is a "reprint" of content from my blog on Embarcadero.com when I was working there.'
---

***Note: **This is a "reprint" of content from my blog on Embarcadero.com when I was working there.  They've since shut down my blog and the content is gone.  I'm republishing it here.  See the [main article](http://www.codingindelphi.com/blog/page/My-Embarcadero-Blog-Content) for more information.*

Okay, things have settled down again, and it is time to get back to my adventure in TDateTime and DateUtils.pas.

When we last left off, I had started at the top of DateUtils, and just started working my way down.  I had written some tests for DateOf and TimeOf, and tried to write tests that pretty thoroughly exercised those functions.  I tried to hit the edges and boundaries, and to test all the different permutations and combinations of a date only, a time only, and both together. 

From there, I worked my way down the list, writing tests for IsLeapYear, IsPM, etc. 

One thing I did was to add IsAM to DateUtils.pas and simply implemented it as:

```delphi
function IsAM(const AValue: TDateTime): Boolean;
begin
  Result := not IsPM(AValue);
end;

```
Now, that is really simple.  Shoot, you don’t really need to write tests for that, right?  I mean, I wrote a whole suite of tests for IsPM, and so how could IsAMgo wrong? Well, any number of ways – but the main one is that some day in the future, someone might come along and try to get cute or super-smart or something and change the implementation.  So I went ahead and wrote a whole bunch of tests for IsAM anyway.  Now, if something changes, or if someone changes something, the tests should be able to recognize that. 

Philosophical Note: As I’m doing this, I’m seeing more clearly than ever that writing tests is all about confidence moving forward.  Once you have taken the effort to write thorough, complete suites of unit tests, you can move forward with confidence.  You can make changes and fixes while feeling confident that if your change has unintended consequences, you’ll likely know about it. If you do find a bug, you write a test that “reveals” it, fix the bug so the test passes, and then you can move forward confident that you’ll know right away if that bug comes back to haunt you.  Confidence is a really good thing when it comes to writing code.

So, for instance, let’s look at the tests for IsInLeapYear.  Leap years are a bit funky.  Some years that you think are leap years are not – Quick:  Was 1600 a leap year?  What about 1900?  Wikipedia actually has a good page on leap years.  (Did you know that leap years are also called “intercalary years”? I sure didn’t.)  The actual calculation of a leap year is a bit more complicated that “Is it divisible by 4?”. 

```delphi
function IsLeapYear(Year: Word): Boolean;
begin
  Result := (Year mod 4 = 0) and ((Year mod 100 <> 0) or (Year mod 400 = 0));
end;

```
Examine the code, you can see that the answer to the questions above are Yes and No.  (As a side note, our QA Manager is a “Leapling”, born on February 29th.  He’s really only 12 years old.)  So, how do you test something called IsInLeapYear?  The declaration is actually quite simple:

```delphi
function IsInLeapYear(const AValue: TDateTime): Boolean;
begin
  Result := IsLeapYear(YearOf(AValue));
end;

```
But just because it is simple doesn’t mean that you shouldn’t thoroughly test it!  So I wrote a whole bunch of tests. First, I checked that random dates in years I know are leap years were properly identified as being in a leap year:

```delphi
  TestDate   := EncodeDate(1960, 2, 29);
  TestResult := IsInLeapYear(TestDate);
  CheckTrue(TestResult, Format('%s is in a leap year, but IsInLeapYear'
    + ' says that it isn''t.  Test #1', [DateToStr(TestDate)]));

  TestDate   := EncodeDate(2000, 7, 31);
  TestResult := IsInLeapYear(TestDate);
  CheckTrue(TestResult, Format('%s is in a leap year, but IsInLeapYear'
    +' says that it isn''t.  Test #2', [DateToStr(TestDate)]));

  TestDate   := EncodeDate(1600, 7, 31);
  TestResult := IsInLeapYear(TestDate);
  CheckTrue(TestResult, Format('%s is in a leap year, but IsInLeapYear'
  + ' says that it isn''t.  Test #4', [DateToStr(TestDate)]));

  TestDate   := EncodeDate(1972, 4, 5);
  TestResult := IsInLeapYear(TestDate);
  CheckTrue(TestResult, Format('%s is in a leap year, but IsInLeapYear'
    +' says that it isn''t.  Test #5', [DateToStr(TestDate)]));

  TestDate   := EncodeDate(1888, 2, 29);
  TestResult := IsInLeapYear(TestDate);
  CheckTrue(TestResult, Format('%s is in a leap year, but IsInLeapYear'
    + ' says that it isn''t.  Test #7', [DateToStr(TestDate)]));

  TestDate   := EncodeDate(2400, 2, 29);
  TestResult := IsInLeapYear(TestDate);
  CheckTrue(TestResult, Format('%s is in a leap year, but IsInLeapYear'
    + ' says that it isn''t.  Test #8', [DateToStr(TestDate)]));

```
Note that I checked "normal" dates, but also dates in the far future (including the tricky 2400) as well as dates before the epoch (which is December 30, 1899, or a datetime value of 0.0). I’ll talk a little more about the epoch in a future post because the epoch is really, really important to TDateTime. It is also really, really troublesome.   

Another thing to note is that this code uses (and thus tests) EncodeDate. And IsInLeapYear itself will exercise YearOf and IsLeapYear indirectly.  If a test in IsInLeapYear fails indirectly because of one of these, you’ll be able to figure that out pretty quickly, write tests specifically to reveal those problems, fix the problems, and then move forward with confidence that you’ve resolved the issues.

Anyway, I also wrote some negative test cases, checking to see that it returned False for dates that most definitely were not in leap years.   I also wrote tests for dates in years that many folks might thing are leap years but are in fact not leap years:

```delphi
  // Years that end in 00 are /not/ leap years, unless divisible by 400
  TestDate   := EncodeDate(1700, 2, 28);
  TestResult := IsInLeapYear(TestDate);
  CheckFalse(TestResult, Format('%s is in a leap year, but IsInLeapYear says
    that it isn''t.  Test #6', [DateToStr(TestDate)]));

  TestDate   := EncodeDate(1900, 2, 28);
  TestResult := IsInLeapYear(TestDate);
  CheckFalse(TestResult, Format('%s is in a leap year, but IsInLeapYear says
    that it isn''t.  Test #7', [DateToStr(TestDate)]));
```
Now that might seem like overkill for a simple function like IsInLeapYear, but I don’t think so. I am now really confident that, since we will be running these tests almost continuously on our Hudson server, no one can mess or alter or change or otherwise break the way leap years are calculated without us knowing about it immediately. And that’s sort of the whole point, right?