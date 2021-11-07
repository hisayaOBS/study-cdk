import * as cdk from '@aws-cdk/core';
import { CfnInstance, CfnSubnet, CfnSecurityGroup, InstanceType, SecurityGroup, PublicSubnet, CfnEIP, CfnEIPAssociation, PrivateSubnet, RouterType } from '@aws-cdk/aws-ec2';
import { CfnInstanceProfile, Role } from '@aws-cdk/aws-iam';
import { Resource } from './abstract/resource';
import * as config from 'config';

export class Ec2 extends Resource {

  public webInstance1a: CfnInstance;
  public natInstance1a: CfnInstance;
  public dbInstance1a: CfnInstance;

  private readonly public1a: PublicSubnet;
  private readonly sgEc2: SecurityGroup;
  private readonly webEc2Ip1a: CfnEIP;
  private readonly natEc2Ip1a: CfnEIP;
  private readonly database1a: PrivateSubnet;
  private readonly sgDb: SecurityGroup;
  private readonly sgNat: SecurityGroup;

  constructor(public1a: PublicSubnet, sgEc2: SecurityGroup, webEc2Ip: CfnEIP, database1a: PrivateSubnet, sgDb: SecurityGroup, natEc2Ip1a: CfnEIP, sgNat: SecurityGroup) {
    super();
    this.public1a = public1a;
    this.sgEc2 = sgEc2;
    this.webEc2Ip1a = webEc2Ip
    this.database1a = database1a;
    this.sgDb = sgDb;
    this.natEc2Ip1a = natEc2Ip1a;
    this.sgNat = sgNat;
  }

  public createResource(scope: cdk.Construct) {

    // Web用EC2生成
    // IAMインスタンスプロファイル取得（Roleをインスタンスに適用するために必要なもの
    const ec2Role = Role.fromRoleArn(scope, 'fromEc2Role', config.get('iamArn.webEc2'));
    const webEc2InstanceProfile = new CfnInstanceProfile(scope, 'ec2InstanceProfile', { roles: [ec2Role.roleName] });

    this.webInstance1a = new CfnInstance(scope, 'webEc21a', {
      availabilityZone: 'ap-northeast-1a',
      iamInstanceProfile: webEc2InstanceProfile.ref,
      imageId: 'ami-0701e21c502689c31', // amazon linux-2
      instanceType: 't2.micro',
      subnetId: this.public1a.subnetId,
      securityGroupIds: [this.sgEc2.securityGroupId],
      keyName: config.get('keyName'),
      tags: [{ key: 'Name', value: this.createResourceName(scope, 'web-ec2-1a') }]
    });
    // EIPの関連付け
    const webEc2Association = new CfnEIPAssociation(scope, 'EIPassociationForWebEc21a', {
      eip: this.webEc2Ip1a.ref,
      instanceId: this.webInstance1a.ref
    });
    webEc2Association.addDependsOn(this.webInstance1a);

    // Natインスタンス用EC2生成
    this.natInstance1a = new CfnInstance(scope, 'natEc21a', {
      availabilityZone: 'ap-northeast-1a',
      imageId: 'ami-0a855f2e323191702', // amazon linux-nat
      instanceType: 't2.micro',
      subnetId: this.public1a.subnetId,
      securityGroupIds: [this.sgNat.securityGroupId],
      keyName: config.get('keyName'),
      // 送信元/送信先チェックをむｋ（NATインスタンスは、中継するだけなので、送信元・先になることはないため)
      sourceDestCheck: false,
      tags: [{ key: 'Name', value: this.createResourceName(scope, 'nat-ec2-1a') }]
    });
    // EIPの関連付け
    const natEc2Association = new CfnEIPAssociation(scope, 'EIPassociationForNatEc21a', {
      eip: this.natEc2Ip1a.ref,
      instanceId: this.natInstance1a.ref
    });
    natEc2Association.addDependsOn(this.natInstance1a);

    // DB用EC2生成
    this.dbInstance1a = new CfnInstance(scope, 'dbEc21a', {
      availabilityZone: 'ap-northeast-1a',
      imageId: 'ami-0701e21c502689c31', // amazon linux-2
      instanceType: 't2.micro',
      subnetId: this.database1a.subnetId,
      securityGroupIds: [this.sgDb.securityGroupId],
      keyName: config.get('keyName'),
      tags: [{ key: 'Name', value: this.createResourceName(scope, 'db-ec2-1a') }]
    });
    // DBはprivateサブネット配置かつ、公開用の固定IPを所持しないので、EIPの関連付けは不要

    this.database1a.addRoute(
      'privateSubnetAddRouteNatInstance',
      {
        routerId: this.natInstance1a.ref,
        routerType: RouterType.INSTANCE,
        destinationCidrBlock: '0.0.0.0/0' // デフォルト値と同値だが、明示的に記述
      }
    );

  }
}
