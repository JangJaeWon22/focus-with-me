## GitHub Actions

### 1. 작동 원리

Workflow ⇒ Job ⇒ Step ⇒ Action

점점 작은 단위로 이동함.

---

### 2. git action 코드 작성.

작업하고 있는 **Repositories**에 들어가서 action 탭으로 Workflows를 생성.

절대 폴더 이름을 바꾸면 안된다.

폴더 구조 : .github/workflows/node.js.yml

```jsx
name: SERVER distribute

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-18.04

    steps:
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STUDY_IP }}
          username: ${{ secrets.STUDY_SSH_ID }}
          key: ${{ secrets.STUDY_SSH_KEY }}
          port: ${{ secrets.STUDY_SSH_PORT }}
          script: |
            sudo -s
            cd /home/ubuntu/focus-with-me
            sudo git pull
            cd /home/ubuntu/focus-with-me/src
            npm i
            sudo pm2 reload all
```

`appleboy/ssh-action@master`는 ssh로 접속을 하고 스크립트를 실행하게 한다.

setting 값으로 github에서 STUDY_IP, STUDY_SSH_ID, STUDY_SSH_KEY, STUDY_SSH_PORT 가 있다.

---

### 3. Secrets 설정

**Repositories**의 Settings로 이동하여 Secrets탭을 선택 후 New repository secret 탭을 누르면 생성 가능함.

- STUDY_IP : ubuntu 주소
- STUDY_SSH_ID : ubuntu
- STUDY_SSH_PORT: 22
- STUDY_SSH_KEY : SSH KEY

  > - STUDY_IP 는 ec2 서버의 주소.
  > - STUDY_SSH_ID : ubuntu 다. FileZilla에서 연결할 때 계정 ID는 ubuntu로 연결 하던걸 생각하자.
  > - STUDY_SSH_PORT : 22 포트가 기본이다. 또 한번 FileZilla를 생각해 보자 포트가 22로 맞췄을 꺼다.
  > - STUDY_SSH_KEY:
  >   가장 중요하다. 5일 동안 삽질을.. 하고 알아 냈다.
  >   해당 키는 id_rsa 키로 사용한다(RSA PRIVATE KEY)
  >   - ubuntu 서버에서 public 키를 발급 한다.
  >     위 public key를 authorized_key에 추가 해야 git actions 에서 접속 가능
  >   - 그리고 기존 연결은 ubuntu keypair.pem으로 하던걸 기억하자.

```jsx
// ec2 서버에서 실행
// email은 github email을 사용했다.
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

// 생성 확인
cd ~/.ssh
ls
// 결과: authorized_keys  id_rsa  id_rsa.pub
// authorized_keys => .pem 키페어가 저장되어있다.
// 여기에서 중요!!!! id_rsa.pub가 public 키인데 직접 확인 해보자

cat id_rsa.pub

// 권한 설정
chmod 700 .ssh
chmod 600 authorized_keys

// 이제 public 키를 키페어에 추가 해주면 끝.
cat id_rsa.pub >> ~/.ssh/authorized_keys

// Secrets에 등록하기 위해 cat으로 조회하고 복 붙.
cat authorized_keys
```

- .git add commit push
  해보면 action이 자동적으로 서버 배포 후 pm2 reload 를 함.

---

### 4. 느낀점

- appleboy/ssh-action
  - 선택 이유
    star가 2021-11-22 기준 1.7k로 엄청나게 많은 사람들이 사용 하고 있기에 믿고 사용함.
- .env 파일
  - 실제로 env 파일도 만드는 과정까지 해보려고 했으나, 현재 방법으로는 한줄 한줄 씩 sreats를 생성하여 연동을 하는 방법 밖에 생각하지 못했음. 일단 현재 진행 중인 프로젝트의 기한이 끝나고 추가적으로 공부해서 수정해볼려고 함.
- PR
  - PR을 날리면 컴펌을 하고 merged가 되면 action이 시작하는데, git branch 설정에서 바꿔서 더 꼼꼼한 PR check를 사용 할려고 했으나, 현재 상황에서 프로젝트 규모가 작다 보니, 불필요할 것으로 예상 되어 생략. 공부 목적으로 .env와 마찬가지로 추가적인 공부 후 수정 예정.
