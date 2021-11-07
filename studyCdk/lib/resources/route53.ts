import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import { CfnEIP } from '@aws-cdk/aws-ec2';
import { Resource } from './abstract/resource';
import * as config from 'config';

interface ResourceInfo {
  readonly id: string;
  readonly target: route53.RecordTarget;
  readonly zone: route53.IHostedZone
  readonly recordName: string;
  readonly comment: string;
  readonly assign: (record: route53.ARecord) => void;
}

export class Route53 extends Resource {

  public mainRecord: route53.ARecord;

  private readonly webEc2Ip: CfnEIP;

  constructor(webEc2Ip: CfnEIP) {
    super();
    this.webEc2Ip = webEc2Ip;
  }

  public createResource(scope: cdk.Construct) {

    // ホストゾーン情報取得
    const hostedZone = route53.HostedZone.fromLookup(scope, 'getHostedZoneInfo', { domainName: config.get('domainName') })

    // リソース情報
    const resourcesInfo: ResourceInfo[] = [
      {
        id: `route53AddRecodeMain`,
        target: { values: [this.webEc2Ip.ref] },
        zone: hostedZone,
        recordName: `${config.get('domainName')}`,
        comment: 'トップページ',
        assign: record => this.mainRecord = record
      },
    ]

    for (const resourceInfo of resourcesInfo) {
      const record = this.createRecord(scope, resourceInfo);
      resourceInfo.assign(record);
    }
  }

  private createRecord(scope: cdk.Construct, resourceInfo: ResourceInfo): route53.ARecord {
    const record = new route53.ARecord(scope, resourceInfo.id, {
      target: resourceInfo.target,
      zone: resourceInfo.zone,
      recordName: resourceInfo.recordName,
      comment: resourceInfo.comment
    });
    return record;
  }
}
