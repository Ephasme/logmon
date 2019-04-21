import * as yargs from "yargs";
import { writeLogLines, truncate } from "./logWriter";

const args = yargs
    .options("filename", {
        default: "/tmp/access.log",
    })
    .argv;

truncate(args.filename);
writeLogLines(args.filename);
