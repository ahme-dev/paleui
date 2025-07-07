import fs from "node:fs";

// config

const viewsDir = "views";
const distDir = "dist";
const assetsDir = "assets";
const externalAssets = ["../paleui/main.css"];

// prepare

if (!fs.existsSync(viewsDir)) {
	console.error(`Views directory does not exist: ${viewsDir}`);
	process.exit(1);
}

if (!fs.existsSync(distDir)) {
	console.info(`Build directory does not exist, creating: ${distDir}`);
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
	content = content.replace(/src="(?:\.\.\/)?assets\//g, 'src="/');

	content = content.replace(
		/href="([a-zA-Z0-9]+)\.([a-zA-Z0-9_.]+)\.html"/g,
		(_, namespace, rest) => {
			const path = rest.replace(/\./g, "/");
			return `href="/${namespace}/${path}.html"`;
		},
	);

	content = content.replace(
		/href="([a-zA-Z0-9_.-]+)\.html"/g,
		'href="/$1.html"',
	);

	return content;
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

	finalContent = fixLinksInContent(finalContent);

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
}

// copy assets

if (fs.existsSync(assetsDir)) {
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir, { recursive: true });
	}

	const assets = fs.readdirSync(assetsDir);
	for (const asset of assets) {
		const assetPath = `${assetsDir}/${asset}`;
		fs.copyFileSync(assetPath, `${distDir}/${asset}`);

		console.info("Prepared asset:", `${distDir}/${asset}`);
	}
}

for (const externalAsset of externalAssets) {
	const assetPath = externalAsset;
	const assetName = assetPath.split("/").pop();
	if (!assetName) {
		console.error(`Could not determine asset name from path: ${assetPath}`);
		continue;
	}

	const destPath = `${distDir}/${assetName}`;
	fs.copyFileSync(assetPath, destPath);

	console.info("Prepared external asset:", destPath);
}
