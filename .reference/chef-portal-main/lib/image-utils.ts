import heic2any from "heic2any";

/**
 * Check if a file is a HEIC/HEIF image
 */
export function isHeicFile(file: File): boolean {
  const heicMimeTypes = [
    "image/heic",
    "image/heif",
    "image/heic-sequence",
    "image/heif-sequence",
  ];
  const heicExtensions = [".heic", ".heif", ".hif"];

  // Check MIME type
  if (heicMimeTypes.includes(file.type.toLowerCase())) {
    return true;
  }

  // Check file extension (fallback for browsers that don't recognize HEIC MIME type)
  const fileName = file.name.toLowerCase();
  return heicExtensions.some((ext) => fileName.endsWith(ext));
}

/**
 * Convert HEIC/HEIF image to JPG
 * @param heicFile The HEIC file to convert
 * @returns A Promise that resolves to a JPG File object
 */
export async function convertHeicToJpg(heicFile: File): Promise<File> {
  try {
    // Convert HEIC to JPG using heic2any
    // heic2any returns an array of Blobs (one per image, or one if single image)
    const convertedBlobs = await heic2any({
      blob: heicFile,
      toType: "image/jpeg",
      quality: 0.92, // High quality (0-1)
    });

    // heic2any returns an array, but for single images it's usually one element
    const blob = Array.isArray(convertedBlobs) ? convertedBlobs[0] : convertedBlobs;

    if (!blob) {
      throw new Error("Failed to convert HEIC image");
    }

    // Create a new File object with .jpg extension
    const fileName = heicFile.name.replace(/\.(heic|heif|hif)$/i, ".jpg");
    const jpgFile = new File([blob], fileName, {
      type: "image/jpeg",
      lastModified: heicFile.lastModified,
    });

    return jpgFile;
  } catch (error) {
    console.error("Error converting HEIC to JPG:", error);
    throw new Error(
      `Failed to convert HEIC image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Process an image file: convert HEIC to JPG if needed, otherwise return as-is
 * @param file The image file to process
 * @returns A Promise that resolves to a processed File (JPG if converted, original otherwise)
 */
export async function processImageFile(file: File): Promise<File> {
  if (isHeicFile(file)) {
    return convertHeicToJpg(file);
  }
  return file;
}

