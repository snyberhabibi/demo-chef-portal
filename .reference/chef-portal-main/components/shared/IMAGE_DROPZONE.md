# ImageDropzone Component

A flexible, reusable drag-and-drop image upload component that supports both single and multiple image uploads.

## Features

- ✅ **Drag & Drop** - Intuitive drag-and-drop interface
- ✅ **Click to Upload** - Traditional file picker support
- ✅ **Single & Multiple** - Toggle between single and multiple file modes
- ✅ **Image Previews** - Beautiful inline image previews
- ✅ **File Validation** - Size and type validation
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Existing Images** - Display and manage existing images
- ✅ **Accessible** - Keyboard navigation and ARIA labels
- ✅ **Customizable** - Extensive customization options

## Basic Usage

### Single Image Upload

```tsx
import { ImageDropzone } from "@/components/shared";
import { useState } from "react";

function MyComponent() {
  const [image, setImage] = useState<File | null>(null);

  return (
    <ImageDropzone
      multiple={false}
      onFilesChange={(file) => setImage(file as File | null)}
      maxSize={5 * 1024 * 1024} // 5MB
    />
  );
}
```

### Multiple Images Upload

```tsx
import { ImageDropzone } from "@/components/shared";
import { useState } from "react";

function MyComponent() {
  const [images, setImages] = useState<File[]>([]);

  return (
    <ImageDropzone
      multiple={true}
      maxFiles={5}
      onFilesChange={(files) => setImages(files as File[])}
      showPreviews={true}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Enable multiple file selection |
| `maxFiles` | `number` | `undefined` | Maximum number of files (multiple mode only) |
| `maxSize` | `number` | `10MB` | Maximum file size in bytes |
| `accept` | `string` | `"image/*"` | Accepted file types |
| `onFilesChange` | `(files: File \| File[] \| null) => void` | - | Callback when files change |
| `existingImages` | `string[]` | `[]` | URLs of existing images to display |
| `onRemoveExisting` | `(index: number) => void` | - | Callback when existing image is removed |
| `disabled` | `boolean` | `false` | Disable the dropzone |
| `className` | `string` | - | Custom CSS classes |
| `showPreviews` | `boolean` | `true` | Show image previews |
| `uploadButtonText` | `string` | - | Custom upload button text |
| `dragText` | `string` | - | Custom drag instruction text |
| `aspectRatio` | `string` | - | Aspect ratio for previews (e.g., "1/1", "16/9") |

## Examples

### With Form Integration

```tsx
import { useForm } from "react-hook-form";
import { ImageDropzone } from "@/components/shared";

function MyForm() {
  const form = useForm();
  const [avatar, setAvatar] = useState<File | null>(null);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    // Submit to API
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ImageDropzone
        multiple={false}
        onFilesChange={(file) => setAvatar(file as File | null)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Existing Images

```tsx
function GalleryEditor() {
  const [existingImages, setExistingImages] = useState([
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
  ]);
  const [newImages, setNewImages] = useState<File[]>([]);

  return (
    <ImageDropzone
      multiple={true}
      existingImages={existingImages}
      onRemoveExisting={(index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
      }}
      onFilesChange={(files) => setNewImages(files as File[])}
    />
  );
}
```

### Square Previews

```tsx
<ImageDropzone
  multiple={true}
  aspectRatio="1/1"
  onFilesChange={(files) => console.log(files)}
/>
```

## Styling

The component uses Tailwind CSS and follows your design system. You can customize it with:

- `className` prop for additional classes
- CSS variables for theming
- Custom button text and messages

## File Validation

The component automatically validates:
- File type (must be an image)
- File size (configurable via `maxSize`)
- File count (when `maxFiles` is set)

Invalid files show error messages using the `FormErrorAlert` component.

## Best Practices

1. **Always cleanup** - The component handles preview URL cleanup automatically
2. **Handle errors** - Use the error state to show user-friendly messages
3. **Limit file size** - Set appropriate `maxSize` based on your backend
4. **Use existing images** - Pre-populate with existing image URLs for better UX
5. **Accessibility** - The component is keyboard accessible out of the box

## TypeScript

The component is fully typed. Import types:

```tsx
import { ImageDropzone, type ImageFile } from "@/components/shared";
```

## See Also

- `OptimizedImage` - For displaying uploaded images
- `FormErrorAlert` - Error display component

