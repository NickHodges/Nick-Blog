---
author: Nick Hodges
publishDate: 2011-05-03
title: Fun With Testing DateUtils.pas #6
postSlug: fun-with-testing-dateutils-pas-6
featured: false
tags:
  - delphi
description: "Okay, so when we last left off, IncMillisecond was still failing in certain circumstances. Let’s take a look at that."
---

Okay, so when we last left off, IncMillisecond was still failing in certain circumstances.  Let’s take a look at that.  Note, too, that I have this crazy notion that if you have a function called IncMillisecond, then it should be able to, you know, increment a millisecond.  

Here is the IncMilliseconds that you very likely have on your computer:

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
Now that probably works just fine for you — as long as you don’t have a date that has a value less than the epoch. Below the epoch, and particularly in that magic "48 Hours" area right around the epoch itself, things go horribly awry. As we saw last time, this test will fail:

```delphi
TestDate := 0.0;
  TestResult := IncMillisecond(TestDate, -1);
  Expected := EncodeDateTime(1899, 12, 29, 23, 59, 59, 999);
  CheckTrue(SameDateTime(Expected, TestResult), 'IncMillisecond failed
    to subtract 1ms across the epoch');
```
It fails because of a number of reasons actually. The first is precision. The current implementation of IncMillisecond does division using a very small number in the denominator.  In the case of this test the numerator is a really big number multiplied by a really small number.  All of this cries out “precision error!”. (You should thank me – I almost used the  tag there.  Phew!)  And that is basically what happens.  IncMillisecond isn’t precise enough to “see” the difference.

Plus, if you do things around the value of zero, it gets really weird.  For instance, check out the output of this console application:

```delphi
program IncMillisecondTest;

{$APPTYPE CONSOLE}

uses
  SysUtils, DateUtils;

var
  TestDate: TDateTime;
  TestResult: TDateTime;
  DateStr: string;

begin
  TestDate := 0.0;
  TestResult := IncMilliSecond(TestDate, 1001);
  DateStr := FormatDateTime('dd mmmm, yyyy hh:mm:ss:zzz',  TestResult);
  WriteLn(DateStr);
  TestResult := IncMilliSecond(TestDate, -1001);
  DateStr := FormatDateTime('dd mmmm, yyyy hh:mm:ss:zzz',  TestResult);
  WriteLn(DateStr);
  ReadLn;
end.
```
I think it is safe to say that something is amiss.

So finally, it is time to rework IncMillisecond, because this pesky little routine is actually at the heart of a bunch of issues with DateUtils.pas. As it will turn out, if you call any of the IncXXXX routines, it all ends up as a call to IncMilliseconds, so this needs to be right.

Okay, so I started out writing this really cool implementation that checked for before and after the epoch, and divided large increments into years and months and days to make sure that their was no loss of precision.  I spent a lot of time on it, and had  whole bunch of tests written and passing with it.   But then it suddenly occurs to me that the trusty TTimeStamp data type and its accompanying conversion routines can once again come to the rescue:

```delphi
function IncMilliSecond(const AValue: TDateTime;
  const ANumberOfMilliSeconds: Int64 = 1): TDateTime;
var
  TS: TTimeStamp;
  TempTime: Comp;
begin
  TS := DateTimeToTimeStamp(AValue);
  TempTime := TimeStampToMSecs(TS);
  TempTime := TempTime + ANumberOfMilliSeconds;
  TS := MSecsToTimeStamp(TempTime);
  Result := TimeStampToDateTime(TS);
end;
```
And here is the cool thing:  I was able to change from my sweet but overly complicated version to the new version above without worrying too much about it, because when I made the switch – all of the tests that I had written for my original version still passed.  This was so cool – I could make the change with confidence because of the large set of tests that I had that exercised all aspects on IncMillisecond.

Anywhow….  Again, the TTimeStamp type is precise, and easy. No need to do direct arithmetic on the TDateTime itself. Instead, we can deal with integers and get the exact answer every time no matter how many milliseconds you pass in. You can pass in 5000 years worth of milliseconds, and all will be well. For instance, this test passes just fine.

