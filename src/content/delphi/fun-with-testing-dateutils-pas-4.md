---
author: Nick Hodges
publishDate: 2011-04-26
title: Fun With Testing DateUtils.pas #4
postSlug: fun-with-testing-dateutils-pas-4
featured: false
tags:
  - uncategorized
description: 'Note: This is a "reprint" of content from my blog on Embarcadero.com when I was working there.'
---

***Note: **This is a "reprint" of content from my blog on Embarcadero.com when I was working there.  They've since shut down my blog and the content is gone.  I'm republishing it here.  See the [main article](http://www.codingindelphi.com/blog/page/My-Embarcadero-Blog-Content) for more information.*

First, an admin note:  I’ve adjusted the color of strings in my code.   I was optimizing the colors for reading on my blog proper as opposed to the main site (hadn’t even thought of it, actually, sorry.), and someone pointed out that the colors weren’t working on the main site at all.  Hope that this post is better.  I changed the last post from Yellow to Lime.  If you have a better color suggestion, please let me know.  I’ve also endeavored to wrap those long code lines. The code won’t compile as shown, but I trust that you guys can figure it out……

Okay back to the topic at hand.

So things are rolling along.  I’ve been writing tons of tests, they are all passing, things are going well, and it’s been fun. But if you have any flair for the dramatic, you can see where this is going….

So there I was rolling along, writing tests for WeeksInAYear (bet you didn’t know that according to ISO 8601, some years have 53 weeks in them, did you.  1981 has 53 weeks, for example) Today, Yesterday – you know, normal stuff.  I’m checking edge conditions, standard conditions, all kinds of years, every year.  You know, really exercising things.  All was rolling along smoothly.

For instance, here are the tests for Yesterday.  Not too hard to test, as there is really only one thing you can do:

```delphi
procedure TDateUtilsTests.Test_Yesterday;
var
  TestResult: TDateTime;
  Expected  : TDateTime;
begin
  TestResult := Yesterday;
  Expected   := IncDay(DateOf(Now), -1);
  CheckEquals(TestResult, Expected, 'The Yesterday function failed to' +
    'return the correct value.');

  TestResult := Yesterday;
  Expected   := DateOf(Now);
  CheckFalse(SameDate(TestResult, Expected), 'The Yesterday function' + 
  'thinks Yesterday is Today, and means that Einstein was totally wrong.');

end;

```
Just a couple of tests that you can do – or at least what I can think of.  (Anyone have any other ideas?)  The fun part is that these tests will fail if IncDayand DateOf fail to perform as advertised, we get triple the testing!  Sweet!

Things were going along swimmingly, and then all of a sudden, out of left field, all this unit testing stuff suddenly proved to be as valuable as everyone says it is.

Here’s how it happened: I was going along, writing tests, and I wrote this one:

```delphi
procedure TDateUtilsTests.Test_EndOfTheDay;
var
  TestDate  : TDateTime;
  TestResult: TDateTime;
  i         : Integer;
  Expected  : TDateTime;
begin
  for i        := 1 to 500 do
  begin
    TestDate   := CreateRandomDate(False, 100, 2500);

    TestResult := EndOfTheDay(TestDate);
    // First, don't change the date
    CheckEquals(DayOf(TestDate), DayOf(TestResult), Format('EndOfTheDay changed'
      + ' the day for test date: %s (Result was: %s)', [DateTimeToStr(TestDate),
      DateTimeToStr(TestResult)]));

    // Next, is it really midnight?
    Expected := DateOf(TestDate);
    Expected := IncMillisecond(Expected, -1);
    Expected := IncDay(Expected);
    CheckTrue(SameDateTime(TestResult, Expected), Format('EndOfTheDay didn''t'
      + ' return midnight for test date: %s (Result was: %s, Expected was: %s)',
      [DateTimeToStr(DateOf(TestDate)), DateTimeToStr(TestResult),
       DateTimeToStr(Expected)]));

  end;
end;

```
Pretty simple and straightforward.  But — BOOM – this thing fails. Badly.  If you run this test on your computer, the second check, the call to CheckTrue, will pretty quickly fail and you’ll get a message something like:

```
Test_StartEndOfTheDay: ETestFailure at  $0051FF06 EndOfTheDay 
didn’t return midnight for test date: 5/12/0366 (Result was: 
5/12/0366 11:59:59 PM, Expected was: 5/14/0366 11:59:59 PM), 
expected:  but was: 
```
Since the test is creating random dates, you’ll never get the exact same error, but pretty soon I figured out that it only failed for dates before the epoch – that is, for dates that have a negative value and are thus earlier than 30 December 1899.

Naturally, I was left scratching my head.  The first inclination is that the test is somehow not correct. But I stared at it for a good long while and came to the conclusion that the test wasn’t the problem.

The first check is fine – the call to EndOfTheDay doesn’t actually change the date as it shouldn’t.  But the second test is where the trouble started.

EndOfTheDay is a pretty simple function;  it returns the very last millisecond of the date for the date/time combination passed to it – that is, 11:59.999pm for the day in question. It is implemented like so:

```delphi
// From DateUtils.pas
function EndOfTheDay(const AValue: TDateTime): TDateTime;
begin
  Result := RecodeTime(AValue, 23, 59, 59, 999);
end;

```
So the natural thing is to actually check to see if the result is indeed that value.  So, I did the natural thing:  I set the expected date to midnight on the date of the value to be tested, decremented one millisecond, and since that changed the date back one day, I moved it forward again with IncDay.  Then I checked to see if they were indeed the same date/time combination.  Well, guess what.  They weren’t.

I originally had a single line of code combining the three that set the value for Expected.  A quick look at the debugger told me that the Expected result wasn’t getting properly calculated.  Breaking it down quickly pointed to a strange phenomenon:  for dates before the epoch, the IncMillisecond call was actually moving the date portion forward  by two days if the date was before the epoch.  (Mysteriously, dates after epoch all worked fine.  Weird.)  That, of course, is a big bad bug.

And this is the part where using the library itself to test other parts of the library is helpful.  Because I used IncMillisecond in my test forEndOfTheDay, I found a bug in IncMillisecond. If I hadn’t done so, the problem might have been left lurking for a while longer.  Or maybe it never would have revealed itself, depending on how diligent my testing of it ended up once I actually got there.

Luckily, it would appear that not too many of you are manipulating milliseconds for dates before the epoch, because there hasn’t been a big hue and cry about this problem. There have been some QC reports about it, though.  But clearly something is dreadfully wrong here.

In the next post, we’ll take a look at just what that is.