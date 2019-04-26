import * as readline from "readline";
import * as yargs from "yargs";
import { TestWriter, truncate } from "./logWriter";

const writer = new TestWriter();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "O>",
});
rl.on("line", (line) => {
    switch (line.trim()) {
        case "++":
            writer.speed += 50;
            console.log(writer.speed);
            break;
        case "+":
            writer.speed += 10;
            console.log(writer.speed);
            break;
        case "-":
            writer.speed -= 10;
            console.log(writer.speed);
            break;
        case "--":
            writer.speed -= 50;
            console.log(writer.speed);
            break;
    }
    rl.prompt();
}).on("close", () => {
    process.exit(0);
});

const args = yargs
    .options("filename", {
        default: "/tmp/access.log",
    })
    .argv;

truncate(args.filename);
writer.writeLogLines(args.filename);
rl.prompt();
