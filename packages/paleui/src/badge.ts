export type Badge = {
	"[role=status]": {
		variants: "default" | "outline" | "ghost" | "secondary" | "destructive";

		size: "default" | "fit";

		children: {
			a?: "";
			svg?: "";
		};
	};
};
