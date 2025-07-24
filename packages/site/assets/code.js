import { codeToHtml } from "https://esm.sh/shiki@3.0.0";

function updateTabs() {
	const items = document.querySelectorAll(".tabs");
	items.forEach(async (it) => {
		const htmlTab = it.querySelector('[role="tabpanel"].html');
		if (htmlTab && htmlTab.innerHTML.trim() !== "") return;

		const previewTab = it.querySelector('[role="tabpanel"].preview');
		if (!previewTab) return;

		const codeContent = previewTab.innerHTML
			.split("\n")
			.map((line) => line.replace(/^\t\t\t/, ""))
			.slice(1, -1)
			.join("\n");

		htmlTab.innerHTML = await codeToHtml(codeContent, {
			lang: "html",
			theme: "min-light",
		});

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
		htmlTab.appendChild(copyButton);
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
