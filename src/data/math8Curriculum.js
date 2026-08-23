// DỮ LIỆU CHUẨN CHƯƠNG TRÌNH TOÁN 8 - KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
// GIẢNG DẠY BỞI: CÔ NGUYỄN THỊ HUYỀN DIỆU - TRƯỜNG THCS NGUYỄN HUỆ

export const SCHOOL_INFO = {
  name: "Trường THCS Nguyễn Huệ",
  city: "Đà Nẵng",
  logo: "/images/logo-thcs-nguyen-hue.png",
  slogan: "Dạy tốt - Học tốt • Kết Nối Tri Thức Với Cuộc Sống"
};

export const TEACHER_INFO = {
  name: "Cô Nguyễn Thị Huyền Diệu",
  title: "Giáo viên Toán học",
  school: "Trường THCS Nguyễn Huệ - Đà Nẵng",
  schoolLogo: "/images/logo-thcs-nguyen-hue.png",
  subject: "Toán 8 - Bộ sách Kết Nối Tri Thức",
  bio: "Hơn 10 năm kinh nghiệm giảng dạy môn Toán THCS. Đồng hành cùng các em học sinh làm chủ kiến thức Đại số 8 qua phương pháp trực quan, trò chơi hóa và ứng dụng công nghệ số hiện đại.",
  avatar: "/images/co-huyen-dieu.jpg"
};

