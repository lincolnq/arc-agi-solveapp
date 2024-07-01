import type { Color } from "$lib/types";
import { BLACK, GRAY } from "./builtins";

function isBlack(c: Color): boolean { return c === BLACK; }
function isGray(c: Color): boolean { return c === GRAY; }
function isNonBlack(c: Color): boolean { return c !== BLACK; }

export const FILTER_NOARGS = {isBlack, isGray, isNonBlack}
export const FILTER_ARGS = {}