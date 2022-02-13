import React, { useContext, useReducer, useEffect } from "react";
import reducer from "./NodeReducer";
import {
  SET_NODES,
  SET_INST_VALUE,
  SET_IO,
  SET_GLOBAL_TOGGLE,
  SET_GLOBAL_DIM,
  SET_GLOBAL,
  SET_GLOBAL_TICK,
  SET_TAB
} from "./Actions";

const getLocalStorage = () => {
  let global = localStorage.getItem("global");
  if (global) return JSON.parse(localStorage.getItem("global"));
  else return { isGlobal: true, globalValue: 50, globalStatus: true };
};

const getTab = () => {
  let tab = localStorage.getItem("tabVal");
  if (tab) return localStorage.getItem("tabVal");
  else return 0;
};

const initialState = {
  nodes: [],
  total: 0,
  global: getLocalStorage(),
  tabVal: getTab(),
};

const NodeContext = React.createContext();

export const NodeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setNodes = (nodes, total) => {
    dispatch({ type: SET_NODES, payload: { nodes, total } });
  };

  const setInstValues = (id, curr, temp) => {
    dispatch({
      type: SET_INST_VALUE,
      payload: { id, curr, temp },
    });
  };

  const setIO = (nodeID, IOLine, value) => {
    dispatch({
      type: SET_IO,
      payload: { nodeID, IOLine, value },
    });
  };

  const setGlobalToggle = (value) => {
    dispatch({
      type: SET_GLOBAL_TOGGLE,
      payload: { value },
    });
  };

  const setGlobalDim = (value) => {
    dispatch({
      type: SET_GLOBAL_DIM,
      payload: { value },
    });
    dispatch({
      type: SET_GLOBAL,
      payload: { value, feature: "dim" },
    });
  };

  const setGlobalTick = (status) => {
    dispatch({
      type: SET_GLOBAL_TICK,
      payload: { status },
    });
  };

  const changeTab = (tab) => {
    dispatch({
      type: SET_TAB,
      payload: { tab },
    });
  };

  useEffect(() => {
    localStorage.setItem("global", JSON.stringify(state.global));
  }, [state.global]);

  useEffect(() => {
    localStorage.setItem("tab", state.tabVal);
  }, [state.tabVal]);

  return (
    <NodeContext.Provider
      value={{
        ...state,
        setNodes,
        setInstValues,
        setIO,
        setGlobalToggle,
        setGlobalDim,
        setGlobalTick,
        changeTab
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
// make sure use
export const useNodeContext = () => {
  return useContext(NodeContext);
};
