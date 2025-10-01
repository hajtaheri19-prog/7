import type { ZodTypeAny } from 'zod';

type PromptConfig<I extends ZodTypeAny, O extends ZodTypeAny> = {
  name: string;
  input: { schema: I };
  output: { schema: O };
  prompt: string;
};

type FlowConfig<I extends ZodTypeAny, O extends ZodTypeAny> = {
  name: string;
  inputSchema?: I;
  outputSchema?: O;
};

export const ai = {
  definePrompt<I extends ZodTypeAny, O extends ZodTypeAny>(config: PromptConfig<I, O>) {
    return async (input: unknown): Promise<{ output: unknown }> => {
      throw new Error(`AI prompt "${config.name}" is not configured in this build environment.`);
    };
  },
  defineFlow<I extends ZodTypeAny, O extends ZodTypeAny>(config: FlowConfig<I, O>, fn: (input?: any) => Promise<any>) {
    return async (input?: any) => fn(input);
  },
};
