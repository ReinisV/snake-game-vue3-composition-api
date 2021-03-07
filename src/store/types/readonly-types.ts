// i would love to use the definition from Vue, but it has only root DeepReadonly,
// it doesnt expose DeepReadonlyArray, so I can't comfortably use it in my code

export type DeepReadonly<T> =
    T extends (infer R)[] ? DeepReadonlyArray<R> :
    T extends Function ? T :
    T extends object ? DeepReadonlyObject<T> :
    T;

export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>

export type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepNonReadonly<T> =
    T extends DeepReadonlyObject<infer R> ? R :
    T extends (DeepReadonlyArray<infer R>)[] ? R :
    T extends Function ? T :
    T extends DeepReadonlyObject<object> ? T :
    T;
