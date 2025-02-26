import { Octokit } from "@octokit/rest"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/")
const branch = process.env.GITHUB_BRANCH || "main"

// Check if a given time is within allowed windows
function isWithinAllowedTime(date: Date): boolean {
  const hour = date.getUTCHours()

  // Primary window: 8h-16h (8am-4pm)
  const isPrimaryWindow = hour >= 8 && hour < 16

  // Secondary window: 13h-19h (1pm-7pm) with 30% chance
  const isSecondaryWindow = hour >= 13 && hour < 19 && Math.random() < 0.3

  return isPrimaryWindow || isSecondaryWindow
}

// Generate commit times for the entire day
export function generateCommitTimes(): Date[] {
  const now = new Date()
  const commitCount = Math.floor(Math.random() * (80 - 20 + 1)) + 20 // 20-80 commits
  const commitTimes: Date[] = []

  for (let i = 0; i < commitCount; i++) {
    const commitDate = new Date(now)
    let attempts = 0

    // Try to find a valid time within the allowed windows
    do {
      // Set random hour (0-23) and random minute (0-59)
      commitDate.setUTCHours(Math.floor(Math.random() * 24))
      commitDate.setUTCMinutes(Math.floor(Math.random() * 60))
      attempts++
    } while (!isWithinAllowedTime(commitDate) && attempts < 10)

    if (attempts < 10) {
      commitTimes.push(new Date(commitDate))
    }
  }

  // Sort commits chronologically
  return commitTimes.sort((a, b) => a.getTime() - b.getTime())
}

async function getCurrentFile(path: string) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    })

    if ("content" in response.data && "sha" in response.data) {
      return {
        content: Buffer.from(response.data.content, "base64").toString(),
        sha: response.data.sha,
      }
    }
    throw new Error("Invalid response format")
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).status === 404) {
      return { content: "", sha: "" }
    }
    throw error
  }
}

// Create a commit at a specific time
export async function createCommit(commitTime: Date) {
  const timestamp = commitTime.toISOString()
  const path = "data/commits.txt"

  try {
    const { content, sha } = await getCurrentFile(path)
    const newContent = content ? `${content}\n${timestamp}` : timestamp

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update commit log at ${timestamp}`,
      content: Buffer.from(newContent).toString("base64"),
      branch,
      sha: sha || undefined,
    })

    return true
  } catch (error) {
    console.error("Error creating commit:", error)
    return false
  }
}

// Delay between commits to avoid rate limiting
export function getRandomDelay(): number {
  return Math.floor(Math.random() * (120000 - 30000 + 1)) + 30000 // 30s to 2min
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}