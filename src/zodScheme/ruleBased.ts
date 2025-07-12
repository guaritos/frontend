import { z } from "zod";

// Common comparison operators
const operatorSchema = z.enum([">", "<", ">=", "<=", "==", "!="]);

// Base condition
const baseCondition = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("aggregate"),
        field: z.string(),
        op: z.enum(["sum", "avg", "count", "min", "max"]),
        operator: operatorSchema,
        value: z.number(),
    }),
    z.object({
        type: z.literal("plain"),
        field: z.string(),
        operator: operatorSchema,
        value: z.number(),
    }),
    z.object({
        type: z.literal("exists"),
        field: z.string(),
        operator: z.boolean(),
    }),
]);

// Recursive condition logic (and/or)
const logicCondition: z.ZodType<any> = z.lazy(() =>
    z.object({
        and: z.array(condition),
    }).or(
        z.object({
            or: z.array(condition),
        })
    )
);

const condition = z.union([baseCondition, logicCondition]);

// Aggregate section (optional logic grouping)
const aggregateItem = z.object({
    type: z.literal("aggregate"),
    field: z.string(),
    op: z.enum(["sum", "avg", "count", "min", "max"]),
    operator: operatorSchema,
    value: z.number(),
});

const aggregateSchema = z.union([
    z.array(aggregateItem),
    z.object({
        and: z.array(aggregateItem),
    }),
    z.object({
        or: z.array(aggregateItem),
    }),
]);

// Then actions
const thenSchema = z.array(
    z.discriminatedUnion("type", [
        z.object({
            type: z.literal("tag"),
            value: z.string(),
        }),
        z.object({
            type: z.literal("webhook"),
            group: z.string(),
            params: z.object({
                headers: z.record(z.string(), z.string()),
                body: z.string(), // Template string with mustache, allow raw
            }),
        }),
        z.object({
            type: z.literal("email"),
            to: z.string(),
            subject: z.string(),
            body: z.string(),
        }),
    ])
);

export const ruleSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    interval: z.string(), // Could be further refined with regex e.g. /^[0-9]+[smhd]$/
    enabled: z.boolean(),
    when: z.object({
        and: z.array(condition), // you can expand to support "or" root too
    }),
    aggregate: aggregateSchema.optional(),
    then: thenSchema,
});