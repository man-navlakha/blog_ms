import { NextResponse } from "next/server";
import { uploadToAppwriteStorage } from "@/lib/appwrite-server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "File is required." }, { status: 400 });
    }

    const { fileId, fileUrl } = await uploadToAppwriteStorage({ file });

    return NextResponse.json({ fileId, fileUrl });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Upload failed." },
      { status: 500 }
    );
  }
}
