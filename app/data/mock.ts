export type Locale = "ko" | "en";
export const mockSafetyData = {
  location: { ko: "도쿄도 시부야구", en: "Shibuya, Tokyo", lat: 35.6595, lng: 139.7005 },
  risk: { level: "safe", flood: "low", tsunami: "outside", quake: "monitoring" },
  shelters: [
    { id: "shibuya-school", name: { ko: "진난 초등학교", en: "Jinnan Elementary School" }, distanceM: 650, walkMin: 8, capacity: "여유", types: ["지진", "홍수"] },
    { id: "yoyogi-park", name: { ko: "요요기 공원", en: "Yoyogi Park" }, distanceM: 1100, walkMin: 14, capacity: "확인 중", types: ["지진", "화재"] },
  ],
  alert: { source: "JMA mock", type: "heavy-rain", issuedAt: "14분 전", severity: "advisory" },
  group: [
    { id: 1, name: "민지", status: "safe", place: "시부야" },
    { id: 2, name: "Alex", status: "waiting", place: "신주쿠" },
    { id: 3, name: "준호", status: "safe", place: "하라주쿠" },
  ],
  esim: { availableGb: 1, validHours: 24, active: false },
} as const;
