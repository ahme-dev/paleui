export type Alert = {
	"[role=alert]": {
		variants: "default" | "destructive";

		children: {
			svg?: "";
			p: "";
			small?: "";
			a?: "";
		};
	};
};
