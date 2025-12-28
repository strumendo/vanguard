# VOLUTION Infrastructure

This directory contains Terraform configurations for deploying VOLUTION infrastructure.

## Structure

```
infrastructure/
├── environments/
│   ├── dev/          # Development environment
│   ├── staging/      # Staging environment
│   └── prod/         # Production environment
├── modules/
│   ├── database/     # PostgreSQL RDS module
│   ├── cache/        # Redis ElastiCache module
│   ├── compute/      # ECS/Fargate compute module
│   └── cdn/          # CloudFront CDN module
└── shared/           # Shared resources (VPC, etc.)
```

## Prerequisites

- Terraform 1.5+
- AWS CLI configured
- Access to AWS account

## Environments

### Development
- Minimal resources for testing
- Single-AZ deployment
- Smaller instance sizes

### Staging
- Production-like setup
- Used for final testing

### Production
- Multi-AZ deployment
- Auto-scaling enabled
- Full monitoring

## Usage

```bash
# Initialize Terraform
cd environments/dev
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply
```

## Estimated Costs

| Environment | Monthly Est. |
|-------------|-------------|
| Development | ~$50-100    |
| Staging     | ~$150-250   |
| Production  | ~$500-1500  |

*Note: Costs vary based on usage and traffic.*
