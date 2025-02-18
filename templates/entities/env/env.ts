import { apiHandler } from "@/shared/action/api-handler";
import { envAction } from "@/shared/action/env-action";
import { queryOptions } from "@tanstack/react-query";
import { z, ZodSchema } from "zod";

export const envOptions = (envirometns: string[], schema: ZodSchema) =>
  queryOptions({
    queryKey: [envirometns],
    queryFn: async () =>
      await apiHandler<z.infer<typeof schema>>(
        () => envAction(envirometns),
        schema,
      ),
  });
