export type Breadcrumbs = {
	"nav[aria-label=breadcrumb]": {
		children: {
			ol: {
				custom: {
					"--separator"?: string;
				};
				children: {
					li: {
						state: "default" | "current";

						children: {
							a?: {
								interactionState: "hover";
							};
							button?: {
								interactionState: "hover";
							};
							svg?: "";
							"span[aria-hidden]"?: "";
						};
					};
				};
			};
		};
	};
};
