"use client";

import { useEffect } from "react";
import { client } from "@/lib/appwrite";

export default function AppwritePing() {
  useEffect(() => {
    client.ping().catch((error) => {
      console.warn("Appwrite ping failed", error);
    });
  }, []);

  return null;
}
