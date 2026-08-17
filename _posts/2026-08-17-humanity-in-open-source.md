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

I work on all of these projects. A typical week for me involves reviewing pull requests, triaging issues, managing communities, managing direction, and writing code. Keep in mind, this is only my maintainer work; I also contribute to other projects.

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

Of these, the lower quality ones tend to arrive from one of a few places:

- An agent gets blocked by a missing feature or a bug in a dependency, and opens an issue or pull request against it automatically
- A user gives an agent the task of finding open source projects to contribute to, and it submits issues and pull requests on their behalf
- A bounty program aimed at agents, where the agent picks issues to work on and submits pull requests for them

**This change means many of us maintainers are now receiving extremely high volumes of pull requests compared to before.**

Here's my GitHub activity in 2025, compared to 2026:

<div class="img-columns">
  <figure>
    <img src="/assets/images/github-2025.jpg" alt="GitHub activity graph - 2025">
    <figcaption>2025</figcaption>
  </figure>
  <figure>
    <img src="/assets/images/github-2026.jpg" alt="GitHub activity graph - 2026">
    <figcaption>2026</figcaption>
  </figure>
</div>

Code review went from 22% of my activity to 43%, while my own pull requests dropped from 28% to 19%. Some of that shift is simply that I've taken on more projects this year, and more projects means more review. But not all of it.

Let's take a look at some rough numbers for a few projects:

| Project | 2025 Issues | 2026 (H1) Issues | Issues (projected change) | 2025 PRs | 2026 (H1) PRs | PRs (projected change) |
| -- | -- | -- | -- | -- | -- | -- |
| VueUse | 234 | 79 | -32% | 507 | 268 | +6% |
| clack | 53 | 53 | +100% | 160 | 106 | +33% |
| Nuxt | 1378 | 477 | -31% | 1634 | 1458 | +79% |
| SvelteKit | 818 | 431 | +5% | 882 | 1203 | +173% |
| Astro | 799 | 710 | +78% | 1314 | 1871 | +185% |

**Note that these are first-half numbers, and we're still part way through 2026 at the time of writing**. The projected columns simply double the first half, which is if anything conservative. These are also raw numbers as there's no reliable way to know which of them are end-to-end agentic contributions.

The pattern to look at here is the two halves of the table against each other. Issues are flat or falling in most of these projects, while pull requests are up in every single one, some of them close to triple. Fewer people are stopping to describe a problem, and far more code is arriving to fix it. That is exactly what you would expect when an agent's first move is to open a pull request rather than a conversation, and it lands on a maintainer's plate either way.

## Why human contributions matter

