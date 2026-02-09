---
author: Nick Hodges
publishDate: 2010-07-21
title: About This Blog
postSlug: about-this-blog
featured: false
tags:
  - delphi
description: "I am pretty surprised at how little effort it took to get this site up and running."
---

I am pretty surprised at how little effort it took to get this site up and running.  From start to finish, including research, set up, and deploying took a Sunday afternoon.  Here are a few notes about the site.

### Why?
Well, having your own blog with your own name in the domain is pretty cool. It's a great place to express ideas, share information, and generally be utterly self-absorbed.  ;-)

### Blog Software
The blog engine I use for nickhodges.com is [BlogEngine.net](http://www.dotnetblogengine.net/).  I chose this for a number of reasons:

- [Steve Trefethen](http://www.stevetrefethen.com) recommends it and Steve is a pretty smart guy.
- It appears to be a fairly robust community of developers, but not so robust that there isn't room to do something of my own.
- It's written in ASP.NET, and thus I feel confident that I can update it, add to it, and fix it if need be.  That relates back to the point above; since there aren't too many plug-ins for it yet, it leave rooom for me to do some work with it. 
- It's a good vehicle to hone my C# skills.  Plus, I bet I can figure out a way to integrate [Delphi Prism](http://www.embarcadero.com/products/delphi-prism) into the mix as well.

### Hosting Service
 [![](/wp-content/uploads/files/2011%2f7%2fdasp_468x60_3mo_nonbranded.gif)](http://www.discountasp.net/index?refcode=NICKHOD)

The hosting service I chose was [DiscountASP.NET](http://www.discountasp.net/index?refcode=NICKHOD).  The reasons I chose them are as follows:

- Steve Trefethen recommends it and Steve is a pretty smart guy.  Plus, I could help Steve out by signing up through his referral link so that he gets a kickback.  Sweet!
- They are obviously very ASP.NET friendly, and my blog engine uses ASP.NET.
- They are pretty cheap, and they have a really nice set of features.  
- Their administrative interface is really easy to use. 
- It was pathetically easy to get my new email address (nick at nickhodges dot com) up and running.  Very nice.
- It was clear that I could be up and running in no time.
- The support is very good.  They were really helpful when I had some initial snags, solving the problem on a Sunday.

Please note that I am also part of the referral program, and so if you decide to use  [DiscountASP.NET](http://www.discountasp.net/index?refcode=NICKHOD), please feel free to click through on this link, or the banner above.  I'll get a referral fee, and you'll have my eternal gratitude.  

### Theme/Layout
This was actually the hardest part.  (For the record, Steve Trefethen had nothing to do with this part. ![Tongue out](http://www.codingindelphi.com/blog/editors/tiny_mce_3_4_3_1/plugins/emotions/img/smiley-tongue-out.gif)) BlogEngine.net provides a few themes, but I poked around and soon found [a large collection of BlogEngine.Net themes generiously donated by the community](http://www.dotnetblogengine.net/).  Someone kindly [put them all together on CodePlex](http://blogenginethemes.codeplex.com/releases/view/40170).  I downloaded them, and then loaded them all up.  Then, I went through them one by one.  It was a lot of work, actually, but basically I deleted the theme that I knew right away I didn't want, and then slowly got more critical until I arrived at the [Vertigo2 theme](http://preview.blogenginetheme.com/?theme=vertigo2). At first I was looking hard for a three column feed, but I liked Vertigo2 so much I decided to forgo the three columns and go with two. This decision was mitigated by the nice footer area.  By the way, the "big N" on the site is a result of "N" being the first letter of my name -- it is placed there automatically.

### Process
The actual process of getting the blog up and running was pretty easy.  I first set it up locally, got IIS going, and then looked at it on http://localhost.  From there, I tweaked things a bit, got it set up like I wanted, and decided on using XML as the datastore.  BlogEngine.net can use any number of databases, but XML is the simplest and cheapest.  I've used XML-based blogs before and they've worked out really well.  .Net's XML handling is really good, so it's pretty staight-forward to use it.
 
 Once I got things set up like I wanted, it was just a matter of using [Filezilla](http://filezilla-project.org/) to move the files over to ftp.nickhodges.com, and that was pretty much it.  My domain name is managed by EasyDNS.com, and so I simply used their online interface to point the domain to the [DiscountASP.NET](http://www.discountasp.net/index?refcode=NICKHOD) name servers, and that was it.  Once the site is up and running, it can be totally administered within itself.  I can still pull a complete copy and play around with it locally if I want to try something new out like adding a widget or an extension.  But generally, any changes like adding posts, etc. is all done within the site itself.

And finally, I am using [Windows Live Writer](http://explore.live.com/windows-live-writer?wa=wsignin1.0) to write most of the posts for the site.  I like it because it allows me to keep and work on drafts offline.