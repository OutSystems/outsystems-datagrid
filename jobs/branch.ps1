param ($branch)
$branchName ="GridReactive_Automation"+$branch -replace '-', ''
Write-Host "##vso[task.setvariable variable=branch;]"$branchName