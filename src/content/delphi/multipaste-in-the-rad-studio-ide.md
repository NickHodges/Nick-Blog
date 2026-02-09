---
author: Nick Hodges
publishDate: 2017-01-26
title: MultiPaste in the RAD Studio IDE
postSlug: multipaste-in-the-rad-studio-ide
featured: false
tags:
  - delphi
description: "Late last year I had the honor of speaking with Cary Jensen at the Delphi Developer Days events."
---

Late last year I had the honor of speaking with Cary Jensen at the [Delphi Developer Days](http://www.delphideveloperdays.com) events. It was a great opportunity to meet some new folks, folks I’ve known online for years, and to present some useful information about Delphi.

One of the presentations we gave was entitled “Delphi Tips, Tricks, and Techniques”.  We showed a bunch of cool shortcuts and other things. It was fun and well received.

So we were in Copenhagen for our second DDD event, and my good friend Jens Fudge comes up to me after I gave my Tips and Tricks and says that I should add MultiPaste to the talk.

Of course, much to my embarrassment, my response was “What is MultiPaste”.  Well, Jens showed me, and now I’m about to show you.  (To make myself look a little better, when I presented MultiPaste in Frankfurt, no one there had heard of it either……)

Okay, so what is MultiPaste?  It’s a feature that came along with the Castalia acquisition, and one that clearly hasn’t had enough attention paid to it.

Ever had a problem like this?  You have some SQL, say:
```
SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
FULL OUTER JOIN Orders
ON Customers.CustomerID = Orders.CustomerID
ORDER BY Customers.CustomerName;
```
and you want to add that SQL to the SQL property of a query at runtime.  You end up either having to turn this into a string like this:
```
'SELECT Customers.CustomerName, Orders.OrderID' +
'FROM Customers' +
'FULL OUTER JOIN Orders' +
'ON Customers.CustomerID = Orders.CustomerID' +
'ORDER BY Customers.CustomerName;'
```
or manually in each line like this:
```
FDQuery1.SQL.Add('SELECT Customers.CustomerName, Orders.OrderID');
FDQuery1.SQL.Add('FROM Customers');
FDQuery1.SQL.Add('FULL OUTER JOIN Orders');
FDQuery1.SQL.Add('ON Customers.CustomerID = Orders.CustomerID');
FDQuery1.SQL.Add('ORDER BY Customers.CustomerName;');
```
Both choices are a big pain in the butt to code.

But not anymore.  MultiPaste makes this kind of thing pathetically easy!

Let's choose the second option above -- the manual adding of the SQL code one line at a time.

First, copy the SQL to your clipboard.  This is important -- the text that you want to manipulate must be on your clipboard.

Next, place your cursor where you want the resulting text to be inserted.

Then, select Edit|MultiPaste  from the IDE's menu  (You'll need to have a code window open for the menu item to be active).  You'll see this:

[![](http://www.codingindelphi.com/blog/wp-content/uploads/2017/01/2017-01-26-09_17_37-MultiPaste-276x300.png)](http://www.codingindelphi.com/blog/wp-content/uploads/2017/01/2017-01-26-09_17_37-MultiPaste.png)

Now, from there, you can type this in the first edit box:
```
FDQuery1.SQL.Add('
```
and then in the second edit box, type:
```
');
```
You should then notice that the main memo box is changing the text you have on your clipboard by adding the contents of the first edit box to the beginning of each line, and the contents of the second edit box to the end of each line.  You should end up with a dialog that looks like this:

[![](http://www.codingindelphi.com/blog/wp-content/uploads/2017/01/FilledOudMultiPaste-1-276x300.png)](http://www.codingindelphi.com/blog/wp-content/uploads/2017/01/FilledOudMultiPaste-1.png)

Then, hit Ok and the text that you created is inserted at the cursor point.   Pretty cool, huh?

Thus, MultiPaste allows you to avoid a bit of the time consuming and tedious coding that we all have done at one time or another.

Just another great feature to make your IDE a bit more productive.