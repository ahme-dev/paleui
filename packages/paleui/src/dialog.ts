import type { buttonComp } from "./button";
import type { Input } from "./input";
import type { Typography } from "./typography";

export type Dialog = {
	peer: {
		button?: buttonComp;
	};

	dialog: {
		interactionState: "focus-visible";

		children: {
			close?: {
				button: {
					custom: {
						class: "close";
					};
				};
			};
			hgroup?: Typography["hgroup"];
			slot: {
				suggested: {
					input: Input;
				};
			};

			form?: {
				custom: {
					method: "dialog";
				};
				children: {
					suggested: {
						button: {
							custom: {
								type: "submit";
							};
						};
					};
				};
			};
			div?: {
				suggested: {
					button: buttonComp;
				};
			};
		};
	};
};
