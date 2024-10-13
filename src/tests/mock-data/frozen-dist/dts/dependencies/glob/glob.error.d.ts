declare const GlobError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "glob-error";
} & Readonly<A>;
export declare class GlobError extends GlobError_base<{
    cause?: unknown;
    message?: string;
}> {
}
export {};
