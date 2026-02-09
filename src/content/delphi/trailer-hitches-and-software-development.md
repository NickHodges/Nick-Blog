---
author: Nick Hodges
publishDate: 2015-04-04
title: Trailer Hitches and Software Development
postSlug: trailer-hitches-and-software-development
featured: false
tags:
  - delphi
  - software development
description: "When I was in the Navy, I had a friend named Tom. Not only a great naval officer, aviator, and all-around good guy, he was also a good husband."
---

When I was in the Navy, I had a friend named Tom.  Not only a great naval officer, aviator, and all-around good guy, he was also a good husband.  And by good husband I mean that he modified his beloved Ford truck to include a tow hitch for his wife’s horse trailer.  It was a big horse trailer and he had to get one of those hitches that was attached into the bed of his truck.  It was a major change.

Being the wise man that he was, he went to get some estimates.  The first one he got was a reasonable price, but the second one was twice what the first one was.  Tom asked why, since the first price wasn’t small, and the second guy’s price was pretty hefty.  The guy said “Well, you can pay me to do it the right way, or you can pay that guy and then have your hitch rip off and have your horse trailer go careening off while you are cruising down the highway”.  The point, of course, was that there is an upfront cost to doing things right that can prevent even more costs down the road (literally, in this case). Needless to say, Tom went with the second guy.

*["It is more important to reduce the effort of maintenance than it is to reduce the effort of implementation." -- Max Kanat-Alexander](https://twitter.com/NickHodges/status/583706076433920000)*

This quote came from a book I read yesterday called [Code Simplicity: The Fundamentals of Software](http://www.amazon.com/gp/product/1449313892/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1449313892&linkCode=as2&tag=nickhodgeshomepa&linkId=DL5II5LJWIGBOWXP).  ![](http://ir-na.amazon-adsystem.com/e/ir?t=nickhodgeshomepa&l=as2&o=1&a=1449313892)
It’s a short book – I read it in a couple of hours – but it is a good one.  Full of wisdom about software development, it makes the point that no matter what, your software is going to change.  And when it changes, you will introduce defects, so you need to make it as easy as possible to change your code in order to minimize the bugs you introduce when changes occur and decrease the difficulty of adding new features. It’s a really good book – give it a read. 

The bottom line of the book: – In order to manage complexity in the large, you need to code for simplicity in the small. Complexity is the key, and how you manage that will dictate the long-term success of your project.  It’s amazingly easy to create complexity, and it takes a lot of work to create simplicity. 

So code is like the trailer hitch – you need to put your costs up front in order to avoid disaster in the future.  As Kanat-Alexander says – we need to put effort into the implementation of our code in the beginning so that costs are minimized during the maintenance period.  We need to plan for the long haul, designing our systems up front to be flexible and changeable and composed of simple modules.  You can build complexity by combining simple modules into a complex system.  Simple modules are easy to maintain.  You can also build complexity by combining complex modules, but complex modules are difficult to maintain.   

There is no up side to the “*Get it done quick and we’ll worry about fixing bugs later*” way of doing things.  “*You can pay me now or you can pay me later*” is how the old saying goes, and it’s as true for software as it is for horse trailer hitches.