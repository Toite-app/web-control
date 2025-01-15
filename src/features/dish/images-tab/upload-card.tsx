import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { uploadDishImageMutation } from "@/api/fetch/dishes/images/upload-dish-image";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface UploadCardProps {
  dishId: string;
}

export function UploadCard({ dishId }: UploadCardProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const handleError = useErrorHandler();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      await uploadDishImageMutation({
        urlValues: { dishId },
        data: formData,
      });

      toast({
        title: t("Images.upload-success"),
        description: t("Images.upload-success-description"),
        variant: "success",
      });

      // Clear input after successful upload
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      handleError({ error });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="w-full"
        />
        <Button onClick={handleUpload} disabled={isUploading}>
          <ImagePlus className="mr-2 h-4 w-4" />
          {isUploading ? t("Images.uploading") : t("Images.upload")}
        </Button>
      </div>
    </Card>
  );
}
