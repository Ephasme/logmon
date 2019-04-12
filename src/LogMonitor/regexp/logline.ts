
// tslint:disable
export const logLinePattern = () =>
    /(?<domain>[^ ]*) (?<hyphen>[^ ]*) (?<userid>[^ ]*) \[(?<time>[^]*)\] "(?<action>[^"]*)" (?<resultcode>[^ ]*) (?<duration>[^ ]*)/gm;
