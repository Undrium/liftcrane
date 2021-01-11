FROM node:10.20.1 as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install
#RUN npm install -g @angular/cli
RUN npm install --save-dev @angular-devkit/build-angular

COPY . /app
RUN npm run build-prod -- --output-path=./dist/out

#CMD ng serve --host 0.0.0.0 --port 3000 --disableHostCheck true
FROM nginxinc/nginx-unprivileged
COPY --from=build /app/dist/out/ /usr/share/nginx/html
# Copy the default nginx.conf 
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
USER 0
RUN mkdir -p /var/cache/nginx /var/log/nginx && chmod -R 777 /var/cache/nginx /var/log/nginx
USER 1000
