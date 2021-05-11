import React, { useState, useContext, useCallback, useMemo } from 'react';

const key = '_local';

const I18NContext = React.createContext();

export function TransProvider({ children, data = {}, local: _local = 'zh' }) {
  const [local, setLocal] = useState((typeof window !== 'undefined' && localStorage.getItem(key)) || _local);
  const set = useCallback(
    function (local) {
      setLocal(local);
      localStorage.setItem(key, local);
    },
    [setLocal],
  );
  const value = useMemo(() => {
    return [data[local], set, local];
  }, [data, local, set]);
  return <I18NContext.Provider value={value}>{children}</I18NContext.Provider>;
}

function useTrans() {
  return useContext(I18NContext);
}

function keyValue(obj = {}, key) {
  const keyList = key.split('.');
  var temp = obj;
  for (let i = 0; i < keyList.length; i++) {
    if (temp === undefined) break;
    temp = temp[keyList[i]];
  }
  return temp === undefined ? key : temp;
}

export function Trans({ children, key }) {
  const _key = key || children;
  const [data] = useTrans();
  return keyValue(data, _key);
}

export function useLocal(key) {
  const [data, setLocal, local] = useTrans();
  return [keyValue(data, key), setLocal, local];
}

export function TransConsumer({ children }) {
  const [_, setLocal, local] = useTrans();
  return React.cloneElement(children, { local, setLocal });
}
