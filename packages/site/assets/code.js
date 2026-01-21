/**
 * Code Display Utility
 *
 * Automatically extracts HTML from demo elements and displays them as formatted code
 * examples. Used throughout the PaleUI documentation site to show component source code
 * alongside live previews.
 *
 * Usage: Add the `data-to-code` attribute to any element containing demo HTML.
 *
 * ```html
 * <!-- Display code in a separate target element -->
 * <div data-to-code="#code-panel">
 *   <button>Demo Button</button>
 * </div>
 * <div id="code-panel"></div>
 *
 * <!-- Replace the element itself with code -->
 * <div data-to-code>
 *   <button>Demo Button</button>
 * </div>
 * ```
 */

import { addHighlightButton, highlightHtml } from "./highlight.js";

const ATTRIBUTE = "data-to-code";
const ATTRIBUTE_WITH_BRACKETS = `[${ATTRIBUTE}]`;

async function replaceWithCode(from, to) {
	let codeContent = from.innerHTML;

	const firstLineTabCount =
		codeContent.split("\n")[1]?.match(/^\t+/)?.[0]?.length || 0;

	codeContent = from.innerHTML
		.split("\n")
		.map((line) => line.replace(new RegExp(`^\t{0,${firstLineTabCount}}`), ""))
		.slice(1, -1)
		.join("\n");

	to.innerHTML = await highlightHtml(codeContent);

	addCopyButton(to, codeContent);
}

function addCopyButton(to, codeContent) {
	if (to.querySelector(".copy-btn")) return;

	const copyButton = document.createElement("button");
	copyButton.textContent = "⎘";
	copyButton.className = "icon outline copy-btn";
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
					copyButton.textContent = "⎘";
				}, 2000);
			})
			.catch((_) => {
				copyButton.textContent = "✘";
				setTimeout(() => {
					copyButton.textContent = "⎘";
				}, 2000);
			});
	});
	to.appendChild(copyButton);
}

function updateTabs() {
	document
		.querySelectorAll(`${ATTRIBUTE_WITH_BRACKETS}:not([data-code-processed])`)
		.forEach(async (block) => {
			const attr = block.getAttribute(ATTRIBUTE);
			const elementToReplace =
				attr.trim() === "" ? block : document.querySelector(attr) || block;

			block.setAttribute("data-code-processed", "");
			await replaceWithCode(block, elementToReplace);
			addHighlightButton(elementToReplace);
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
