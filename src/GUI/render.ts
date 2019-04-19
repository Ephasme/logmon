import { IState, IBatchState, IBasicState, IApplicationSettings } from "../Stats/types";
import { Map } from "immutable";
import moment = require("moment");

export const maybeGetBatch = (batch: IBatchState): IBatchState | null =>
    batch.sections.size > 0 ? batch : null;

export function getBatch(state: IState) {
    return maybeGetBatch(state.currentBatch) ||
           maybeGetBatch(state.lastValidBatch);
}

export interface IGui {
    render(state: IState, appSettings: IApplicationSettings, now: Date, lastRender: Date): void;
}

export function createGui(clear: () => void, display: (input: string) => void) {
    type BasicStateWithKey = IBasicState & { key: string };
    
    function most<T>(all: Map<string, BasicStateWithKey>, selector: (batch: BasicStateWithKey) => T, name: string) {
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
        render: (state: IState, appSettings: IApplicationSettings, now: Date, lastRender: Date) => {
            const momentNow = moment(now);
            const timespan = moment.duration(momentNow.diff(lastRender)).asSeconds();
            const batch = getBatch(state);
            clear();

            if (state.alert.status === "off") {
                const message = state.alert.message.get(0);
                if (message && message.type === "alert") {
                    display("");
                    display(`/!\\ Alert:\t${alertMessage(message.hits, message.time)}`);
                    display("");
                } else if (message && message.type === "recover") {
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
            display("Settings:");
            display(`    - Overload duration:\t\t${state.alert.overloadDuration}/${appSettings.maxOverloadDuration}`);
            display(`    - Max hits per second:\t\t${appSettings.maxHitsPerSeconds}`);
            display(`    - Monitored file:\t\t\t${appSettings.filename}`);


            const allBatchesWithKeys = state.allBatches.sections
                .map((x, key) => ({ ...x, key }));

            const mostVisits = most(allBatchesWithKeys, (x) => x.hits, "hit(s)");
            const mostErrorProne = most(allBatchesWithKeys, (x) => x.errors, "error(s)");
            display("");
            display("Global stats:");
            display(`    - Most visited section:\t\t${mostVisits}`);
            display(`    - Most buggy section:\t\t${mostErrorProne}`);
            display(`    - Total hits:\t\t\t\t${state.allBatches.hits} hit(s)`);
            display(`    - Avg hits/s:\t\t\t\t${state.allBatches.hits / timespan}`);
            display(`    - Total traffic:\t\t\t${state.allBatches.traffic} b`);

            function displaySections(state: [string, IBasicState][]) {
                for (const [key, data] of state) {
                    display(`${key}: ${data.traffic} bytes in ${data.hits} hit(s) (${data.errors} error(s))`)
                }
            }

            display("");
            display("Current batch:");
            display(`    - Current batch traffic:\t${state.currentBatch.traffic}`);
            display(`    - Current batch hits/s:\t\t${state.currentBatch.hits / timespan}`);

            display("");
            display("Sections details:")
            display("Last updated at " + now.toLocaleString());
            display("");
            if (batch) {
                displaySections(batch.sections.toArray());
            } else {
                displaySections([]);
            }

            display("");
            display("> Made with love by Ephasme... <3");
            display("> Press ESC, a, or C-c to quit.");
        }
    }
}