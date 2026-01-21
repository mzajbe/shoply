import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";

export const runtime = "nodejs";

async function saveMediaFile(file: File) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "media");
  await mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));

  return {
    url: `/uploads/media/${filename}`,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Only image uploads are supported" }, { status: 400 });
    }

    const saved = await saveMediaFile(file);
    const id = crypto.randomUUID();

    return NextResponse.json({ id, ...saved }, { status: 201 });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
