# LogMon

## Install and run

Install docker then run:

```sh
docker-compose up --build
```

It's composed of two dockers, one that is the expected program, the other is writing ficticious logs into the shared access.log.
You can start/stop the second docker in order to check the alert functionnality.

The program has currently 86% code coverage and 50+ unit tests including 4 GUI tests with snapshots.

To run the tests: `yarn run test`
To run the coverage: `yarn run test:cover`

The coverage infos are located at `./coverage/lcov-report/index.html`
You can run those from within a browser.

## Satisfactory things

This projet is assumely over engineered, the goal is to show-off my knowledge and the way I would try to tackle a bigger problem.

I'm using:

 - GUI and logic unit testing,
 - pure DI for IoC,
 - immutable states for mutations,
 - decoupled rendering from business logic,
 - highly modularized and isolated code.

 ## Unsatisfactory things

 If I were to restart this I would have chosen not to use the 10 seconds span for monitoring the log file.
 I think I should use more the dates from the logs instead of the Date object from javascript because if the log is written in a highly asynchronous manner I think it might fail to represent the reality. That's my biggest regret but I didn't have the time to restart when I realised that.

 I think the reducing state logic could be clearer and I could use action instead of just input parameters.

 I might have need a pipeline in order to sequence the states modifications but that requires more thinking.

 ## Improvements

 I think I would try to work on a better UI and add more informations like some graphs representing the activity.
 I would improve the metrics I display:
  - Find correlations between metrics (hits and time for example) in order to identify potential actions.
  - Display the most active users (possibly DDoS sources).

## Conclusion

Thanks for everything, I hope that my little program will please you, it's not perfect but I tried my best.