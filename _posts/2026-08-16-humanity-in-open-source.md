---
layout: post
title: Humanity in Open Source
description: Thoughts on how the open source world is changing in the AI era, not always for the better.
---

With the rise of AI, life in tech is vastly different than it was just a few years ago. In particular, this has affected the open source community a huge amount and the maintainers within it.

Today, I want to share some thoughts on this, what we could do differently, and how we can make the open source world a better place for everyone.

## About me

First of all, some context for those who may not know me. I spend a large part of my time working on open source projects, both as a maintainer and as a contributor.

For example, I am part of several open source teams: [e18e](https://e18e.dev/), [prettier](https://github.com/prettier), [chai](https://github.com/chaijs), [npmx](https://github.com/npmx-dev), [bombshell](https://github.com/bombshell-dev), [parse5](https://github.com/inikulin/parse5), [tinylibs](https://github.com/tinylibs), [chokidar](https://github.com/paulmillr/chokidar), and [VueUse](https://github.com/vueuse).

This isn't an exhaustive list, and I _actively_ work on all of these projects. A typical week for me involves reviewing pull requests, triaging issues, managing communities, managing direction, and writing code. Keep in mind, this is only my maintainer work; I also contribute to other projects.

You can see that **this is a lot of work**, even before the AI era. So you might also guess where this post is going...

## Creation is easy now

With the introduction of AI, it became a lot easier to _create_. Not only creation of code, but of documentation, plans, issues, and so on.

This has been a life changer for many of us in the tech world. I am far from being a "power user", but I use Claude almost daily to help me dig into code bases, research architectural changes, and automate my more trivial tasks. Many of my friends go well beyond this though, and use it for entire features, or even entire projects end-to-end.

What this has unlocked for us all is the ability to create more, faster. When an idea pops into our heads, we can roughly write the idea down and have an agent take a stab at it. With a bit of back and forth, we can usually have a working prototype that same day.

I know a few people whose businesses now run like this:

1. Human writes issue for a new feature or bug
2. Human assigns the issue to an agent
3. Agent writes code for the issue
4. Human reviews the code and merges it (or gives the agent feedback)

This is very impressive. It saves a lot of time, and sometimes means smaller businesses don't need to hire as many engineers.

## Here come the agents

Within a business, this ability to create can be great. In open source, however, it often has a different effect.

Regardless of AI, a typical open source project receives contributions in the form of issues and pull requests, usually in these situations:

1. A user finds a bug and submits an issue
2. A user has a feature request and submits an issue
3. A user wants to contribute code and submits a pull request

In the past, these contributions were made by humans. **Today, these are often made by agents.**

They tend to arrive from one of a few places:

- An agent gets blocked by a missing feature or a bug in a dependency, and opens an issue or pull request against it automatically
- A user gives an agent the task of finding open source projects to contribute to, and it submits issues and pull requests on their behalf
- A bounty program aimed at agents, where the agent picks issues to work on and submits pull requests for them

**This change means many of us maintainers are now receiving extremely high volumes of issues and pull requests compared to before.**

Here's my GitHub activity in 2024, compared to 2026:

<div class="img-columns">
  <figure>
    <img src="/assets/images/github-2024.jpg" alt="GitHub activity graph - 2024">
    <figcaption>2024</figcaption>
  </figure>
  <figure>
    <img src="/assets/images/github-2026.jpg" alt="GitHub activity graph - 2026">
    <figcaption>2026</figcaption>
  </figure>
</div>

Code review has doubled, while my own pull requests have nearly halved. Keep in mind the overall total has gone up too as I am doing more open source this year. The trend is clear, though: more review, less code.

## The lack of humanity

We have two kinds of agentic contribution: "agent-assisted human contributions", and "end-to-end agentic contributions". What do I mean by this?

- An agent-assisted human contribution is when a human uses an agent to help them make a contribution
- An end-to-end agentic contribution is when an agent makes a contribution and sees it through on its own, without any human involvement (regardless of if a human triggered it)

A huge change in the open source world is that we are now seeing a lot more end-to-end agentic contributions. Where we used to interact with a real human, we're just chatting to someone else's agent now.

I really miss seeing text that a human wrote. Every PR looks the same, every issue looks the same. All of them are a wall of text with nice headings, bullet point lists, and code blocks. I don't even need to read the words anymore to know its an agentic contribution. The shape of it is enough.

<figure>
  <img class="img-framed" src="/assets/images/agentic-pr.jpg" alt="An agentic contribution">
  <figcaption>Shape of a typical agentic PR</figcaption>
</figure>

**The real problem, though, is that we're no longer speaking to a human. We've lost the humanity in open source.**

It takes a lot of time to parse these walls of text mentally, and gives no joy doing it. We also have no idea who we're talking to, or if they're even aware of this interaction.

Even if the change is correct, what's the point in responding? I suppose I get to spend someone else's tokens instead of my own, but other than that, I could just copy the issue into my own agent and fix it myself without the overhead of dealing with someone else's agent.

## The loss of community

The person behind the agent often has no idea this interaction is even happening. Even when they do, they're far less invested in it than when they were the ones communicating and making the contribution.

People used to contribute to projects repeatedly, and eventually become _contributors_. Even better, they would become _maintainers_. This is how communities are built, and how projects survive long term.

**Today, we very rarely gain new contributors, and even more rarely gain new maintainers. This directly results in the loss of community.**

In the past, a person could start a project, gain some contributors, and eventually some maintainers. In parallel, users would grow and start discussing enough that we now need a Discord server. Now we have a community! One of the best parts of open source is the community that forms around it.

Sadly, many projects now start with one person and stay that way. No human contributors to turn into maintainers, no users to turn into a community. Just a pile of agents spending each other's tokens.

## Burnout is increasing

All of this means more and more people are burning out and, increasingly often, leaving open source entirely (as a maintainer).

You might have seen the recent [AI health report](https://ai-health.syntax.fm/) by Syntax.fm. This is a good example of what we're seeing: higher burnout rates, higher pressure, reduced enjoyment.

There's no fun when you take humans out of the loop. Combine that with the higher stress and the higher volume of contributions, and you have a recipe for burnout.

Many high profile maintainers I am friends with have experienced burnout at some point in the last couple of years. Some have left open source entirely, and some have left the tech industry entirely. This is a huge loss for the open source world.

## It's not all bad!

This is a pretty dire post so far, but only because I've focused on the bad things. There's a lot of good happening in open source, and I'm loving it like I always have. Everything is excellent, it'll just be more excellent if we can solve some of the problems I mentioned above.

## What can we do about it?

### Maintainers: Use tooling to filter out agentic spam

There are a few tools out there, but I particularly like [AgentScan](https://github.com/MatteoGabriele/agentscan) right now. As a maintainer, this gives you an easy way to detect end-to-end agentic contributions that are most likely spam or low quality. You can then triage these contributions accordingly, and focus your time on the human contributions that are more likely to be high quality.

Similarly, GitHub now offers a way to limit the maximum number of open pull requests per user. In high volume projects, this can be a good way to prevent mass agentic contributions from things like agentic bounty programs.

### Communities are still forming, join them!

My two prime examples of this are [e18e](https://e18e.dev/) and [npmx](https://npmx.dev/). Both of these projects have incredible communities behind them, built up from humans who care, and who are invested in the project. These communities are growing, and are a joy to be a part of.

In the case of e18e, we somehow managed to find hundreds of people who truly care about making the JavaScript ecosystem faster and more secure. Everyone wants this really, but it is pretty niche to want to _help make it happen_. The fact that we have hundreds of people actively contributing to this effort on a regular basis is incredible, and a testament to the fact that communities are still forming in open source.

Similarly, npmx saw incredible growth in the first few weeks alone. In just N weeks, there were N0 pull requests submitted by humans, and N1 contributors. One of the fastest growing communities the web has seen in a long time.

We may have fewer communities today, but they do exist and are still forming. I'd highly recommend joining one you're interested in.

### Follow contribution guidelines

Most open source projects have contribution guidelines. These are usually in a `CONTRIBUTING.md` file, and outline how to contribute to the project.

If you're thinking of contributing, whether through issues or pull requests, please read these guidelines first. Similarly, if the repository has a pre-defined template when you open such an issue or pull request, please use it.

This added structure helps maintainers gain an understanding of your contribution much faster than they would otherwise. The benefit is yours as much as the maintainer's, as it will help you get your contribution merged faster.

### Be a human contributor

If you're thinking of creating an issue or pull request, write the text yourself.

Most of us don't mind if you use an agent to help investigate an issue, or to help write the code. The important part is that you write the text of the issue or pull request yourself, and you respond when we post a comment.

Not only will this give us a better experience, but it'll also lead to you having a better understanding of the change. Writing things down yourself is a good way to learn, and will help you become a better contributor.

## Wrapping up

**Community and humanity are fundamental to a healthy open source ecosystem.**

Without these, projects will die, maintainers will burn out, and people will be disconnected from each other. Not only maintainers, but contributors and users too. Open source is about more than just code; it's about people, and the relationships we build with each other.

**Be human.**
