param ($branch)
$branchName = "GridReactive_Automation" + $branch -replace '-', ''
Write-Host "##vso[task.setvariable variable=sauce;]" + $branchName