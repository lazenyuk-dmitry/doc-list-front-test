import emitter from "tiny-emitter/instance";

const dataTransfer = {
  originArray: null,
  item: null,
  index: null,
  zoneUid: null,
  group: null,
};

function addItem(array, item, index) {
  const arrCopy = [...array];

  arrCopy.splice(index, 0, item);

  return arrCopy;
}

function removeItem(array, index) {
  const arrCopy = [...array];

  arrCopy.splice(index, 1);

  return arrCopy;
}

function getNewItemIndex(targetIndex, insertPosition, maxPosition) {
  if (insertPosition === "append") {
    return maxPosition + 1;
  } else if (insertPosition === "before") {
    return targetIndex;
  } else if (insertPosition === "after") {
    return targetIndex + 1;
  }

  return 0;
}

function emitChangedData(data, zoneUid) {
  emitter.emit("data-changed", {
    data,
    zoneUid,
  });
}

emitter.on("set-data-transfer", (originArray, item, index, zoneUid, group) => {
  dataTransfer.originArray = originArray;
  dataTransfer.zoneUid = zoneUid;
  dataTransfer.item = item;
  dataTransfer.index = index;
  dataTransfer.group = group;
});

emitter.on("dropped", (array, index, insertPosition, zoneUid, group) => {
  const newPosition = getNewItemIndex(index, insertPosition, array.length);

  if (
    dataTransfer.group !== group ||
    (newPosition === dataTransfer.index && zoneUid === dataTransfer.zoneUid)
  ) {
    return;
  }

  if (index === dataTransfer.index && zoneUid === dataTransfer.zoneUid) {
    return;
  }

  if (zoneUid === dataTransfer.zoneUid) {
    const modiFiedArray = removeItem(array, dataTransfer.index);
    const correctNewPosition =
      newPosition > dataTransfer.index ? newPosition - 1 : newPosition;

    emitChangedData(
      addItem(modiFiedArray, dataTransfer.item, correctNewPosition),
      zoneUid
    );
  } else {
    emitChangedData(
      removeItem(dataTransfer.originArray, dataTransfer.index),
      dataTransfer.zoneUid
    );
    emitChangedData(addItem(array, dataTransfer.item, newPosition), zoneUid);
  }
});

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args),
};
