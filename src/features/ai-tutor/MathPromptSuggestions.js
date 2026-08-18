// DỮ LIỆU CÂU HỎI MẪU & KỊCH BẢN GỢI Ý CHO TRỢ GIẢNG AI CÔ HUYỀN DIỆU
// CHUYÊN BIỆT CHO MÔN TOÁN 8 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)

export const AI_MATH_PROMPTS = [
  {
    category: "Chương 2: Hằng đẳng thức",
    title: "Phân tích x² - 4x + 4",
    prompt: "Cô ơi, hướng dẫn em từng bước phân tích đa thức x^2 - 4x + 4 thành nhân tử bằng hằng đẳng thức với ạ?",
    tags: ["HĐT 2", "Phân tích nhân tử"]
  },
  {
    category: "Chương 2: Hằng đẳng thức",
    title: "Khai triển (2x + 3y)²",
    prompt: "Cô hướng dẫn em khai triển biểu thức (2x + 3y)^2 sao cho không bị nhầm hệ số với ạ?",
    tags: ["HĐT 1", "Khai triển"]
  },
  {
    category: "Chương 2: Hằng đẳng thức",
    title: "Phân tích 4x² - 25",
    prompt: "Cô hướng dẫn em áp dụng hằng đẳng thức hiệu hai bình phương để phân tích 4x^2 - 25 thành nhân tử ạ?",
    tags: ["HĐT 3", "Hiệu 2 bình phương"]
  },
  {
    category: "Dạng toán: Tìm x",
    title: "Tìm x: x² - 16 = 0",
    prompt: "Cô ơi, giúp em giải bài toán tìm x: x^2 - 16 = 0 bằng phương pháp đưa về phương trình tích ạ?",
    tags: ["Tìm x", "Phương trình tích"]
  },
  {
    category: "Chương 1: Đa thức",
    title: "Nhận biết đơn thức đồng dạng",
    prompt: "Làm sao để phân biệt nhanh hai đơn thức đồng dạng trong đa thức nhiều biến hả cô?",
    tags: ["Đơn thức", "Đồng dạng"]
  },
  {
    category: "Chương 1: Đa thức",
    title: "Chia đa thức cho đơn thức",
    prompt: "Cô hướng dẫn em quy tắc chia đa thức (6x^3y^2 - 9x^2y^3 + 3x^2y^2) cho đơn thức 3x^2y^2 ạ?",
    tags: ["Phép chia", "Quy tắc số mũ"]
  },
  {
    category: "Mẹo tính nhanh",
    title: "Tính nhanh 105² - 95²",
    prompt: "Làm thế nào để áp dụng hằng đẳng thức đáng nhớ tính nhẩm siêu tốc giá trị 105^2 - 95^2 mà không cần máy tính ạ?",
    tags: ["Tính nhanh", "Mẹo hay"]
  },
  {
    category: "Hình học 8: Tứ giác",
    title: "Dấu hiệu nhận biết hình thoi & vuông",
    prompt: "Cô tóm tắt giúp em sơ đồ chuyển hóa từ hình bình hành sang hình chữ nhật, hình thoi và hình vuông với ạ?",
    tags: ["Hình học", "Tứ giác"]
  }
];

export const MATH_SYMBOL_BUTTONS = [
  { label: "x²", insert: "x^2" },
  { label: "y²", insert: "y^2" },
  { label: "x³", insert: "x^3" },
  { label: "(A+B)²", insert: "(x + y)^2" },
  { label: "(A-B)²", insert: "(x - y)^2" },
  { label: "A²-B²", insert: "x^2 - y^2" },
  { label: "√x", insert: "\\sqrt{x}" },
  { label: "÷", insert: " : " },
  { label: "±", insert: " \\pm " },
  { label: "a/b", insert: "\\frac{a}{b}" },
  { label: "° (độ)", insert: "^\\circ" }
];
