import { IState, IBatchState, IBasicState } from "../Stats/types";
import { Map } from "immutable";
import * as blessed from "blessed";

export const maybeGetBatch = (batch: IBatchState): IBatchState | null =>
    batch.sections.size > 0 ? batch : null;

export function getBatch(state: IState) {
    return maybeGetBatch(state.currentBatch) ||
           maybeGetBatch(state.lastValidBatch);
}

export function batchToTableData(state?: [string, IBasicState][]): string[][] {
    return (state || []).reduce((acc, [idx, el]) => {
        return [ ...acc, [ idx, el.hits.toString(), el.traffic.toString(), el.errors.toString() ]];
    }, [["section", "hits", "traffic", "errors"]]);
}

export interface IGui {
    render(): void;
}

export function createGui() {
    const screen = blessed.screen({
        smartCSR: true,
        title: "LogMon",
    });

    const alert = blessed.box({
        parent: screen,
        top: 0,
        style: {
            bg: "red",
            fg: "white",
        },
        content: "ALERT:\nSome alert",
    })

    const header = blessed.box({
        parent: screen,
        top: 2,
        content: "Welcome to LogMon - an access log monitoring console application.\n" +
                 "\n" +
                 "You can use options to customize the timing, \n" +
                 "and the alerting behaviour (see --help command for more infos).\n" +
                 "\n" +
                 "> Made with love by Ephasme... <3\n" +
                 "> Press ESC, a, or C-c to quit.",

    });

    const globalStats = blessed.box({
        top: <number>header.top + 7,
        parent: screen,
    });

    const listtableTitle = blessed.box({
        parent: screen,
        top: <number>globalStats.top + 8,
        content: "Last batch statistics:"
    });
    
    const listtableDate = blessed.box({
        parent: screen,
        top: <number>listtableTitle.top + 1,
        content: "Last update:",
    });

    const listtable = blessed.listtable({
        parent: screen,
        border: "line",
        top: <number>listtableDate.top + 1,
        scrollable: true,
        height: "100%-22",
        width: "50%",
        data: [],
    });

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    type BasicStateWithKey = IBasicState & { key: string };
    
    function most<T>(all: Map<string, BasicStateWithKey>, selector: (batch: BasicStateWithKey) => T, name: string) {
        const mostVisited = all.maxBy(selector);
        if (mostVisited) {
            return `${mostVisited.key} (${selector(mostVisited)} ${name})`
        }
        return "";
    }

    const alertMessage = (value: number, now: Date) =>
        `High traffic generated an alert - hits = ${value}, triggered at ${now}`;

    const recoverMessage = (now: Date) =>
        `Recovered from high traffic at ${now}`;

    return {
        render: (state: IState) => {
            const batch = getBatch(state);

            if (state.alert.status === "off") {
                const message = state.alert.message.get(0);
                if (message && message.type === "alert") {
                    alert.setContent(`Alert:\n\t${alertMessage(message.hits, message.time)}`);
                    alert.show();
                } else if (message && message.type === "recover") {
                    alert.setContent(`Alert:\n\t${recoverMessage(message.time)}`);
                    alert.show();
                }
            } else {
                alert.hide();
            }

            if (batch) {
                listtable.setData(batchToTableData(batch.sections.toArray()));
            } else {
                listtable.setData(batchToTableData());
            }
            listtableDate.setContent(state.lastUpdated.toLocaleString());

            const allBatchesWithKeys = state.allBatches.sections
                .map((x, key) => ({ ...x, key }));

            const mostVisits = most(allBatchesWithKeys, (x) => x.hits, "hit(s)");
            const mostErrorProne = most(allBatchesWithKeys, (x) => x.errors, "error(s)");
            globalStats.setContent(`
Global stats:
    
    Most visited section: ${mostVisits}
    Most buggy section: ${mostErrorProne}
    Total hits: ${state.allBatches.hits} hit(s)
    Total traffic: ${state.allBatches.traffic} b`)

            screen.render();
        }
    }
}

const gui = createGui();

export function render(state: IState) {
    gui.render(state);
}