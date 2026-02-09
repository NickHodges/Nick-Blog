---
author: Nick Hodges
publishDate: 2014-12-03
title: Obey Postel’s Law in Your Code
postSlug: obey-postels-law-in-your-code
featured: false
tags:
  - delphi
description: "Jon Postel was a guy that wrote an early specification for the Transmission Control Protocol (TCP), one of the core protocols of the Internet protocol..."
---

[Jon Postel](http://en.wikipedia.org/wiki/Jon_Postel) was a guy that wrote an early specification for the Transmission Control Protocol (TCP), one of the core protocols of the Internet protocol suite.  You use it every day to surf the web, send emails, etc.  One of the guiding principles that he used when writing it was this:
Be conservative in what you do, be liberal in what you accept from others.
This idea is also call the [Robustness Principle](http://en.wikipedia.org/wiki/Robustness_principle), and is sometimes rephrased as "*Be conservative in what you send, be liberal in what you accept.*"  When applied to TCP, it means that the sender of data should be strict in what is sent, ensuring that it is accurate and precise.  It also means that the receiver of data should be forgiving and understanding of data to as large a degree as possible.  If you send data, be as clear as possible in what you send.  If you can accept the data sent, then you should.

Any application programming interface (API) should follow this principle.  Thus, the same principle should apply to your code.  The public interface of your class should be viewed as an API, and it should be conservative in what it sends, and forgiving in what it receives.  When calling another API, your code should send out data in a completely conformant way, following the rules laid down by the receiving API.  But it should be willing to receive input in a non-conformant way as long as the input can be understood.

For instance, if passed a string, you might be happy to accept strings with blank spaces on the beginning and end, and use the Trim function to clean things up for the sender.  Your classes might provide overloads for input methods, accepting both and integer and a string as input, providing a way for your class to be as forgiving as possible.

But when you call another API, your code should be strict and always send data in the correct, expected form.  You should trim your strings before they get sent along to the API you are calling.  If the system expects integers, you are going to send integers.  You should meet the specification completely.

Another example is the use of nil.  First, your code should never pass nil to a method that you are calling.  Always provide a valid instance if the API calls for one.  Second, your code should accept nil, but "fail fast" if passed nil and raise an exception.  You should never let your internals get into the state of nil, and while you should accept nil, you should immediately raise an exception at any attempt to set one of your internal references to nil.

Postel’s Law – a small but important way to write better code.