const params = new URLSearchParams(window.location.search);
const isTestMode = params.get("test") === "true";

window.__TEST_MODE__ = isTestMode;

if (isTestMode) {
	const style = document.createElement("style");
	style.textContent = `
		.preview-panel {
			min-height: 100vh !important;
			aspect-ratio: unset !important;
			flex: 1 !important;
		}

		.preview-panel > * {
			flex: 1 !important;
			min-height: 100% !important;
		}
	`;
	document.head.appendChild(style);

	const header = document.querySelector("header");
	const footer = document.querySelector("footer");
	const mainAside = document.querySelector("main > aside");

	if (header) header.remove();
	if (footer) footer.remove();
	if (mainAside) mainAside.remove();

	const mainSection = document.querySelector("main > section");
	if (mainSection) {
		mainSection.style.width = "100%";
		mainSection.style.maxWidth = "100%";
		mainSection.style.padding = 0;
	}
}
