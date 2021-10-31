import * as cdk from '@aws-cdk/core';
import * as config from 'config';
export abstract class Resource {

  abstract createResource(scope: cdk.Construct): void;

  public createResourceName(scope: cdk.Construct, name: string): string {
    const resourceName = `${config.get('systemName')}-${config.get('env')}-${name}`;
    return resourceName;
  }
}
