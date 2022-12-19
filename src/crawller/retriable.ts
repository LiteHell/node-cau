export async function withRetries<T> (target: () => Promise<T>, retryCount: number): Promise<T> {
    while (retryCount > 0) {
        try {
            return await target();
        } catch(err) {
            if (retryCount <= 0)
                throw err;
            retryCount--;
        }
    }
    throw new Error('Retriable function failed');
}