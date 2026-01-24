export type Avatar = {
	picture: {
		variants: "default" | "square";

		children: {
			img: "";
			small: "";
		};
	};
};

export type AvatarGroup = {
	"[role=group]": {
		children: {
			picture: Avatar["picture"];
			picture2: Avatar["picture"];
			picture3: Avatar["picture"];
			picture4: Avatar["picture"];
		};
	};
};
