import { IState, IBatchState } from "../Stats/types";
import * as blessed from "blessed";

export const maybeGetBatch = (batch: IBatchState): IBatchState | null =>
    batch.sections.size > 0 ? batch : null;

export function getBatch(state: IState) {
    return maybeGetBatch(state.currentBatch) ||
           maybeGetBatch(state.lastValidBatch);
}

export function batchToTableData(state: IBatchState) {
    return state.sections.reduce((acc, el, key) => {
        return [ ...acc, [ key, el.hits.toString(), el.traffic.toString(), el.errors.toString() ]];
    }, []);
}

export function render(state: IState) {
    const screen = blessed.screen();
    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
    
    const banner = blessed.box({
        content: "Welcome to LogMon - this application monitors your access log file."
    });
    const escapeBox = blessed.box({
        top: 1,
        left: 5,
        content: "Press escape, Q or C-c to exit." });
    const batch = getBatch(state);
    const batchTable = blessed.table({
        top: 1,
        data: batch ? batchToTableData(batch) : undefined,
    });

    screen.append(banner);
    screen.append(escapeBox);
    screen.append(batchTable);

    screen.render();
}