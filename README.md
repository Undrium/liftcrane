# Liftcrane

Manage, clone and patch clusters in Kubernetes

Liftcrane is a GUI using CloudGuard to safely manage a multi environment Kubernetes setup. It is aimed towards organizations which want to let development teams provision and handle their own clusters.

## Kubernetes

To start locally, use for instance Minikube. 

 `minikube --extra-config apiserver.cors-allowed-origins=["http://*"] start`

 Also visit the address of the started cluster in Chrome to enable passage of the certificate.

 When it comes to JWT, use the default one and open up the service account with this command.

 `kubectl create clusterrolebinding serviceaccounts-cluster-admin --clusterrole=cluster-admin --group=system:serviceaccounts`

 Using this will make your mini-system very vurnerable, this is strictly for a local testing environment.

 ## Release log

### 2020.06.01
* Openshift-clusters can now be added, still in testing phase
* Vendor now differs on kubernetes and openshift

### 2020.05.05
* Secrets are now created clientside before beeing persisted in cloudguard
* List secrets in namespaces
* Clusters can now be deleted from cloudguard

 ### 2020.05.04
* Ingresses can now be created and deleted under Namespaces
* Ingresses can now be edited 

### 2020.05.03
* Services can now be created and deleted under Namespaces
* Services can now be edited 
* Generic confirm and edit dialog added

### 2020.05.02
* Endpoints, Services and Ingresses are now listed for each namespace