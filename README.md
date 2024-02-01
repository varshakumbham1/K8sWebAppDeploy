## To build and run the dockerfile
docker build -t nodejs-webapp .
docker tag nodejs-webapp:latest varshakumbham/nodejs-webapp:latest
docker run -p 3000:80 varshakumbham/nodejs-webapp:latest 
docker push varshakumbham/nodejs-webapp:latest

## To create Kube deployments, services and ingress
kubectl apply -f mysql-deployment.yml
kubectl apply -f mysql-service.yml
kubectl apply -f webapp-deployment.yml
kubectl apply -f webapp-service.yml
kubectl apply -f ingress.yml

## To check the status
kubectl get pods
kubectl get deployments
kubectl get services

## Minikube for local development, use the minikube service command to open a service in your default browser:
minikube service webapp-service