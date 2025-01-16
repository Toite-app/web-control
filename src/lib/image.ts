import { IFile } from "@/types/file.types";

export default class ImageLib {
  public static getImageUrl(
    file?: Pick<
      IFile,
      "bucketName" | "endpoint" | "extension" | "id" | "region"
    > | null
  ) {
    if (!file) return "/images/placeholder.jpg";

    return `${file.endpoint}/${file.bucketName}/${file.id}${file.extension}`;
  }
}
