import { consultProduct } from "@/services/ai/product-consultant";

export async function GET() {
  try {
    const data = await consultProduct();

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}
