declare const InvalidTsConfigFileError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "invalid-tsconfig-file-error";
} & Readonly<A>;
export declare class InvalidTsConfigFileError extends InvalidTsConfigFileError_base<{
    cause?: unknown;
    message?: string;
}> {
}
export {};
