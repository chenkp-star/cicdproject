# Run from an Administrator PowerShell, then reboot Windows.
$features = @('Microsoft-Windows-Subsystem-Linux', 'VirtualMachinePlatform')
foreach ($feature in $features) {
  Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart
}
Write-Host 'WSL2 features enabled. Reboot Windows, then open Docker Desktop.'
