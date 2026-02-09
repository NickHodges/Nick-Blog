---
author: Nick Hodges
publishDate: 2011-08-09
title: Delphi Pretty Good Practices #2 – Source Control
postSlug: delphi-pretty-good-practices-2-source-control
featured: false
tags:
  - uncategorized
description: "This post was originally made on Fri, 04/23/2010 - 14:35 on my Embarcadero blog."
---

*This post was originally made on Fri, 04/23/2010 - 14:35 on my Embarcadero blog.*

Okay, so for this first installment, I’ll be illustrating one of my core principles for developing applications:  All my code of any importance at all goes under source control.  All of it.
I’m all by myself – why should I use source control?

We ask about source control use on the annual survey, and a surprisingly large percentage of you are not using source control at all.    That as a bit of a surprise.  If you are working on a team of any size, using source control is a no brainer.  But even if you are working alone, using source control is a really good idea. 

Why, you might ask?  Well, there are a number of good reasons:

- It’s good to be in the habit.  Sure, you may be working alone.  But in the future you may not be.  Or your “weekend hobby project” might turn into a popular project with many developers.  If anything like that happens, being in the habit of using source code control will stand you in good stead.
- It protects your code.  Since your code is stored in on a server apart from your development machine, you have a backup. And then, you can even backup the code on the server.  Sure, you can zip it all up any time you want, but you don’t get all the other benefits I’m listing here.
- It can save your butt.  Sometimes, you might accidently delete something.  You might make mistakes and change code that you didn’t want changed.  You might start off on some crazy idea when you are feeling a bit saucy, and then regret it.  Source control can save you from all of these by making it a piece of cake to revert to any previous state.  It’s like a really powerful “undo” feature.
- It allows you to “turn back time”. Say you are a shareware author. You like to release updates and new versions.  And say you get a support request from a customer that has a bug while using a version that is two major releases old. Source control lets you easily recreate the code base for that exact release and debug the problem that the user is seeing.
- It makes you think about your process.  Even if you work alone, you should be deliberate and organized in how you write code. If you are in the habit of checking your code into a source control system, you’ll end up thinking more about what you are doing, how you are doing things, and you’ll end up being more organized and deliberate. 
- It gives you the freedom to experiment.  Somewhat the mirror image of the previous reason, source control gives you the freedom to say “What the heck, I’ll try that wacky way of doing things!”  Since you know that you can always get back to a known good state, you can be free to experiment and try something that might otherwise hesitate to do. And that experiment might just prove to be a brilliant way to do it. 
- It lets you backtrack.  Even when we work alone, we can’t remember every single thing we do and every single change we make.  And I bet at least once in your life you’ve looked at some code and said “Huh? When the heck did that happen?”  With a source control system, you can answer that question very easily.  You can track where a specific change came from and when it was made and maybe even the comment you made when you checked the change in.
- It lets you see what changed.  Sometimes, things start acting up. Maybe a section of your application that you haven’t used in a while is behaving differently than you expected.  Maybe it is totally broken and you have no idea why.  Source control can let you track the process and peer into the history of a specific chunk of code to see what changes were made and how those changes affected the project as a whole.

