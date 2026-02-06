---
author: Moises Aguirre
pubDatetime: 2024-05-23T12:00:00Z
title: "Workshop: Kubernetes AKS, Kube-State-Metrics, and Prometheus"
postSlug: kube-state-metrics-workshop
featured: true
draft: false
tags:
  - kubernetes
  - aks
  - azure
  - prometheus
description: "A Hands-On Guide to Monitoring Kubernetes with Azure AKS using Kube-State-Metrics and Prometheus."
---

# Kubernetes Workshop: Azure AKS, Kube-State-Metrics, and Prometheus (with Example Workload)

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Setup](#2-setup)
  * [Install Azure CLI](#21-install-azure-cli)
  * [Install Kubectl](#22-install-kubectl)
  * [Install Helm](#23-install-helm)
  * [Log in to Azure](#24-log-in-to-azure)
  * [Create a Resource Group](#25-create-a-resource-group)
3. [Workshop Steps](#3-workshop-steps)
  * [Create an AKS Cluster](#31-create-an-aks-cluster)
  * [Connect Kubectl to AKS](#32-connect-kubectl-to-aks)
  * [Deploy an Example NGINX Workload](#33-deploy-an-example-nginx-workload)
  * [Install Kube-State-Metrics using Helm](#34-install-kube-state-metrics-using-helm)
  * [Install Prometheus using Helm](#35-install-prometheus-using-helm)
  * [Access Prometheus Dashboard](#36-access-prometheus-dashboard)
  * [Query Kube-State-Metrics in Prometheus](#37-query-kube-state-metrics-in-prometheus)
  * [Advanced PromQL: Joining Metrics with Labels](#38-advanced-promql-joining-metrics-with-labels)
4. [Teardown](#4-teardown)
  * [Delete Helm Releases](#41-delete-helm-releases)
  * [Delete the Example NGINX Workload](#42-delete-the-example-nginx-workload)
  * [Delete the AKS Cluster](#43-delete-the-aks-cluster)
  * [Delete the Resource Group](#44-delete-the-resource-group)

-----

## 1\. Prerequisites

Before you begin, ensure you have:

  * An Azure account with an active subscription.
  * Administrator privileges on your local machine to install software.

## 2\. Setup

This section covers installing the necessary command-line tools and logging into your Azure account.

### 2.1 Install Azure CLI

The Azure CLI is a command-line tool for managing Azure resources.

**Windows:**

1.  **Recommended:** Install Azure CLI using Windows Package Manager (winget):
    ```bash
    winget install --exact --id Microsoft.AzureCLI
    ```
2.  **Alternative:** Download the MSI installer from the official Microsoft documentation: [Install Azure CLI on Windows](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows) and run the installer, following the prompts.
3.  After installation, open a new command prompt or PowerShell and verify the installation:
    ```bash
    az --version
    ```

**macOS/Linux:**

Follow the instructions on the official Microsoft documentation: [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

### 2.2 Install Kubectl

`kubectl` is the Kubernetes command-line tool, used to run commands against Kubernetes clusters.

**Windows (Recommended):**

1.  Install `kubectl` using Windows Package Manager (winget):
    ```bash
    winget install -e --id Kubernetes.kubectl
    ```
2.  After installation, open a new command prompt or PowerShell and verify the installation:
    ```bash
    kubectl version --client
    ```

**Windows (Alternative - Manual Download):**

1.  Download the latest stable `kubectl` executable:
    ```bash
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/windows/amd64/kubectl.exe"
    ```
2.  Create a directory for `kubectl`, for example, `C:\kubectl`.
3.  Move the downloaded `kubectl.exe` to this directory.
4.  Add `C:\kubectl` to your system's `PATH` environment variable.
      * Search for "Environment Variables" in the Windows search bar and open "Edit the system environment variables".
      * Click "Environment Variables...".
      * Under "User variables for...", select `Path` and click "Edit...".
      * Click "New" and add `C:\kubectl`. Click "OK" on all open windows.
5.  Close and reopen your command prompt or PowerShell to apply the changes.
6.  Verify the installation:
    ```bash
    kubectl version --client
    ```

**macOS/Linux:**

Follow the instructions on the official Kubernetes documentation: [Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### 2.3 Install Helm

Helm is a package manager for Kubernetes, which we'll use to deploy `kube-state-metrics` and Prometheus.
**Windows (using Windows Package Manager - Recommended):**

1. Open a command prompt or PowerShell.
2. Install Helm using winget:
    ```bash
    winget install Helm.Helm
    ```
3. Verify the installation:
    ```bash
    helm version
    ```

**Windows (using Chocolatey - Alternative):**

1. If you don't have Chocolatey, install it by following the instructions on their website: [Chocolatey Installation](https://chocolatey.org/install)
2. Open an **elevated** PowerShell or Command Prompt (Run as Administrator).
3. Install Helm:
    ```bash
    choco install kubernetes-helm
    ```
4. Verify the installation:
    ```bash
    helm version
    ```

**Windows (manual download - Alternative):**

1. Download the desired version of Helm from the official releases page: [Helm Releases](https://github.com/helm/helm/releases) (look for `helm-vX.Y.Z-windows-amd64.zip`)
2. Unzip the downloaded file. You'll find a `helm.exe` executable.
3. Move `helm.exe` to a directory included in your system's `PATH` (e.g., `C:\Program Files\Helm` and add it to PATH, or place it in `C:\kubectl` if you added that to your PATH).
4. Verify the installation:
    ```bash
    helm version
    ```

**macOS/Linux:**

Follow the instructions on the official Helm documentation: [Installing Helm](https://helm.sh/docs/intro/install/)

### 2.4 Log in to Azure

Open your terminal or command prompt and log in to your Azure account:

```bash
az login
```

This command will open a web browser for you to complete the login process.

### 2.5 Create a Resource Group

A resource group is a logical container for Azure resources.

```bash
RESOURCE_GROUP_NAME="myAKSWorkshopRG"
LOCATION="eastus" # You can choose a different region, e.g., westus, centralus

az group create --name $RESOURCE_GROUP_NAME --location $LOCATION
```

## 3\. Workshop Steps

Now let's get to the core of the workshop: creating an AKS cluster, deploying a sample application, installing the monitoring tools, and querying metrics.

### 3.1 Create an AKS Cluster

This command creates a basic AKS cluster. For production environments, you'd want to consider more advanced configurations (e.g., multiple node pools, advanced networking).

```bash
AKS_CLUSTER_NAME="myAKSCluster"

az aks create 
    --resource-group $RESOURCE_GROUP_NAME 
    --name $AKS_CLUSTER_NAME 
    --node-count 1 
    --generate-ssh-keys 
    --node-vm-size standard_ds2_v2 # A common general-purpose VM size
```

This command will take a few minutes to complete.

### 3.2 Connect Kubectl to AKS

Once the cluster is created, configure `kubectl` to connect to your new AKS cluster.

```bash
az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $AKS_CLUSTER_NAME
```

Verify `kubectl` can communicate with your cluster:

```bash
kubectl get nodes
```

You should see your AKS node(s) listed with a `Ready` status.

### 3.3 Deploy an Example NGINX Workload

We'll deploy a simple NGINX web server as our example workload. This will create a Deployment and a Service.

Create a file named `nginx-example.yaml` with the following content:

```yaml
# nginx-example.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3 # We'll deploy 3 replicas to generate more metrics
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer # Expose NGINX via a LoadBalancer for external access (optional for this workshop, but good practice)
```

Apply this manifest to your cluster:

```bash
kubectl apply -f nginx-example.yaml
```

Verify the NGINX deployment and pods are running:

```bash
kubectl get deployment nginx-deployment
kubectl get pods -l app=nginx
kubectl get service nginx-service
```

You should see 3 NGINX pods in `Running` status and a service with an `EXTERNAL-IP` (might be `<pending>` for a moment).

### 3.4 Install Kube-State-Metrics using Helm

`kube-state-metrics` listens to the Kubernetes API server and generates metrics about the state of Kubernetes objects (e.g., deployments, pods, nodes).

First, add the Prometheus community Helm repository:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

Now, install `kube-state-metrics`:

```bash
helm install kube-state-metrics prometheus-community/kube-state-metrics --namespace kube-system --create-namespace
```

Verify that `kube-state-metrics` is running:

```bash
kubectl get pods -n kube-system -l app.kubernetes.io/name=kube-state-metrics
```

You should see a pod named `kube-state-metrics-...` with a `Running` status.

### 3.5 Install Prometheus using Helm

Next, we'll install Prometheus, which will scrape metrics from `kube-state-metrics`.

Create a file named `prometheus-values.yaml` with the following content:

```yaml
# prometheus-values.yaml
server:
  service:
    type: LoadBalancer # Expose Prometheus via a LoadBalancer for easy access
alertmanager:
  enabled: false
kube-state-metrics:
  enabled: false # We installed it separately, so disable the one bundled with Prometheus
```

Now, install Prometheus using the Helm chart with your custom values:

```bash
helm install prometheus prometheus-community/prometheus -f prometheus-values.yaml --namespace monitoring --create-namespace
```

This will deploy Prometheus server, its associated service accounts, and roles. The `LoadBalancer` service type will provision an external IP address for Prometheus. This may take a few minutes for the external IP to be assigned.

Verify Prometheus pods are running:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=prometheus
```

You should see pods like `prometheus-server-...` with `Running` status.

### 3.6 Access Prometheus Dashboard

Get the external IP address of the Prometheus server:

```bash
kubectl get svc -n monitoring prometheus-server
```

Look for the `EXTERNAL-IP` for the `prometheus-server` service. It might show `<pending>` for a few minutes. Keep running the command until an IP address appears.

Once you have the external IP, open your web browser and navigate to `http://<EXTERNAL-IP>:80`.

You should see the Prometheus UI.

**Alternative: Access Prometheus Locally via Port Forwarding**

If you don't have an external IP or prefer not to expose Prometheus externally, you can use `kubectl port-forward` to access the dashboard locally:

```bash
kubectl port-forward -n monitoring svc/prometheus-server 9090:80
```

Then, open your browser and go to [http://localhost:9090](http://localhost:9090).

This method is secure and works even if your cluster does not provision a public IP.

### 3.7 Query Kube-State-Metrics in Prometheus

In the Prometheus UI, go to the "Graph" tab.

In the expression input box, you can enter various PromQL queries to explore metrics from `kube-state-metrics`.

Here are some example queries related to your NGINX workload:

  * **Number of running NGINX pods:**

    ```promql
    kube_pod_status_phase{pod=~"nginx-deployment.*", phase="Running"}
    ```

  * **Number of desired NGINX replicas for the deployment:**

    ```promql
    kube_deployment_spec_replicas{deployment="nginx-deployment"}
    ```

  * **Current number of available replicas for the NGINX deployment:**

    ```promql
    kube_deployment_status_replicas_available{deployment="nginx-deployment"}
    ```

  * **Pod restart count (if any NGINX pods have restarted):**

    ```promql
    kube_pod_container_status_restarts_total{pod=~"nginx-deployment.*"}
    ```

  * **Information about Kubernetes deployments (including NGINX):**

    ```promql
    kube_deployment_info
    ```

Type `kube_` in the expression box and explore the auto-completion suggestions. You'll find many metrics providing insights into the state of your NGINX deployment and other Kubernetes objects.

### 3.8 Advanced PromQL: Joining Metrics with Labels

Prometheus allows you to join data from different metrics using label matching. This is useful for correlating information across resources, such as deployments and pods, or pods and nodes. Here are some advanced examples you can try in the Prometheus UI:

* **Join NGINX pod restarts with pod phase (show restart count only for running pods):**

  ```promql
  kube_pod_container_status_restarts_total{pod=~"nginx-deployment.*"}
    * on(pod) group_left(phase)
    kube_pod_status_phase{phase="Running"}
  ```

* **Show desired vs available replicas for all deployments (side-by-side):**

  ```promql
  kube_deployment_spec_replicas - kube_deployment_status_replicas_available
  ```
  This shows the difference between desired and available replicas for each deployment.

* **List NGINX pods with their node assignment:**

  ```promql
  kube_pod_info{pod=~"nginx-deployment.*"}
  ```
  This metric includes labels for `pod`, `namespace`, and `node`, allowing you to see which node each NGINX pod is running on.

Explore more by using the `on()` and `group_left()`/`group_right()` operators in PromQL to join metrics on shared labels. This enables powerful cross-resource queries and deeper insights into your Kubernetes workloads.

## 4\. Teardown

It's crucial to clean up your Azure resources to avoid incurring unnecessary costs.

### 4.1 Delete Helm Releases

Delete the Helm releases for Prometheus and Kube-State-Metrics:

```bash
helm uninstall prometheus -n monitoring
helm uninstall kube-state-metrics -n kube-system
```

### 4.2 Delete the Example NGINX Workload

Delete the NGINX deployment and service:

```bash
kubectl delete -f nginx-example.yaml
```

### 4.3 Delete the AKS Cluster

```bash
az aks delete --resource-group $RESOURCE_GROUP_NAME --name $AKS_CLUSTER_NAME --yes
```

This command will prompt for confirmation. The `--yes` flag bypasses the prompt.

### 4.4 Delete the Resource Group

Deleting the resource group will remove all resources contained within it, including the AKS cluster, virtual networks, public IPs, and storage accounts created by AKS.

```bash
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

The `--no-wait` flag tells the command to return immediately without waiting for the deletion to complete, which can take several minutes.
