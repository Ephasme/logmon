# LogMon

Access log monitoring application, a hiring project for Datadog.

## Installation

### Local

**Requirements**
* You must have nodejs intalled version >11.
* You must have yarn installed version >1.15.2.

Run:

```sh
yarn install
yarn start
```

In order to start the program. You can use the `--help` option in order to get more information about the options.

### Docker

**Requirements**
* You must have docker installed and running on your machine.

Run:
```sh
docker-compose up
```

In order to start in debug mode. This will start two containers which are:

+ **logmon** the container running the actual application.
+ **logwriter** the container writing fake logs to the `/tmp/access.log` file.

If you want to start logmon only you can do it with those commands:

```sh
docker build --rm --tag logmon:latest .
docker run -ti logmon
```

## Remarks

This project took a bit more time than expected because I started with an idea (having a single update framerate of 10 seconds). I was deeply disatisfied with this method and I decided to rethink my structure in order to get rid of this constraint.

Today each parts are separate and can have a resfresh rate on its own. The rendering itself is not correlated with the data processing tasks.

I truly wanted to have something which is qualitative so I took the time to write a lot more tests than expected by the exercice. In the end you'll find more than 50 unit tests comprising 4 GUI tests with snapshots to ensure the rendering is always good whatever refactoring I decide to do.

The code is very testable with a lot of IoC handled by a Poor man DI.

I didn't comment the methods because I think the code is well structured enough to avoid extraneous comments.

## Improvements

Obviously I would write a documentation in order to explain fully all the options and all the displayed infos. I think I would also try to use some graphical console interface like ncurse or blessed.

I think that structurally I would try not to put the logs in the state since I think that it belongs to the payloads.

Globally I would improve the testability by decoupling even more the different parts of the application with types and interfaces.

## Conclusion

Thanks for letting me test my skills on this nice little project, it has buged me quite a lot these days and I enjoyed working on it.

I did my best and I hope it will please you.