I’m sure you all can think of more reasons.  Bottom line is that if you aren’t using source control, then you should start, no matter what your development situation is.  ZIP files just aren’t going to cut it.  Seriously.
## Okay, I’m convinced. What now?
I’m convinced that my points above are so compelling that you are in violent agreement with me, so I’m going to make you use the Subversion client to get the code for this series’ demo project, TextScrubber. [TextScrubber is only available from SourceForge under Subversion](http://sourceforge.net/projects/textscrubber/).   If you don’t use Subversion for source control, you should at least have the command line client on your machine, because Subversion is everywhere, and you should at least know how to get code from code repositories that use it.  I know that there are other well known source control management systems out there.  [Git](http://git-scm.com/) and [Mercurial](http://mercurial.selenic.com/) are growing in popularity, but Subversion is probably the most widely used source control system out there.  We use Subversion internally here on the RAD Studio team.
### Getting the Subversion Command Line Client
So the first thing you’ll need to do is to get the Subversion client.  (If you already have the client, you can skip this whole section) A whole lot of projects out there — whether on [SourceForge](http://www.sourceforge.net/) or[GoogleCode](http://code.google.com/) or [CodePlex](http://www.codeplex.com/) — use Subversion, so having the client is pretty useful.  It’s also small and easy to use, so here’s how you get it:

- I’d recommend getting the binary package from [Collabnet](http://www.collabnet.com/):  In order to do that, you’ll have to get an account with them. You can sign up here:  [http://www.open.collab.net/servlets/Join](http://www.open.collab.net/servlets/Join)  If you don’t want to do that, you can get the binaries here as well:  [http://subversion.tigris.org/servlets/ProjectDocumentList?folderID=91](http://subversion.tigris.org/servlets/ProjectDocumentList?folderID=91)
- Go to:  [http://www.collab.net/downloads/subversion/](http://www.collab.net/downloads/subversion/) and choose the second download entitled:  “CollabNet Subversion Command-Line Client v1.6.9 (for Windows)”
- There is a big orange button there that says “Download”.  Note again that this is the second button on that page as we are downloading the client only.
- Press the button and download the file. 
- Execute the installer that you downloaded. 

There, you just installed the Subversion client.  The path to the client should now be on your DOS PATH (if it isn’t, you can put it there) and you should be all ready to go on the command line. 
Note: Subversion has only very recently been brought under the umbrella of the Apache Project. As such, it is licensed under the very friendly [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).   It was originally founded by Collabnet, but moved over to be a part of the Apache set of tools just this past February.  It is open source, so if you are really hard core, you can download the source and compile it all yourself.  Me?   I’m not that hardcore. I use the convenient binaries provided by the good folks at Collabnet. 
## Grabbing the Code for TextScrubber
Once you have the command line Subversion client installed (it’s called svn.exe, by the way), you can easily download the code for [TextScrubber](http://sourceforge.net/projects/textscrubber/).  Seriously, it’s like falling off a log.  Just do the following:

- Open a command window and go to the parent directory where you want the code to go.  For instance, if you want the code to go into c:\code\textscrubber, you want to start with your command prompt at c:\code
- Issue the following command: 

svn co https://textscrubber.svn.sourceforge.net/svnroot/textscrubber/trunk textscrubber

‘co’ stands for ‘checkout’. The second parameter is the URL for the ‘tip’ of the Subversion repository. This command will pull from SourceForge the most recent version of the code into the \textscrubber\trunk directory. That last parameter there is the name of the subdirectory that will be created and filled with the code from SourceForge. 

That’s it. You now have the most recent, up to date code for TextScrubber on your machine.  You are all ready to start straightening and unformatting text!
## Using Subversion
In the future, if I make updates to the project, then all you need to do is to navigate to the \textscrubber\trunk directory and do a “7up” or "svn up" command, and it will get the latest and greatest code for you in a jiffy.  Can’t be much simpler than that. That’s the command you’ll end up using the most, probably.

Since it is so popular and commonly used, there is a lot of information about using Subversion out on the web.  [I’ve found this tutorial to be very useful](http://svnbook.red-bean.com/en/1.1/index.html), as well as the book (written by the same guys that wrote the tutorial..): [Version Control with Subversion](http://www.amazon.com/gp/product/0596004486?ie=UTF8&tag=nickhodges-20&linkCode=as2&camp=1789&creative=9325&creativeASIN=0596004486)

Another useful tool for using Subversion is [TortoiseSVN](http://tortoisesvn.tigris.org/).  TortoiseSVN is a Windows shell plug-in that provides all the functionality of the Subversion client in an easy to use GUI.  Below is a screen shot of the TortoiseSVN Log Window for the [TSmiley project on SourceForge](http://sourceforge.net/projects/tsmiley).

TortoiseSVN is also an open source project, so you can get it for free.  If TortoiseSVN proves to be valuable to you, I’d also encourage you make [a generous donation to the project](http://tortoisesvn.tigris.org/donate.html).  I did.
## Getting and Setting Up the Subversion Server
If you make the wise and sagely decision to go ahead and use source control for all of your code, you can easily set up the Subversion server.  You can, of course, download the Collabnet binaries and install them, but if you want to go the pathetically easy route (which I recommend), you should download and install [Visual SVN Server](http://www.visualsvn.com/server/).  I’m not even going to go through the steps to installing the server, because they are not much more than download, run the install, and you are done.  That’s it.  It takes like two minutes.  Seriously. They even provide you with a nice Management Console application for administering the server, making that really easy as well. 

(And while you are looking at VisualSVN Server, you can consider upgrading to their [Enterprise edition](http://www.visualsvn.com/server/licensing/).) 

Now, I myself run the full server (Apache, etc. – the whole ball ‘o’ wax….) on my local machine and use it to manage my code.  This enables me to browse my code in a browser and do other things that are supported by a full blown server   But that might be a bit of overkill for some of you (I’m weird that way – I just want the “full” experience and like to be in learning mode…) and you might not want to do that.  Instead, you can simply create local repositories on your local disk.   The Subversion tutorial above can show you how to do that. 

I have been using the server locally since I use a laptop exclusively and move it between work and home.  But I think I’ll set up the server on a machine at home and check in there. That way, my code will be stored on a separate machine.
## More About Source Control
As you can probably tell, this post isn’t meant to be a primer on Subversion or source control in general.  The tutorial I listed above is a good place to learn about Subversion.  If you want to learn more about source control in general, I recommend reading [Source Control HOWTO](http://www.ericsink.com/scm/source_control.html) by Erik Sink.  Eric is a really interesting guy who has a great blog and also runs [SourceGear](http://www.sourcegear.com/), a commercial vendor of developer tools including [Vault](http://www.sourcegear.com/vault/), a source control management tool that I recommend considering.  You might be interested to note that Vault is free for single users.
That’s it.

And so that is the first “Pretty Good Practice” for developing with Delphi: Manage your code with a source control system.

So, what do you think?  Are you ready to make the move to source control management?