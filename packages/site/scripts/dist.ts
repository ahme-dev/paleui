import fs from "node:fs";

// config

const viewsDir = "views";
const distDir = "dist";

// prepare

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
		/href="([a-zA-Z0-9]+)\.([a-zA-Z0-9_.]+)\.html"/g,
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

	// for dependency assets
	content = content.replace(
		/href="(?!http:\/\/|https:\/\/)(?:\.\.\/)*([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)"/g,
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

// copy views

const views = fs.readdirSync(viewsDir).filter((file) => file.endsWith(".html"));

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
				/<div\s+layout-slot\s*\/?>/,
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

		fs.copyFileSync(oldLinkPath, newPath);

		console.info(`\tCopied asset from ${oldLinkPath} to ${newPath}`);
	}
}
