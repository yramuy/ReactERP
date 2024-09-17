import { combineReducers } from "redux";

const initialState = {
    message: "",
    levelMenuID: "",
    data: [],
    status: "",
    id: 0,
    loading: false,
    reload: false
};

function ModuleReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case "MESSAGE":
            return { ...state, message: payload }
        case "LEVELMENUID":
            return { ...state, levelMenuID: payload }
        case "DATA":
            return { ...state, data: payload }
        case "STATUS":
            return { ...state, status: payload }
        case "ID":
            return { ...state, id: payload }
        case "LOADING":
            return { ...state, loading: payload }
        case "RELOAD":
            return { ...state, reload: payload }

        default:
            return state;
    }
}

const rootReducer = combineReducers({
    moduleData: ModuleReducer
});

export default rootReducer;