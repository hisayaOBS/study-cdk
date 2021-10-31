import * as cdk from '@aws-cdk/core';
import { CfnInternetGateway, CfnVPCGatewayAttachment } from '@aws-cdk/aws-ec2'
import { Resource } from './abstract/resource'

export class InternetGateway extends Resource {

  public internetGateway: CfnInternetGateway;
  public gatewayAttachment: CfnVPCGatewayAttachment;
  private readonly vpcId: string;

  constructor(vpcId: string) {
    super();
    this.vpcId = vpcId;
  }

  public createResource(scope: cdk.Construct) {

    // インターネットGWリソース生成
    this.internetGateway = new CfnInternetGateway(scope, 'internetGateway', {
      tags: [{
        key: 'Name', value: this.createResourceName(scope, 'igw')
      }]
    });

    // VPCにアタッチ
    this.gatewayAttachment = new CfnVPCGatewayAttachment(scope, 'igwVpcAttach', {
      vpcId: this.vpcId,
      internetGatewayId: this.internetGateway.ref
    })

    // 削除ポリシー設定
    this.gatewayAttachment.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    this.internetGateway.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
