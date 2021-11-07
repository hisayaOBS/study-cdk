import * as cdk from '@aws-cdk/core';
import { Vpc } from './resources/vpc';
import { InternetGateway } from './resources/internetGateway';
import { Subnet } from './resources/subnet';
import { Ec2 } from './resources/ec2';
import { SecurityGroup } from './resources/securityGroup';
import { ElasticIp } from './resources/elasticIp';
import { Route53 } from './resources/route53';

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

    // セキュリティグループリソース生成
    const securityGroup = new SecurityGroup(subnet, vpc.vpc.ref);
    securityGroup.createResource(this);

    // Elastic IPリソース生成
    const elasticIp = new ElasticIp();
    elasticIp.createResource(this);

    // EC2リソース生成(NATインスタンス関連のルートをRTに追加含む)
    const ec2 = new Ec2(subnet.public1a, securityGroup.sgEc2, elasticIp.webEc2Ip1a, subnet.database1a, securityGroup.sgDb, elasticIp.natEc2Ip1a, securityGroup.sgNat);
    ec2.createResource(this);

    // Route53レコード追加生成
    const route53 = new Route53(elasticIp.webEc2Ip1a);
    route53.createResource(this);
  }
}
