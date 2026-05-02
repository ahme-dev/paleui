// Aggregates all component schemas into a single array.
// The generation script renders each entry and concatenates the results.

import { schema as accordionSchema } from "./accordion";
import { schema as alertSchema } from "./alert";
import { schema as badgeSchema } from "./badge";
import { schema as buttonSchema } from "./button";
import { schema as cardSchema } from "./card";
import { schema as mainSchema } from "./main";
import { schema as tabsSchema } from "./tabs";
import { schema as typographySchema } from "./typography";

function toSchemas<T>(schema: T | readonly T[]) {
	return Array.isArray(schema) ? [...schema] : [schema];
}

export const schema = [
	...toSchemas(mainSchema),
	...toSchemas(accordionSchema),
	...toSchemas(alertSchema),
	...toSchemas(badgeSchema),
	...toSchemas(buttonSchema),
	...toSchemas(cardSchema),
	...toSchemas(typographySchema),
	...toSchemas(tabsSchema),
];
