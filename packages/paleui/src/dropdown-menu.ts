export type DropdownMenu = {
	details: {
		state: "default" | "open";

		children: {
			"[role=button]": {
				interactionState: "hover";
			};
			"[role=dialog]": {
				"[role=menu]": {
					children: {
						p?: "";
						"[role=menuitem]": {
							interactionState: "hover";

							children:
								| {
										a?: "";
								  }
								| {
										small?: "";
								  };
						};
					};
				};
			};
		};
	};
};
