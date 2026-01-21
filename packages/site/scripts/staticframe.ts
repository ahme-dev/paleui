/**
 * StaticFrame
 * Acts as a compiler for the site.
 * It supports layouts, flat file based routing, and asset composition.
 */

import fs from "node:fs";

// config

const viewsDir = "views";
const distDir = "dist";
const assets = "assets";

// prepare

function exitWith(message: string) {
	console.error(message);
	process.exit(1);
}

function getFileMeta(f: string) {
	const filePath = `${viewsDir}/${f}`;
	const fileParts = f.split(".");

	const fileExt = fileParts.pop();
	if (!fileExt) exitWith(`File ${f} has no extension`);
	const fileName = fileParts.pop() as string;
	if (!fileName) exitWith(`File ${f} has no name`);
	const fileNameWithExt = `${fileName}.${fileExt}`;

	const fileDirSlashed = fileParts.join("/");
	const fileDirDotted = fileParts.join(".");

	const fileLayoutPaths: string[] = [];

	for (const part of fileParts) {
		const partLayout = `${viewsDir}/${part}.layout.html`;
		if (fs.existsSync(partLayout)) {
			fileLayoutPaths.push(partLayout);
		}
	}
	const rootLayoutPath = `${viewsDir}/layout.html`;
	if (fs.existsSync(rootLayoutPath)) {
		fileLayoutPaths.push(rootLayoutPath);
	}

	return {
		filePath,
		fileLayoutPaths,

		fileNameWithExt,
		fileDirSlashed,
		fileDirDotted,
	};
}

function getFileContent(filePath: string) {
	if (!fs.existsSync(filePath)) {
		exitWith(`File does not exist: ${filePath}`);
	}
	if (!fs.lstatSync(filePath).isFile()) {
		exitWith(`Path is not a file: ${filePath}`);
	}
	return fs.readFileSync(filePath, "utf8");
}

function fixLinksInContent(content: string) {
	const transformations = new Map<string, { newLink: string; type: string }>();

	// for flat nested files
	content = content.replace(
		/href="([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_.-]+)\.html"/g,
		(match, namespace, rest) => {
			const path = rest.replace(/\./g, "/");
			const newLink = `/${namespace}/${path}.html`;
			const newLinkWithAttr = `href="${newLink}"`;
			const oldLink = match.replace(/^(href="|src=")(.+)"$/, "$2");

			transformations.set(oldLink, {
				type: "html",
				newLink,
			});
			return newLinkWithAttr;
		},
	);

	// for root files
	content = content.replace(
		/href="([a-zA-Z0-9_.-]+)\.html"/g,
		(match, file) => {
			const newLink = `/${file}.html`;
			const newLinkWithAttr = `href="${newLink}"`;
			const oldLink = match.replace(/^(href="|src=")(.+)"$/, "$2");

			transformations.set(oldLink, {
				type: "html",
				newLink,
			});
			return newLinkWithAttr;
		},
	);

	// for assets in dir
	content = content.replace(
		/src="(?:\.\.\/)?assets\/([^"]+)"/g,
		(match, file) => {
			const newLink = `/${file}`;
			const newLinkWithAttr = `src="${newLink}"`;
			const oldLink = match.replace(/^(href="|src=")(.+)"$/, "$2");

			transformations.set(oldLink, {
				type: "asset",
				newLink,
			});
			return newLinkWithAttr;
		},
	);

	// for JS module imports (e.g., import { foo } from "./highlight.js")
	content = content.replace(/from\s+"\.\/([^"]+)"/g, (match, file) => {
		const newLink = `/${file}`;
		const newLinkWithFrom = `from "${newLink}"`;
		const oldLink = `assets/${file}`;

		transformations.set(oldLink, {
			type: "asset",
			newLink,
		});
		return newLinkWithFrom;
	});

	// for fonts in dir
	content = content.replace(
		/url\("(?:\.\.\/)?assets\/([^"]+)"\)/g,
		(match, file) => {
			const newLink = `/${file}`;
			const newLinkWithUrl = `url("${newLink}")`;
			const oldLink = match.replace(/^url\("(.+)"\)$/, "$1");

			transformations.set(oldLink, {
				type: "asset",
				newLink,
			});
			return newLinkWithUrl;
		},
	);

	// for dependency assets
	// currently on relative path
	// not node modules
	content = content.replace(
		/href="(?!http:\/\/|https:\/\/)(?:\.\.\/)*([a-zA-Z0-9_./-]+)\/([a-zA-Z0-9_.-]+(?<!\.html))"/g,
		(match, _dir, file) => {
			const newLink = `/${file}`;
			const newLinkWithAttr = `href="${newLink}"`;
			const oldLink = match.replace(/^(href="|src=")(.+)"$/, "$2");

			transformations.set(oldLink, {
				type: "dependency",
				newLink,
			});
			return newLinkWithAttr;
		},
	);

	return {
		content,
		transformations,
	};
}

