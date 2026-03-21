import { Client, ID, Storage } from "node-appwrite";

export function getAppwriteServerConfigError() {
  if (!process.env.APPWRITE_API_KEY) {
    return "Appwrite storage is not configured. Missing: APPWRITE_API_KEY.";
  }

  if (!process.env.APPWRITE_BUCKET_ID) {
    return "Appwrite storage is not configured. Missing: APPWRITE_BUCKET_ID.";
  }

  return null;
}

function getServerClient() {
  const endpoint =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    process.env.APPWRITE_ENDPOINT ||
    "https://fra.cloud.appwrite.io/v1";
  const projectId =
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;

  if (!projectId) {
    throw new Error("Appwrite is not configured. Missing: APPWRITE_PROJECT_ID.");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(process.env.APPWRITE_API_KEY);

  return client;
}

export async function uploadToAppwriteStorage({ file }) {
  const configError = getAppwriteServerConfigError();
  if (configError) {
    throw new Error(configError);
  }

  const client = getServerClient();
  const storage = new Storage(client);

  const result = await storage.createFile(
    process.env.APPWRITE_BUCKET_ID,
    ID.unique(),
    file
  );

  const endpoint =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    process.env.APPWRITE_ENDPOINT ||
    "https://fra.cloud.appwrite.io/v1";
  const projectId =
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID;

  const fileUrl = `${endpoint}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${result.$id}/view?project=${projectId}`;

  return { fileId: result.$id, fileUrl };
}
