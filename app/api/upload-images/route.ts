import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, isConfigured } from "@/lib/supabase";

const BUCKET = "property-images";

export async function POST(req: NextRequest) {
  if (!isConfigured) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  const files = formData.getAll("files") as File[];
  if (!files.length) {
    return NextResponse.json({ error: "no_files" }, { status: 400 });
  }

  const client = createAdminClient();

  // Auto-create public bucket on first use
  await client.storage.createBucket(BUCKET, { public: true }).catch(() => {});

  const urls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = await file.arrayBuffer();

    const { error } = await client.storage
      .from(BUCKET)
      .upload(name, buffer, { contentType: file.type, upsert: false });

    if (!error) {
      const { data } = client.storage.from(BUCKET).getPublicUrl(name);
      urls.push(data.publicUrl);
    }
  }

  return NextResponse.json({ urls });
}
