import { NextResponse } from "next/server"
import { createCommit } from "@/lib/utils"

export async function POST() {
  try {
    const success = await createCommit(new Date())

    if (!success) {
      throw new Error("Failed to create commit")
    }

    return NextResponse.json({
      success: true,
      message: "Test commit created successfully",
    })
  } catch (error) {
    console.error("Error creating test commit:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test commit",
      },
      { status: 500 },
    )
  }
}

