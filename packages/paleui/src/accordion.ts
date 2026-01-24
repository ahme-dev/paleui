export type Accordion = {
	"details[role=region]": {
		state: "default" | "open";

		children: {
			summary: {
				interactionState: "hover";
			};
			div: "";
		};
	};
};
