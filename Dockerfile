FROM library/nginx:1.14.1
ADD dist/index.html /usr/share/nginx/html/index.html
ADD dist/static /usr/share/nginx/html/static
ADD deploy/nginx/mysite.template /etc/nginx/conf.d/mysite.template
CMD envsubst '$BASE_URL $BR_URL $ETL_URL $IMG_URL $BRCM_URL' < /etc/nginx/conf.d/mysite.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
