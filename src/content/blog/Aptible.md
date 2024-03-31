---
author: Nick Hodges
pubDatetime: 2024-01-03
title: Say No to Configuring Infrastructure with Aptible
postSlug: aptible
featured: true
tags:
  - internet
  - aptible
  - technology
description: "Don't bother messing around with infrastructure.  Just let Aptible do all the work so you can focus on your application."
---

## Introduction

When I was starting out as a developer, deploying an application meant compiling it on your Windows 3.1 machine, copying the resulting \*.exe file to a floppy disk, and then mailing it to your shareware customer who had sent you a check (yes, a paper check) in the mail for five dollars.

Things have changed a little bit.

Today, deployment happens daily, or hourly, or even more. Bug fixes, features, and improvements can be deployed to the cloud, and thus to millions of customers, with a single git push command. And what that means is that applications are vastly more flexible, changeable, and adaptable than they were in the days of shareware.

But even so, all this doesn’t happen by accident. Often, you need to manage a lot of infrastructure to make all of that happen, both physical and logical infrastructure. Someone has to keep all those boxes up and running all those virtual machines at the data center finely tuned. Many companies have people employed full time to manage spinning up and configuring cloud resources. The cloud is better than trying to build out a server room, but still, it takes a lot of time.

What if you didn't have to do _*any*_ of that? What if you could deploy an application and not have to worry one bit about the infrastructure to which that deployment is taking place? What if thinking about AWS resources at all became a thing of the past? What if issues like security and compliance and all the other hassles implicit in owning infrastructure were to be just abstracted away?

That would be cool.

Well, that’s what I like about Aptible. As a cloud-based platform designed for secure, compliant deployment, Aptible is exactly what is needed for deploying a modern web-based application.

Besides not even remotely dealing with the US Mail, with Aptible I can deploy, secure, and scale an application in the cloud without thinking at all about how that application will run, remain secure, and scale. That’s worth a lot to me, and so I love what Aptible is doing, and I was happy, as well, to discover how easy it all is.

So, in this post I’m going to discuss what Aptible can do for you, and then show an example of doing it.

## Why Aptible?

### Easy Deployment

Deploying with Aptible is as easy as pushing to a git repo on Github. It’s just that simple. Push to the Aptible origin and your code is uploaded, built, and deployed. All you need is a simple Dockerfile to make sure everything runs like you want it to run, and you are good to go. No need to manage build servers, FTP servers, or anything remotely on your side of the fence. If I need a database, Aptible sets it up and configures it in seconds. What a treat that is.

### Scalability

In the past, I can remember big server rooms with those raised tile floors that housed rooms full of servers to run our stuff. Scaling meant buying, installing, and configuring a new box in the server room.

Aptible makes all that go away. Scaling is just a matter of telling the Aptible dashboard what you want, and they take care of the rest. Deploying additional database servers, application servers, whatever, is all done for you behind the scenes. No need to tweak AWS resources or roll out and build up more Azure virtual machines. It just happens as you need and request it.

### Security

Whether it is general API security, HIPAA compliance, HITRUST CSF certification, or SOC 2 compliance, Aptible takes care of all that security stuff for you. Frankly, I don’t even want to think about what it would take to ensure that a physical server is meeting the HIPAA standards. Let Aptible worry about that. Now I don’t have to.

The bottom line is that all this stuff just kind of becomes soft background noise when it used to be a New York City cab blaring it’s horn on your bumper.

That’s all really great, but the ease of getting things set up is just icing on the cake. Here’s a run-through on how to get an app up and running.

## Setting up and Deploying to Aptible

**1. Create an account**

The first step, of course, is to create an account on Aptible.com The have a simple sign up process that does require a username, email, password, as well as a company name. All fields are required.

![Create an Aptible account](/assets/aptibleimages/image-1.png "The page for creating your new Aptible account")

Upon registering, you will be sent the standard email confirmation, and once clicked, your account will be up and ready to get started.

