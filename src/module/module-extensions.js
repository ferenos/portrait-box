const isTokenVariantEnabled = () => {
    return game.modules.has(CONST.MODULE_NAME, "tokenVariant");
}

const getTokenVariantApi = () => {
    return game.modules.get('token-variant').api;
}

export { isTokenVariantEnabled, getTokenVariantApi };