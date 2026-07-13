# Alibaba Cloud Deployment

The production path uses Alibaba Cloud Container Registry (ACR) for the image and ECS Cloud Assistant for deployment. `deploy-to-ecs.ps1` invokes the Alibaba Cloud ECS `RunCommand` API through the official `aliyun` CLI, pulls the ACR image, and runs BountyOps with restart protection.

Required secret values stay on the ECS host in `/opt/bountyops/.env`; they are never committed. Set `QWEN_API_KEY`, `QWEN_BASE_URL`, `QWEN_MODEL`, `SLACK_APP_TOKEN`, and `SLACK_BOT_TOKEN` there.

```powershell
docker build -t bountyops-qwen .
docker tag bountyops-qwen registry-intl.<region>.aliyuncs.com/<namespace>/bountyops-qwen:latest
docker push registry-intl.<region>.aliyuncs.com/<namespace>/bountyops-qwen:latest

.\deploy\alibaba-cloud\deploy-to-ecs.ps1 `
  -Region <region> `
  -InstanceId <ecs-instance-id> `
  -AcrImage registry-intl.<region>.aliyuncs.com/<namespace>/bountyops-qwen:latest
```

The final Devpost submission must include the deployed ECS endpoint/evidence and a link to `deploy-to-ecs.ps1` as the code-level Alibaba Cloud API proof.
