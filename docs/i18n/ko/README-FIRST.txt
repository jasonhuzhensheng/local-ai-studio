한국어 | ../README.md
이 문서는 공개 프로젝트 텍스트의 기계 번역이며 원어민이 모두 검토하지는 않았습니다. 기술적 모호성에 대해서는 영어 또는 중국어 소스를 참조하세요. 개인 사용자 데이터는 포함되지 않습니다.

Local AI Studio: 새로운 Apple Silicon Mac용 마이그레이션 소스 패키지

검토된 이 릴리스에는 frontend/backend 소스, 테스트, 모델 다운로드 매니페스트, 고정된 종속성, 기본 엔진 소스 및 실험적인 Apple 비디오 패치가 포함되어 있습니다. 현지 개발이나 생산보다 뒤처질 수 있습니다.
가중치, 가상 환경, 이전 작업, 참조 이미지, 채팅 기록, 계정 구성 및 비밀은 제외됩니다. 원클릭 app가 아닙니다.

이 전체 폴더를 INSTALL-PROMPT.en.txt와 함께 대상 Mac의 코딩 보조자에게 제공하십시오.
원래 검증 시스템은 96GB 메모리를 갖춘 M2 Max였습니다. 대상 모델, 메모리, OS를 먼저 확인하세요. 메모리가 부족한 Mac에서 비디오 설정을 맹목적으로 재사용하지 마십시오.

내용:
 src/ 프런트엔드, 백엔드, download/validation 도구, 모델 매니페스트
 tests/ 테스트; 일부는 models/services. 설치가 필요합니다. 모두 무차별적으로 실행하지 마십시오.
 requirements/viggle-pinned.txt 고정된 이미지 환경
 src/h3_requirements.lock 별도의 고정 비디오 환경
 vendor/ 컴파일된 바이너리가 없는 네이티브 소스; 업스트림 라이선스 유지
 patches/ ComfyUI/ClipProj는 Python 변경 사항을 커밋하고 배포했습니다.
 SHA256SUMS.txt 파일별 체크섬

모델 진입점: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json 및 h3_apple_models.json (비디오), src/. 아래 다운로드하기 전에 각 매니페스트와 해당 설치 프로그램을 확인하세요.
텍스트 모델: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, 파일 Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. 이 패키지에는 해당 모델에 대해 완전히 고정된 revision/hash가 포함되어 있지 않습니다. 먼저 신뢰할 수 있는 업스트림 메타데이터를 획득하고 기록하세요. 원본 머신과 바이트 단위로 동등하다고 주장하지 마십시오.

새로운 머신 설치는 검증되지 않았습니다. 대상 사용자의 원래 기계 경로, 모델 별칭 및 시스템 도구 경로를 검토합니다. 이미 수정된 공급업체 소스에 기록 패치를 다시 적용하지 마세요. 성공적인 다운로드는 성공적인 추론이나 허용 가능한 품질의 증거가 아닙니다.

오른쪽 상단의 언어 메뉴를 사용하여 33 언어 중에서 선택하세요. 브라우저는 귀하의 선택을 기억합니다. 언어 팩은 로컬로 제공됩니다. 언어 전환은 콘텐츠를 온라인 번역 서비스로 보내지 않습니다. 사용자 메시지, 대화 및 저장된 콘텐츠는 원래 언어를 유지합니다.
