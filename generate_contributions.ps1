
$startDate = Get-Date -Year 2026 -Month 1 -Day 1 -Hour 10 -Minute 0 -Second 0
$endDate = Get-Date # Today (May 5, 2026)

$currentDate = $startDate
$messages = @("Update styles", "Fix minor bugs", "Refactor components", "Add documentation", "Improve performance", "Update README", "Cleanup code", "Merge branch 'feature/ui'")

while ($currentDate -le $endDate) {
    if ((Get-Random -Minimum 0 -Maximum 100) -lt 85) {
        $numCommits = Get-Random -Minimum 1 -Maximum 4
        
        for ($i = 1; $i -le $numCommits; $i++) {
            # Check for index.lock and remove if it persists
            if (Test-Path ".git/index.lock") {
                Remove-Item ".git/index.lock" -Force -ErrorAction SilentlyContinue
            }

            $timestamp = $currentDate.AddHours((Get-Random -Minimum 0 -Maximum 12)).AddMinutes((Get-Random -Minimum 0 -Maximum 59))
            $dateStr = $timestamp.ToString("yyyy-MM-ddTHH:mm:ss")
            $msg = $messages[(Get-Random -Minimum 0 -Maximum $messages.Length)]
            
            Add-Content -Path "CONTRIBUTIONS.md" -Value "Contribution on $dateStr - $msg"
            
            $env:GIT_AUTHOR_DATE = $dateStr
            $env:GIT_COMMITTER_DATE = $dateStr
            
            git add CONTRIBUTIONS.md
            git commit -m "$msg" --quiet
            
            # Small sleep to prevent race conditions
            Start-Sleep -Milliseconds 100
        }
    }
    
    $currentDate = $currentDate.AddDays(1)
}

Remove-Item Env:GIT_AUTHOR_DATE
Remove-Item Env:GIT_COMMITTER_DATE

Write-Host "Generated backdated commits in CONTRIBUTIONS.md from Jan 1 to date."
