---
author: Nick Hodges
publishDate: 2012-01-22
title: Why You Should be Using Interfaces and not Direct References
postSlug: why-you-should-be-using-interfaces-and-not-direct-references
featured: false
tags:
  - delphi
description: "I’ve been going on and on about how you should be coding against abstractions and not implementations."
---

I’ve been going on and on about how you should be coding against abstractions and not implementations.  From there, it’s not a big leap to realize that you should be using interfaces as the main means to create those abstractions.  Some of you have been asking me about why I think this, so I thought I’d write a post about why I say it.  So, here it is.

First, though, I’ll talk a bit about interfaces, what they are, and how they work.  This will be far from exhaustive, but I’ll try to cover the bases, and direct you to better sources of information.

### What are Interfaces?
So, the first question you might have is “What the heck is an interface anyway?”.  Well, that’s an interesting question.  The short, easy answer is that an interface is a declaration of functionality without an implementation of that functionality.  In Delphi, we can declare an interface like so:

```
type
  IGetHTML = interface
    ['{3C02359E-D6DA-40E0-A12E-30B239DA7D9F}']
    function GetHTML: string;
  end;

```

This is a very basic Delphi interface.  Interfaces consist of a name (in this case, IGetHTML) and a declaration of methods and properties.  An interface includes ***no*** “real” code or implementing functionality. It is purely a declaration of capability.  In this case, the interface says “Hey, when I am implemented, I’ll give you some HTML.”  The interface tells you what functionality is available.  It does not tell you ***how*** the functionality will be implemented.  In fact, the interface doesn’t care, and the user of the interface shouldn’t care either.  The implementation of the interface might do any number of things to get HTML – create it internally, grab it from a file, construct it based on the internal state of some other object, or just plain return random HTML snippets. The interface itself doesn’t care.  All the interface knows is that it’s implementer will return a string, and that presumably that string will contain some HTML.

Note that the declaration of the interface as a GUID right after the initial declaration. This GUID is used by the compiler to identify uniquely this interface.  Strictly speaking, you can use an interface without the GUID, but you can’t get very far using them as much of the RTL and most frameworks that take advantage of interfaces will require that they have a GUID.

Of course, the purpose here is to create an implementing class that has some meaning when it goes into “Get me some HTML” mode.  For instance, you might have a series of visual components on form designer that represent a web page.  When it comes time to render the HTML for the page, you might iterate over all of them and call their GetHTML methods, regardless of what their type is.   The point is that it*** doesn’t matter*** what the implementing objects are or what they do – they just produce HTML.

### Implementing an Interface
But of course, as you’ve guessed,  an interface can’t do anything without an implementing class.  Delphi makes it really easy to implement interfaces.  To do so, you need to declare a class as implementing an interface, and then make sure that class implements all the methods in the interface. 

In order to implement IGetHTML, you might declare a class as follows:

```
type
  THTMLGetter = class(TInterfacedObject, IGetHTML)
    function GetHTML: string;
  end;

  function THTMLGetter.GetHTML: string;
  begin
    Result := 'You want some HTML?  I got your HTML right here!

';
  end;

```

Note that the the class declares IGetHTML after the base class.  (The base class is TInterfacedObject – we’ll get to that in a minute.) It declares and implements the GetHTML function required by the interface

Some things to note:

- The class can have any number of other fields and methods that it needs or requires, as long as it has the methods defined by the interface. If you fail to provide all the necessary methods, the compiler will give you an error until you do.  The class above is a really simple example, but the implementing class can be as simple or complicated as necessary – just as long as it has a GetHTML method.
- The base class can be any base class as long as it implements the necessary methods for Delphi’s interface reference counting.    (TInterfacedObject does this -- again, more on that in a minute…) But I want to stress again – the base class can be anything.  It could be a class you created.  It could be a VCL class.  It could be TButton or TClientDataset or anything.  It doesn’t matter, and the interface doesn’t care, as long as you provide implementations for all the necessary methods.
- A class can implement any number of interfaces, so you can have a class declaration like 
 
TMultipleInterfaces = class(TInterfacedObject, IThisInterface, IThatInterface, IAnotherInterface); 
 
wherein the TMultipleInterface class providesan implementation
- Interfaces can inherit from other interfaces, so you can declare an interface like so: 
 
TChildInterface = interface(TParentInterface);  
 
In this way, the child interface will require an implementation for all its declared methods as well as those of its parent.

### Some Suggestions for Using Interfaces
Here are a few things to think about when creating and dealing with interfaces:

