---
author: Nick Hodges
publishDate: 2011-04-26
title: Fun With Testing DateUtils.pas #2
postSlug: fun-with-testing-dateutils-pas-2
featured: false
tags:
  - delphi
description: 'Note: This is a "reprint" of content from my blog on Embarcadero.com when I was working there.'
---

***Note: **This is a "reprint" of content from my blog on Embarcadero.com when I was working there.  They've since shut down my blog and the content is gone.  I'm republishing it here.  See the [main article](http://www.codingindelphi.com/blog/page/My-Embarcadero-Blog-Content) for more information.*

First of all, thanks for the help improving the CreateRandomDate function.  I confess that I didn’t spend enough time thinking on it, and I’ll also confess that you guys are way smarter than I am.  ;-)  I’ll post the “updated” version for your perusal in a separate post. 

In addition, you all were right – that code formatting sucks.   The plug-in I got for Live Writer was not very configurable.  I am now using John Kasters “YAPP” tool, and it all looks a lot better. 

Okay, back to the show…..

So to get going with unit testing DateUtils.pas, I naturally simply “plugged in” to our existing RTL unit test framework.  We have an existing RTL set of unit tests for running DUnit tests on the RTL.  I simply added the unit UnitTest.DateUtils.pas to the project, created the new class:

```delphi
TDateUtilsTests = class(TTestCase) 
end;

```
and I was in business.  From there, it’s merely a matter of declaring published methods that run the DUnit tests.

So, I started right at the top with DateOf and TimeOf. So, what to test? Well, the most obvious thing: Does DateOf actually return the date portion of a given TDateTime?  Well, lets create a TDateTime with a random time, then, lets create a TDate with the same date but no time at all, and see if DateOf can do it’s magic?

```delphi
procedure TDateUtilsTests.Test_DateOf; 
var
  TestDate: TDateTime;
  Expected: TDateTime; 
  Result : TDateTime; 
begin
  TestDate := EncodeDateTime(1945, 12, 1, 1, 46, 13, 112);
  Expected := EncodeDate(1945, 12, 1);
  Result := DateOf(TestDate); 
  CheckTrue(SameDate(Result, Expected), 
       'Test date and Expected date were not the same.'
     + ' DateOf function failed. Test #1'); 
end;

```
So this is a pretty straightforward test – you create two dates, and see if they are the same after the call to DateOf.  Simple.

What if you, say, increment the time part by one millisecond.  Come on, that can’t hurt anything right?  Better make sure:

```delphi
  
// This test will fail if it gets run at 23:59.999 
// at night. I'm willing to gamble that this 
// will never happen. 
TestDate := Now;
Expected := IncMillisecond(TestDate); 
Result := DateOf(TestDate);
CheckTrue(SameDate(Result, Expected),
  'Test date and Expected date were not the same.' 
+ ' DateOf function failed. Test #2');

```
Okay, those are some “positive test cases”.  (I have a bunch more different ones along these lines….)  What about testing the negative case?  That is, test where we know that the two dates should be different after the call, and we test to make sure that they are, indeed different.

```delphi
  
  TestDate := Now; 
  Expected := DateOf(IncDay(TestDate)); 
  Result := DateOf(TestDate); 
  CheckFalse(SameDate(Result, Expected),
     'Test date and Expected date should have'
   + ' been different but they weren''t. Test #2');

```
I have a similar set of tests for TimeOf.  These are pretty basic, but that is where you start, right?  With the basics?  From there, I wrote tests that change only the milliseconds, the seconds, the minutes and the hours.  All should never allow the DateOf function to return anything other than the date.  For TimeOf, I do the same – change the year, month, and date and make sure the time is the same.  Then I purposefully change the time and make sure that the function actually does change the time. 

Now, some of you are going to chastise me for using other DateUtils.pas functions to write tests.  Two schools of thought on that.  One says that you should never rely on anything outside of the actually call being tested.  Another says to use those library functions because they’ll get tested all the more when used in other tests. I’m going to be following the latter philosophy, and as well see in a later post, this way of doing things actually will reveal a pretty significant bug in a routine that was used to test another routine.