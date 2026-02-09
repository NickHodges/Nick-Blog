---
author: Nick Hodges
publishDate: 2011-08-09
title: Delphi Pretty Good Practices #5 – Don’t Use Literals
postSlug: delphi-pretty-good-practices-5-don-t-use-literals-2
featured: false
tags:
  - delphi
description: "If there is a bedrock, bottom line, everyone-should-follow-it-all-the-time rule in programming it is “The DRY Principle” – Don’t Repeat Yourself."
---

If there is a bedrock, bottom line, everyone-should-follow-it-all-the-time rule in programming it is “The DRY Principle” – Don’t Repeat Yourself. This simple rule states that you should write code once and only once, and that you shouldn’t allow the same code to be used all over the place. Or, as the Wikipedia article deftly states: "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." Put more simply, it means that you shouldn’t have the same thing repeated all over your code, but that you should create a single identifier and use that in the many places where it might be needed.

As a practical matter, the DRY principle in its most basic form tells us that we should, as a matter of course, not use literals in our code, but instead should declare constants (or resourcestring types as we’ll discuss in a minute) and use those instead. That way, if you need to change the value for something, you can do it in a single place instead of having to make multiple, error-prone changes throughout your existing code.

For example: Say you have a system that has an arbitrary number of required repetitions, say 17. You might end up writing a whole bunch of code like this:

```
for i := 1 to 17 do 
begin 
  ProcessStuff; 
  DoSomeMoreStuff; 
end;
```
Now imagine that you have that kind of code all over the place, and then your boss comes around and says "Hey, we need to repeat all that stuff 18 times now, not just seventeen.” Well, if you haven’t followed the DRY Principle, you could very well end up with a lot of code to change. And don’t use search and replace, because what if you change the 17 that is part of a variable name or something? Things could get ugly fast.

Of course, the thing to do is to declare a constant:

```
const 
  NumberOfRepetitions = 17;
```
and declare your loops as

```delphi
for i := 1 to NumberOfRepetitions do 
begin
  ProcessStuff;   
  DoSomeMoreStuff;
end;
```

and now when your boss switches things up, you have but one simple change to make, and all is well.

Now this is a pretty simple, basic thing to do, but I’m constantly surprised at how often I find myself forgetting to do it. (For instance, if you look through the code for TextScrubber, you’ll probably notice that I need to apply the DRY Principle to the TVersionInfo constructor in uTextScrubberTypes.pas.) You might be surprised how many literals you use in your code. I often take advantage of the syntax highlighting feature to scan code for specific colors for strings and numbers and replace them with constant values as much as possible. For instance, some code from TextScrubber used to look like this:

```delphi
procedure TStraightTextMainForm.InitializeMainFormInformation;
var 
  IniFile: TIniFile; 
begin 
  IniFile := TIniFile.Create(IniFileName); 
  try 
    TextScrubberOptions.ClickChoice := TClickChoice( IniFile.ReadInteger('Options', cClickChoice, 0));
    TextScrubberOptions.ShouldTrim := IniFile.ReadBool(cOptions, 'ShouldTrimText', False); 
  finally 
    IniFile.Free; 
  end; 
end;
```

with a bunch of string literals. Instead, now, I’ve declared two constants in the uTextScrubberConsts.pas unit

```delphi
const 
  cOptions = 'Options';   
  cClickChoice = 'ClickChoice'; 
  cShouldTrimText = 'ShouldTrimText'; 
  cVersionLangCodePage = '040904E4';
```

and the new code looks like this:

```delphi
procedure TStraightTextMainForm.InitializeMainFormInformation; 
var 
  IniFile: TIniFile; 
begin 
  IniFile := TIniFile.Create(IniFileName); 
  try 
    TextScrubberOptions.ClickChoice := TClickChoice( IniFile.ReadInteger(cOptions, cClickChoice, 0)); 
    TextScrubberOptions.ShouldTrim := IniFile.ReadBool(cOptions, cShouldTrimText, False); 
  finally 
    IniFile.Free; 
  end; 
end;
```

Those constants are also used when I write out information to the INI file, so that I can change the value in one place if I need to, and so that I can know that there won’t be any typographical errors in my strings that will cause a bug. The same string value is always going to be used for the INI file entry.

Now let’s take a look specifically at strings. Strings are a bit special because they are very often used to communicate information, and as such, they frequently need to be translated into other languages through the process of “localization”. Windows provides an easy way to do this via string resources, and Delphi provides an easy way to create string resources via the resourcestring identifier. These strings are then created as resources, making them easy to translate. And “easy to translate” can often be, well, translated into “cheaper to translate” and that is a good thing.

Practically speaking, I apply this principle by placing as many const and resourcestring declarations as I can in a single file, thus centrally locating them for easy management and translation. In our case with the TextScrubber project, I’ve created a file called uTextScrubberConsts.pas and put constants and resource string values into it. If you look through the project code, you’ll probably notice that I need to apply the DRY Principle to the TVersionInfo constructor in uTextScrubberTypes.pas, even if it is keeping those constants within the unit.

One question that might get asked is “How do you choose what to make a const and what to make a resourcestring?” My answer is that as a general rule, any string that could change without changing the UI or the functionality of the code, make a const. Any string that, if changed, will trigger a change in UI or translation should be made a resourcestring. There are exceptions to that, of course. More simply, a rule to use that anything that might get translated should be a resourcestring.

Now, this is a pretty simple “pretty good practice” to follow, but for you folks who have not been following this principle, simply doing so can make your code more readable and maintainable.