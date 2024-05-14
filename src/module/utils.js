import {CONST} from "./const.js";

export const getSetting = (settingName) => {
    return game.settings.get(CONST.MODULE_NAME, settingName);
};

export const getSettingFromToken = (settingName, token) => {
    return game.actors.find(a => a.id === token.actor.id).getFlag(CONST.MODULE_NAME, settingName);
}

