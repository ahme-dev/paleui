/**
 * Syntax Highlighting Utility
 *
 * Provides optional syntax highlighting for code blocks via Shiki. Highlighting is
 * opt-in and persisted in localStorage to keep the default bundle lightweight while
 * allowing enhanced highlighting for users who want it.
 */

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

export { highlightHtml, addHighlightButton };
