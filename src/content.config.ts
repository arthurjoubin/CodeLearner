import { defineCollection, z } from 'astro:content';

const news = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		author: z.string().default('Arthur'),
		tags: z.array(z.string()).default(['llm', 'vibecoding']),
		mentionedTools: z.array(z.string()).default([]),
	}),
});

const comparisons = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		tools: z.array(z.string()),
		verdict: z.string(),
	}),
});

const devfinds = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		discount: z.string(),
		originalPrice: z.string(),
		discountedPrice: z.string(),
		expireDate: z.coerce.date().optional(),
		affiliate: z.boolean().default(false),
		url: z.string().url(),
		tools: z.array(z.string()),
	}),
});

const tools = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		description: z.string(),
		category: z.enum(['IDE', 'Agent', 'Vibe Framework', 'UI Generator', 'Code Review', 'Other']),
		website: z.string().url(),
		pricing: z.string(),
		features: z.array(z.string()).default([]),
		pros: z.array(z.string()).default([]),
		cons: z.array(z.string()).default([]),
		pubDate: z.coerce.date(),
	}),
});

const llms = defineCollection({
	type: 'content',
	schema: z.object({
		name: z.string(),
		description: z.string(),
		provider: z.string(),
		contextWindow: z.string(),
		pricing: z.string(),
		website: z.string().url(),
		strengths: z.array(z.string()).default([]),
		weaknesses: z.array(z.string()).default([]),
		bestFor: z.array(z.string()).default([]),
		benchmarks: z.array(z.object({ name: z.string(), score: z.string() })).default([]),
		pubDate: z.coerce.date(),
	}),
});

export const collections = { news, comparisons, devfinds, tools, llms };
