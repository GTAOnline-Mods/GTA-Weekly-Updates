export function mergeObject<T>(obj1: T, obj2: T, obj3: T): T {
  const returnObj = {
    ...obj3,
    ...obj2,
    ...obj1,
  };

  for (let attr of Object.keys(returnObj)) {
    let val =
      (obj2 as any)[attr] !== (obj1 as any)[attr]
        ? (obj2 as any)[attr]
        : (obj3 as any)[attr] !== undefined
        ? (obj3 as any)[attr]
        : (obj1 as any)[attr];

    if (val) {
      (returnObj as any)[attr] = val;
    } else if (!(returnObj as any)[attr]) {
      delete (returnObj as any)[attr];
    }
  }

  return returnObj;
}

// tslint:disable-next-line: export-name
export function mergeArrays<T>(
  oldCollection: T[],
  updatedCollection: T[],
  remoteCollection: T[],
  uniqueIdentifier: (item: T) => string | number
): T[] {
  const oldIds = oldCollection.map(uniqueIdentifier);
  const updatedIds = updatedCollection.map(uniqueIdentifier);
  const remoteIds = remoteCollection.map(uniqueIdentifier);

  const remoteRemovals = oldIds.filter((i) => !remoteIds.includes(i));

  const localUpdates = updatedCollection
    .filter((i) => {
      const id = uniqueIdentifier(i);
      const oldItem = oldCollection.find((_i) => uniqueIdentifier(_i) === id);
      if (oldItem) {
        for (let attr of Object.keys(oldItem).concat(Object.keys(i))) {
          if ((i as any)[attr] !== (oldItem as any)[attr]) {
            return true;
          }
        }
      } else {
        return true;
      }
      return false;
    })
    .map(uniqueIdentifier);

  const resultCollection = updatedCollection
    .filter(
      (i) =>
        localUpdates.includes(uniqueIdentifier(i)) ||
        !remoteRemovals.includes(uniqueIdentifier(i))
    )
    .map((i) => {
      const id = uniqueIdentifier(i);
      const oldItem =
        oldCollection.find((_i) => {
          const _id = uniqueIdentifier(_i);
          return _id === id;
        }) || {};

      const remoteItem =
        remoteCollection.find((_i) => {
          const _id = uniqueIdentifier(_i);
          return _id === id;
        }) || {};

      return mergeObject(oldItem, i, remoteItem) as T;
    });
  resultCollection.push(
    ...remoteCollection.filter((i) => {
      const id = uniqueIdentifier(i);

      return (
        !(oldIds.includes(id) && !updatedIds.includes(id)) &&
        !updatedIds.includes(id)
      );
    })
  );
  return resultCollection;
}

export function safeInt(
  input: string,
  fallback: number,
  returnEmpty = true
): number {
  if (!isNaN(parseInt(input))) {
    return parseInt(input);
  } else if (returnEmpty && !input) {
    return 0;
  } else {
    return fallback;
  }
}
