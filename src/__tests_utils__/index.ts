import { writeLogLines } from "./logWriter";
import * as yargs from "yargs";
import { truncateSync } from "fs";

const args = yargs
    .options("filename", {
        default: "/tmp/access.log",
    })
    .argv;

truncateSync(args.filename)
writeLogLines(args.filename);