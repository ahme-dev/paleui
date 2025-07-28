//
// Highlighter
//

let shikiEnabled = false;
function getShiki() {
	try {
		shikiEnabled = localStorage.getItem("shiki") === "true";
	} catch (_) {}
}
getShiki();
function toggleShiki() {
	localStorage.setItem("shiki", !shikiEnabled);
	shikiEnabled = !shikiEnabled;
}

async function highlightHtml(str) {
	let html = "";

	if (shikiEnabled) {
		const mod = await import("https://esm.sh/shiki@3.0.0");
		html = await mod.codeToHtml(str, {
			lang: "html",
			theme: "min-light",
		});
	} else {
		const escapedStr = str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
		html = `<pre><code>${escapedStr}</code></pre>`;
	}

	return html;
}

function addHighlightButton(to) {
	if (to.querySelector(".highlight-btn")) return;

	const highlightButton = document.createElement("button");
	highlightButton.textContent = shikiEnabled ? "✪" : "☲";
	highlightButton.className = "icon outline highlight-btn";
	const text = shikiEnabled ? "Turn off highlighting" : "Turn on highlighting";
	highlightButton.setAttribute("aria-label", text);
	highlightButton.title = text;
	highlightButton.style =
		"position: absolute; top: 10px; right: 45px; z-index: 1000; cursor: pointer;";

	highlightButton.addEventListener("click", () => {
		toggleShiki();
		const confirmText = shikiEnabled
			? "Reload the page to turn on highlighting? This will load shikijs and increase bundle size on the site."
			: "Reload the page to turn off highlighting?";
		if (confirm(confirmText)) location.reload();
	});
	to.appendChild(highlightButton);
}

//
// Replacer
//

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

//
// Watch and replace all fields
//

const ATTRIBUTE = "data-to-code";
const ATTRIBUTE_WITH_BRACKETS = `[${ATTRIBUTE}]`;

function updateTabs() {
	document.querySelectorAll(ATTRIBUTE_WITH_BRACKETS).forEach(async (block) => {
		const attr = block.getAttribute(ATTRIBUTE);
		const elementToReplace =
			attr.trim() === "" ? block : document.querySelector(attr) || block;

		block.removeAttribute(ATTRIBUTE);
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
