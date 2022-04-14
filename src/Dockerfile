FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY dist/ .


# FROM httpd:2.4
# COPY dist/ /usr/local/apache2/htdocs/