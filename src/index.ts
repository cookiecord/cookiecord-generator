import program from "commander";
import { copy, readJSON, writeFile } from "fs-extra";
import { join, resolve } from "path";
import { spawn, spawnSync } from "child_process";
program.version("0.0.1").name("cookiecord-generator");

program
    .command("generate <name>")
    .description("generate a new cookiecord bot")
    .action(async name => {
        const genPath = resolve(__dirname, "../../gen");
		const selfPkgJson = await readJSON(resolve(__dirname, "../package.json"));

        await copy(genPath, join(process.cwd(), name));
        const pkgjson = await readJSON(join(genPath, "package.json"));
		pkgjson.name = name;
		pkgjson.dependencies.cookiecord = `^${selfPkgJson.version.split("-")[0]}`;
        await writeFile(
            join(process.cwd(), name, "package.json"),
            JSON.stringify(pkgjson, null, 4)
        );
        spawnSync("yarn", {cwd: join(process.cwd(), name), stdio: "inherit"})
        console.log(
            `Generated at ${join(
                process.cwd(),
                name
            )}\nPlease run 'yarn start' to start your new bot after filling out the .env file!`
        );
    });

if (process.argv.length < 3) program.help();
program.parse(process.argv);
