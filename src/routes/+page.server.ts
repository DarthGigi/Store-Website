import type { Actions } from "@sveltejs/kit";

const botDetect = /(bot)/gm;

export const actions: Actions = {
    default: async (event) => {
        console.log(event);
    }
}