export const MATH_8_CURRICULUM = [
  {
    chapter: 1,
    chapterTitle: "Chương 1: Đa thức nhiều biến",
    description: "Khám phá thế giới đại số với đơn thức, đa thức nhiều biến và các phép toán cộng, trừ, nhân, chia.",
    color: "from-sky-500 to-blue-600",
    badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    lessons: [
      {
        id: 1,
        number: 1,
        title: "Bài 1: Đơn thức",
        summary: "Khái niệm đơn thức, đơn thức thu gọn, bậc của đơn thức có bậc khác 0, và đơn thức đồng dạng.",
        keyFormulas: [
          { label: "Dạng tổng quát", latex: "A = a \\cdot x^m y^n z^p" },
          { label: "Bậc của đơn thức", latex: "\\text{Bậc} = m + n + p" },
          { label: "Đơn thức đồng dạng", latex: "2x^2y \\text{ và } -5x^2y" }
        ],
        theory: [
          "Đơn thức là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa các số và các biến.",
          "Đơn thức thu gọn là đơn thức chỉ gồm tích của một số với các biến mà mỗi biến chỉ được viết một lần dưới dạng nâng lên lũy thừa với số mũ nguyên dương.",
          "Hai đơn thức đồng dạng là hai đơn thức có hệ số khác 0 và có cùng phần biến."
        ],
        quizQuestions: [
          {
            id: "c1_b1_q1",
            question: "Biểu thức nào sau đây là một đơn thức?",
            options: ["A. $3x^2y + 1$", "B. $-5x^3y^2z$", "C. $\\frac{x + y}{z}$", "D. $2x - 3y$"],
            correctAnswer: 1,
            explanation: "$-5x^3y^2z$ là tích của một số ($-5$) và các biến $x, y, z$ nên là một đơn thức."
          },
          {
            id: "c1_b1_q2",
            question: "Bậc của đơn thức $4x^3 y^2 z$ là bao nhiêu?",
            options: ["A. $3$", "B. $5$", "C. $6$", "D. $4$"],
            correctAnswer: 2,
            explanation: "Bậc bằng tổng các số mũ của các biến: $3 + 2 + 1 = 6$."
          }
        ]
      },
      {
        id: 2,
        number: 2,
        title: "Bài 2: Đa thức",
        summary: "Khái niệm đa thức, các hạng tử của đa thức, thu gọn đa thức và bậc của đa thức.",
        keyFormulas: [
          { label: "Dạng thu gọn", latex: "P = ax^2y + bx y^2 + c" },
          { label: "Bậc của đa thức", latex: "\\max(\\text{bậc của các hạng tử})" }
        ],
        theory: [
          "Đa thức là một tổng của những đơn thức. Mỗi đơn thức trong tổng gọi là một hạng tử của đa thức đó.",
          "Thu gọn đa thức là làm cho đa thức không còn hai hạng tử nào đồng dạng.",
          "Bậc của đa thức là bậc của hạng tử có bậc cao nhất trong dạng thu gọn của đa thức đó."
        ],
        quizQuestions: [
          {
            id: "c1_b2_q1",
            question: "Thu gọn đa thức $P = 3x^2y - xy + 2x^2y + 5xy$ ta được:",
            options: ["A. $5x^2y + 4xy$", "B. $x^2y + 6xy$", "C. $5x^2y - 6xy$", "D. $5x^4y^2 + 4xy$"],
            correctAnswer: 0,
            explanation: "$(3x^2y + 2x^2y) + (-xy + 5xy) = 5x^2y + 4xy$."
          }
        ]
      },
      {
        id: 3,
        number: 3,
        title: "Bài 3: Phép cộng và phép trừ đa thức",
        summary: "Quy tắc cộng trừ đa thức nhiều biến, nhóm các hạng tử đồng dạng và quy tắc đổi dấu khi bỏ dấu ngoặc.",
        keyFormulas: [
          { label: "Cộng đa thức", latex: "A + B = (a_1 + b_1) + (a_2 + b_2) + \\dots" },
          { label: "Trừ đa thức", latex: "A - B = A + (-B)" }
        ],
        theory: [
          "Để cộng (hay trừ) hai đa thức, ta đặt dấu cộng (hay dấu trừ) giữa hai đa thức đó rồi bỏ dấu ngoặc (nếu có dấu trừ phía trước thì đổi dấu tất cả các hạng tử trong ngoặc) và thu gọn các hạng tử đồng dạng."
        ],
        quizQuestions: [
          {
            id: "c1_b3_q1",
            question: "Cho $A = x^2 - 2y$ và $B = 2x^2 + 2y$. Kết quả $A + B$ là:",
            options: ["A. $3x^2$", "B. $3x^2 + 4y$", "C. $-x^2$", "D. $3x^2 - 4y$"],
            correctAnswer: 0,
            explanation: "$(x^2 + 2x^2) + (-2y + 2y) = 3x^2 + 0 = 3x^2$."
          }
        ]
      },
      {
        id: 4,
        number: 4,
        title: "Bài 4: Phép nhân đa thức",
        summary: "Quy tắc nhân đơn thức với đa thức A(B + C) = AB + AC và nhân đa thức với đa thức (A + B)(C + D).",
        keyFormulas: [
          { label: "Nhân đơn thức với đa thức", latex: "A(B + C) = AB + AC" },
          { label: "Nhân đa thức với đa thức", latex: "(A + B)(C + D) = AC + AD + BC + BD" }
        ],
        theory: [
          "Muốn nhân một đơn thức với một đa thức, ta nhân đơn thức với từng hạng tử của đa thức rồi cộng các tích với nhau.",
          "Muốn nhân một đa thức với một đa thức, ta nhân mỗi hạng tử của đa thức này với từng hạng tử của đa thức kia rồi cộng các tích với nhau."
        ],
        quizQuestions: [
          {
            id: "c1_b4_q1",
            question: "Tính $2x(3x^2 - 5x + 1)$:",
            options: ["A. $6x^3 - 10x^2 + 2x$", "B. $6x^2 - 10x + 2$", "C. $6x^3 - 5x + 2x$", "D. $5x^3 - 7x^2 + 2x$"],
            correctAnswer: 0,
            explanation: "$2x \\cdot 3x^2 - 2x \\cdot 5x + 2x \\cdot 1 = 6x^3 - 10x^2 + 2x$."
          }
        ]
      },
      {
        id: 5,
        number: 5,
        title: "Bài 5: Phép chia đa thức cho đơn thức",
        summary: "Điều kiện chia hết và quy tắc chia đa thức cho đơn thức.",
        keyFormulas: [
          { label: "Chia đa thức cho đơn thức", latex: "(A + B):C = A:C + B:C" },
          { label: "Quy tắc lũy thừa", latex: "x^m : x^n = x^{m-n} \\ (m \\ge n)" }
        ],
        theory: [
          "Đa thức A chia hết cho đơn thức B nếu mọi hạng tử của A đều chia hết cho B.",
          "Muốn chia đa thức A cho đơn thức B, ta chia từng hạng tử của A cho B rồi cộng các kết quả với nhau."
        ],
        quizQuestions: [
          {
            id: "c1_b5_q1",
            question: "Kết quả của phép chia $(6x^4y^3 - 9x^3y^2) : (3x^2y)$ là:",
            options: ["A. $2x^2y^2 - 3xy$", "B. $2x^2y - 3x$", "C. $3x^2y^2 - 3xy$", "D. $2x^6y^4 - 3x^5y^3$"],
            correctAnswer: 0,
            explanation: "$6x^4y^3 : 3x^2y = 2x^2y^2$ và $-9x^3y^2 : 3x^2y = -3xy$."
          }
        ]
      },
      {
        id: 0,
        number: 0,
        title: "Ôn tập cuối chương 1",
        summary: "Tổng kết toàn bộ kiến thức về đơn thức, đa thức nhiều biến và rèn luyện kỹ năng tính toán chuẩn xác.",
        keyFormulas: [
          { label: "Sơ đồ tư duy", latex: "\\text{Đơn thức} \\to \\text{Đa thức} \\to (+, -, \\times, :)" }
        ],
        theory: [
          "Nắm vững các định nghĩa, quy tắc nhân chia lũy thừa cùng cơ số.",
          "Thành thạo kỹ năng nhóm hạng tử và rút gọn biểu thức đại số."
        ],
        quizQuestions: [
          {
            id: "c1_rev_q1",
            question: "Giá trị của biểu thức $P = 2x^2y - xy^2$ tại $x = 1, y = -1$ là:",
            options: ["A. $-3$", "B. $-1$", "C. $1$", "D. $3$"],
            correctAnswer: 0,
            explanation: "$P = 2 \\cdot (1)^2 \\cdot (-1) - 1 \\cdot (-1)^2 = -2 - 1 = -3$."
          }
        ]
      }
    ]
  },
  {
    chapter: 2,
    chapterTitle: "Chương 2: Hằng đẳng thức đáng nhớ và ứng dụng",
    description: "Làm chủ 7 Hằng đẳng thức vàng và các kỹ thuật Phân tích đa thức thành nhân tử kinh điển.",
    color: "from-teal-500 to-emerald-600",
    badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    lessons: [
      {
        id: 6,
        number: 6,
        title: "Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu",
        summary: "3 hằng đẳng thức đầu tiên: Hiệu hai bình phương, bình phương của một tổng và bình phương của một hiệu.",
        keyFormulas: [
          { label: "HĐT 1: Bình phương của một tổng", latex: "(A + B)^2 = A^2 + 2AB + B^2" },
          { label: "HĐT 2: Bình phương của một hiệu", latex: "(A - B)^2 = A^2 - 2AB + B^2" },
          { label: "HĐT 3: Hiệu hai bình phương", latex: "A^2 - B^2 = (A - B)(A + B)" }
        ],
        theory: [
          "Bình phương của một tổng bằng bình phương số thứ nhất cộng hai lần tích số thứ nhất với số thứ hai cộng bình phương số thứ hai.",
          "Hiệu hai bình phương của hai biểu thức bằng tích của hiệu hai biểu thức với tổng của chúng."
        ],
        quizQuestions: [
          {
            id: "c2_b6_q1",
            question: "Khai triển $(2x + 3y)^2$ ta được:",
            options: ["A. $4x^2 + 12xy + 9y^2$", "B. $4x^2 + 6xy + 9y^2$", "C. $2x^2 + 12xy + 3y^2$", "D. $4x^2 + 9y^2$"],
            correctAnswer: 0,
            explanation: "$(2x)^2 + 2 \\cdot (2x) \\cdot (3y) + (3y)^2 = 4x^2 + 12xy + 9y^2$."
          },
          {
            id: "c2_b6_q2",
            question: "Biểu thức $x^2 - 16$ viết dưới dạng tích là:",
            options: ["A. $(x - 4)(x + 4)$", "B. $(x - 16)(x + 16)$", "C. $(x - 4)^2$", "D. $(x + 4)^2$"],
            correctAnswer: 0,
            explanation: "$x^2 - 4^2 = (x - 4)(x + 4)$."
          }
        ]
      },
      {
        id: 7,
        number: 7,
        title: "Bài 7: Lập phương của một tổng. Lập phương của một hiệu",
        summary: "Hằng đẳng thức số 4 và số 5: Khai triển bậc 3 của tổng và hiệu hai biểu thức.",
        keyFormulas: [
          { label: "HĐT 4: Lập phương của một tổng", latex: "(A + B)^3 = A^3 + 3A^2B + 3AB^2 + B^3" },
          { label: "HĐT 5: Lập phương của một hiệu", latex: "(A - B)^3 = A^3 - 3A^2B + 3AB^2 - B^3" }
        ],
        theory: [
          "Lập phương của một tổng hai biểu thức bằng lập phương biểu thức thứ nhất cộng 3 lần tích bình phương biểu thức thứ nhất với biểu thức thứ hai cộng 3 lần tích biểu thức thứ nhất với bình phương biểu thức thứ hai cộng lập phương biểu thức thứ hai."
        ],
        quizQuestions: [
          {
            id: "c2_b7_q1",
            question: "Biểu thức $x^3 - 3x^2 + 3x - 1$ là dạng khai triển của:",
            options: ["A. $(x - 1)^3$", "B. $(x + 1)^3$", "C. $(x - 3)^3$", "D. $x^3 - 1$"],
            correctAnswer: 0,
            explanation: "Dấu đan xen $+$, $-$, $+$, $-$ tương ứng với HĐT $(x - 1)^3$."
          }
        ]
      },
      {
        id: 8,
        number: 8,
        title: "Bài 8: Tổng và hiệu hai lập phương",
        summary: "Hằng đẳng thức số 6 và số 7: Phân tích tổng và hiệu hai lập phương thành nhân tử.",
        keyFormulas: [
          { label: "HĐT 6: Tổng hai lập phương", latex: "A^3 + B^3 = (A + B)(A^2 - AB + B^2)" },
          { label: "HĐT 7: Hiệu hai lập phương", latex: "A^3 - B^3 = (A - B)(A^2 + AB + B^2)" }
        ],
        theory: [
          "Lưu ý: Biểu thức A^2 - AB + B^2 gọi là 'bình phương thiếu của một hiệu'.",
          "Biểu thức A^2 + AB + B^2 gọi là 'bình phương thiếu của một tổng'."
        ],
        quizQuestions: [
          {
            id: "c2_b8_q1",
            question: "Phân tích $x^3 + 8$ thành nhân tử ta được:",
            options: ["A. $(x + 2)(x^2 - 2x + 4)$", "B. $(x + 2)(x^2 + 2x + 4)$", "C. $(x + 2)^3$", "D. $(x - 2)(x^2 + 2x + 4)$"],
            correctAnswer: 0,
            explanation: "$x^3 + 2^3 = (x + 2)(x^2 - 2x + 4)$."
          }
        ]
      },
      {
        id: 9,
        number: 9,
        title: "Bài 9: Phân tích đa thức thành nhân tử",
        summary: "Các phương pháp phân tích: Đặt nhân tử chung, Dùng hằng đẳng thức, Nhóm hạng tử và Phối hợp nhiều phương pháp.",
        keyFormulas: [
          { label: "Đặt nhân tử chung", latex: "AB + AC = A(B + C)" },
          { label: "Dùng hằng đẳng thức", latex: "A^2 - 2AB + B^2 = (A - B)^2" },
          { label: "Nhóm hạng tử", latex: "x^2 - xy + x - y = x(x - y) + (x - y) = (x - y)(x + 1)" }
        ],
        theory: [
          "Phân tích đa thức thành nhân tử (hay thừa số) là biến đổi đa thức đó thành một tích của những đa thức.",
          "Luôn kiểm tra nhân tử chung đầu tiên trước khi áp dụng các phương pháp khác."
        ],
        quizQuestions: [
          {
            id: "c2_b9_q1",
            question: "Phân tích $5x(x - 2) + 3(x - 2)$ thành nhân tử:",
            options: ["A. $(x - 2)(5x + 3)$", "B. $(x - 2)(5x - 3)$", "C. $8x(x - 2)$", "D. $15x(x - 2)$"],
            correctAnswer: 0,
            explanation: "Đặt nhân tử chung là $(x - 2)$ ta được $(x - 2)(5x + 3)$."
          }
        ]
      },
      {
        id: 0,
        number: 0,
        title: "Ôn tập cuối chương 2",
        summary: "Hệ thống hóa toàn bộ 7 Hằng đẳng thức đáng nhớ và tuyệt chiêu giải bài toán phân tích nhân tử, tìm x.",
        keyFormulas: [
          { label: "7 Hằng Đẳng Thức Vàng", latex: "\\text{HĐT } (1 \\to 7) \\text{ Bộ nhớ siêu đẳng}" }
        ],
        theory: [
          "Áp dụng thành thạo để tính nhanh giá trị biểu thức, rút gọn phân thức đại số và giải phương trình tìm x."
        ],
        quizQuestions: [
          {
            id: "c2_rev_q1",
            question: "Tìm $x$ biết $x^2 - 9 = 0$:",
            options: ["A. $x = 3$ hoặc $x = -3$", "B. $x = 3$", "C. $x = 9$ hoặc $x = -9$", "D. $x = 0$"],
            correctAnswer: 0,
            explanation: "$(x - 3)(x + 3) = 0 \\implies x = 3$ hoặc $x = -3$."
          }
        ]
      }
    ]
  }
];

