import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2'
import { Resource } from './abstract/resource'

export class Network extends Resource {

  public network: ec2.Vpc;

  constructor() {
    super();
  }

  public createResource(scope: cdk.Construct) {

    // const natGatewayProvider = ec2.NatProvider.instance({
    //   instanceType: new ec2.InstanceType('t3.small'),
    // });

    this.network = new ec2.Vpc(scope, 'vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 1,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: this.createResourceName(scope, 'public'),
          cidrMask: 24,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          name: this.createResourceName(scope, 'db'),
          cidrMask: 24,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          name: this.createResourceName(scope, 'database'),
          cidrMask: 24,
        }
      ],

    })

  }
}
