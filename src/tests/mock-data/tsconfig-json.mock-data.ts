export const tsconfigMockData = `{
	"exclude": ["./vite.config.mts"],
	"compilerOptions": {
		"lib": ["ES2023", "ES2023.Array", "DOM", "DOM.Iterable"],
		"types": ["node"],
		"target": "ESNext",
		"module": "NodeNext",
		"moduleDetection": "force",
		"allowJs": false,
		"incremental": false,
		"composite": false,
		"moduleResolution": "NodeNext",
		"noEmit": true,
		"strict": true,
		"skipLibCheck": true,
		"noFallthroughCasesInSwitch": true,
		"downlevelIteration": true,
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noImplicitReturns": false,
		"noUnusedLocals": true,
		"noUnusedParameters": false,
		"noEmitOnError": false,
		"noErrorTruncation": false,
		"noImplicitAny": true,
		"noImplicitThis": true,
		"noUncheckedIndexedAccess": false,
		"strictNullChecks": true,
		"exactOptionalPropertyTypes": true,
		"noPropertyAccessFromIndexSignature": true,
		"rootDir": "./src",
		"paths": {
			"@dependencies/*": ["./src/dependencies/*"],
			"@inputs": ["./src/workflow/inputs/index.ts"],
			"@regex": ["./src/workflow/logic/regex/regex.ts"],
			"@tests/mocks": ["./src/tests/mocks/index.ts"],
			"@tests/mock-data": ["./src/tests/mock-data/index.ts"]
		}
	}
}
`;
