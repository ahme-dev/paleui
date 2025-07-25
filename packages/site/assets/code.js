import { codeToHtml } from "https://esm.sh/shiki@3.0.0";

async function replaceWithCode(from, to) {
	let codeContent = from.innerHTML;

	const firstLineTabCount =
		codeContent.split("\n")[1].match(/^\t+/)?.[0].length || 0;

	codeContent = from.innerHTML
		.split("\n")
		.map((line) => line.replace(new RegExp(`^\\t{0,${firstLineTabCount}}`), ""))
		.slice(1, -1)
		.join("\n");

	to.innerHTML = await codeToHtml(codeContent, {
		lang: "html",
		theme: "min-light",
	});

	// const closestObject = to.closest("object");
	// closestObject.style.height = "auto";
	// closestObject.style.maxHeight = "calc((100vw * 5) / 9)";
	// closestObject.style.aspectRatio = "auto";

	const copyButton = document.createElement("button");
	copyButton.textContent = "⏍";
	copyButton.className = "icon secondary";
	copyButton.setAttribute("aria-label", "Copy to clipboard");
	copyButton.title = "Copy to clipboard";
	copyButton.style =
		"position: absolute; top: 10px; right: 10px; z-index: 1000; cursor: pointer;";

	copyButton.addEventListener("click", () => {
		navigator.clipboard
			.writeText(codeContent)
			.then(() => {
				copyButton.textContent = "✔";
				setTimeout(() => {
					copyButton.textContent = "⏍";
				}, 2000);
			})
			.catch((_) => {
				copyButton.textContent = "✘";
				setTimeout(() => {
					copyButton.textContent = "⏍";
				}, 2000);
			});
	});
	to.appendChild(copyButton);
}

function updateTabs() {
	const codeBlocks = document.querySelectorAll("[data-to-code]");
	codeBlocks.forEach(async (block) => {
		const attr = block.getAttribute("data-to-code");
		const elementToReplace =
			attr.trim() === "" ? block : document.querySelector(attr) || block;

		block.removeAttribute("data-to-code");
		await replaceWithCode(block, elementToReplace);
	});
}

updateTabs();

let debounceTimer = null;
const observer = new MutationObserver(() => {
	if (debounceTimer) clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		updateTabs();
	}, 100);
});

observer.observe(document.body, { childList: true, subtree: true });
