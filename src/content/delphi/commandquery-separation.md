---
author: Nick Hodges
publishDate: 2014-12-06
title: Command/Query Separation
postSlug: commandquery-separation
featured: false
tags:
  - delphi
description: 'Introduction An important step to writing Clean Code is the notion of separating "commands" and "queries" by using the Command Query Separation Princi...'
---

### Introduction
An important step to writing Clean Code is the notion of separating "commands" and "queries" by using the [Command Query Separation Principle](http://en.wikipedia.org/wiki/Command%E2%80%93query_separation).  The notion was first discussed by [Bertrand Meyer](http://en.wikipedia.org/wiki/Bertrand_Meyer) in his book *[Object Oriented Software Construction](http://www.amazon.com/gp/product/0136291554/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0136291554&linkCode=as2&tag=nickhodgeshomepa&linkId=IVMYKYZ22AWZJ2LQ)*.  This means that the idea is not new.  In its basic form, it means we should separate the things that read data from the system and things that write data to the system.

The Command/Query Separation Principle means that there should be a clear separation between the updating of information and status in your program and the way that you read information from the program.  Commands and queries should be separately declared (though you'll find that commands can call queries but not vice-versa.)  It can be a complex as ensuring that reading and writing take place in completely separate object, or as simple as ensuring that commands and queries are simply done in different methods of your objects.

Of course, the first question you'll have is "What do you mean by 'command' and 'query'?"  Well, I'll tell you.
### Queries
A query is an operation that returns a result without effecting the state of the class or application.  In Object Pascal, this is typically a `function`.  Queries should not mutate the state of a class.  They should be idempotent.   That means "*denoting an element of a set that is unchanged in value when multiplied or otherwise operated on by itself.*"  (I had to look that up, by the way....)

As a general rule, queries should return a single value, and "asking a question should not change the answer".  They should be referentially transparent; that is, they should be perfectly replaceable with their literal result without changing the meaning of the system.

What this means practically is that your functions shouldn't change the status of the system you are working on, whether that be a class, a framework, or an application.  You should be able to run a query, i.e. a function, a hundred times in a row and get the same answer back each time.  The function, because it doesn't change the status of the system, can be safely called at any time without repercussions.

Now this should be a general rule -- there are certainly cases where your query will change the state of the system (a dataset's `Next` call comes to mind).  But generally, it's a good idea to have your queries not change state.
### Commands
A command is any operation that has an observable side-effect.  It is any code that changes something in your class or application.  Typically, in Object Pascal, a command will be a `procedure` -- that is, code that takes actions without returning a value.  Commands can call queries (but queries should never call commands, because commands change the status of the system).

Commands should not in general return values.  Thus, the use of `var` parameters should be discouraged if not down-right banned.
### Don't Mix the Two
All your methods and routines should be easily identifiable as either a command or a query.  Commands and queries should be separate entities in your code -- with the exception that a command can call a query if need be. The use of `var` or `out` parameters in a `procedure` will confuse this issue, and thus should be discouraged.   If you follow this rule, your code should be more "reasonable" -- it should be easier to understand and easier to modify.

CQRS also encourages you not to violate what I consider to be a bedrock of sound development technique:  Don't try to make one thing do two things.   For instance, here is some code that does exactly that:
```
procedure ProcessWidgets(aCollectionOfWidgets: TWidgetCollection; var aNumberOfProcessedWidgets: integer);
```
This method is a clear violation of CQS [*NOTE:  I orginally had this as CQRS*] as it obviously is trying to be a command and altering the state of the system by processing widgets, but also tries to be a query by "returning" through a `var` parameter the number of processed widgets.  Instead, the system should have a simple command to process widgets and a separate query to return the number of widgets that were processed.  The procedure is trying to be two things at once, and all kinds of mischief comes from making one thing do two things.

Following the CQRS principle in the design of your code will help to ensure the proper separation of concerns, resulting in cleaner, easier to read and easier to maintain code.