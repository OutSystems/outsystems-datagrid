param ($branch)
$branchName = $branch -replace '-', ''
Write-Host "##vso[task.setvariable variable=sauce;]" "GridReactive_Automation" + $branchName