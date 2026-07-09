import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/api/admin.functions";
import { getAuthToken } from "@/lib/auth";

interface ImageUploadProps {
  bucket: "service-images" | "blog-images";
  currentUrl?: string | null;
  onUpload: (publicUrl: string) => void;
  onClear?: () => void;
  label?: string;
}

/**
 * Reusable image upload component.
 * - Accepts a file from the user's disk
 * - Converts it to base64
 * - Calls the uploadImage server function (which handles the actual Supabase Storage PUT)
 * - Returns the public URL via onUpload callback
 */
export function ImageUpload({
  bucket,
  currentUrl,
  onUpload,
  onClear,
  label = "Upload image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Read as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const token = await getAuthToken();
      if (!token) throw new Error("Not authenticated.");

      const result = await uploadImage({
        data: {
          authToken: token,
          bucket,
          fileName: file.name,
          base64,
          contentType: file.type,
        },
      });

      setPreview(result.publicUrl);
      onUpload(result.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleClear() {
    setPreview(null);
    onClear?.();
  }

  return (
    <div>
      {/* Current / preview image */}
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-700 mb-3">
          <img src={preview} alt="Uploaded preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 bg-slate-900/80 hover:bg-red-700 text-white w-7 h-7 rounded-full inline-flex items-center justify-center transition-colors"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-slate-700 hover:border-amber-500 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-amber-400 transition-colors mb-3 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
          <span className="text-sm">{uploading ? "Uploading…" : label}</span>
          <span className="text-xs text-slate-600">JPEG, PNG, WebP — max 5 MB</span>
        </button>
      )}

      {!preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-amber-500 hover:text-amber-400 underline disabled:opacity-60"
        >
          {preview ? "Change image" : "Browse file"}
        </button>
      )}

      {preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-amber-500 hover:text-amber-400 underline disabled:opacity-60"
        >
          Replace image
        </button>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        aria-label={label}
      />
    </div>
  );
}
