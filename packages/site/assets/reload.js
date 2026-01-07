(function() {
	let lastReloadContent = null;

	async function checkForReload() {
		try {
			const response = await fetch('/reload.txt?t=' + Date.now());
			if (response.ok) {
				const content = await response.text();
				if (lastReloadContent === null) {
					lastReloadContent = content;
				} else if (content !== lastReloadContent) {
					console.log('Reload triggered - changes detected');
					window.location.reload();
				}
			}
		} catch (err) {
		}
	}

	setInterval(checkForReload, 1000);
})();