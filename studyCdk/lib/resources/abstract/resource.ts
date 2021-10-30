import * as cdk from '@aws-cdk/core';

export abstract class Resource {

  abstract createResource(scope: cdk.Construct): void;

  public createResourceName(scope: cdk.Construct, name: string): string {
    const resourceName = `${scope.node.tryGetContext('systemName')}-${name}`;
    return resourceName;
  }
}
