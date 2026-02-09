---
author: Nick Hodges
publishDate: 2016-05-15
title: 'Fun Code of the Day #2: Does nil have a type?'
postSlug: fun-code-of-the-day-2-does-nil-have-a-type
featured: false
tags:
  - delphi
  - fun code of the day
description: "Okay, no cheating now. That is, no running the code until you’ve guessed. What is the output of this code."
---

Okay, no cheating now. That is, no running the code until you’ve guessed.

What is the output of this code?
```
program Project90;

{$APPTYPE CONSOLE}

{$R *.res}

uses
  System.SysUtils;

  var
    S: TObject;

begin
  try
    S := nil;
    if S is TObject then
    begin
      Writeln('Yup');
    end else
    begin
      Writeln('Nope');
    end;
  except
    on E: Exception do
      Writeln(E.ClassName, ': ', E.Message);
  end;
  Readln;
end.

```
How sure are you?

Now run it and find out. Were you right?