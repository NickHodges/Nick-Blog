---
author: Nick Hodges
publishDate: 2014-11-22
title: Testing My New Code Formatter
postSlug: testing-my-new-code-formatter
featured: false
tags:
  - delphi
description: "I am using the Crayon Code Highlighter."
---

I am using the Crayon Code Highlighter.  Let's see how it works:
```
procedure ConfigureOptions;
var
  Option : IOptionDefintion;
begin
  Option := TOptionsRegistry.RegisterUnNamedOption('The file to be processed',
    procedure(value : string)
    begin
        TSampleOptions.FileToProcess:= value;
    end);
  Option.Required := true;

  Option := TOptionsRegistry.RegisterOption('OutputInUpperCase','o', 'The output should be in upper case',
    procedure(value : Boolean)
    begin
        TSampleOptions.OutputInUpperCase:= value;
    end);
  Option.Required := true;  Option.HasValue := False;

  Option := TOptionsRegistry.RegisterOption('NumberOfIterations','n','The number of times the file should be processed',
    procedure(value : integer)
    begin
        TSampleOptions.NumberofIterations := value;
    end);
  Option.Required := False;
  Option.HasValue := True;
end;
```
Looks pretty good I think.