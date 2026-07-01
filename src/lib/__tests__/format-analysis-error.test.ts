import { describe, expect, it } from "vitest";
import { formatAnalysisError } from "@/lib/format-analysis-error";

describe("formatAnalysisError", () => {
  it("maps fetch failed to a Dify connection hint", () => {
    expect(formatAnalysisError(new Error("fetch failed"))).toContain(
      "无法连接 Dify 服务",
    );
  });

  it("maps missing API key to setup instructions", () => {
    expect(
      formatAnalysisError(new Error("DIFY_API_KEY is not configured")),
    ).toContain("DIFY_API_KEY");
  });

  it("maps timeout errors to retry guidance", () => {
    expect(formatAnalysisError(new Error("timeout of 120000ms exceeded"))).toContain(
      "超时",
    );
  });
});
