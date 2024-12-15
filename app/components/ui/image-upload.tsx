"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    // Ensure secure_url is used and valid
    if (result.info && result.info.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {/* Display uploaded images */}
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-gray-300 shadow-sm"
          >
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                disabled={disabled}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="Uploaded Image"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Image Upload Button */}
      <CldUploadWidget onSuccess={onUpload} uploadPreset="dymiifz8e">
        {({ open }) => {
          const onClick = () => {
            if (!disabled) {
              open();
            }
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
