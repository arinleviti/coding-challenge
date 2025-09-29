import { NextRequest, NextResponse } from "next/server";

// request: the HTTP request
// params: an object with the dynamic route params, here { id: string }
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const receivedParams = await params;
  // Convert the id string to a number
  const id = Number(receivedParams.id);

  // Simulate latency
  await new Promise((res) => setTimeout(res, 500));

  // Return a JSON response
  return NextResponse.json({ success: true, deletedId: id });
}