// Danh sách các Game Toán 8 tương tác có sẵn
export const MATH_GAMES_CATALOG = [
  {
    id: "game_identity_speed",
    title: "⚡ Đấu trường 7 Hằng Đẳng Thức",
    category: "Chương 2 - Hằng đẳng thức",
    description: "Thử thách phản xạ thần tốc! Ghép nhanh vế trái và vế phải của 7 hằng đẳng thức đáng nhớ để ghi combo điểm số và leo bảng vàng.",
    type: "interactive_canvas",
    difficulty: "Trung bình",
    timeLimit: 60,
    tags: ["Hằng đẳng thức", "Phản xạ", "Combo x2"]
  },
  {
    id: "game_monomial_match",
    title: "🧩 Săn tìm Đơn thức Đồng dạng",
    category: "Chương 1 - Đơn thức",
    description: "Tìm và ghép các cặp đơn thức đồng dạng để dọn sạch bàn chơi và thu gọn đa thức nhiều biến.",
    type: "interactive_canvas",
    difficulty: "Dễ",
    timeLimit: 90,
    tags: ["Đơn thức", "Đồng dạng", "Thu gọn"]
  },
  {
    id: "game_math_wheel_quiz",
    title: "🏆 Vòng quay Tri thức Toán 8 (KNTT)",
    category: "Tổng hợp Chương 1 & 2",
    description: "Quay vòng quay may mắn chọn câu hỏi trắc nghiệm Toán 8 KNTT, giải đố nhận huy hiệu và điểm thưởng.",
    type: "interactive_canvas",
    difficulty: "Nâng cao",
    timeLimit: 120,
    tags: ["Trắc nghiệm", "Vòng quay", "Huy hiệu"]
  },
  {
    id: "game_wordwall_embed",
    title: "🎯 Wordwall: Trò chơi Đa thức & Hằng đẳng thức",
    category: "Chương 1 & Chương 2",
    description: "Trò chơi nhúng trực tiếp từ nền tảng Wordwall giúp học sinh luyện tập tương tác sinh động.",
    type: "game_iframe",
    embedUrl: "https://wordwall.net",
    difficulty: "Dễ",
    tags: ["Wordwall", "Nhúng iFrame"]
  }
];
