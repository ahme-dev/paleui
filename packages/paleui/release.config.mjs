export default {
	branches: ["main"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		"@sebbo2002/semantic-release-jsr",
		[
			"@semantic-release/exec",
			{
				prepareCmd: "pnpm run build",
			},
		],
	],
};
