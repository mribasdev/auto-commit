import { TestCommitButton } from "@/components/test-commit-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">GitHub Auto Commits</h1>
          <p className="text-muted-foreground">Test and monitor your automated commit system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manual Commit Test</CardTitle>
            <CardDescription>Click the button below to test the commit functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <TestCommitButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Current system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="font-medium">Repository</div>
              <div className="text-sm text-muted-foreground">{process.env.GITHUB_REPOSITORY || "Not configured"}</div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">Branch</div>
              <div className="text-sm text-muted-foreground">{process.env.GITHUB_BRANCH || "main"}</div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">Cron Schedule</div>
              <div className="text-sm text-muted-foreground">Daily at midnight UTC (0 0 * * *)</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

