import { NextResponse } from "next/server"
import { generateCommitTimes, createCommit, getRandomDelay } from "@/lib/utils"

export const runtime = "nodejs"

async function processCommits() {
  // Generate all commit times for the day
  const commitTimes = generateCommitTimes()
  console.log(`Planning ${commitTimes.length} commits for today`)

  let successfulCommits = 0

  for (const commitTime of commitTimes) {
    const success = await createCommit(commitTime)
    if (success) {
      successfulCommits++
      // Add random delay between commits to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, getRandomDelay()))
    }
  }

  return successfulCommits
}

export async function GET() {
  try {
    const commits = await processCommits()
    return NextResponse.json({
      success: true,
      message: `Scheduled ${commits} commits for today`,
    })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ success: false, error: "Failed to process commits" }, { status: 500 })
  }
}

