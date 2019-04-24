import { Map } from "immutable";
import { IBasicStats } from "../Store/analysis/utils/createBasicStatsFrom";
import { RootState } from "../Store/states";
import { ISeconds } from "../Utils/units";
// tslint:disable: max-line-length

export interface IGui {
    render(state: RootState, now: Date, maxHitsPerSecond: number,
           maxOverloadDuration: ISeconds, filename: string): void;
}

/**
 * This is a factory responsibe for GUI creation.
 * @param clear a function that clears the UI
 * @param display a function that displays a line to the UI
 */
export function createGui(clear: () => void, display: (input: string) => void): IGui {
    type BasicStatsWithKey = IBasicStats & { key: string };

    function most<T>(all: Map<string, BasicStatsWithKey>, selector: (batch: BasicStatsWithKey) => T, name: string) {
        const mostVisited = all.maxBy(selector);
        if (mostVisited) {
            return `${mostVisited.key} (${selector(mostVisited)} ${name})`;
        }
        return "-";
    }

    const alertMessage = (value: number, now: Date) =>
        `High traffic generated an alert - hits = ${value}, triggered at ${now.toUTCString()}`;

    const recoverMessage = (now: Date) =>
        `Recovered from high traffic at ${now.toUTCString()}`;

    return {
        render: (state: RootState, now: Date, maxHitsPerSecond: number,
                 maxOverloadDuration: ISeconds, filename: string) => {
            clear();

            for (const message of state.load.messages) {
                 if (message && message.type === "alert") {
                    display(`/!\\ Alert: ${alertMessage(message.hits, message.time)}`);
                } else if (message && message.type === "info") {
                    display(`[o] Info: ${recoverMessage(message.time)}`);
                }
            }

            if (state.load.messages.size > 0) {
                display("");
            }

            display("Welcome to LogMon - an access log monitoring console application.\n" +
            "\n" +
            "You can use options to customize the timing, \n" +
            "and the alerting behaviour (see --help command for more infos).");
            display("");
            display("Last updated at " + now.toUTCString());

            display("");
            display("");
            display("Settings:");
            display(`    - Overload duration:     ${state.load.overloadDuration.sec}/${maxOverloadDuration.sec}`);
            display(`    - Max hits per second:   ${maxHitsPerSecond}`);
            display(`    - Monitored file:        ${filename}`);

            const allBatchesWithKeys = state.analysis.sections
                .map((x, key) => ({ ...x, key }));

            const mostVisits = most(allBatchesWithKeys, (x) => x.hits, "hit(s)");
            const mostErrorProne = most(allBatchesWithKeys, (x) => x.errors, "error(s)");
            display("");
            display("Global stats:");
            display(`    - Most visited section:  ${mostVisits}`);
            display(`    - Most buggy section:    ${mostErrorProne}`);
            display(`    - Total hits:            ${state.analysis.totalAll.hits} hit(s)`);
            display(`    - Avg hits/s:            ${(state.analysis.totalAll.hits / state.analysis.totalAll.timespan.sec || 0).toFixed(2)}`);
            display(`    - Total traffic:         ${state.analysis.totalAll.traffic} b`);

            display("");
            display("Current batch:");
            display(`    - Current batch traffic: ${state.analysis.totalBatch.traffic}`);
            display(`    - Current batch hits/s:  ${((state.analysis.totalBatch.hits / state.analysis.totalBatch.timespan.sec) || 0).toFixed(2)}`);

            display("");
            display("Sections details:");
            display("");

            for (const [key, data] of state.analysis.sections.toArray()) {
                display(`${key}: ${data.traffic} bytes in ${data.hits} hit(s) (${data.errors} error(s))`);
            }

            display("");
            display("> Handcrafted with care for Datadog by Ephasme... <3");
            display("> Press C-c to quit.");
        },
    };
}
