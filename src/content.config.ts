import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		author: z.string().default('Arthur'),
		image: z.string().optional(),
		tags: z.array(z.string()).default(['llm', 'vibecoding']),
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
		image: z.string().optional(),
	}),
});

const deals = defineCollection({
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

export const collections = { blog, comparisons, deals };
