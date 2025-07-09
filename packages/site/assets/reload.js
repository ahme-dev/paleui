function reload() {
	let lastModified = Date.now();

	const checkForChanges = async () => {
		try {
			const response = await fetch("/reload.txt");
			if (response.ok) {
				const text = await response.text();
				const lines = text.split("\n");
				const firstLine = lines[0].trim();

				if (!firstLine) {
					console.log("No date found.");
				} else {
					const newModified = new Date(firstLine).getTime();
					if (Number.isNaN(newModified)) {
						console.log("Invalid date format:", firstLine);
					} else if (newModified > lastModified) {
						console.log("Changes detected, reloading...");
						lastModified = newModified;
						window.location.reload();
					} else {
						return;
					}
				}
			} else {
				console.log(
					`Error fetching reload.txt: ${response.status} ${response.statusText}`,
				);
			}
		} catch (err) {
			console.log("Checking for changes failed:", err);
		}

		setTimeout(checkForChanges, 1000);
	};

	console.log("Live reload enabled");
	checkForChanges();
}

reload();
