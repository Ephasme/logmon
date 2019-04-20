import { truncateSync } from "fs";
import * as yargs from "yargs";
import { writeLogLines } from "./logWriter";

const args = yargs
    .options("filename", {
        default: "/tmp/access.log",
    })
    .argv;

truncateSync(args.filename);
writeLogLines(args.filename);
