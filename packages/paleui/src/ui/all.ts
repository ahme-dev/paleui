// Aggregates all component schemas into a single array.
// The generation script renders each entry and concatenates the results.

import { schema as accordionSchema } from "./accordion";
import { schema as alertSchema } from "./alert";
import { schema as mainSchema } from "./main";

export const schema = [mainSchema, accordionSchema, alertSchema];