function distProject() {
	if (!fs.existsSync(viewsDir)) {
		console.error(`Views directory does not exist: ${viewsDir}`);
		process.exit(1);
	}
	if (fs.existsSync(distDir)) {
		fs.rmSync(distDir, { recursive: true, force: true });
		console.info(`Cleared dist directory`);
	} else {
		console.info(`Created dist directory`);
		fs.mkdirSync(distDir);
	}

	const views = fs
		.readdirSync(viewsDir)
		.filter((file) => file.endsWith(".html"));

	for (const viewFile of views) {
		const inputFile = getFileMeta(viewFile);
		if (inputFile.fileNameWithExt === "layout.html") {
			continue;
		}

		const inputFileContent = getFileContent(inputFile.filePath);

		let finalContent = "";

		// add layouts

		if (inputFile.fileLayoutPaths.length > 0) {
			finalContent = inputFileContent;

			for (const layoutPath of inputFile.fileLayoutPaths) {
				const layoutContent = getFileContent(layoutPath);
				finalContent = layoutContent.replace(
					/<[^>]+\s+layout-slot\s*\/?>/,
					finalContent,
				);
			}
		} else {
			console.warn(`No layouts found for file: ${inputFile.filePath}`);
			finalContent = inputFileContent;
		}

		// replace links

		const fixResult = fixLinksInContent(finalContent);
		finalContent = fixResult.content;

		// copy to destination

		const outputFile = {
			fileDirSlashed: `${distDir}/${inputFile.fileDirSlashed}`,
			filePath: `${distDir}/${inputFile.fileDirSlashed}/${inputFile.fileNameWithExt}`,
		};

		if (!fs.existsSync(outputFile.fileDirSlashed)) {
			fs.mkdirSync(outputFile.fileDirSlashed, { recursive: true });
		}
		fs.writeFileSync(outputFile.filePath, finalContent, "utf8");

		console.info("Prepared html:", outputFile.filePath);

		// copy transformed assets

		for (const [oldLink, { type, newLink }] of fixResult.transformations) {
			if (type === "html") continue;

			const oldLinkPath = oldLink.replace(/^\.\.\//, ``); // remove leading ../ if exists
			if (!fs.existsSync(oldLinkPath)) {
				continue;
			}
			const newPath = `${distDir}/${newLink.replace(/^(href="|src=")(.+)"$/, "$2")}`;
			if (fs.existsSync(newPath)) {
				console.info(`\tDuplicate asset skipped`);
				continue;
			}

			// js files, process and fix imports before copying

			if (oldLinkPath.endsWith(".js")) {
				let jsContent = getFileContent(oldLinkPath);
				const jsFixResult = fixLinksInContent(jsContent);
				jsContent = jsFixResult.content;
				fs.writeFileSync(newPath, jsContent, "utf8");
				console.info(
					`\tProcessed and copied JS asset from ${oldLinkPath} to ${newPath}`,
				);

				for (const [jsOldLink, jsTransform] of jsFixResult.transformations) {
					if (jsTransform.type !== "asset") continue;
					const jsOldPath = jsOldLink.replace(/^\.\.\//, ``);
					if (!fs.existsSync(jsOldPath)) continue;
					const jsNewPath = `${distDir}/${jsTransform.newLink}`;
					if (fs.existsSync(jsNewPath)) {
						console.info(`\tDuplicate JS import skipped`);
						continue;
					}
					fs.copyFileSync(jsOldPath, jsNewPath);
					console.info(`\tCopied JS import from ${jsOldPath} to ${jsNewPath}`);
				}
			} else {
				fs.copyFileSync(oldLinkPath, newPath);
				console.info(`\tCopied asset from ${oldLinkPath} to ${newPath}`);
			}
		}

		// copy fonts in assets

		if (!fs.existsSync(`${assets}`)) {
			const assetFiles = fs
				.readdirSync(assets)
				.filter(
					(file) =>
						file.endsWith(".woff") ||
						file.endsWith(".woff2") ||
						file.endsWith(".ttf"),
				);

			for (const assetFile of assetFiles) {
				console.log(assetFile);
				const assetFilePath = `${assets}/${assetFile}`;
				if (!fs.existsSync(assetFilePath)) {
					console.warn(`Asset file does not exist: ${assetFilePath}`);
					continue;
				}

				const outputAssetPath = `${distDir}/${assetFile}`;
				if (fs.existsSync(outputAssetPath)) {
					console.info(`\tDuplicate asset skipped: ${outputAssetPath}`);
					continue;
				}

				fs.copyFileSync(assetFilePath, outputAssetPath);
				console.info(`\tCopied asset: ${outputAssetPath}`);
			}
		}
	}
}

function writeToTriggerFile() {
	let content = "";
	content += new Date().toISOString();
	content += "\n";
	content += `This file is used for triggering live reload.`;

	const triggerFilePath = `${distDir}/reload.txt`;
	fs.writeFileSync(triggerFilePath, content, "utf8");
	console.info(`Reload trigger file updated: ${triggerFilePath}`);
}

distProject();
writeToTriggerFile();
