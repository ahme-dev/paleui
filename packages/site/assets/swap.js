function swap() {
	const loaders = {},
		unloaders = {};
	register_links();
	new MutationObserver(dom_changes).observe(document.querySelector("html"), {
		childList: true,
		subtree: true,
	});
	window.addEventListener("popstate", () =>
		update(location.href, "[swap-history-restore]", false, "body"),
	);
	window.addEventListener("DOMContentLoaded", dom_load);

	function update(href, target, pushstate, fallback = null) {
		fetch(href, { headers: new Headers({ "swap-target": target }) })
			.then((r) => r.text())
			.then((html) => {
				const tmp = document.createElement("html");
				tmp.innerHTML = html;
				(
					document.querySelector(target) ?? document.querySelector(fallback)
				).outerHTML = (
					tmp.querySelector(target) ?? tmp.querySelector(fallback)
				).outerHTML;
				if (pushstate) history.pushState({}, "", href);
				register_links();
			});
	}
	function register_links() {
		for (const elt of document.querySelectorAll("*[swap-target]"))
			elt.onclick = (e) => {
				update(
					elt.getAttribute("href"),
					elt.getAttribute("swap-target"),
					elt.getAttribute("swap-history"),
				);
				e.preventDefault();
			};
	}
	function dom_changes(mutations) {
		for (const uselector in unloaders)
			for (const um of mutations)
				for (const un of um.removedNodes)
					if (
						un.matches &&
						un.querySelector &&
						(un.matches(uselector) || un.querySelector(uselector))
					) {
						unloaders[uselector]();
						delete unloaders[uselector];
					}
		for (const selector in loaders)
			for (const m of mutations)
				for (const n of m.addedNodes)
					if (
						n.matches &&
						n.querySelector &&
						(n.matches(selector) || n.querySelector(selector))
					)
						unloaders[selector] = loaders[selector]();
	}
	function dom_load() {
		for (const selector in loaders)
			if (document.querySelector(selector))
				unloaders[selector] = loaders[selector]();
	}
	return { loaders };
}
swap();
