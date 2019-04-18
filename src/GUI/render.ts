import { IState, IBatchState, IBasicState, IApplicationSettings } from "../Stats/types";
import { Map } from "immutable";
import moment = require("moment");
import { file } from "@babel/types";

export const maybeGetBatch = (batch: IBatchState): IBatchState | null =>
    batch.sections.size > 0 ? batch : null;

export function getBatch(state: IState) {
    return maybeGetBatch(state.currentBatch) ||
           maybeGetBatch(state.lastValidBatch);
}

export interface IGui {
    render(): void;
}

export function createGui() {
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

    let lastRender = moment();

    return {
        render: (state: IState, appSettings: IApplicationSettings) => {
            const now = moment();
            const timespan = moment.duration(now.diff(lastRender)).asSeconds();
            const batch = getBatch(state);
            console.clear();

            if (state.alert.status === "off") {
                const message = state.alert.message.get(0);
                if (message && message.type === "alert") {
                    console.log("");
                    console.log(`/!\\ Alert:\t${alertMessage(message.hits, message.time)}`);
                    console.log("");
                } else if (message && message.type === "recover") {
                    console.log("");
                    console.log(`[o] Info:\t${recoverMessage(message.time)}`);
                    console.log("");
                }
            }            

            lastRender = now;

            console.log("Welcome to LogMon - an access log monitoring console application.\n" +
            "\n" +
            "You can use options to customize the timing, \n" +
            "and the alerting behaviour (see --help command for more infos).");

            console.log("");
            console.log("Settings:");
            console.log(`    - Overload duration:\t${state.alert.overloadDuration}/${appSettings.maxOverloadDuration}`);
            console.log(`    - Max hits per second:\t${appSettings.maxHitsPerSeconds}`);
            console.log(`    - Monitored file:\t\t${appSettings.filename}`);


            const allBatchesWithKeys = state.allBatches.sections
                .map((x, key) => ({ ...x, key }));

            const mostVisits = most(allBatchesWithKeys, (x) => x.hits, "hit(s)");
            const mostErrorProne = most(allBatchesWithKeys, (x) => x.errors, "error(s)");
            console.log("");
            console.log("Global stats:");
            console.log(`    - Most visited section:\t${mostVisits}`);
            console.log(`    - Most buggy section:\t${mostErrorProne}`);
            console.log(`    - Total hits:\t\t${state.allBatches.hits} hit(s)`);
            console.log(`    - Avg hits/s:\t\t${state.allBatches.hits / timespan}`);
            console.log(`    - Total traffic:\t\t${state.allBatches.traffic} b`);

            function displaySections(state: [string, IBasicState][]) {
                for (const [key, data] of state) {
                    console.log(`${key}: ${data.traffic} bytes in ${data.hits} hit(s) (${data.errors} error(s))`)
                }
            }

            console.log("");
            console.log("Current batch:");
            console.log(`    - Current batch traffic:\t${state.currentBatch.traffic}`);
            console.log(`    - Current batch hits/s:\t${state.currentBatch.hits / timespan}`);

            console.log("");
            console.log("Sections details:")
            console.log("Last updated at " + state.lastUpdated.toLocaleString());
            console.log("");
            if (batch) {
                displaySections(batch.sections.toArray());
            } else {
                displaySections([]);
            }

            console.log("");
            console.log("> Made with love by Ephasme... <3");
            console.log("> Press ESC, a, or C-c to quit.");
        }
    }
}

const gui = createGui();

export function render(state: IState, appSettings: IApplicationSettings) {
    gui.render(state, appSettings);
}