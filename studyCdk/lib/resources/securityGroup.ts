import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2'
import { Resource } from './abstract/resource'

export class SecurityGroup extends Resource {

  // public sgAlb: ec2.SecurityGroup;
  public sgEc2: ec2.SecurityGroup;
  public sgDb: ec2.SecurityGroup;

  private readonly vpcId: string
  constructor(vpcId: string) {
    super();
    this.vpcId = vpcId;
  }

  public createResource(scope: cdk.Construct) {

    // デフォルトでアウトバウンドはすべて許可
    const vpcInfo = ec2.Vpc.fromVpcAttributes(scope, 'vpcInfo', {
      availabilityZones: ['ap-northeast-1a'],
      vpcId: this.vpcId
    });

    // EC2サーバ設定
    this.sgEc2 = new ec2.SecurityGroup(scope, 'sgEc2', {
      vpc: vpcInfo,
      allowAllOutbound: true,
      description: 'sg for webServer',
      securityGroupName: this.createResourceName(scope, 'sg-ec2'),
    })
    this.sgEc2.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80), 'allow http access'
    )
    this.sgEc2.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443), 'allow https access'
    )
    this.sgEc2.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22), 'allow ssh access'
    )
    this.sgEc2.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.allIcmp(), 'allow ping(icmp) access'
    )

    // EC2サーバ設定
    this.sgDb = new ec2.SecurityGroup(scope, 'sgDb', {
      vpc: vpcInfo,
      allowAllOutbound: true,
      description: 'sg for db',
      securityGroupName: this.createResourceName(scope, 'sg-db'),
    })
    this.sgDb.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22), 'allow ssh access'
    )
    this.sgDb.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306), 'allow http access'
    )
    this.sgDb.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.allIcmp(), 'allow ping(icmp) access'
    )
  }
}
