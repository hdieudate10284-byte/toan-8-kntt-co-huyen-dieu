/**
 * DỊCH VỤ TRỢ GIẢNG AI TOÁN 8 - CÔ NGUYỄN THỊ HUYỀN DIỆU (THCS NGUYỄN HUỆ)
 * Bộ xử lý suy luận toán học thông minh: Hỗ trợ giải động đa thức, 7 hằng đẳng thức,
 * phương pháp gợi mở Socratic, tạo bài tập tương tự và tích hợp Gemini API (nếu có API Key).
 */

/**
 * Gọi Google Gemini API nếu có cấu hình VITE_GEMINI_API_KEY trong .env
 */
async function callGeminiApi(questionText, mode = 'detailed') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your-gemini-api-key')) return null;

  const modeInstruction = {
    socratic: 'Hãy đóng vai Cô Huyền Diệu hướng dẫn theo phương pháp gợi mở (Socratic): Không đưa ngay đáp án cuối cùng mà đặt câu hỏi dẫn dắt, gợi ý công thức và hướng tư duy từng bước cho học sinh.',
    detailed: 'Hãy đóng vai Cô Huyền Diệu trình bày lời giải chi tiết, rõ ràng từng bước theo thang điểm chuẩn của trường THCS Nguyễn Huệ, giải thích cặn kẽ và nêu rõ các lỗi bẫy học sinh hay mắc.',
    practice: 'Hãy đóng vai Cô Huyền Diệu giải nhanh bài toán gốc, sau đó tạo ra 2 bài toán tương tự cùng dạng (có đáp án ẩn/gợi ý) để học sinh tự luyện tập củng cố kiến thức.'
  }[mode] || 'Trình bày lời giải sư phạm từng bước rõ ràng.';

  const systemPrompt = `Bạn là Cô Nguyễn Thị Huyền Diệu, giáo viên dạy môn Toán lớp 8 tại trường THCS Nguyễn Huệ, chuyên sâu bộ sách "Kết Nối Tri Thức Với Cuộc Sống".
Phong cách sư phạm: Ân cần, nhiệt huyết, động viên học sinh, xưng "cô" và gọi học sinh là "em".
Quy tắc định dạng công thức Toán học: BẮT BUỘC dùng cú pháp LaTeX $công thức$ cho công thức nội dòng và $$công thức$$ cho công thức khối đặt ở giữa dòng.
Yêu cầu theo chế độ: ${modeInstruction}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nCâu hỏi của học sinh: "${questionText}"` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1200
        }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (replyText) {
      return {
        reply: replyText,
        topic: "Trợ giảng AI Live (Gemini)"
      };
    }
  } catch (err) {
    console.warn('Gemini API call failed, switching to Built-in Math Engine:', err);
  }
  return null;
}

/**
 * Bộ suy luận Toán 8 Cục bộ Thông minh (Built-in Grade 8 Math Expert Engine)
 */