Once you click on the link in the verification email, you will be taken to your Aptible Dashboard, where you will be given a one month trial for the Enterprise level. After the thirty days are up, you will have to give a credit card and sign up for at least the Starter package. There is no free tier for Aptible. Full information about pricing can be found here: [https://www.aptible.com/pricing](https://www.aptible.com/pricing)

**Step 3: Create an Environment**

![Screen for creating an environment](/assets/aptibleimages/image-2.png "This screen is where you will see your environments listed")

From here, I’m going to create an Aptible environment and a simple application that tracks a CD collection. I’ve pre-built a simple REST-based application using Node and Expressjs that tracks CDs, the performing artist, and the year of release. This is served up via a standard REST API and JSON. It will all run inside Aptible where I could scale and manage it to my heart's content without worrying about any physical or virtual infrastructure.

The first thing to do is to create an environment. I do that by clicking the big yellow button in the upper right of the Dashboard that says -- shockingly! -- “New Environment.”

This will allow me to choose the “Stack” and give my environment a name. The name is easy -- I’ve chosen “cdcollectionapp” for the environment name. Choosing a stack will require a bit more care.

Normally, you will create an environment for the different stages of your application's development. A typical collection of environments might be for development, staging, and production. The stacks you choose for each will likely be different as well. Stacks are general isolated, but you can choose to connect stacks using Aptible’s Network Integration feature.

![Screen to name your environment.](/assets/aptibleimages/image-3.png "This is the screen where you will give your new environment a name.")

In Aptible, stacks are almost the same as what you might view as a "region," or more specifically, “the general area of the world where the servers your app will be located.” You can read all about stacks in the documentation ([https://www.aptible.com/docs/stacks](https://www.aptible.com/docs/stacks)) but basically the idea is that a stack is a collection of resources (virtual computers) that you will use to run your application. Stacks can be shared or dedicated. Typically, a production environment would use a dedicated stack, while “lesser” environments would leverage a shared stack. The beauty here is that you don’t have to worry about any of the logistics of this -- you just ask for what you need, and Aptible manages it all for you.

So if I fill out the form and press “Create Environment” I’ll have an environment in which my application can reside.

**Step 4: Create an Application**

Next, I’ll be asked to give a name to the application that the environment will host. Here I’ve called my application “cdcollection”

![Name your app here](/assets/aptibleimages/image-4.png "This is the screen for naming your application")

Pressing the “Create App” button has an interesting result -- I am asked to reenter my login credentials.

![Reenter your credentials](/assets/aptibleimages/image-5.png "Here you have to prove who you are again.")

Selecting the dropdown entitled “Why do I need to elevate my credentials?” will tell you that in order to make environmental level changes, they just want to make sure that it really is you. It also notes that because you can actually deploy a new application by pushing code to GitHub (we’ll see that in a minute) you need an SSH key registered with GitHub and Aptible.

Entering your credentials then takes you to do that very thing -- give your public SSH key to Aptible so that they can deploy based on code pushes to your repository. (Again, we’ll get that hooked up in a minute…)

**Step 5: Add your SSH key**

![Copy your public SSH key](/assets/aptibleimages/image-6.png "The screen for entering your public SSH key so you can communicate with GitHub")

Paste your public (NOT YOUR PRIVATE!) SSH key into the edit box and press “Save Key.” That will let Aptible perform actions based on hooks in your GitHub repository (which we’ll set up in a minute).

![Connect your repository to Aptible](/assets/aptibleimages/image-7.png "These are the commands for connecting your GitHub repository to Aptible.")

Aptible will want you to set up a remote repository for your application to which your code can be pushed, built, and then deployed. What this means is that you can manage your code repository as you like on GitHub, but when you are ready to deploy, you can push your current code to the designated Aptible repository, and Aptible will build and deploy your code for you automatically and without any further effort on your part. Deploying a new version of your application becomes nothing more than a simple push to your Aptibile git repository.

At this point, we need a git repository with an application in it in order to perform these steps. Let’s take a bit of a detour and set that up.

**Step 6: Creating the CD Collection Application**

Here is the repository for our CD Collection application

[https://github.com/NickHodges/cd-collection](https://github.com/NickHodges/cd-collection)

You can clone this code, run npm install in the /src directory, and have it all up and running in the standard way.

Some things to note:

1. The application uses MongoDB to run. If you want to run the application on your local machine, you’ll have to have MongoDB running. You can find out how to make that happen on the Mongo website.
2. Once Mongo is running, you’ll have to add the correct URL for the MongoDB server running on your machine to the .env file.
3. We’ll be setting up MongoDB on Aptible in a minute. Don’t worry, it’s quite easy.

Once you have the repository on your local machine and you are satisfied that it runs and all is well (or you can just trust me that the application works if you don’t want to make all that happen), then you can follow the instructions on the page above.

Once that happens, your application will be deployed to Aptible’s servers. Aptible will see this and then move on to the next step in the process, which will be to set up the database and the environmental variables needed to access the database.

![Creating the Database](/assets/aptibleimages/image-8.png "The page for creating your database instance")

Now, an important thing to note here is that the project has a Dockerfile included in it. Aptible uses that Dockerfile to contain and run your application.

**Step 7: Create the Database Server**

Next up we’ll create our MongoDB in our Aptible environment. And you might be astonished to find that the way to do that is to press the “New Database” button. This will cause a combo box to appear that has a list of databases you can choose from. Hunt up the MongoDB 4.0 version and select it. Aptible will give you a default database handle of ‘cdcollection-mongodb**’** which you can leave, but you’ll need to change the Environmental Variable name to ‘MONGO_URI` to match what is in the application.

I found the interface here a touch confusing -- I felt like there needed to be a save button or something, so I pressed the “Create Database” button again, but that just created another entry. So I deleted that and then realized there is a “Save and Deploy” button at the bottom. \_

Then I read a bit more carefully and saw that the environmental variable would be automatically set and that I didn’t need to add any more variables in the provided edit box. \_

Then I pressed the “Save and Deploy” button, and Aptible began the process of setting up the database against my application. It took a few moments, but soon everything was deployed:

![Saving and deploying](/assets/aptibleimages/image-9.png "The page shown as your application is deployed")

Now, things are pretty much set up. At this point, you can go to the main dashboard for the application. You can select the Database tab on the left and see your MongoDB has been provisioned:

![Showing your database instance](/assets/aptibleimages/image-10.png "Here you can see your database instance")

But right now, there isn’t any way to get at our application, so we need to create an endpoint

**Step 8: Create an Endpoint**

You might think you would do that on the Endpoint tab, but instead, endpoints are created inside the application tab. So, select “Apps” on the left, and then our `cdcollection app` from the presented list. From there, select the `Endpoints` sub-tab, and there you will find the `New Endpoint` button.

![Creating an endpoint](/assets/aptibleimages/image-11.png "You need to create an endpoint for your data to be shown")

Here, you’ll need to do the following:

1. Add a custom container port. Enter 3000 here, which is what our Dockerfile expects.
2. Unless you have some custom domain requirements, leave the `Endpoint Type` alone.
3. Choose `External` for the `Endpoint Placement`. You may have different requirements for a more complex app, but this will be the simplest solution for our demo here.
4. From there, scroll down and press “Save Endpoint”

Aptible will now provision your endpoint. I found that this took a while, maybe ten minutes or so.

_What is an endpoint? An endpoint is the URL where REST actions can take place. _

But once the endpoint is created, you should have a URL visible in the dashboard:

![Your endpoint](/assets/aptibleimages/image-12.png "The endpoint has been created")

If you hit the little copy button and put that URL in your browser, you should see the “Hello Aptible User!!!” response from our app. It’s working!

![The application running](/assets/aptibleimages/image-13.png "Here is the display from the applications root")

**Step 9: Fill up the Data**

So let’s make the app actually do something. The application defines an endpoint location of `cds`, so you can add that to the end of your URL, and you should see an empty JSON dataset of just two square brackets. That’s good, though. That means that the application is talking to the MongoDB, finding nothing upon querying it, and returning empty JSON. So let’s get some data into our CD collection.

To do that, we need to run a script included in our project called `add-cds.js`

In order to do that, you need to do the following:

1. Open up the `add-cds.js` file in your IDE
2. Edit the URL in line 20 to be the same as your URL. Be sure to have the `/cds` on there
3. At the command line, navigate to your repositories directory and issue the command `node ./add-cds.js’
4. If all goes well, you should see the output of the CD information being added to the database.

Once that is done, there should be data in your application that you can view as JSON in the browser:

![Application displaying data](/assets/aptibleimages/image-14.png "The basic JSON returned by the application")

The app will even allow you to view individual entries via the ID. If you copy one of the `id` values and add it to the URL, you should see that individual entry in the browser. If I enter

[https://app-65707.on-aptible.com/cds/6591581189dd883daaa95861/cds](https://app-65707.on-aptible.com/cds/6591581189dd883daaa95861)

In my browser, I see the entry:

![A specific item](/assets/aptibleimages/image-15.png "The application returning a specific item based on the URL")

Now, the work of building and deploying your application is basically done. From here, you can focus on building your application and not worry about any of the infrastructure to deploy your application. As you write code and commit it to your GitHub repository, you can deploy to Aptible with a simple command line entry. Let’s take a look.

**Step 10: Updating and Deploying via GitHub**

Let’s make a simple change to our application. As we saw above, the default message from the application is “Hello, Aptible User!!!”. Let’s go old school and change that in the `app.ts` file to ‘Hello World!`

Make that change, commit it to git, and push it to your repository. Then, execute the following at the command line:

`git push aptible main`

This will set into motion a flurry of activity in your command window, culminating in a fresh deployment of your application.

Once it is done, you will see the new greeting at the root URL:

![A new root message](/assets/aptibleimages/image-16.png "The root message has been changed and deployed")

Now that you can update the application by pushing code to GitHub, you are all done!

## Conclusion

So deploying applications gets easier every day, and Aptible is a big part of that. No more USPS mailers, no more rack-mounted servers in a chilled and tiled room, and not even anymore spending the day at the AWS or Azure console.

You need not worry about deploying or scaling or securing your application. Instead, you can just worry about what is really important -- making sure that your application does what it is supposed to do.
