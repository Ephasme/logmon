import { Map } from "immutable";
import moment = require("moment");
import { IBasicStats } from "../Store/analysis/utils/createBasicStatsFrom";
import { RootState } from "../Store/states";
import { Seconds } from "../Utils/units";

export interface IGui {
    render(now: Date): void;
}

/**
 * This is a factory responsibe for GUI creation.
 * @param clear a function that clears the UI
 * @param display a function that displays a line to the UI
 */
export function createGui(clear: () => void, display: (input: string) => void) {
    type BasicStatsWithKey = IBasicStats & { key: string };
    
    function most<T>(all: Map<string, BasicStatsWithKey>, selector: (batch: BasicStatsWithKey) => T, name: string) {
        const mostVisited = all.maxBy(selector);
        if (mostVisited) {
            return `${mostVisited.key} (${selector(mostVisited)} ${name})`
        }
        return "";
    }

    const alertMessage = (value: number, now: Date) =>
        `High traffic generated an alert - hits = ${value}, triggered at ${now.toLocaleString()}`;

    const recoverMessage = (now: Date) =>
        `Recovered from high traffic at ${now}`;

    return {
        render: (state: RootState, now: Date, elapsed: Seconds,
                 maxHitsPerSecond: number, maxOverloadDuration: Seconds,
                 filename: string) => {
            clear();
                    console.log(elapsed);
            if (state.alert.status === "TRIGGERED") {
                const message = state.alert.message;
                if (message && message.type === "alert") {
                    display("");
                    display(`/!\\ Alert:\t${alertMessage(message.hits, message.time)}`);
                    display("");
                } else if (message && message.type === "info") {
                    display("");
                    display(`[o] Info:\t${recoverMessage(message.time)}`);
                    display("");
                }
            }            

            display("Welcome to LogMon - an access log monitoring console application.\n" +
            "\n" +
            "You can use options to customize the timing, \n" +
            "and the alerting behaviour (see --help command for more infos).");
            display("");
            display("Last updated at " + now.toLocaleString());

            display("");
            display("");
            display("Settings:");
            display(`    - Overload duration:\t\t${state.alert.overloadDuration.sec}/${maxOverloadDuration.sec}`);
            display(`    - Max hits per second:\t\t${maxHitsPerSecond}`);
            display(`    - Monitored file:\t\t\t${filename}`);


            const allBatchesWithKeys = state.analysis.sections
                .map((x, key) => ({ ...x, key }));

            const mostVisits = most(allBatchesWithKeys, (x) => x.hits, "hit(s)");
            const mostErrorProne = most(allBatchesWithKeys, (x) => x.errors, "error(s)");
            display("");
            display("Global stats:");
            display(`    - Most visited section:\t\t${mostVisits}`);
            display(`    - Most buggy section:\t\t${mostErrorProne}`);
            display(`    - Total hits:\t\t\t${state.analysis.totalAll.hits} hit(s)`);
            display(`    - Avg hits/s:\t\t\t${state.analysis.totalAll.hits / elapsed.sec}`);
            display(`    - Total traffic:\t\t\t${state.analysis.totalAll.traffic} b`);

            display("");
            display("Current batch:");
            display(`    - Current batch traffic:\t\t${state.analysis.totalBatch.traffic}`);
            display(`    - Current batch hits/s:\t\t${state.analysis.totalBatch.hits / elapsed.sec}`);

            display("");
            display("Sections details:")
            display("");
            
            for (const [key, data] of state.analysis.sections.toArray()) {
                display(`${key}: ${data.traffic} bytes in ${data.hits} hit(s) (${data.errors} error(s))`)
            }

            display("");
            display("> Made with love by Ephasme... <3");
            display("> Press ESC, a, or C-c to quit.");
        }
    }
}