export type Tabs = {
	".tabs": {
		children: {
			input: {
				custom: {
					type: "radio";
					name: string;
				};
				state: "checked";
				interactionState: "focus-visible";
			};
			"[role=tablist]": {
				children: {
					"[role=tab]": "";
				};
			};
			"[role=tabpanel]": "";
		};
	};
};
