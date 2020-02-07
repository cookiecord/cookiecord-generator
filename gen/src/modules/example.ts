import { Message } from "discord.js";
import { command, default as CookiecordClient, Module } from "cookiecord";

export default class ExampleModule extends Module {
    constructor(client: CookiecordClient) {
        super(client);
    }

    @command()
    ping(msg: Message) {
        msg.reply("Pong. :ping_pong:");
    }
}
