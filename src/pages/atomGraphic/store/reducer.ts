export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'modalInfo':
      return {
        ...state,
        [action.type]: {
          ...state.drawerInfo,
          ...action[action.type]
        }
      }
    case 'common':
      return {
        ...state,
        [action.type]:{
          ...state.common,
          ...action[action.type]
        }
      }
  }
};
