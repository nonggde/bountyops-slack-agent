param(
  [Parameter(Mandatory = $true)][ValidatePattern('^[A-Za-z0-9-]+$')][string]$Region,
  [Parameter(Mandatory = $true)][ValidatePattern('^[A-Za-z0-9-]+$')][string]$InstanceId,
  [Parameter(Mandatory = $true)][ValidatePattern('^[A-Za-z0-9._/:@-]+$')][string]$AcrImage
)

$ErrorActionPreference = 'Stop'

# Alibaba Cloud ECS Cloud Assistant runs the container update on the target VM.
$command = "set -e; docker pull $AcrImage; docker rm -f bountyops 2>/dev/null || true; docker run -d --restart unless-stopped --name bountyops --env-file /opt/bountyops/.env $AcrImage"
$encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($command))

aliyun ecs RunCommand `
  --RegionId $Region `
  --Type RunShellScript `
  --CommandContent $encoded `
  --InstanceId.1 $InstanceId `
  --Name BountyOpsQwenDeploy
