// Aggregates all component schemas into a single array.
// The generation script renders each entry and concatenates the results.

import { schema as accordionSchema } from "./accordion";
import { schema as alertSchema } from "./alert";
import { schema as aspectRatioSchema } from "./aspect-ratio";
import { schema as avatarSchema } from "./avatar";
import { schema as badgeSchema } from "./badge";
import { schema as breadcrumbsSchema } from "./breadcrumbs";
import { schema as buttonSchema } from "./button";
import { schema as cardSchema } from "./card";
import { schema as checkboxSchema } from "./checkbox";
import { schema as dialogSchema } from "./dialog";
import { schema as dropdownMenuSchema } from "./dropdown-menu";
import { schema as formSchema } from "./form";
import { schema as inputSchema } from "./input";
import { schema as mainSchema } from "./main";
import { schema as selectSchema } from "./select";
import { schema as separatorSchema } from "./separator";
import { schema as tabsSchema } from "./tabs";
import { schema as tooltipSchema } from "./tooltip";
import { schema as typographySchema } from "./typography";

export const schema = [
	mainSchema,
	accordionSchema,
	alertSchema,
	aspectRatioSchema,
	avatarSchema,
	badgeSchema,
	breadcrumbsSchema,
	buttonSchema,
	cardSchema,
	checkboxSchema,
	dialogSchema,
	dropdownMenuSchema,
	formSchema,
	inputSchema,
	selectSchema,
	separatorSchema,
	tabsSchema,
	tooltipSchema,
	typographySchema,
];
