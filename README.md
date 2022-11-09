# 공통 환경

- 런타임: Node.js 16.x
- 아키텍처: x86_64
- 메모리: 128MB
- 임시 스토리지: 512MB
- 제한 시간: 3초
- 리소스 권한
  - Allow: logs:CreateLogGroup
  - Allow: logs:CreateLogStream
  - Allow: logs:PutLogEvents 

# Lambda 함수 목록

## 1. handleCognitoPostConfirmation
Cognito Lambda 사후 확인 트리거를 처리하는 함수

- 기능
  - Cognito User Pool에 등록된 사용자를 RDS에 저장
  - Cognito User Pool에 등록된 사용자를 특정 SNS Topic에 구독
- 트리거
  - Cognito User Pool - Post confirmation Lambda trigger
- 리소스 권한
  - VPC 할당 권한(AWSLambdaVPCAccessExecutionRole)
  - 특정 SNS Topic에 대한 Sns:Publish 허용
- VPC
  - RDS 인스턴스와 동일한 VPC에 위치
  - RDS 인스턴스의 인바운드 규칙 - Lambda 함수의 아웃바운드 규칙 허용

## 2. handlePreSignUp
Cognito Lambda 사전 가입 트리거를 처리하는 함수

- 기능
  - 특정 날짜 이후에 가입이 불가능하도록 구현
- 트리거
  - Cognito User Pool - Pre authentication Lambda trigger

## 3. sendAlarmFromSNSToSlack
ECS 클러스터의 CPU 사용량 경보를 Slack으로 전송하는 함수

- 기능
  - ECS Cluster의 CPU 사용량이 60%를 넘어갈 때 발생하는 경보를 Slack으로 전송
- 트리거
  - CloudWatch CPU 사용량 경보

## 4. sendCloudWatchAlarm
앱 빌드 실패 알람을 Slack으로 전송하는 함수

- 기능
  - CodeBuild에서 빌드가 실패하면 빌드 실패 메시지를 Slack으로 전송
- 트리거
  - CodeBuild -> CloudWatch Log Group Filter Pattern: `?ERROR`