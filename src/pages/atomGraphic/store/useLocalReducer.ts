import { useReducer } from "react";
import { reducer } from "./reducer";
import { initialState } from "./state";

export const useLocalReducer = () => {
    const [state, useDispatch] = useReducer(reducer, initialState);
    
    // 重写dispatch方法
    const newDispatch = (type = '', data: any) => {
      useDispatch({
        type,
        [type]: data
      })
    }
  
    return [state, newDispatch]
  }