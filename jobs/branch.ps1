$branchName = $(BranchName) -replace '-', ''
Write-Host "##vso[task.setvariable variable=sauce;]" $branchName