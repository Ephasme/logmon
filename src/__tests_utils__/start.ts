import { writeLogLines } from "./logWriter";
import * as yargs from "yargs";

const args = yargs
    .options("filename", {
        default: "/tmp/access.log",
    })
    .argv;

writeLogLines(args.filename);