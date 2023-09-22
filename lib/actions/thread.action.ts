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

async function firstPostsQuery(pageSize: number) {
  return await prisma.thread.findMany({
    take: pageSize,
    where: {
      OR: [{ parentId: null }, { parentId: "" }, { parentId: undefined }],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          id: true,
        },
      },
      children: {
        // select: {
        //   parentId: true,
        // },
        include: {
          author: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  });
}

async function secondPostsQuery(cursor: string, pageSize: number) {
  return await prisma.thread.findMany({
    take: pageSize,
    cursor: {
      id: cursor,
    },
    where: {
      OR: [{ parentId: null }, { parentId: "" }, { parentId: undefined }],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          id: true,
        },
      },
      children: {
        // select: {
        //   parentId: true,
        // },
        include: {
          author: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  });
}

export async function fetchPosts({
  cursor = null,
  pageSize,
}: {
  cursor: null | string | undefined;
  pageSize: number;
}) {
  let result;
  try {
    if (cursor) {
      result = await secondPostsQuery(cursor, pageSize);
    } else {
      result = await firstPostsQuery(pageSize);
    }

    return result;
  } catch (error: any) {
    throw new Error(`Cannot fetch all Threads: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  try {
    const thread = await prisma.thread.findUnique({
      where: {
        id,
      },
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
            author: {
              select: {
                id: true,
                identifier: true,
                name: true,
                image: true,
              },
            },
            parentId: true,
            authorId: true,
            text: true,
            createdAt: true,
            id: true,
            children: {
              select: {
                author: {
                  select: {
                    id: true,
                    identifier: true,
                    name: true,
                    image: true,
                  },
                },
                parentId: true,
              },
            },
          },
        },
      },
    });

    return thread;
  } catch (error: any) {
    throw new Error(`Cannot fetch Thread by id: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    const originalThread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!originalThread) throw new Error("Thread not found");

    const commentThread = await prisma.thread.create({
      data: {
        text: commentText,
        authorId: userId,
        parentId: threadId,
      },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Cannot add comment to thread: ${error.message}`);
  }
}