export async function askAiTutor(questionText, options = {}) {
  const { mode = 'detailed' } = options;

  // 1. Thử gọi Gemini AI nếu có cấu hình API Key
  const geminiResult = await callGeminiApi(questionText, mode);
  if (geminiResult) return geminiResult;

  // 2. Giả lập độ trễ tự nhiên (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const q = questionText.toLowerCase().trim();
  const rawQ = questionText.trim();

  // --- A. DẠNG TOÁN: KHAI TRIỂN HẰNG ĐẲNG THỨC BÌNH PHƯƠNG (a ± b)^2 ---
  const squareMatch = rawQ.match(/\(\s*([0-9]*)\s*([a-zA-Z])\s*([\+\-])\s*([0-9]*)\s*([a-zA-Z]?)\s*\)\s*\^\s*2/);
  if (squareMatch) {
    const coefA = squareMatch[1] ? parseInt(squareMatch[1], 10) : 1;
    const varA = squareMatch[2] || 'x';
    const sign = squareMatch[3];
    const coefB = squareMatch[4] ? parseInt(squareMatch[4], 10) : 1;
    const varB = squareMatch[5] || '';

    const A_term = `${coefA === 1 ? '' : coefA}${varA}`;
    const B_term = varB ? `${coefB === 1 ? '' : coefB}${varB}` : `${coefB}`;

    const A_sq_coef = coefA * coefA;
    const A_sq = `${A_sq_coef === 1 ? '' : A_sq_coef}${varA}^2`;

    const mid_coef = 2 * coefA * coefB;
    const mid_var = varB ? `${varA}${varB}` : `${varA}`;
    const mid_term = `${mid_coef}${mid_var}`;

    const B_sq_coef = coefB * coefB;
    const B_sq = varB ? `${B_sq_coef === 1 ? '' : B_sq_coef}${varB}^2` : `${B_sq_coef}`;

    const finalResult = `${A_sq} ${sign} ${mid_term} + ${B_sq}`;

    if (mode === 'socratic') {
      return {
        reply: `Chào em! Cô Huyền Diệu hướng dẫn em cách tư duy khai triển biểu thức $(${A_term} ${sign} ${B_term})^2$ nhé:

### 💡 Câu hỏi gợi mở:
1. Biểu thức này có dạng Hằng đẳng thức số mấy?
   - Đó là **${sign === '+' ? 'Bình phương của một tổng: $(A + B)^2$' : 'Bình phương của một hiệu: $(A - B)^2$'}**.
2. Em hãy xác định:
   - Biểu thức thứ nhất $A = ${A_term}$ $\\Rightarrow A^2 = (${A_term})^2 = ?$
   - Biểu thức thứ hai $B = ${B_term}$ $\\Rightarrow B^2 = (${B_term})^2 = ?$
   - Hai lần tích $2AB = 2 \\cdot (${A_term}) \\cdot (${B_term}) = ?$

👉 **Mẹo cô dặn:** Chú ý lũy thừa cả hệ số nhé, ví dụ $(${A_term})^2$ là $${A_sq}$, không được bỏ quên hệ số bình phương!
Em hãy tự ghép lại theo công thức $A^2 ${sign} 2AB + B^2$ xem có ra $${finalResult}$ không nhé!`,
        topic: `Chương 2: Khai triển HĐT ${sign === '+' ? '1' : '2'}`
      };
    }

    return {
      reply: `Chào em! Cô hướng dẫn em khai triển chi tiết biểu thức $(${A_term} ${sign} ${B_term})^2$ như sau:

### 📝 Các bước giải chi tiết:
Áp dụng **Hằng đẳng thức ${sign === '+' ? 'số 1: $(A + B)^2 = A^2 + 2AB + B^2$' : 'số 2: $(A - B)^2 = A^2 - 2AB + B^2$'}**:
- Đặt $A = ${A_term}$
- Đặt $B = ${B_term}$

Ta có:
$$(${A_term} ${sign} ${B_term})^2 = (${A_term})^2 ${sign} 2 \\cdot (${A_term}) \\cdot (${B_term}) + (${B_term})^2$$
$$= ${A_sq} ${sign} ${mid_term} + ${B_sq}$$

### ✅ Kết quả cuối cùng:
$$(${A_term} ${sign} ${B_term})^2 = ${finalResult}$$

⚠️ **Lưu ý chống sai sót:** Rất nhiều bạn hay viết nhầm $(${coefA}${varA})^2 = ${coefA}${varA}^2$ (sai). Phải là $${A_sq}$ mới chuẩn xác em nhé!`,
      topic: `Chương 2: Hằng đẳng thức ${sign === '+' ? 'số 1' : 'số 2'}`
    };
  }

  // --- B. DẠNG TOÁN: PHÂN TÍCH ĐA THỨC THÀNH NHÂN TỬ BẰNG HẰNG ĐẲNG THỨC HIỆU HAI BÌNH PHƯƠNG (A^2 - B^2) ---
  const diffSqMatch = rawQ.match(/([0-9]*)\s*([a-zA-Z])\s*\^\s*2\s*-\s*([0-9]+)/);
  if (diffSqMatch) {
    const coefA_sq = diffSqMatch[1] ? parseInt(diffSqMatch[1], 10) : 1;
    const varA = diffSqMatch[2] || 'x';
    const numB_sq = parseInt(diffSqMatch[3], 10);

    const rootA = Math.sqrt(coefA_sq);
    const rootB = Math.sqrt(numB_sq);

    if (Number.isInteger(rootA) && Number.isInteger(rootB)) {
      const A_term = `${rootA === 1 ? '' : rootA}${varA}`;
      const B_term = `${rootB}`;

      return {
        reply: `Chào em! Dạng bài phân tích $${coefA_sq === 1 ? '' : coefA_sq}${varA}^2 - ${numB_sq}$ sử dụng **Hằng đẳng thức số 3: Hiệu hai bình phương**:

### 💡 Công thức tổng quát:
$$A^2 - B^2 = (A - B)(A + B)$$

### 📝 Các bước thực hiện:
1. Đưa các hạng tử về dạng bình phương hoàn chỉnh:
   - $${coefA_sq === 1 ? '' : coefA_sq}${varA}^2 = (${A_term})^2$
   - $${numB_sq} = ${B_term}^2$
2. Áp dụng công thức hằng đẳng thức:
   $$${coefA_sq === 1 ? '' : coefA_sq}${varA}^2 - ${numB_sq} = (${A_term})^2 - ${B_term}^2 = (${A_term} - ${B_term})(${A_term} + ${B_term})$$

### ✅ Đáp số:
$$(${A_term} - ${B_term})(${A_term} + ${B_term})$$

🎯 **Thử thách luyện tập:** Hãy thử phân tích đa thức $4${varA}^2 - 49$ xem đáp án là gì nhé!`,
        topic: "Chương 2: Hiệu hai bình phương"
      };
    }
  }

  // --- C. DẠNG TOÁN: PHÂN TÍCH TAM THỨC BẬC HAI DẠNG BÌNH PHƯƠNG x^2 ± 2ax + a^2 ---
  const perfectSqMatch = rawQ.match(/([a-zA-Z])\s*\^\s*2\s*([\+\-])\s*([0-9]+)\s*([a-zA-Z])\s*\+\s*([0-9]+)/);
  if (perfectSqMatch) {
    const varName = perfectSqMatch[1];
    const sign = perfectSqMatch[2];
    const middleCoef = parseInt(perfectSqMatch[3], 10);
    const constTerm = parseInt(perfectSqMatch[5], 10);

    const bVal = Math.sqrt(constTerm);
    if (Number.isInteger(bVal) && 2 * bVal === middleCoef) {
      return {
        reply: `Chào em! Cô hướng dẫn em phân tích đa thức $${varName}^2 ${sign} ${middleCoef}${varName} + ${constTerm}$ thành nhân tử:

### 💡 Bước 1: Nhận diện dạng Hằng đẳng thức
Quan sát đa thức có 3 hạng tử:
- Hạng tử thứ nhất: $${varName}^2 = (${varName})^2$
- Hạng tử tự do: $${constTerm} = ${bVal}^2$
- Hạng tử ở giữa: $${sign}${middleCoef}${varName} = ${sign}2 \\cdot ${varName} \\cdot ${bVal}$

### 📝 Bước 2: Áp dụng Hằng đẳng thức ${sign === '+' ? 'số 1' : 'số 2'}
$$(A ${sign} B)^2 = A^2 ${sign} 2AB + B^2$$

Với $A = ${varName}$ và $B = ${bVal}$, ta có:
$$${varName}^2 ${sign} ${middleCoef}${varName} + ${constTerm} = ${varName}^2 ${sign} 2 \\cdot ${varName} \\cdot ${bVal} + ${bVal}^2 = (${varName} ${sign} ${bVal})^2$$

### ✅ Kết luận:
Đa thức được phân tích thành: $$(${varName} ${sign} ${bVal})^2$$`,
        topic: `Chương 2: Bình phương một ${sign === '+' ? 'tổng' : 'hiệu'}`
      };
    }
  }

  // --- D. DẠNG TOÁN: TÌM X (PHƯƠNG TRÌNH TÍCH) ---
  if (q.includes('tìm x') || q.includes('tim x')) {
    if (q.includes('x^2 - 16 = 0') || q.includes('x^2-16=0') || q.includes('x^2 - 25 = 0') || q.includes('x^2-25=0')) {
      const num = q.includes('16') ? 16 : 25;
      const root = Math.sqrt(num);
      return {
        reply: `Chào em! Bài toán tìm $x$ từ phương trình $x^2 - ${num} = 0$ được giải bằng 2 cách:

### 🌟 Cách 1: Sử dụng Hằng đẳng thức (Khuyên dùng)
Biến đổi phương trình về dạng phương trình tích:
$$x^2 - ${root}^2 = 0$$
$$(x - ${root})(x + ${root}) = 0$$

Suy ra:
- **Trường hợp 1:** $x - ${root} = 0 \\Rightarrow x = ${root}$
- **Trường hợp 2:** $x + ${root} = 0 \\Rightarrow x = -${root}$

### ✅ Kết luận:
Tập nghiệm của phương trình là $x \\in \\{ -${root}; ${root} \\}$ (hoặc viết gọn $x = \\pm ${root}$).

⚠️ **Lưu ý bẫy học sinh:** Rất nhiều bạn chỉ lấy $x = ${root}$ mà quên mất giá trị âm $x = -${root}$ đấy nhé!`,
        topic: "Dạng toán: Tìm x bằng HĐT"
      };
    }

    if (q.includes('x(x - 3)') || q.includes('x(x-3)')) {
      return {
        reply: `Chào em! Đối với phương trình tích dạng $x(x - 3) = 0$:

### 💡 Quy tắc:
Một tích $A \\cdot B = 0$ khi và chỉ khi $A = 0$ hoặc $B = 0$.

### 📝 Lời giải:
$$x(x - 3) = 0$$
$$\\Rightarrow \\begin{cases} x = 0 \\\\ x - 3 = 0 \\end{cases} \\Rightarrow \\begin{cases} x = 0 \\\\ x = 3 \\end{cases}$$

### ✅ Kết luận:
Vậy $x = 0$ hoặc $x = 3$.`,
        topic: "Dạng toán: Tìm x (Phương trình tích)"
      };
    }
  }

  // --- E. DẠNG TOÁN: PHÉP CHIA ĐA THỨC CHO ĐƠN THỨC (CHƯƠNG 1) ---
  if (q.includes('chia') || q.includes('phép chia') || q.includes('chia hết')) {
    return {
      reply: `Chào em! Cô Huyền Diệu hướng dẫn em quy tắc **Chia đa thức cho đơn thức** trong Chương 1:

### 📌 Quy tắc vàng:
Muốn chia đa thức $A$ cho đơn thức $B$ (trường hợp các hạng tử của $A$ đều chia hết cho $B$):
1. Chia từng hạng tử của đa thức $A$ cho đơn thức $B$.
2. Cộng các kết quả tìm được với nhau.

### 🔍 Ví dụ mẫu:
Thực hiện phép tính: $(6x^3y^2 - 9x^2y^3 + 3x^2y^2) : 3x^2y^2$

$$\\text{Biểu thức} = (6x^3y^2 : 3x^2y^2) - (9x^2y^3 : 3x^2y^2) + (3x^2y^2 : 3x^2y^2)$$
$$= 2x - 3y + 1$$

⚠️ **Cảnh báo lỗi:** Rất nhiều bạn chia $3x^2y^2 : 3x^2y^2$ bị triệt tiêu thành $0$ (sai). Hai biểu thức giống nhau chia nhau phải bằng $1$ nhé!`,
      topic: "Chương 1: Phép chia đa thức"
    };
  }

  // --- F. DẠNG TOÁN: MẸO TÍNH NHANH BẰNG HẰNG ĐẲNG THỨC ---
  if (q.includes('tính nhanh') || q.includes('101^2') || q.includes('99^2') || q.includes('102^2') || q.includes('105^2 - 95^2')) {
    if (q.includes('105') && q.includes('95')) {
      return {
        reply: `Chào em! Tính nhanh $105^2 - 95^2$ bằng hằng đẳng thức hiệu hai bình phương $A^2 - B^2 = (A - B)(A + B)$:

### 📝 Các bước tính nhẩm:
$$105^2 - 95^2 = (105 - 95)(105 + 95)$$
$$= 10 \\cdot 200 = 2000$$

Chỉ mất đúng 2 giây nhẩm là ra kết quả $2000$ tròn trịa mà không cần bấm máy tính! 🎉`,
        topic: "Mẹo hay: Tính nhanh HĐT"
      };
    }

    return {
      reply: `Chào em! Tuyệt chiêu tính nhẩm bằng Hằng đẳng thức số 1 và số 2 siêu tốc:

### 1. Tính nhanh $101^2$:
Tách $101 = 100 + 1$, áp dụng $(A+B)^2 = A^2 + 2AB + B^2$:
$$101^2 = (100 + 1)^2 = 100^2 + 2 \\cdot 100 \\cdot 1 + 1^2 = 10000 + 200 + 1 = 10201$$

### 2. Tính nhanh $99^2$:
Tách $99 = 100 - 1$, áp dụng $(A-B)^2 = A^2 - 2AB + B^2$:
$$99^2 = (100 - 1)^2 = 100^2 - 2 \\cdot 100 \\cdot 1 + 1^2 = 10000 - 200 + 1 = 9801$$

### 3. Tính nhanh $52 \\cdot 48$:
Tách $(50 + 2)(50 - 2) = 50^2 - 2^2 = 2500 - 4 = 2496$.`,
      topic: "Mẹo hay: Tính nhanh Toán 8"
    };
  }

  // --- G. DẠNG TOÁN: HÌNH HỌC 8 (CHƯƠNG 3 - TỨ GIÁC) ---
  if (q.includes('tứ giác') || q.includes('hình bình hành') || q.includes('hình thoi') || q.includes('hình chữ nhật') || q.includes('hình vuông') || q.includes('hình thang')) {
    return {
      reply: `Chào em! Cô Huyền Diệu tóm tắt sơ đồ tư duy **Hình học 8 - Các loại Tứ giác đặc biệt**:

### 📌 1. Định lý tổng các góc trong một tứ giác:
$$\\widehat{A} + \\widehat{B} + \\widehat{C} + \\widehat{D} = 360^\\circ$$

### 📌 2. Sơ đồ chuyển hóa nhận biết các hình:
- **Hình thang** $\\xrightarrow{\\text{2 cạnh bên song song / 2 cạnh đáy bằng nhau}}$ **Hình bình hành**.
- **Hình bình hành** $\\xrightarrow{\\text{1 góc vuông / 2 đường chéo bằng nhau}}$ **Hình chữ nhật**.
- **Hình bình hành** $\\xrightarrow{\\text{2 cạnh kề bằng nhau / 2 đường chéo vuông góc}}$ **Hình thoi**.
- **Hình chữ nhật + Hình thoi** $\\longrightarrow$ **Hình vuông** (Mang đầy đủ tất cả các tính chất đẹp nhất của hình chữ nhật và hình thoi).

Em cần cô chứng minh dấu hiệu nhận biết nào cụ thể không? Hãy nhắn cho cô nhé!`,
      topic: "Hình học 8: Tứ giác đặc biệt"
    };
  }

  // --- H. CÂU HỎI MẶC ĐỊNH SƯ PHẠM ---
  return {
    reply: `Chào em! Cô Huyền Diệu đã nhận được câu hỏi: *"${questionText}"*.

Để giải bài toán này một cách chính xác và đạt điểm tối đa, cô gợi ý phương pháp tiếp cận:
1. **Xác định dạng bài:** Thuộc Đại số Chương 1 (Đơn thức/Đa thức), Chương 2 (7 Hằng đẳng thức & Phân tích nhân tử) hay Hình học Chương 3 (Tứ giác).
2. **Liệt kê công thức gốc liên quan:**
   - 7 Hằng đẳng thức: $(A \\pm B)^2$, $A^2 - B^2$, $(A \\pm B)^3$, $A^3 \\pm B^3$.
   - 4 phương pháp phân tích nhân tử: Đặt nhân tử chung, Dùng hằng đẳng thức, Nhóm hạng tử, Tách hạng tử.
3. **Thực hiện từng bước có giải thích:** Luôn kiểm tra lại dấu âm và lũy thừa của hệ số.

👉 Em hãy nhập cụ thể biểu thức (ví dụ: $(3x - 2y)^2$, $x^2 - 16$, hay $x^2 + 8x + 16$) để cô phân tích từng bước chi tiết cho em nhé! ❤️`,
    topic: "Phương pháp tư duy Toán 8 KNTT"
  };
}
