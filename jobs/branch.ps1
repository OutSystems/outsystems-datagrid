param ($branch)
$branchName="GridReactive_Automation_"+$branch -replace '-', ''
Write-Host "##vso[task.setvariable variable=branch;]$branchName"