# study-CDK

## ネットワーク構成

- public-subnet: ap-north-east-1a
- private-subnet: ap-north-east-1a
- web-ec2-instance: public-subnet (provide elastic-ip)
- db-ec2-instance: private-subnet
- nat-ec2-instance: public-subnet (provide elastic-ip)

セキュリティグループ・ルートテーブルの設定も記述してあるので、デプロイ後、すぐに使用可能です。
複数の availability-zone にデプロイしたい場合は、既存コードを複製し、修正してください。

## 注意事項

node-module の config を使用しています。
下記コマンドでインストールしてから使用してください。

> env 情報、keyName、domainName、systemName を記述してあります

```shell
npm install @types/config config
```

※config の使用方法は記載されているサイトが多くありますので、こちらでは明示しません。
