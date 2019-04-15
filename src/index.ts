import { kernel } from "./Container";
import { Stats } from "./Stats/Stats";

const DEFAULT_FILE_NAME = "/tmp/access.log";
const watcher = kernel.createLogWatcher(DEFAULT_FILE_NAME);

const stats = new Stats();

watcher.subscribe(stats.onLog.bind(stats));

stats.run();

console.log("Application started:")
console.log(`   * watching ${DEFAULT_FILE_NAME}`)

watcher.watch();
