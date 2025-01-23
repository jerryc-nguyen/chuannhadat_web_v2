### Troubleshooting

- To view logs run `docker compose logs --tail=100 -f`
- To view the generated Nginx configuration run:
  - docker exeac -ti nginx cat /etc/nginx/conf.d/default.conf

### Build web docker production

```
docker build --platform linux/x86_64 -t registry.gitlab.com/mkt-devops/web-deployments:chuannhadat_next -f Dockerfile . && docker push registry.gitlab.com/mkt-devops/web-deployments:chuannhadat_next
```

### IMAGES CND NOTES

images.chuannhadat.com
-> BUNNY CDN (s3-images.b-cdn.net)
-> resizer.chuannhadat.com/s3-images
-> Prefix url: https://chuannhadat-assets.sgp1.digitaloceanspaces.com

assets.chuannhadat.com
-> BUNNY CDN (chuannhadat-files.b-cdn.net)
-> chuannhadat.com

spaces.chuannhadat.com
-> BUNNY CDN (chuannhadat-do-spaces.b-cdn.net)
-> https://chuannhadat-assets.sgp1.digitaloceanspaces.com

s3-images-dev.b-cdn.net
-> resizer.chuannhadat.com/s3-images-dev
-> Prefix url: https://chuannhadat-assets-dev.sgp1.digitaloceanspaces.com

### Mapping sizes taildwind:

.gap-x-2 {
column-gap: 0.5rem;
}
.gap-x-4 {
column-gap: 1rem;
}
.gap-x-8 {
column-gap: 2rem;
}
.gap-y-4 {
row-gap: 1rem;
}
.gap-y-5 {
row-gap: 1.25rem;
}
.gap-y-6 {
row-gap: 1.5rem;
}

===

1em = 16px
-20 = 1.25 | tw: 1 | gap-y-5
-32 = 2

===
component examples from this repo: https://github.com/HashenUdara/shadcn-ui-examples/tree/main
https://next-shadcn-dashboard-starter.vercel.app/dashboard/employee/new

OK