```delphi
TestDate := EncodeDate(2010, 4, 8);
MSecsToAdd := Int64(5000) * DaysPerYear[False] * HoursPerDay * MinsPerHour *
    SecsPerMin *  MSecsPerSec; // 1.5768E14 or 157680000000000
TestResult := IncMilliSecond(TestDate, MSecsToAdd);
Expected := EncodeDate(7010, 4, 8);
ExtraLeapDays := LeapDaysBetweenDates(TestDate, Expected);
Expected := IncDay(Expected, -ExtraLeapDays);
CheckTrue(SameDate(Expected, TestResult), 'IncMillisecond failed to
   add 5000 years worth of milliseconds.');
```
And for you curious folks, here the implementation for the helper function LeapDaysBetweenDates:

```delphi
function TDateUtilsTests.LeapDaysBetweenDates(aStartDate,
       aEndDate: TDateTime): Word;
var
  TempYear: Integer;
begin
  if aStartDate > aEndDate then
    raise Exception.Create('StartDate must be before EndDate.');
  Result := 0;
  for TempYear := YearOf(aStartDate) to YearOf(aEndDate) do
  begin
    if IsLeapYear(TempYear) then
      Inc(Result);
  end;
  if IsInLeapYear(aStartDate) and
     (aStartDate > EncodeDate(YearOf(aStartDate), 2, 29)) then
    Dec(Result);
  if IsInLeapYear(aEndDate) and
     (aEndDate < EncodeDate(YearOf(aEndDate), 2, 29)) then
    Dec(Result);
end;
```
From there, the rest of the IncXXXXX routines are simple –- they merely multiply by the next “level up” of time intervals, and call the previous one.  I’ve marked them all inline so that it all happens in one need function call.  Thus, we have:

```delphi
function IncHour(const AValue: TDateTime;
  const ANumberOfHours: Int64 = 1): TDateTime;
begin
  Result := IncMinute(AValue, ANumberOfHours * MinsPerHour);
end;

function IncMinute(const AValue: TDateTime;
  const ANumberOfMinutes: Int64 = 1): TDateTime;
begin
  Result := IncSecond(AValue, ANumberOfMinutes * MinsPerHour);
end;

function IncSecond(const AValue: TDateTime;
  const ANumberOfSeconds: Int64 = 1): TDateTime;
begin
  Result := IncMilliSecond(Avalue, ANumberOfSeconds * MSecsPerSec);
end;
```

One thing to note: DateUtils.pas will only handle years from 1 to 9999. TDateTime won’t handle any date less than midnight on January 1, 0001 nor a date larger than December 31, 9999. So if you are using Delphi to track specific dates in dates before that (or if you plan on doing some time travel into the far future) you’ll have to use some other data type to keep track of dates.

Now, once you’ve done the above, it is tempting to say “Hey, for IncDay, I’ll just add the days to the value passed in.  I mean, that’s all you are really doing.  Well guess what!  You can’t do that!  If you have this for your IncDay:

```delphi
function IncDay(const AValue: TDateTime;
  const ANumberOfDays: Integer = 1): TDateTime;
begin
  Result := AValue + ANumberOfDays;
end;
```

Then this test will not pass because of the strange “48 hour” deal we talked about last post:

```delphi
TestDate := EncodeDateTime(1899, 12, 30, 1, 43, 28, 400);
  TestResult := IncDay(TestDate, -1);
  Expected := EncodeDateTime(1899, 12, 29, 1, 43, 28, 400);
  CheckTrue(SameDate(Expected, TestResult), 'IncDay failed to
    decrement one day from the epoch');
```

Instead, you have to send it all the way back to milliseconds via IncHour, IncMinute, and IncSecond:

```delphi
function IncDay(const AValue: TDateTime;
  const ANumberOfDays: Integer = 1): TDateTime;
begin
  Result := IncHour(AValue, ANumberOfDays * HoursPerDay);
end;
```

Once you put those changes in, well, things get a lot greener.  I have now written a very thorough set of unit test  for testing all of the IncXXXX routines, adding and subtracting dates for both before and after the epoch.  I also test very carefully incrementing and decrementing across the epoch and inside that crazy little 48 hour spot.  They are all passing.

I’ll create a unit with these new fixes in it that you can use if you want.  I’ll also publish the unit that includes these tests that I’ve written.  (When you look at it, be nice.  It’s not very pretty, but it gets the job done.)  As I continue through, I’ll update that file with any other fixes and changes that get made.