import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // note the Promise
) {
  const params = await context.params;
  const id = Number(params.id);

  await new Promise((res) => setTimeout(res, 500));

  return NextResponse.json({ success: true, deletedId: id });
}
