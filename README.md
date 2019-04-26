# LogMon

Access log monitoring application, a demo project for Datadog.

## Installation

### Local

**Requirements**
* You must have nodejs intalled version >11.
* You must have yarn installed version >1.15.2.

In order to start the program you can run:

```sh
yarn install
yarn build
yarn start
```

You can use the `--help` option in order to get more information about the options.

### Docker

In order to use Docker, you must have it installed and running on your machine.

Run:
```sh
docker-compose up
```

This will start two containers which are:

+ **logmon** the container running the actual application.
+ **logwriter** the container writing fake logs to the `/tmp/access.log` file.

If you want to control logwriter from within docker you can attach to it with:

```sh
docker attach logwriter
```

If you want to start logmon only you can do it with those commands:

```sh
docker build --rm --tag logmon .
docker run -ti logmon
```

## LogWriter debug app

The logwriter test application is interactive: you can control the speed of log writing with the prompt in order to test the alerting logic.

The commands are:
**++** to increase the delay by 50 ms
**+** to increase the delay by 10 ms
**-** to decrease the delay by 10 ms
**--** to decrease the delay by 50 ms

You must hit enter to validate your commands.
It is set to 100 ms delay by default which will approximatively represent 10 hits per seconds.

## Remarks

This project took a bit more time than expected (around 12/14 hours I think) because I started with an idea (having a single update framerate of 10 seconds). I was deeply disatisfied with this method and I decided to rethink my structure in order to get rid of this issue.

Today each parts are separate and can have a resfresh rate on its own. The rendering itself is not correlated with the data processing tasks which allows for different rendering strategies to be implemented without having to change the monitoring logic.

I truly wanted to have something which is qualitative so I took the time to write a lot more tests than expected by the exercice. In the end you'll find more than 60 unit tests comprising 5 GUI tests with snapshots to ensure the rendering is always good whatever refactoring I decide to do. The code coverage is over 99%.

The code is very testable with a lot of IoC handled by a Poor man DI.
I believe that all of this make my code highly maintainable and largely SOLID since all you have to do to add new features is to add new sections in the store and implement new reducers and actions (largely inspired by redux).

I didn't add much comments because I believe that the code should speak by itself without requiring additionnal explanation. Plus comments have the tendency to become outdated real quick. 

## Improvements

Obviously I would write a full documentation in order to explain fully all the options and all the displayed infos. I think I would also try to use some graphical console interface like ncurse or blessed.

I think that structurally I would try not to put the logs in the state since I think that it belongs to the payloads.

Globally I would improve the testability by decoupling even more the different parts of the application with types and interfaces.

I would also do some performance checks in order to make sure it would scale.

## Conclusion

Thanks for letting me test my skills on this nice little project, it has buged me quite a lot these days and I enjoyed working on it.

I did my best and I hope it will please you.