Looking at my own history, my first real involvement in open source was through the [polymer](https://github.com/Polymer/polymer) project. I contributed to this project enough that I became good friends with the maintainers, and eventually became a partial code owner myself. I also ended up maintaining various tools and related projects in the Polymer ecosystem, which later became the [lit](https://lit.dev/) ecosystem.

To this day, I am still friends with many of the original Polymer team, and learnt a large amount of what I know about open source from them. These are real, long term friendships, even though many of us no longer work on the same projects.

Going even more human, we can use [npmx](https://npmx.dev/) as a great example. In the last year, npmx has held several in-person meet ups which have directly resulted in connecting people who had never met before, and who now work together on open source projects. Again, these are real friendships.

That's all social, though. Human contributions also matter a lot for the project itself. For example, [Mateusz](https://bsky.app/profile/andarist.bsky.social) ran [changesets](https://github.com/changesets/changesets/) solo for years. Between 2021 and 2024, he was pretty much the only person committing to the project. A v3 had been on the cards since around 2021, but never moved much. From late 2024 onwards, [Bjorn](https://bsky.app/profile/bluwy.me) and [Adam](https://bsky.app/profile/haglund.dev) started contributing, stuck around, and [Changesets v3](https://changesets.dev/blog/announcing-changesets-v3) finally shipped. The three of them are now the primary maintainers, together.

Some work only happens when someone else turns up and stays. No volume of agentic patches gets you there.

## The lack of humanity

We have two kinds of agentic contribution:

- An agent-assisted human contribution - when a human uses an agent to help them make a contribution
- An end-to-end agentic contribution - when an agent makes a contribution and sees it through on its own, without any human involvement (regardless of if a human triggered it)

The agent-assisted contributions are a natural evolution of how we work as software engineers. Just another tool in our toolbox to help us get things done. These contributions are usually high quality, and the human behind them is still very much involved.

A huge change in the open source world is that we are now seeing a lot more end-to-end agentic contributions. Where we used to interact with a real human, we're just chatting to someone else's agent now.

I really miss seeing text that a human wrote. Every PR looks the same, every issue looks the same. All of them are a wall of text with nice headings, bullet point lists, and code blocks. I don't even need to read the words anymore to know it is an agentic contribution. The shape of it is enough.

<figure>
  <img class="img-framed" src="/assets/images/agentic-pr.jpg" alt="An agentic contribution">
  <figcaption>Shape of a typical agentic PR</figcaption>
</figure>

**The real problem, though, is that we're no longer speaking to a human. We've lost the humanity in open source.**

It takes a lot of time to parse these walls of text mentally, and gives no joy doing it. We also have no idea who we're talking to, or if they're even aware of this interaction.

Even if the change is correct, what's the point in responding? At that point I may as well copy the issue into my own agent and fix it myself, without the overhead of dealing with someone else's agent. That's the part that should worry us: the most rational move is to cut the other person out entirely, and I don't think anyone actually wants an ecosystem where that's true.

## The loss of community

The person behind the agent often has no idea this interaction is even happening. Even when they do, they're far less invested in it than when they were the ones communicating and making the contribution.

People used to contribute to projects repeatedly, and eventually become _contributors_. Even better, they would become _maintainers_. This is how communities are built, and how projects survive long term.

**Today, we very rarely gain new contributors, and even more rarely gain new maintainers. This directly results in the loss of community.**

In the past, a person could start a project, gain some contributors, and eventually some maintainers. In parallel, users would grow and start discussing enough that we now need a Discord server. Now we have a community! One of the best parts of open source is the community that forms around it.

Sadly, many projects now start with one person and stay that way. No human contributors to turn into maintainers, no users to turn into a community. Just a pile of agents spending each other's tokens.

## Pressure to create

Many projects have competition; other projects that do roughly the same thing with their own benefits and drawbacks. This is a good thing, as it drives progress and innovation.

Today, however, the competition is moving faster than ever with the help of agents. What should we do when we see this? Often the answer is to try to keep up, also with the help of agents.

This is a vicious cycle that leads to all sorts of problems rather than any good innovation. Projects which used to be the best at what they do are now bloated, unfocused, and average at many things instead.

It is worth remembering that a lot of the volume we're seeing isn't coming from outside the project at all. Some of it is us, the maintainers, shipping faster than we otherwise would because the tools let us and the competition appears to demand it.

For example, a tool I use regularly was once the best and fastest at one thing. Over the last year, it has gained more and more features well outside its original scope. Now it can do a bit of everything, at the cost of losing its original focus. Most of those changes have been shipped by the primary maintainer, who has been under pressure to keep up with the competition (which never had that same original scope).

You're allowed to not keep up. Rarely did a project die from shipping less than a competitor, and plenty have been ruined by trying to match one. **Being the best at one thing is a valid strategy, and it's usually why people picked you in the first place.**

## Burnout is increasing

All of this means more and more people are burning out and, increasingly often, leaving open source entirely (as a maintainer).

You might have seen the recent [AI health report](https://ai-health.syntax.fm/) by Syntax.fm. This is a good example of what we're seeing: higher burnout rates, higher pressure, reduced enjoyment.

There's no fun when you take humans out of the loop. Combine that with the higher stress and the higher volume of contributions, and you have a recipe for burnout.

Many high profile maintainers I am friends with have experienced burnout at some point in the last couple of years. Some have left open source entirely, and some have left the tech industry entirely. This is a huge loss for the open source world.

## What can we do about it?

This is a pretty dire post so far, but not all is bad. A lot of great things are happening in open source, and there is plenty we can do to make it better for all of us.

### Maintainers: Use tooling to filter out agentic spam

There are a few tools out there, but I particularly like [AgentScan](https://github.com/MatteoGabriele/agentscan) right now. As a maintainer, this gives you an easy way to detect end-to-end agentic contributions that are most likely spam or low quality. You can then triage these contributions accordingly, and focus your time on the human contributions that are more likely to be high quality.

Similarly, GitHub now offers a way to limit the maximum number of open pull requests per user. In high volume projects, this can be a good way to prevent mass agentic contributions from things like agentic bounty programs.

### Maintainers: Define an AI policy in `CONTRIBUTING.md`

Even if an agent isn't going to read this, it is a good idea to specify in your contribution guidelines what your policy is regarding AI contributions.

Each project is different, you may want to ban AI contributions entirely, or you may want to allow them with some restrictions. Either way, it is a good idea to make this clear in your contribution guidelines.

There are already some good examples out there to borrow from:

- [Nuxt](https://github.com/nuxt/nuxt/blob/main/CONTRIBUTING.md#ai-assisted-contributions) asks contributors to never let an LLM speak for them, and never let an LLM think for them. Use the tools, but understand and write your own words.
- [Vitest](https://github.com/vitest-dev/vitest/blob/main/CONTRIBUTING.md#ai-contributions) welcomes AI as an assistant but requires a real person behind every issue and pull request, with disclosure of the tool used. Anything that looks entirely automated gets labelled and closed after three days unless a human genuinely responds.
- [clack](https://github.com/bombshell-dev/clack/blob/main/.github/PULL_REQUEST_TEMPLATE.md#ai-generated-code-disclosure) takes a lighter approach with a disclosure checkbox in the pull request template. AI use is fine, reviewers just want to know so they can pay extra attention to edge cases.

These sit at quite different points on the spectrum, which is the point. Pick whichever fits your project, but pick something and write it down.

### Companies: Keep a human in the loop for upstream contributions

If your company makes heavy use of agentic workflows, here's the pitch: an increasing number of us reject end-to-end agentic contributions outright, on sight. If you want your upstream changes to actually land, you're much more likely to succeed if you keep a human in the loop.

One way of achieving this is a rule in your `CLAUDE.md`, `AGENTS.md`, or whatever your agents read. Have them stop before opening anything upstream, and have the human write the pull request or issue text themselves, and any replies that follow. Your agent can still do the investigation and the code.

I know this is slower and less convenient than letting it run end to end, but it means your change is far more likely to be merged.

### Contributors: Follow contribution guidelines

Most open source projects have contribution guidelines. These are usually in a `CONTRIBUTING.md` file, and outline how to contribute to the project.

If you're thinking of contributing, whether through issues or pull requests, please read these guidelines first. Similarly, if the repository has a pre-defined template when you open such an issue or pull request, please use it.

This added structure helps maintainers gain an understanding of your contribution much faster than they would otherwise. The benefit is yours as much as the maintainer's, as it will help you get your contribution merged faster.

### Contributors: Write the text yourself

Most of us don't mind if you use an agent to help investigate an issue, or to help write the code. The important part is that you write the text of the issue or pull request yourself, and you respond when we post a comment.

Not only will this give us a better experience, but it'll also lead to you having a better understanding of the change. Writing things down yourself is a good way to learn, and will help you become a better contributor.

### Contributors: Communities are still forming, join them!

My two prime examples of this are [e18e](https://e18e.dev/) and [npmx](https://npmx.dev/). Both of these projects have incredible communities behind them, built up from humans who care, and who are invested in the project. These communities are growing, and are a joy to be a part of.

In the case of e18e, we somehow managed to find hundreds of people who truly care about making the JavaScript ecosystem faster and more secure. Everyone wants this really, but it is pretty niche to want to _help make it happen_. The fact that we have hundreds of people actively contributing to this effort on a regular basis is incredible, and a testament to the fact that communities are still forming in open source.

npmx is an even starker example, given how young it is. Here's what its first 40 days looked like:

| Metric | Value |
| -- | -- |
| PRs opened | 1,412 |
| PRs merged | 1,192 (84%) |
| Unique PR authors | 224 (205 merged) |
| Issues opened | 497 |
| Issues closed | 401 |
| Comments on PRs | 5,283 |
| Commits | 1,437 |
| Distinct commit authors | 212 |

That's forty days. Compare it to the annual numbers earlier in this post and it holds its own against projects many years older. **The difference is that almost all of it was written by humans.** 224 people opened those pull requests, 212 of them landed commits, and they left over five thousand comments on each other's work. An 84% merge rate on top of that, because people were building something together rather than firing contributions into the void.

We may have fewer communities today, but they do exist and are still forming. I'd highly recommend joining one you're interested in.

## Wrapping up

**Community and humanity are fundamental to a healthy open source ecosystem.**

Without these, projects will die, maintainers will burn out, and people will be disconnected from each other. Not only maintainers, but contributors and users too. Open source is about more than just code; it's about people, and the relationships we build with each other.

**Be human.**
