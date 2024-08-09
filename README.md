### Troubleshooting

- To view logs run `docker compose logs --tail=100 -f`
- To view the generated Nginx configuration run:
  - docker exeac -ti nginx cat /etc/nginx/conf.d/default.conf

### Build web docker production

```
docker build --platform linux/x86_64 -t registry.gitlab.com/mkt-devops/web-deployments:chuannhadat_next -f Dockerfile . && docker push registry.gitlab.com/mkt-devops/web-deployments:chuannhadat_next
```