- Declare interfaces in their own unit, preferably one interface per unit.  This makes for small units, but interfaces should be defined separately from any implementation.  It’s very tempting to declare an interface and a class that implements it in the same unit, but you should resist this temptation.  Keep interfaces separate and completely decoupled from any particular implementation.
- Generally speaking, it’s a good idea to have interfaces be specific and to the point.  If you have a large interface – one with many methods, you might consider breaking it down.  There are times when it’s okay, but don’t be afraid to have interfaces with just a handful of – or even one – methods.
- Interfaces can be used as abstractions for your code, but not all interfaces are abstractions necessarily.  If you have a “leaky” abstraction, then your interface isn’t truly an abstraction.  A leaky abstraction is one which allows implementation details to sneak through.  Say you had an interface called IDataSource and that interface had a method called GetConnectionString.  Having that method appears to strongly imply the notion of a relational database, perhaps even a specific one like MS SQL Server.  An implementation of IDataSource might use a collection or a list, and so the notion of a connection string shouldn’t be part of the implementation.  In this case, the implementation detail of having a connection string has “leaked through” your attempt at abstracting the notion of  a data source.
- Along those lines, if your interfaces are merely a reproduction of the public class you use to implement it, then it is very likely that you have a leaky abstraction.

### What’s this TInterfacedObject All About?
Much of the coolness and power of Delphi’s interfaces comes from the fact that they are ***reference counted***.  That is, the use of the interface is tracked by the compiler and the implementing instance, once created, is automatically freed when the compiler realizes that the number of references to a given interface variable is zero.  In this way, a Delphi developer can use interfaces without ever having to worry about the memory that they allocate because the compiler tracks all the uses and destroys the class instance for you when the interface is no longer reachable.  That is pretty slick, and I’ll talk a bit more about that below. 

So, given that, the compiler needs a way to do all that tracking.  It also needs a way to figure out which interface is what (remember the GUID from above?).  So, in order to do that, all classes that implement an interface need to declare and implement three methods:

```
function _AddRef: Integer; stdcall;
function _Release: Integer; stdcall;
function QueryInterface(const IID: TGUID; out Obj): HResult; stdcall;
```

The first two are called automatically by the compiler each time it sees that a reference is used (_AddRef) and goes out of scope (_Release).  The QueryInterface method is used to determine if the class implements a given interface.  I’m not going to go into much depth here, but you can at least understand now the declaration (and implementation) of TInterfacedObject:

```
TInterfacedObject = class(TObject, IInterface)
  protected
    FRefCount: Integer;
    function QueryInterface(const IID: TGUID; out Obj): HResult; stdcall;
    function _AddRef: Integer; stdcall;
    function _Release: Integer; stdcall;
  public
    procedure AfterConstruction; override;
    procedure BeforeDestruction; override;
    class function NewInstance: TObject; override;
    property RefCount: Integer read FRefCount;
  end;

...

function TInterfacedObject._AddRef: Integer;
begin
  Result := InterlockedIncrement(FRefCount);
end;

function TInterfacedObject._Release: Integer;
begin
  Result := InterlockedDecrement(FRefCount);
  if Result = 0 then
    Destroy;
end;

```

You can see the entire declaration of TInterfacedObject in the System.pas unit.  It basically does all the housekeeping of managing the reference count of the implementing object, and destroying it when the count gets to zero.

Some further things to note:

- If you want reference counting for your interfaces, you need to either descend your implementing classes from TInterfacedObject, or declare similar functionality in your class.
- You should never really ever have a need to call the three “magic” methods of TInterfacedObject.  If you feel the need to, you almost certainly are doing something you shouldn’t be.  Pay no attention to what the IDE’s code completion tells you, don’t call them or mess with them in any way. 
- With regard to the previous note, it is interesting that you can call the methods on TInterfacedObject in your code despite them being protected.  Remember, they are part of the interface, and the interface doesn’t have the notion of private, protected, or public. 

### How Do You Actually Use an Interface?
Okay, so how do you actually use one of these things?  Here’s a simple example of our simple interface as implemented by our simple object:

```
procedure GetMeSomeHTMLPlease;
var
  HTMLGetter: IGetHTML;
begin
  HTMLGetter := THTMLGetter.Create;
  ShowMessage(HTMLGetter.GetHTML);
end;
```

The first thing you probably notice is that the line of code creating THTMLGetter looks pretty “normal”.  But of course, the big difference is that HTMLGetter is declared as IGetHTML – an interface type, and not an object reference type.   The next thing you probably see is that once the interface is created and used that…… well, nothing happens.  There’s no try…finally block and thus no call to Free that you would normally see if HTMLGetter were declared as THTMLGetter and not an interface.  This is, of course, because the interface is reference counted, and the THTMLGetter instance will be destroyed automatically by the compiler at the end of the procedure. 

