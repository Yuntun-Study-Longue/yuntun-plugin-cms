export const COLLAPSE = 'layout/COLLAPSE'

const initialState = {
    isCollapsed: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case COLLAPSE:
          return {
            ...state,
            isCollapsed: action.collapsed
          };

        default:
        return state;
    }
}

export const toggleSiderMenu = (collapsed) => dispatch =>
    new Promise(resolve => {
        dispatch({
            type: COLLAPSE,
            collapsed
        })
    })