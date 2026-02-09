---
author: Nick Hodges
publishDate: 2015-04-17
title: Fun Code of the Day #1
postSlug: fun-code-of-the-day-1
featured: false
tags:
  - delphi
  - fun code of the day
description: "unit uEnumConverter; interface type TEnum = record public class function AsString<T>(aEnum: T): string; static; class function AsInteger<T>(aEnum: T):..."
---

```
unit uEnumConverter;

interface

type
  TEnum = record
  public
    class function AsString(aEnum: T): string; static;
    class function AsInteger(aEnum: T): Integer; static;
  end;

implementation

uses
      TypInfo
    ;

{ TEnum }

class function TEnum.AsString(aEnum: T): string;
begin
  Result := GetEnumName(TypeInfo(T), AsInteger(aEnum));
end;

class function TEnum.AsInteger(aEnum: T): Integer;
begin
  case Sizeof(T) of
    1: Result := pByte(@aEnum)^;
    2: Result := pWord(@aEnum)^;
    4: Result := pCardinal(@aEnum)^;
  end;
end;

end.
```