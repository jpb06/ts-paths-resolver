export const transpiledEsmWithMultipleSimilarImportsMockData = `import { Effect, pipe } from 'effect';
import { writeFileEffect } from '@dependencies/fs/index.js';
import { writeFileEffect } from '@dependencies/http/index.js';
import { writeFileEffect } from '@dependencies/yolo/cool/bro/index.js';
import { requirePathRegex } from '@regex';
import { resolveFullPath } from '../../resolve-path/resolve-full-path.js';`;
