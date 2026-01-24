export type Input = {
	input: {
		interactionState: "focus-visible";
	};
	textarea: {
		interactionState: "focus-visible";
	};
	"label[role=textbox]": {
		interactionState: "focus-within";

		children: {
			svg?: "";
			input: "";
		};
	};
};
