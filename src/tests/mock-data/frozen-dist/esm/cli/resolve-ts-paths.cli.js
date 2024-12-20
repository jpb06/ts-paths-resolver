#!/usr/bin/env node
import { runPromise } from 'effect-errors';
import { resolveTsPaths } from '../workflow/resolve-ts-paths.workflow.js';
import { validateArguments } from './args/validate-args.js';
(async () => {
    const args = validateArguments();
    await runPromise(resolveTsPaths(args));
})();
//# sourceMappingURL=resolve-ts-paths.cli.js.map