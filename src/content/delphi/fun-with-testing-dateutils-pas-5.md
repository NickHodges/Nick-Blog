---
author: Nick Hodges
publishDate: 2011-05-03
title: Fun With Testing DateUtils.pas #5
postSlug: fun-with-testing-dateutils-pas-5
featured: false
tags:
  - delphi
description: 'Note: This is a "reprint" of content from my blog on Embarcadero.com when I was working there.'
---

***Note: **This is a "reprint" of content from my blog on Embarcadero.com when I was working there.  They've since shut down my blog and the content is gone.  I'm republishing it here.  See the [main article](http://www.codingindelphi.com/blog/page/My-Embarcadero-Blog-Content) for more information.*

Okay, so when I left you hanging in the last post, I promised I’d explain what was up with IncMillisecond.  But before I do that, I have to explain a bunch of stuff about TDateTime. And as it turns out, we’ll have to take a detour, and we won’t exactly get to IncMillisecond this time around. 

Most of you probably know how TDateTime works.  TDateTime is a Double that keeps track of minutes in the “front” of the decimal and seconds in the fraction, or the “back”.  The key thing to know is the value of the “epoch” that I mentioned previously.  For TDateTime, the epoch is 0.0, which corresponds to exactly 00:00:00.000 (midnight) on December 30, 1899. (For can read up on all the gory details about why it is December 30, 1899, and not December 31, 1899) 

What this means is that a date time of 2.0 is January 1, 1900 at midnight.  2.5 would be noon on January 1, 1900.  1000.25 would be one thousand days and six hours past December 30, 1899, or September 26, 1903 at 6:00:00 AM.  It also means that –1 is December 29, 1899.  and –1000.25 is Sunday, April 4, 1898 at 6:00:00 AM. 

Now, that last one was a bit tricky if you look carefully at it.  The days part was negative (-1000) but the hours part was not.  Remember, the left part of the double is the number of days before the epoch, but the decimal part – the part to the right, if you will – is always a positive value starting at midnight of the day in question.   I emphasized that last part pretty strongly because once a date goes negative, a counter intuitive thing happens.  The negative part only really applies to the left portion of the value.  The decimal value represents a positive value from midnight.  So to do the last calculation above, I actually had to subtract 999 days and 18 hours to get the right answer.  And there in lies the heart of the problem that we have run into with incrementing milliseconds (and seconds and minutes and hours, as it turns out) for days before the epoch. 

Here’s another way to think about it:  what is the date time value for –0.5?  Well, the correct answer is noon on 29 December 1899.  But look at the left part of the value – it is still zero, which is, of course, 30 December 1899!  And what if you make the call Frac(-0.5) to that value?  You get – ready for it? — -0.5!  And I just got done telling you that you can’t have a “negative” time value.  Time values always are positive values from midnight.  And herein lies our problem. 

Another interesting note:  In the particular world of TDateTime, 0 has an unusual “feature”.  When viewed as the “left” side of a TDateTime, it actually represents a span of time just a hair less than 48 hours.  According to the pure mathematical formula for managing dates and times in Delphi, December 30, 1899 actually has 48 hours.  That is, it stretches from –0.999… to 0.999…. in time.  This is weird, huh?  Never really thought about that, did you?  Well, the whole Date/Time system has to account for this little anomaly. 

So, we have two related issues here:  Time values for negative TDateTime values are really positive, and this weird 48 hour day thing right at the epoch.  Well, frankly I didn’t think about or know about either one when I started out writing my unit tests (until they revealed this issue to me.  Unit testing rocks…) and I am very sad to say that the original author of DateUtils.pas didn’t either.  Both of these errors manifest themselves when calculating times at and before the epoch.  That’s the bad part.    And I know all of this because of unit testing.  That’s the good part. 

But wait, there is more.  As it turns out, all of the time calculations in DateUtils.pas are based on floating point values.  Very, very small floating point values, in fact.  For instance, take a look at the current implementation of IncMillisecond:

```delphi
function IncMilliSecond(const AValue: TDateTime;
  const ANumberOfMilliSeconds: Int64): TDateTime;
begin
  if AValue > 0 then
    Result := ((AValue * MSecsPerDay) + ANumberOfMilliSeconds) / MSecsPerDay
  else
    Result := ((AValue * MSecsPerDay) - ANumberOfMilliSeconds) / MSecsPerDay;
end;
```

The value for MSecsPerDay is pretty large — 86,400,000 – and when you start dividing small numbers by really big numbers you get even smaller numbers –numbers so small that they lose precision.  Now, you can see that our developer at least recognized that something  was going a little goofy with the dates before zero, but the current implementation has the error we are currently looking at.  Alas.

Or even better, go to SysUtils.pas and take a look at TryEncodeTime, which really does some arithmetic fraught with the possibilities for errors and inaccuracies:

```delphi
function TryEncodeTime(Hour, Min, Sec, MSec: Word; out Time: TDateTime): Boolean;
begin
  Result := False;
  if (Hour < HoursPerDay) and (Min < MinsPerHour)
    and (Sec < SecsPerMin) and (MSec < MSecsPerSec) then
  begin
    Time := (Hour * (MinsPerHour * SecsPerMin * MSecsPerSec) +
             Min * (SecsPerMin * MSecsPerSec) +
             Sec * MSecsPerSec +
             MSec) / MSecsPerDay;
    Result := True;
  end;
end;
```

That will create some seriously small values, won’t it, given data near midnight on either side?  I’ve subsequently reworked this routine to be more precise.  (I’ll post all this new code for your real soon now.)

Okay, so where to turn in all of this?  The first thing I did was to rewrite IncMilliseconds.  But as you’ll see, even this was really, really tricky and fraught with peril as well.

Okay, so I thought – I’m doing all this test driven development; what I need to do right now is to write some test cases that I know should pass before I even start.  First, I thought that if you have a function called IncMillisecond, then it ought to at least have enough accuracy and precision to at the very least create a different date/time combination, right?

```delphi
TestDate := 0.0;
TestResult := IncMillisecond(TestDate);
CheckFalse(SameDateTime(TestDate, TestResult), 'IncMilliseocnd failed to
     change the given date');
```

And of course, this fails.  Good – I expected it to. But after a few hours of writing code, and wondering why it keeps failing, I suddenly realize thatSameDateTime is the problem here!  Argh!

And then it hits me – Uh oh.  I’ve started pulling on a thread, and if I keep pulling on it, it is going to keep unraveling and unraveling….  And that is exactly what happened.

Checkout your SameDateTime:

```delphi
function SameDateTime(const A, B: TDateTime): Boolean;
begin
  Result := Abs(A - B) < OneMillisecond;
end;
```

Now, that looks all well and good. Take the absolute value of the difference, and as long as it is less than 1ms, then the times are effectively the same.OneMillisecond is defined as: OneMillisecond = 1 / MSecsPerDay, or 1.15740741 × 10-8. And in the world of computers, that is a pretty small number. So small, in fact, that it is pretty easy to have small values not register. In our simple test here, the A value is 0, and the B value -1.1574074074e-08. And guess what, that difference is not quite enough to get SameDateTime to return False. It returns True instead.

So, let’s follow this loose thread a bit more, and then we’ll quit for today. We need a SameDateTime function (and, as it turns out, a SameTime function) that returns a correct answer for dates that actually are OneMillisecond apart. We need something that gives answers based on real number so of milliseconds.  And SysUtils.pas has the answer:  TTimeStamp

TTimeStamp is declared as follows:

```delphi
{ Date and time record }
  TTimeStamp = record
    Time: Integer;      { Number of milliseconds since midnight }
    Date: Integer;      { One plus number of days since 1/1/0001 }
  end;
```

Now, that is more like it — integers and not these fuzzy floating point numbers! The accompanying DateTimeToTimeStamp function is exactly what we need. Now, we can write a very precise SameDateTime and SameDate functions:

```delphi
function SameDateTime(const A, B: TDateTime): Boolean;
var
  TSA, TSB: TTimeStamp;
begin
  TSA := DateTimeToTimeStamp(A);
  TSB := DateTimeToTimeStamp(B);
  Result := (TSA.Date = TSB.Date) and (TSA.Time = TSB.Time);
end;

function SameTime(const A, B: TDateTime): Boolean;
begin
  Result := (DateTimeToTimeStamp(A).Time = DateTimeToTimeStamp(B).Time);
end;
```

Those two new implementations will, in fact, return correct results for two dates one millisecond apart.  And let’s just say that TTimeStamp is going to be making more appearances in the new, updated DateUtils.pas in the future.

Okay, so our original, simple test above passes now. But guess what: this second one still doesn’t:

```delphi
TestDate := 0.0;
  TestResult := IncMillisecond(TestDate, -1);
  CheckFalse(SameDateTime(TestDate, TestResult), 'IncMilliseocnd failed
    to change the given date');
  Expected := EncodeDateTime(1899, 12, 29, 23, 59, 59, 999);
  CheckTrue(SameDateTime(Expected, TestResult), 'IncMillisecond failed
    to subtract 1ms across the epoch');
```

So next time, we’ll get cracking on that.