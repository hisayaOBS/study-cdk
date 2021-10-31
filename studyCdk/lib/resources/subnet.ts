import * as cdk from '@aws-cdk/core';
import { PublicSubnet, PrivateSubnet, RouterType } from '@aws-cdk/aws-ec2'
import { Resource } from './abstract/resource'
import { InternetGateway } from './internetGateway'

export class Subnet extends Resource {

  public public1a: PublicSubnet;
  // public public1c: PublicSubnet;
  public database1a: PrivateSubnet;
  // public database1c: PrivateSubnet;

  private readonly vpcId: string;
  private readonly internetGateway: InternetGateway;


  constructor(vpcId: string, internetGateway: InternetGateway) {
    super();
    this.vpcId = vpcId;
    this.internetGateway = internetGateway;
  }

  public createResource(scope: cdk.Construct) {
    // Publicサブネット
    this.public1a = new PublicSubnet(scope, 'subnetPublic', {
      availabilityZone: 'ap-northeast-1a',
      vpcId: this.vpcId,
      cidrBlock: '10.0.1.0/24',
    });
    this.public1a.addDefaultInternetRoute(
      this.internetGateway.internetGateway.ref,
      this.internetGateway.gatewayAttachment,
    );

    // Privateサブネット
    // this.database1a = new PublicSubnet(scope, 'subnetPrivate', {
    //   availabilityZone: 'ap-northeast-1a',
    //   vpcId: this.vpcId,
    //   cidrBlock: '10.0.2.0/24',
    // });
    // this.database1a.addDefaultInternetRoute(
    //   this.internetGateway.internetGateway.ref,
    //   this.internetGateway.gatewayAttachment,
    // );

  }
}
