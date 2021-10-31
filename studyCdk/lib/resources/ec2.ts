import * as cdk from '@aws-cdk/core';
import { CfnInstance, CfnSubnet, CfnSecurityGroup, InstanceType, SecurityGroup, PublicSubnet } from '@aws-cdk/aws-ec2';
import { CfnInstanceProfile, Role } from '@aws-cdk/aws-iam';
import { Resource } from './abstract/resource';
import * as config from 'config';

export class Ec2 extends Resource {

  public webInstance: CfnInstance;

  private readonly vpcId: string;
  private readonly public1a: PublicSubnet;
  private readonly sgEc2: SecurityGroup;

  constructor(vpcId: string, public1a: PublicSubnet, sgEc2: SecurityGroup) {
    super();
    this.vpcId = vpcId;
    this.public1a = public1a;
    this.sgEc2 = sgEc2;
  }

  public createResource(scope: cdk.Construct) {

    // IAMインスタンスプロファイル取得（Roleをインスタンスに適用するために必要なもの
    const ec2Role = Role.fromRoleArn(scope, 'fromEc2Role', config.get('iamArn.webEc2'));
    const ec2InstanceProfile = new CfnInstanceProfile(scope, 'ec2InstanceProfile', { roles: [ec2Role.roleName] });

    this.webInstance = new CfnInstance(scope, 'webEc2', {
      availabilityZone: 'ap-northeast-1a',
      iamInstanceProfile: ec2InstanceProfile.ref,
      imageId: 'ami-0701e21c502689c31', // amazon linux-2
      instanceType: 't3.nano',
      subnetId: this.public1a.subnetId,
      securityGroupIds: [this.sgEc2.securityGroupId],
      keyName: 'hm-ssh-key',
      tags: [{ key: 'Name', value: this.createResourceName(scope, 'web-ec2') }]
    });

  }
}
