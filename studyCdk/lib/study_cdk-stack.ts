import * as cdk from '@aws-cdk/core';
import { Vpc } from './resources/vpc';
import { InternetGateway } from './resources/internetGateway';
import { Subnet } from './resources/subnet';
import { Ec2 } from './resources/ec2';
import { PublicSubnet, RouterType, CfnTransitGatewayAttachment } from '@aws-cdk/aws-ec2';
import { SecurityGroup } from './resources/securityGroup';
import { Network } from './resources/Network';



export class StudyCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPCリソース生成
    const vpc = new Vpc();
    vpc.createResource(this);

    // インターネットGWリソース生成
    const internetGateway = new InternetGateway(vpc.vpc.ref);
    internetGateway.createResource(this);

    // サブネットリソース生成
    const subnet = new Subnet(vpc.vpc.ref, internetGateway);
    subnet.createResource(this);

    //
    // const vpc = new Network();
    // vpc.createResource(this);

    // セキュリティグループリソース生成
    const securityGroup = new SecurityGroup(vpc.vpc.ref);
    securityGroup.createResource(this);

    // EC2リソース生成
    const ec2 = new Ec2(vpc.vpc.ref, subnet.public1a, securityGroup.sgEc2);
    ec2.createResource(this);

  }
}
