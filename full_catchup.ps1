
$startDate = Get-Date -Year 2026 -Month 1 -Day 1
$endDate = Get-Date

$currentDate = $startDate
while ($currentDate -le $endDate) {
    $dateStr = $currentDate.ToString("yyyy-MM-dd") + " 12:00:00"
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    Add-Content -Path "DAILY.txt" -Value "Commit for $dateStr"
    git add DAILY.txt
    git commit -m "Daily update $dateStr" --quiet
    
    # Try to push every 30 commits to keep it moving
    if ($currentDate.Day % 30 -eq 0) {
        git push origin main --quiet
    }
    
    $currentDate = $currentDate.AddDays(1)
}

git push origin main
Write-Host "Completed full catch-up."
