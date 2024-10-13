declare const FsError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "fs-error";
} & Readonly<A>;
export declare class FsError extends FsError_base<{
    cause?: unknown;
    message?: string;
}> {
}
export {};
