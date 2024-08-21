import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage<{
  requestId: string;
}>();

export const getAsyncStorageRequestId = () => {
  const storage = asyncLocalStorage.getStore();

  return storage?.requestId;
};