Okay, that’s a very cursory and very quick look at interfaces in Delphi.  A ton of better and more in depth information on how Delphi interfaces out there is [only a Google search away](http://bit.ly/xip0Up).

### Why Do You Want To Use Interfaces?
The what and the how are the easy part.  It’s not tough to figure out how this all works.  It’s the ***why*** that seems to be the sticking point for many – I know it was for me for a long time.  So here’s the real meat of the article – Why in the heck would you want to use these crazy things?

Well here’s why.

Ultimately, there is one bottom line reason why you should use interfaces in Delphi:  They provide a very thin – but very powerful -- abstraction to your code.  That’s why.  Everything below is really an expansion on that one idea.

[As I’ve said before](http://bit.ly/xVHqNN), and I’ll say again:  *A good developer codes against abstractions, and not implementations*.  Interfaces are a great way to create abstractions.  If you want a thorough discussion on why this is a good idea, [I suggest reading Erich Gamma on the topic](http://bit.ly/A8yS0i) – but I’ll talk a bit about it here.

If you program against abstractions, you can’t couple yourself to a specific implementation.  Interfaces allow you to make the coupling between your classes very loose.  Classes should be developed and tested in isolation with few or no external dependencies.  But they almost certainly have to depend on ***something***.  And certainly once you have a well-designed class library created, you need to piece it together to create the system you need to build.  In the end, **an interface is the lightest and thinnest thing that a class can depend on**.  So, if you program primarily with interfaces, you can’t help but create very loosely coupled code.  And we all know that loosely coupled code is good.  So interfaces help produce good code.

But there’s more – interfaces also let you alter implementations, even at runtime.  Because you are dealing with an interface, and not an implementation, **you can pick and choose what implementation you want when you want**.  For instance, you can write code like this:

```
procedure EncryptSomething(aSuperSecretStuff);TBuffer; const aIWantToBeSafe: Boolean);
var
  Encryptor: IEncrypt;
begin
  if aIWantToBeSafe then
  begin
    Encryptor := TSuperDuperPowerfulEncryption.Create;
  end else
  begin
    Encryptor := TWhoCaresHowSafe.Create;
  end;
  Encryptor.Encrypt(aSuperSecretStuff);
end;

```

This is a silly example, but you can see how this can be very powerful – you can have a single interface and select the proper implementation as needed.  An example might be an ICreditCard interface where you instantiate different credit card implementations based on the choice made by your customer.  Because you aren’t tied to a specific implementation, you can use a single ICreditCard interface while making it easy to alter which implementation gets used.  That’s powerful.

And of course, you might think that your implementation of your interface is great, but it’s entirely possible that a better one comes along, and you want to be able to easily plug that new implementation in without having to radically change your code.  Interfaces make that quite possible.  A good rule of thumb is to “[Always develop against interfaces and code as if a radically better implementation is just around the corner.](http://bit.ly/z7jj1Y)” (That sounds too good to be my quote – sorry if I stole that from you. )

But wait, there is more!  Interfaces are good for inter-module communications.  Say you have a large system with different teams working on different major modules.  Those teams are responsible for providing functionality in their own modules, and thus they are responsible for the integrity and quality of the code in their modules.  Let’s say you are on the Widget team, and you need the Sprocket team to do something for you.  You go to the Sprocket guys and say “Hey, I need to add a few things in the Sprocket code so that we can do some Sprocket-type stuff in our Widget.”  The Sprocket guys are going to laugh at you – like they are going to let you poke around in their carefully crafted system!  No, instead, they will likely ask you want you need, build the functionality, and hand you some code with an interface and a factory for creating an implementation of that interface.  They aren’t going to let you anywhere near their code – but they are happy to let you have an interface into that code.  You get what you want – some Sprocket functionality – and they don’t have to expose anything more than an interface to you.  And later, if they completely re-architect their code, what do you care?  Your interface still works, even if they completely change the internal implementation.  That’s a sound way to develop, all made possible because of interfaces.

And it doesn’t end there – interfaces make your code testable.  As noted above, because you are using interfaces you can readily substitute any implementation you want.  What if you are testing and you don’t want to connect to the production database?  You can simply provide a mock implementation for your database connection interface – one that only pretends to be the database and that returns canned data – and now you can test your code in isolation without actually connecting to a database. 

And finally, interfaces make it easy to implement design patterns and do things like Dependency Injection.  Most of the new patterns and practices – including Dependency Injection frameworks – are enabled because of the power and flexibility of interfaces.  If you choose not to embrace interfaces, then you are locking yourself out of new and effective programming frameworks and techniques.  Or, put another way, all the cool kids are doing interfaces, and you want to be part of the cool kid group, right?

### Conclusion
Okay, so if you aren’t convinced by now, I don’t know what to say.  Interfaces are flexible and powerful and let you ensure that your code is decoupled, easy to update, testable, and protected.  They enable you to write clean, powerful, easy to maintain code.  They enable the use of new, powerful frameworks and development techniques. 

What more could you want?