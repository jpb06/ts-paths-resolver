#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_errors_1 = require("effect-errors");
const resolve_ts_paths_workflow_js_1 = require("../workflow/resolve-ts-paths.workflow.js");
const validate_args_js_1 = require("./args/validate-args.js");
(async () => {
    const args = (0, validate_args_js_1.validateArguments)();
    await (0, effect_errors_1.runPromise)((0, resolve_ts_paths_workflow_js_1.resolveTsPaths)(args));
})();
//# sourceMappingURL=resolve-ts-paths.cli.js.map