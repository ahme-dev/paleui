export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function dedent(str: string): string {
	const lines = str.split("\n");
	const nonEmpty = lines.filter((l) => l.trim().length > 0);
	if (nonEmpty.length === 0) return "";
	const minIndent = Math.min(
		...nonEmpty.map((l) => l.match(/^(\s*)/)?.[1].length ?? 0),
	);
	return lines
		.map((l) => l.slice(minIndent))
		.join("\n")
		.trim();
}
