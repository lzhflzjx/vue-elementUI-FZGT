docker-compose pull
docker-compose create
docker save `docker-compose images | awk -F " " '{print $2":"$3}' | grep -v '^:' | grep -v 'Repository:Tag'` | gzip - > images_zhiyuan.gz
docker-compose rm -sf
