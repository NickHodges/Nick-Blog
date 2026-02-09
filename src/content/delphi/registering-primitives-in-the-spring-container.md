---
author: Nick Hodges
publishDate: 2015-11-08
title: Registering Primitives in the Spring Container
postSlug: registering-primitives-in-the-spring-container
featured: false
tags:
  - delphi
  - software development
description: "I just got back from attending EKON 19 in Köln, Germany. I had a really good time and learned a lot."
---

I just got back from attending EKON 19 in Köln, Germany. I had a really good time and learned a lot. In fact, I learned the most in one of the sessions I gave – a three hour workshop on Dependency Injection.  [Stefan Glienke](http://delphisorcery.blogspot.com/) was there – he maintains and enhances the [Spring Framework](http://www.spring4d.org) – and he showed me something that the Spring Container can do that I didn’t know it could do -- resolve primitive values by name and an anonymous method.

Here’s how this works.  First, we’ll take a look at a simple class:
```
type
  TPerson = class 
  private 
    FName: string; 
    FAge: integer; 
    function GetName: string; 
    function GetAge: integer; 
  public 
    constructor Create(aName: string); 
    property Name: string read GetName;  
    property Age: integer read GetAge; 
  end;

```
This is a simple class -- so simple that I won't bother showing you the implementation, which I know you can figure out.

What is cool, however, is that you can inject both **Name** and **Age** properties.  I’ll demo one as a constructor-injected parameter, and the other as a field-injected value.

First, we’ll register the **Name** property.  We’ll get the name property using the following function that gets the user’s Windows Name:
```
function GetLocalUserName: string;
var
  aLength: DWORD;
  aUserName: array [0 .. Max_Path - 1] of Char;
begin
  aLength := Max_Path;
  if not GetUserName(aUserName, aLength) then
  begin
    raise Exception.CreateFmt('Win32 Error %d: %s', [GetLastError, SysErrorMessage(GetLastError)]);
  end;
  Result := string(aUserName);
end;

```
This is just a wrapper around the Windows API call **GetUserName**.  The real fun is here:
```
  GlobalContainer.RegisterType;
  GlobalContainer.RegisterType('name').DelegateTo(
                                   function: string
                                   begin
                                     Result := GetLocalUsername;
                                   end
                                   );
    GlobalContainer.RegisterType('age').DelegateTo(
                                   function: integer
                                   begin
                                     Result := 42; 
                                   end
                                   );

```
First, we register the **TPerson** class so that the container can resolve things for it. Then we register a string with the name 'name', and delegate its "construction" to an anonymous function that calls our **GetLocalUserName** function. The point here is that we now have a “handle” – the string ‘name’ – to a string value that can resolve at runtime. We do the very same thing for the **FAge** field. That might seem like over-controlling things, but in effect it is quite powerful.  We can use it to ensure that both interface and primitive values in a class are resolved with the Container.  Imagine a constructor that requires not only interface dependencies, but a string value as well.  You can let the container resolve the values for the entire class.

Now, all we need to do is to change the above class to have these attributes:
```
type
  TPerson = class 
  private 
    FName: string; 
    [Inject('age')]
    FAge: integer; 
    function GetName: string; 
    function GetAge: integer; 
  public
    [Inject(‘name’)] 
    constructor Create(aName: string); 
    property Name: string read GetName; 
    property Age: integer read GetAge; 
  end;

```
Now, the **Name** property of the **TPerson** class will automatically be filled with the Windows user name without actually writing any more code to make it do that. The **FAge** field will be set with our favorite number '42'.

(The code for this application can be found [here](https://bitbucket.org/NickHodges/nickdemocode/src/e71f9e507f96e9a92e45914967613018dc331e37/EKON19/DependencyInjection/Code/uPrimitiveRegistration.pas?at=default&fileviewer=file-view-default).)

Now, at this point I bet you are asking “Why would I do that?”

It does, on the surface, seem like a bit of overkill.  But, in the world of Dependency Injection, being able to resolve ***all* **the dependencies of a given class – interfaces, classes, **and** primitives  -- is golden.  Not having to write code, and centralizing the resolution of constructor parameters, properties, and fields --no matter what the type -- are very useful indeed.  Remember, the more you can decouple your code via the Container, the better.

And you don’t even need but the one call to the **ServiceLocator**.