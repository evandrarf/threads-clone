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

export async function fetchUser(
  identifier: string,
  using: string = "identifier",
  withThreads: boolean = false
) {
  try {
    let user;
    if (using === "identifier") {
      user = await prisma.user.findUnique({
        where: {
          identifier,
        },
        include: {
          threads: withThreads,
        },
      });
    } else if (using === "id") {
      user = await prisma.user.findUnique({
        where: {
          id: identifier,
        },
        include: {
          threads: withThreads,
        },
      });
    }

    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    const threads = prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        threads: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                identifier: true,
                image: true,
              },
            },
            children: {
              select: {
                parentId: true,
                authorId: true,
                text: true,
                createdAt: true,
                id: true,
                author: {
                  select: {
                    name: true,
                    image: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user threads: ${error.message}`);
  }
}
