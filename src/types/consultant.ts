import { z } from "zod";

export const ProductConsultantReportSchema = z.object({
  recommendedTrend: z.string().min(1),
  recommendedSkus: z.array(z.string().min(1)).min(1),
  opportunityScore: z.number().min(0).max(100),
  profitEstimate: z.string().min(1),
  risks: z.array(z.string().min(1)).min(1),
  recommendation: z.string().min(1),
});

export type ProductConsultantReport = z.infer<
  typeof ProductConsultantReportSchema
>;
