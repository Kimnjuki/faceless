/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as articles from "../articles.js";
import type * as challenges from "../challenges.js";
import type * as community from "../community.js";
import type * as content from "../content.js";
import type * as contentCategories from "../contentCategories.js";
import type * as crons from "../crons.js";
import type * as health from "../health.js";
import type * as http from "../http.js";
import type * as import_ from "../import.js";
import type * as leads from "../leads.js";
import type * as learningPaths from "../learningPaths.js";
import type * as newsIngestor from "../newsIngestor.js";
import type * as niches from "../niches.js";
import type * as platformGuides from "../platformGuides.js";
import type * as profiles from "../profiles.js";
import type * as templates from "../templates.js";
import type * as tools from "../tools.js";
import type * as webinars from "../webinars.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  articles: typeof articles;
  challenges: typeof challenges;
  community: typeof community;
  content: typeof content;
  contentCategories: typeof contentCategories;
  crons: typeof crons;
  health: typeof health;
  http: typeof http;
  import: typeof import_;
  leads: typeof leads;
  learningPaths: typeof learningPaths;
  newsIngestor: typeof newsIngestor;
  niches: typeof niches;
  platformGuides: typeof platformGuides;
  profiles: typeof profiles;
  templates: typeof templates;
  tools: typeof tools;
  webinars: typeof webinars;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
