export declare function withRetries<T>(target: () => Promise<T>, retryCount: number): Promise<T>;
