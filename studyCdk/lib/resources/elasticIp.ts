import * as cdk from '@aws-cdk/core';
import { CfnEIP } from '@aws-cdk/aws-ec2';
import { Resource } from './abstract/resource';

interface ResourceInfo {
  readonly id: string;
  readonly resourceName: string;
  readonly assign: (elasticIp: CfnEIP) => void;
}

export class ElasticIp extends Resource {

  public webEc2Ip1a: CfnEIP;
  public natEc2Ip1a: CfnEIP;

  private readonly resourcesInfo: ResourceInfo[] = [
    {
      id: 'ElasticIpWebEc2-1a',
      resourceName: 'eip-web-ec2-1a',
      assign: elasticIp => this.webEc2Ip1a = elasticIp
    },
    {
      id: 'ElasticIpNatEc2-1a',
      resourceName: 'eip-nat-ec2-1a',
      assign: elasticIp => this.natEc2Ip1a = elasticIp
    },
  ];

  constructor() {
    super();
  }

  public createResource(scope: cdk.Construct) {
    for (const resourceInfo of this.resourcesInfo) {
      const elasticIp = this.createElasticIp(scope, resourceInfo);
      resourceInfo.assign(elasticIp);
    }
  }

  private createElasticIp(scope: cdk.Construct, resourceInfo: ResourceInfo): CfnEIP {
    const elasticIp = new CfnEIP(scope, resourceInfo.id, {
      domain: 'vpc',
      tags: [{
        key: 'Name',
        value: this.createResourceName(scope, resourceInfo.resourceName)
      }]
    });

    return elasticIp;
  }
}
