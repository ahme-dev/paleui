import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

const config = {
	plugins: [
		postcssPresetEnv({
			stage: 2,
			features: {},
			browsers: "last 4 versions, > 0.5%, not dead, IE 11",
		}),
		autoprefixer({
			overrideBrowserslist: ["last 4 versions", "> 0.5%", "not dead", "IE 11"],
			grid: "autoplace",
		}),
	],
};

export default config;
