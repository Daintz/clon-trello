"use server";

import { z } from "zod";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export type State = {
  errors?: {
    title?: string[];
  },
  message?: string | null;
}

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Minimum length of 3 letters is required"
  })
});

export async function create(prevState: State, formData: FormData) {
  const validatedFields = CreateBoard.safeParse({
    title: formData.get("title"),
  })

  if (!validatedFields.success) {
    console.log('error')
    return {
      errros: {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing fields."
      }
    }
  }

  const { title } = validatedFields.data;

  try {
    await db.board.create({
      data: {
        title,
      }
    });
  } catch (error) {
    return {
      message: "Database Error",
    }
  }

  revalidatePath("/organization/org_2YgkPiB4xboBq1Vznc94QAAu7HR");
  redirect("/organization/org_2YgkPiB4xboBq1Vznc94QAAu7HR");
};