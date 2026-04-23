import { TeamMember, Product, Task } from "./types";

export const teamMembers: TeamMember[] = [
  { id: "1", name: "김미정", role: "MI팀장" },
  { id: "2", name: "이수진", role: "선임MI" },
  { id: "3", name: "박준혁", role: "선임MI" },
  { id: "4", name: "최지현", role: "MI담당" },
  { id: "5", name: "정다은", role: "MI담당" },
  { id: "6", name: "한승민", role: "MI담당" },
  { id: "7", name: "윤서영", role: "MI담당" },
  { id: "8", name: "강민우", role: "MI담당" },
  { id: "9", name: "임채원", role: "MI담당" },
  { id: "10", name: "신예진", role: "MI담당" },
];

export const products: Product[] = [
  // 순환기계
  { id: "p01", name: "딜라트렌", category: "순환기계", code: "CKD-C001" },
  { id: "p02", name: "오로디핀", category: "순환기계", code: "CKD-C002" },
  { id: "p03", name: "칸데모어", category: "순환기계", code: "CKD-C003" },
  { id: "p04", name: "자니딥", category: "순환기계", code: "CKD-C004" },
  { id: "p05", name: "코자르", category: "순환기계", code: "CKD-C005" },
  { id: "p06", name: "아모잘탄", category: "순환기계", code: "CKD-C006" },
  // 당뇨/대사
  { id: "p10", name: "글루패스트", category: "당뇨/대사", code: "CKD-D001" },
  { id: "p11", name: "듀비에", category: "당뇨/대사", code: "CKD-D002" },
  { id: "p12", name: "트라젠타", category: "당뇨/대사", code: "CKD-D003" },
  { id: "p13", name: "자디앙", category: "당뇨/대사", code: "CKD-D004" },
  // 항생제
  { id: "p20", name: "씨프로", category: "항생제", code: "CKD-A001" },
  { id: "p21", name: "레보스펙트라", category: "항생제", code: "CKD-A002" },
  { id: "p22", name: "세파메진", category: "항생제", code: "CKD-A003" },
  { id: "p23", name: "타조신", category: "항생제", code: "CKD-A004" },
  // 호흡기
  { id: "p30", name: "뮤코솔반", category: "호흡기", code: "CKD-R001" },
  { id: "p31", name: "레보투스", category: "호흡기", code: "CKD-R002" },
  { id: "p32", name: "씨날방코", category: "호흡기", code: "CKD-R003" },
  // 신경계
  { id: "p40", name: "딜렉신", category: "신경계", code: "CKD-N001" },
  { id: "p41", name: "프리가바린", category: "신경계", code: "CKD-N002" },
  { id: "p42", name: "리보트릴", category: "신경계", code: "CKD-N003" },
  // 소화기
  { id: "p50", name: "에소메졸", category: "소화기", code: "CKD-G001" },
  { id: "p51", name: "알마겔", category: "소화기", code: "CKD-G002" },
  { id: "p52", name: "모티리톤", category: "소화기", code: "CKD-G003" },
  // 항암/면역
  { id: "p60", name: "젬탁셀", category: "항암/면역", code: "CKD-O001" },
  { id: "p61", name: "옥살리", category: "항암/면역", code: "CKD-O002" },
  // 비뇨기계
  { id: "p70", name: "하루날", category: "비뇨기계", code: "CKD-U001" },
  { id: "p71", name: "베시케어", category: "비뇨기계", code: "CKD-U002" },
  // 근골격계
  { id: "p80", name: "세레브렉스", category: "근골격계", code: "CKD-M001" },
  { id: "p81", name: "아세클로펜", category: "근골격계", code: "CKD-M002" },
  // 기타
  { id: "p90", name: "뉴티엠", category: "기타", code: "CKD-E001" },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

export const sampleTasks: Task[] = [
  {
    id: "t01", title: "딜라트렌 심부전 적응증 문헌 검토",
    description: "심부전 환자 대상 딜라트렌 효능·안전성 최신 문헌 검토 요청",
    category: "검토", status: "진행중", priority: "긴급",
    assigneeId: "2", requesterName: "영업1팀 이상호 부장",
    requestChannel: "이메일", productId: "p01",
    dueDate: fmt(addDays(today, 3)), createdAt: fmt(addDays(today, -2)), completedAt: null,
  },
  {
    id: "t02", title: "에소메졸 복약지도 교육 자료 제작",
    description: "약사 대상 복약지도 슬라이드 제작 요청 (20매 이내)",
    category: "자료생성", status: "접수", priority: "일반",
    assigneeId: "3", requesterName: "마케팅팀 박지수 과장",
    requestChannel: "메신저", productId: "p50",
    dueDate: fmt(addDays(today, 7)), createdAt: fmt(addDays(today, -1)), completedAt: null,
  },
  {
    id: "t03", title: "트라젠타 당뇨병 가이드라인 리뷰",
    description: "2024 ADA 가이드라인 내 DPP-4 억제제 권고 내용 리뷰",
    category: "리뷰", status: "검토중", priority: "일반",
    assigneeId: "4", requesterName: "메디컬팀 김현수 부장",
    requestChannel: "이메일", productId: "p12",
    dueDate: fmt(addDays(today, 1)), createdAt: fmt(addDays(today, -5)), completedAt: null,
  },
  {
    id: "t04", title: "세파메진 신장 용량 조절 교육",
    description: "신기능 감소 환자 세파메진 용량 조절 기준 교육 자료",
    category: "교육", status: "완료", priority: "일반",
    assigneeId: "5", requesterName: "임상팀 장민호 차장",
    requestChannel: "이메일", productId: "p22",
    dueDate: fmt(addDays(today, -3)), createdAt: fmt(addDays(today, -10)), completedAt: fmt(addDays(today, -4)),
  },
  {
    id: "t05", title: "딜렉신 신경병증성 통증 Q&A",
    description: "영업사원 대상 신경병증성 통증 FAQ 20문항 제작",
    category: "자료생성", status: "진행중", priority: "긴급",
    assigneeId: "6", requesterName: "영업2팀 이민지 차장",
    requestChannel: "메신저", productId: "p40",
    dueDate: fmt(addDays(today, 2)), createdAt: fmt(addDays(today, -3)), completedAt: null,
  },
  {
    id: "t06", title: "자니딥 vs 암로디핀 비교 자료",
    description: "칼슘 채널 차단제 계열 비교 학술 자료 제작",
    category: "자료생성", status: "접수", priority: "일반",
    assigneeId: "7", requesterName: "마케팅팀 최유진 과장",
    requestChannel: "이메일", productId: "p04",
    dueDate: fmt(addDays(today, 14)), createdAt: fmt(today), completedAt: null,
  },
  {
    id: "t07", title: "타조신 내성균 대응 문헌 검토",
    description: "ESBL 생성균 대상 타조신 효능 문헌 검토 요청",
    category: "검토", status: "완료", priority: "긴급",
    assigneeId: "2", requesterName: "감염내과 박진아 교수",
    requestChannel: "이메일", productId: "p23",
    dueDate: fmt(addDays(today, -1)), createdAt: fmt(addDays(today, -7)), completedAt: fmt(addDays(today, -2)),
  },
  {
    id: "t08", title: "뮤코솔반 소아 용량 안전성 검토",
    description: "소아 연령대별 암브록솔 용량 및 안전성 데이터 검토",
    category: "검토", status: "진행중", priority: "일반",
    assigneeId: "8", requesterName: "소아과 김철수 교수",
    requestChannel: "기타", productId: "p30",
    dueDate: fmt(addDays(today, 5)), createdAt: fmt(addDays(today, -2)), completedAt: null,
  },
];
