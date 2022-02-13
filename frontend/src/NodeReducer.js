import {
  SET_NODES,
  SET_INST_VALUE,
  SET_IO,
  SET_GLOBAL_TOGGLE,
  SET_GLOBAL_DIM,
  SET_GLOBAL,
  SET_GLOBAL_TICK,
  SET_TAB,
} from "./Actions";

const node_reducer = (state, action) => {
  if (action.type === SET_NODES) {
    return {
      ...state,
      nodes: action.payload.nodes,
      total: action.payload.nodes.length,
    };
  }
  if (action.type === SET_INST_VALUE) {
    let allNodes = [...state.nodes];

    let obj = allNodes.find((node) => {
      return node.id === action.payload.id;
    });
    obj.current = action.payload.curr;
    obj.temp = action.payload.temp;
    return { ...state, nodes: allNodes, total: allNodes.length };
  }

  if (action.type === SET_GLOBAL_TICK) {
    return {
      ...state,
      global: { ...state.global, isGlobal: action.payload.status },
    };
  }
  if (action.type === SET_IO) {
    let allNodes = [...state.nodes];
    if (state.total > 0) {
      let obj = allNodes.find((node) => {
        return node.id === action.payload.nodeID;
      });

      obj[action.payload.IOLine] = action.payload.value;
    }
    return { ...state, nodes: allNodes, total: allNodes.length };
  }
  if (action.type === SET_GLOBAL_TOGGLE) {
    let allNodes = state.nodes;
    allNodes.map((node) => {
      node.relay = action.payload.value;
    });
    return {
      ...state,
      nodes: allNodes,
      total: allNodes.length,
      global: { ...state.global, globalStatus: action.payload.value },
    };
  }
  if (action.type === SET_GLOBAL_DIM) {
    let allNodes = state.nodes;
    allNodes.map((node) => {
      node.dim = action.payload.value;
    });
    return { ...state, nodes: allNodes, total: allNodes.length };
  }
  if (action.type === SET_GLOBAL) {
    if (action.payload.feature === "toggle")
      return {
        ...state,
        global: { ...state.global, isGlobal: action.payload.value },
      };
    if (action.payload.feature === "dim")
      return {
        ...state,
        global: { ...state.global, globalValue: action.payload.value },
      };
  }
  if (action.type === SET_TAB) {
    return {
      ...state,
      tab: action.payload,
    };
  }
};

export default node_reducer;
