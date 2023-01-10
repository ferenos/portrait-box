import {PortraitBox} from "./portrait-box.js";
import {CONST} from "./const.js";
import {registerSettings} from "./settings.js ";

export const initializeHooks = () => {
    Hooks.once("init", async () => {
        console.log(`${CONST.MODULE_NAME} | Initializing`);
        registerSettings();
        await preloadTemplates();
        CONFIG.ui.portraitBox = PortraitBox;
    });

    Hooks.once("ready", async() => {
        await ui.portraitBox.render(true);
    });

    Hooks.on("hoverToken", (token, hovered) => {
        if(hovered) {
            ui.portraitBox.show(token);
        }
        else {
            ui.portraitBox.hide();
        }
    });

    Hooks.on("renderSettingsConfig", (app, html, data) => {
        let name, colour;
        name = `${CONST.MODULE_NAME}.labelBgColor`;
        colour = game.settings.get(CONST.MODULE_NAME, "labelBgColor");
        $("<input>")
            .attr("type", "color")
            .attr("data-edit", name)
            .val(colour)
            .insertAfter($(`input[name="${name}"]`, html).addClass("color"));
    });
}

async function preloadTemplates() {
    const templatePaths = [
        `modules/${CONST.MODULE_NAME}/templates/portrait-box.html`
    ];

    return await loadTemplates(templatePaths);
}