---
author: Nick Hodges
publishDate: 2011-05-03
title: Fun With Testing DateUtils.pas #8
postSlug: fun-with-testing-dateutils-pas-8
featured: false
tags:
  - uncategorized
description: 'Note: This is a "reprint" of content from my blog on Embarcadero.com when I was working there.'
---

***Note: **This is a "reprint" of content from my blog on Embarcadero.com when I was working there.  They've since shut down my blog and the content is gone.  I'm republishing it here.  See the [main article](http://www.codingindelphi.com/blog/page/My-Embarcadero-Blog-Content) for more information.*

Okay, first up:  [I’ve put the tests and updates for DateUtils.pas on CodeCentra](http://cc.embarcadero.com/item/27675)l. 

So far, I’ve been writing tests in a pretty organized way.  But I write each individual test, one at a time.  I often end up writing a lot of “piece-meal” tests by hand.  I end up with a lot of code that looks like this:

```delphi
procedure TDateUtilsTests.Test_IncMinuteBeforeEpochAdding;
var
  TestDate, Expected, TestResult: TDateTime;
begin
  TestDate   := EncodeDateTime(945, 12, 7, 13, 34, 26, 765);

  TestResult := IncMinute(TestDate, 1);
  Expected   := EncodeDateTime(945, 12, 7, 13, 35, 26, 765);
  CheckTrue(SameDateTime(TestResult, Expected), Format('IncMinute couldn''t add
     a single minute to %s ', [DateTimeToStr(TestDate)]));

  TestResult := IncMinute(TestDate, 45);
  Expected   := EncodeDateTime(945, 12, 7, 14, 19, 26, 765);
  CheckTrue(SameDateTime(TestResult, Expected), Format('IncMinute couldn''t add
     45 minutes to %s ', [DateTimeToStr(TestDate)]));

  TestResult := IncMinute(TestDate, MinsPerDay);
  Expected   := EncodeDateTime(945, 12, 8, 13, 34, 26, 765);
  CheckTrue(SameDateTime(TestResult, Expected), Format('IncMinute couldn''t add
     a days worth of minutes to %s ', [DateTimeToStr(TestDate)]));
end;
```
Now those tests are fine, but they aren’t very easy to write. Adding another one either takes a lot of typing, or runs the risk of cut-n-paste errors that slow things down.  Wouldn’t it be cool if there were a more systematic way of running tests that made it easier to add a specific test?

Well, one of our R&D guys did that for the DateUtils.pas unit.  Denis Totoliciu works on the RTL as part of our Romanian team.   Now Denis is a pretty smart guy and a big proponent of test driven development.  He has been busy writing tests for DateUtils.pas as well, and he’s a lot more efficiency minded than I am.  As a result, he’s also a lot more productive and prolific. This is why I am the manager and he is the developer.   

If you look at the code for the unit tests, you can probably see where he has written tests and where I have (though I’ll be taking up Denis’s method for future tests).  He recognized that most tests for any given DateUtils.pas routine are all going to be pretty similar, so he created a system whereby you create a large array of data, and then iterate over that array and run the tests on the data in each element. This way, if you want to add tests, you can simply add an item to the data array with the input and expected output. 

For instance, when he first did this, I noticed that he didn’t always add data to test dates before the epoch.  Since I’ve learned the hard way that whenever you test a routine you should also test dates before the epoch as well as after, it was really easy for me to simply add the data to the array and expand the number of tests that were run. 

Here’s how this looks:

```delphi
procedure TDateUtilsTests.Test_DayOfTheMonth;
const
  CMax = 16;

type

  TDateRec = record
    Year, Month, Day: Word;
    ExpectedDay: Word;
  end;
  TDates = array [1..CMax] of TDateRec;

const
  CDates: TDates = (
    (Year: 2004; Month: 01; Day: 01; ExpectedDay: 01),  // 1
    (Year: 2004; Month: 01; Day: 05; ExpectedDay: 05),
    (Year: 2004; Month: 01; Day: 08; ExpectedDay: 08),  // 3
    (Year: 2004; Month: 02; Day: 14; ExpectedDay: 14),
    (Year: 2004; Month: 02; Day: 29; ExpectedDay: 29),  // 5
    (Year: 2004; Month: 04; Day: 24; ExpectedDay: 24),
    (Year: 2004; Month: 07; Day: 27; ExpectedDay: 27),  // 7
    (Year: 2004; Month: 12; Day: 29; ExpectedDay: 29),
    (Year: 2005; Month: 01; Day: 01; ExpectedDay: 01),  // 9
    (Year: 2005; Month: 01; Day: 03; ExpectedDay: 03),
    (Year: 2005; Month: 05; Day: 05; ExpectedDay: 05),  // 11
    (Year: 2005; Month: 07; Day: 12; ExpectedDay: 12),
    (Year: 2005; Month: 09; Day: 11; ExpectedDay: 11),  // 13
    (Year: 2005; Month: 02; Day: 21; ExpectedDay: 21),
    (Year: 2005; Month: 02; Day: 25; ExpectedDay: 25),  // 15
    (Year: 2005; Month: 04; Day: 10; ExpectedDay: 10),
     );

var
  TestDate: TDateTime;
  Expected: Word;
  Result: Word;
  i: Integer;
begin
  for i := Low(CDates) to High(CDates) do
  begin
    TestDate := EncodeDate(CDates[i].Year, CDates[i].Month, CDates[i].Day);
    Expected := CDates[i].ExpectedDay;
    Result := DayOfTheMonth(TestDate);

    CheckTrue(SameDate(Expected, Result), Format('DayOfTheMonth failed
        for test %d.', [i]));
  end;
end;
```

Note that the first thing this code does is declare a really big array full of dates (all after the epoch, too). The array is of type TDates, which is simply an array of type TDateRec. All of these types are declared locally, so each routine can have it’s own separated data types. The array holds all the inputs as well as the expected result. Each element of the array is informally numbered, and when one fails, the number of the test is identified by the counter used in the for statement.

Now for me to add a bunch of tests that use data before the epoch is a piece of cake. I merely change the value for CMax and then make the array look like this:

```delphi
const
  CDates: TDates = (
    (Year: 2004; Month: 01; Day: 01; ExpectedDay: 01),  // 1
    (Year: 2004; Month: 01; Day: 05; ExpectedDay: 05),
    (Year: 2004; Month: 01; Day: 08; ExpectedDay: 08),  // 3
    (Year: 2004; Month: 02; Day: 14; ExpectedDay: 14),
    (Year: 2004; Month: 02; Day: 29; ExpectedDay: 29),  // 5
    (Year: 2004; Month: 04; Day: 24; ExpectedDay: 24),
    (Year: 2004; Month: 07; Day: 27; ExpectedDay: 27),  // 7
    (Year: 2004; Month: 12; Day: 29; ExpectedDay: 29),

    (Year: 2005; Month: 01; Day: 01; ExpectedDay: 01),  // 9
    (Year: 2005; Month: 01; Day: 03; ExpectedDay: 03),
    (Year: 2005; Month: 05; Day: 05; ExpectedDay: 05),  // 11
    (Year: 2005; Month: 07; Day: 12; ExpectedDay: 12),
    (Year: 2005; Month: 09; Day: 11; ExpectedDay: 11),  // 13
    (Year: 2005; Month: 02; Day: 21; ExpectedDay: 21),
    (Year: 2005; Month: 02; Day: 25; ExpectedDay: 25),  // 15
    (Year: 2005; Month: 04; Day: 10; ExpectedDay: 10),
```
```delphi
    // Before the Epoch
    (Year: 1004; Month: 01; Day: 01; ExpectedDay: 01),  // 17
    (Year: 1004; Month: 01; Day: 05; ExpectedDay: 05),
    (Year: 1004; Month: 01; Day: 08; ExpectedDay: 08),  // 19
    (Year: 1004; Month: 02; Day: 14; ExpectedDay: 14),
    (Year: 1004; Month: 02; Day: 29; ExpectedDay: 29),  // 21
    (Year: 1004; Month: 04; Day: 24; ExpectedDay: 24),
    (Year: 1004; Month: 07; Day: 27; ExpectedDay: 27),  // 23
    (Year: 1004; Month: 12; Day: 29; ExpectedDay: 29),

    (Year: 1005; Month: 01; Day: 01; ExpectedDay: 01),  // 25
    (Year: 1005; Month: 01; Day: 03; ExpectedDay: 03),
    (Year: 1005; Month: 05; Day: 05; ExpectedDay: 05),  // 27
    (Year: 1005; Month: 07; Day: 12; ExpectedDay: 12),
    (Year: 1005; Month: 09; Day: 11; ExpectedDay: 11),  // 29
    (Year: 1005; Month: 02; Day: 21; ExpectedDay: 21),
    (Year: 1005; Month: 02; Day: 25; ExpectedDay: 25),  // 31
    (Year: 1005; Month: 04; Day: 10; ExpectedDay: 10)
  );
```
And now I have a complete set of tests for dates before the epoch.  Piece of cake.  If I find specific dates that I want to test, then I can easily add those as well.  The actual code that runs the tests doesn’t care how many elements there are in the array; it will happily process all the data passed to it.  Now, you don’t get to write as many fun error messages as you do when you do it the more straightforward way, but that is a small price to pay for the efficiency gained.

And if a test fails, you are given the test number, and you can see the test data and expected result right away right in the code.

And here’s a further aside for those of you who don’t like me using random dates:  this test for EncodeDateDay and DecodeDateDay tests every single day in every single year.   

```delphi
procedure TDateUtilsTests.Test_EncodeDateDay_DecodeDateDay;
var
  TempYear, MinYear, MaxYear: Word;
  RYear: Word;
  TestDate: TDateTime;
  RDayOfWeek: Word;
  TempDay: Integer;
  RDayOfYear: Word;
begin
  // Test every possible day for every possible year.
  MinYear := MinAllowableYear; // 1
  MaxYear := MaxAllowableYear; // 9999
  for TempYear := MinYear to MaxYear do
  begin
    for TempDay := 1 to DaysPerYear[IsLeapYear(TempYear)] do
    begin
      TestDate := EncodeDateDay(TempYear, TempDay);
      DecodeDateDay(TestDate, RYear, RDayOfYear);

      CheckEquals(TempYear, RYear,
        Format('EncodeDateDay() / DecodeDateDay() failed.
             TempYear = %d; RYear = %d', [TempYear, RYear]));
      CheckEquals(TempDay, RDayOfYear,
        Format('EncodeDateDay() / DecodeDateDay() failed.
             TempDay = %d; RDayOfYear = %d', [TempDay, RDayOfYear]));
    end;
  end;
end;
```
It takes a little longer to process, but it covers every single possible test case, I believe.

So that should cover it.  I think I’ll wrap the series up here.  I’m almost done writing tests for DateUtils.pas.  When I am done, I think I will move on to StrUtils.pas.