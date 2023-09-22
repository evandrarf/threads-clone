"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    const payload = {
      username: username.toLowerCase(),
      name,
      bio,
      image,
      onboarded: true,
      identifier: userId,
    };

    await prisma.user.upsert({
      where: { identifier: userId },
      update: payload,
      create: payload,
    });

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(identifier: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        identifier,
      },
    });

    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
