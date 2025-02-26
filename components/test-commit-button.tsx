"use client"

import { useState } from "react"
import { Check, Loader2, GitCommit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function TestCommitButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastCommitTime, setLastCommitTime] = useState<string | null>(null)
  const { toast } = useToast()

  const handleTestCommit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-commit", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        setLastCommitTime(new Date().toLocaleTimeString())
        toast({
          title: "Success!",
          description: "Test commit was created successfully.",
        })
      } else {
        throw new Error(data.error || "Failed to create commit")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create test commit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleTestCommit} disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitCommit className="mr-2 h-4 w-4" />}
        Create Test Commit
      </Button>
      {lastCommitTime && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Last commit at: {lastCommitTime}
        </div>
      )}
    </div>
  )
}

