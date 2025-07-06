"use client";

import { getChatFileUploadUrl } from "./actions";

export default function Home() {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const digest = await crypto.subtle.digest(
        "SHA-256",
        await file.arrayBuffer()
      );
      const hash = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const { url, fields } = await getChatFileUploadUrl(hash);
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        console.error(`upload failed: ${res.status}`);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}
