import { spawnSync } from "child_process";
import program from "commander";
import { copy, pathExists, readdir, readJSON, writeFile } from "fs-extra";
import { join, resolve } from "path";
program.version("0.0.1").name("cookiecord-generator");

program
	.command("generate <name>")
	.description("generate a new cookiecord bot")
	.action(async (name: string) => {
		const genPath = resolve(__dirname, "../../gen");
		const selfPkgJson = await readJSON(
			resolve(__dirname, "../../package.json")
		);
		const targetPath = join(process.cwd(), name);
		try {
			if (
				(await pathExists(targetPath)) &&
				(await readdir(targetPath)).length !== 0
			)
				throw new Error("Target directory exists and is not empty");
		} catch (error) {
			console.error(error.message);
			process.exit(1);
		}

		await copy(genPath, targetPath);

		const pkgjson = await readJSON(join(genPath, "package.json"));
		pkgjson.name = name;
		pkgjson.dependencies.cookiecord = `^${
			selfPkgJson.version.split("-")[0]
		}`;
		await writeFile(
			join(process.cwd(), name, "package.json"),
			JSON.stringify(pkgjson, null, 4)
		);
		spawnSync("yarn", { cwd: targetPath, stdio: "inherit" });
		console.log(
			`Generated at ${join(
				process.cwd(),
				name
			)}\nPlease run 'yarn start' to start your new bot after filling out the .env file!`
		);
	});

if (process.argv.length < 3) program.help();
program.parse(process.argv);
