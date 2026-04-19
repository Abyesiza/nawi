import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "@/lib/auth/current";

const f = createUploadthing();

/**
 * UploadThing routes — all require an authenticated ADMIN.
 * Add more routes here for other upload contexts (gallery, profile, etc.).
 */
export const ourFileRouter = {
  /** Hero / gallery photos for experiences and marketplace products. */
  adminImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 8 },
  })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user) throw new UploadThingError("Not signed in");
      if (user.role !== "ADMIN") {
        throw new UploadThingError("Only admins may upload images");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        `[uploadthing] admin ${metadata.userId} uploaded ${file.ufsUrl}`
      );
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
