// 요기요 웹(yogiyo.co.kr)에 배달 주소 '광주 서구 상무중앙로 44'(요기요 변환: 치평동 1251-2)를 넣었을 때
// 배달 가능 목록에 나온 가게 (2026-11-18 오후 조회). 키: data.js 의 가게 이름.
// min = 최소주문금액, fee = 최소주문금액 기준 배달팁, eta = 예상 배달시간, pickup = 포장 주문 가능, pickupMin = 포장 준비 시간(분)
// 목록에 없다고 배달이 안 된다는 뜻은 아니다(조회 시각에 영업하지 않았을 수 있음). 그래서 '가능'만 표시한다.
window.DELIVERY_META = {source: "요기요 웹 배달 가능 목록", address: "광주 서구 상무중앙로 44", checked: "2026-11-18"};
window.DELIVERY = {
  "파리바게뜨 광주상무백양점": {id: 1324924, min: 15000, fee: 3000, eta: "24~39분", pickup: false},
  "아비꼬(상무점)": {id: 412215, min: 20000, fee: 4000, eta: "24~39분", pickup: true, pickupMin: 20},
  "봉구스밥버거 상무점": {id: 1335394, min: 10000, fee: 3000, eta: "16~31분", pickup: true, pickupMin: 10},
  "프랭크버거 광주상무점": {id: 1296013, min: 14000, fee: 2900, eta: "19~34분", pickup: true, pickupMin: 20},
  "뼈대군국밥 광주상무점": {id: 1298745, min: 13000, fee: 2000, eta: "24~39분", pickup: true, pickupMin: 10},
  "명인면옥 상무점": {id: 1435946, min: 15000, fee: 3000, eta: "24~39분", pickup: true, pickupMin: 20},
  "서가앤쿡": {id: 370674, min: 18000, fee: 4000, eta: "24~39분", pickup: true, pickupMin: 10},
  "왓더버거 광주상무점": {id: 1468349, min: 14000, fee: 3000, eta: "16~31분", pickup: true},
  "이삭토스트 상무점": {id: 1287552, min: 14000, fee: 3500, eta: "15~30분", pickup: false},
  "진미가람": {id: 490855, min: 20000, fee: 3000, eta: "24~39분", pickup: true, pickupMin: 20},
  "보울레시피(bowl recipe)": {id: 1435458, min: 10900, fee: 2500, eta: "24~39분", pickup: true, pickupMin: 15},
  "한솥도시락 치평점": {id: 1173416, min: 16000, fee: 3000, eta: "24~39분", pickup: true, pickupMin: 20},
  "현완단겸 상추튀김 상무점": {id: 576113, min: 17000, fee: 2900, eta: "24~39분", pickup: true, pickupMin: 20},
  "메가MGC커피 광주치평점": {id: 1186527, min: 12000, fee: 2400, eta: "28~43분", pickup: false},
  "용쓰91김밥 상무점": {id: 1415206, min: 15000, fee: 3600, eta: "24~39분", pickup: true, pickupMin: 20},
  "도야짬뽕 상무직영점": {id: 1039397, min: 16000, fee: 3000, eta: "24~39분", pickup: true},
  "헤이키커피 상무점": {id: 1339617, min: 15000, fee: 2500, eta: "24~39분", pickup: true, pickupMin: 5},
  "크리스피크림도넛 광주상무점": {id: 1472972, min: 15000, fee: 2000, eta: "16~31분", pickup: false},
  "파리바게뜨 상무역점": {id: 283509, min: 15000, fee: 3000, eta: "24~39분", pickup: false},
  "이디야커피 광주상무롯데마트점": {id: 532133, min: 14000, fee: 2500, eta: "24~39분", pickup: true, pickupMin: 20},
  "짬뽕관 광주상무점": {id: 582692, min: 15000, fee: 2000, eta: "24~39분", pickup: true, pickupMin: 30},
  "브로 샌드위치": {id: 1236919, min: 9500, fee: 2400, eta: "24~39분", pickup: false},
  "KFC 광주상무DI": {id: 1527131, min: 14000, fee: 4000, eta: "21~36분", pickup: false},
  "죽이야기 상무점": {id: 1136422, min: 10000, fee: 4000, eta: "24~39분", pickup: true, pickupMin: 15},
  "미스터초밥 상무직영점": {id: 1027746, min: 12000, fee: 2000, eta: "39~54분", pickup: true, pickupMin: 20},
  "상지국밥": {id: 1204302, min: 12000, fee: 3000, eta: "24~39분", pickup: true, pickupMin: 30},
  "파리바게뜨 상무마륵점": {id: 1242978, min: 15000, fee: 3000, eta: "14~29분", pickup: false},
  "티파라치": {id: 1545728, min: 9000, fee: 3000, eta: "24~39분", pickup: true, pickupMin: 20},
  "보배반점 상무점": {id: 1120490, min: 13500, fee: 2000, eta: "14~29분", pickup: false},
  "할멈탕수육김밥 상무점": {id: 1555556, min: 18000, fee: 2500, eta: "24~39분", pickup: true, pickupMin: 20}
};
