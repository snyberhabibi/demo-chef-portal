declare module "heic2any" {
  interface ConvertOptions {
    blob: Blob | File;
    toType?: "image/jpeg" | "image/png" | "image/webp";
    quality?: number; // 0-1
  }

  function heic2any(options: ConvertOptions): Promise<Blob | Blob[]>;

  export default heic2any;
}

