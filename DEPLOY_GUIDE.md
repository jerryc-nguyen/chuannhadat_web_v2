# Deployment Script

## Setup

1. Copy `.env.deploy.sample` to `.env.deploy`
2. Fill in your credentials in `.env.deploy`:
   - `DEPLOY_VPS_IP`: The VPS IP address
   - `DEPLOY_VPS_USER`: SSH user for the VPS
   - `DEPLOY_TOKEN_USERNAME`: Your GitLab deploy token username
   - `DEPLOY_TOKEN`: Your GitLab deploy token

3. Make the script executable:
   ```
   chmod +x deploy.sh
   ```

4. Ensure your SSH key is set up for VPS access

## Usage

- Full deployment: `./deploy.sh [optional_tag]`
- Restart services only: `./deploy.sh --restart`
