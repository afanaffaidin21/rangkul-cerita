import { z } from "zod";

const reflectionText = z.string().trim().min(1).max(1200);

export const reflectionOutputSchema = z.object({
  reflection: reflectionText,
  suggestedQuestion: z.string().trim().min(1).max(300),
  summary: z.object({
    mainTopic: z.string().trim().min(1).max(200),
    emotions: z.array(z.string().trim().min(1).max(80)).min(1).max(8),
    possibleTriggers: z.string().trim().min(1).max(400),
    userNeed: z.string().trim().min(1).max(200),
    nextStep: z.string().trim().min(1).max(400),
  }).strict(),
  recommendedSteps: z.array(reflectionText).length(3),
}).strict();

export type ReflectionOutput = z.infer<typeof reflectionOutputSchema>;
