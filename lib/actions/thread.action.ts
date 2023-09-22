"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  // communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  // communityId,
  path,
}: Params) {
  try {
    const createdThread = await prisma.thread.create({
      data: {
        text,
        authorId: author,
      },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating Thread: ${error.message}`);
  }
}
