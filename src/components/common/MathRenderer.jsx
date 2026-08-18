import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Component render công thức toán học KaTeX / MathType chuẩn đẹp (1 dòng)
 * @param {string} formula - Chuỗi công thức LaTeX (ví dụ: "A = a \\cdot x^m y^n z^p")
 * @param {boolean} displayMode - true: hiển thị block chính giữa, false: hiển thị inline
 * @param {string} className - Class CSS mở rộng
 */
export const MathRenderer = ({ formula = '', displayMode = false, className = '' }) => {
  const html = useMemo(() => {
    if (!formula) return '';
    try {
      let cleanFormula = String(formula).trim();
      // Loại bỏ các ký tự bọc thừa nếu có
      if (cleanFormula.startsWith('$$') && cleanFormula.endsWith('$$')) {
        cleanFormula = cleanFormula.slice(2, -2).trim();
      } else if (cleanFormula.startsWith('$') && cleanFormula.endsWith('$')) {
        cleanFormula = cleanFormula.slice(1, -1).trim();
      } else if (cleanFormula.startsWith('\\(') && cleanFormula.endsWith('\\)')) {
        cleanFormula = cleanFormula.slice(2, -2).trim();
      } else if (cleanFormula.startsWith('\\[') && cleanFormula.endsWith('\\]')) {
        cleanFormula = cleanFormula.slice(2, -2).trim();
      }

      return katex.renderToString(cleanFormula, {
        displayMode: displayMode,
        throwOnError: false,
        output: 'html', // CHỈ xuất HTML chuẩn MathType, loại bỏ hoàn toàn dòng text MathML thô bị lặp lại phía dưới
        strict: false
      });
    } catch (err) {
      console.warn('Lỗi render KaTeX:', err);
      return `<span class="text-rose-400 font-mono">${formula}</span>`;
    }
  }, [formula, displayMode]);

  return (
    <span
      className={`math-rendered-formula ${displayMode ? 'block text-center my-2' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Component hiển thị văn bản kết hợp công thức toán học KaTeX / MathType inline
 * Tự động phân tách và vẽ đẹp mọi công thức toán đặt trong cặp dấu $...$ hoặc dạng A. B. C. D.
 */
export const MathText = ({ text = '', className = '' }) => {
  if (!text) return null;

  const rawStr = String(text);

  // 1. Nếu có dấu phân cách $...$ hoặc $$...$$ hoặc \(...\)
  if (rawStr.includes('$') || rawStr.includes('\\(') || rawStr.includes('\\[')) {
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;
    const parts = rawStr.split(regex);

    return (
      <span className={className}>
        {parts.map((part, index) => {
          if (!part) return null;

          if (
            (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) ||
            (part.startsWith('\\[') && part.endsWith('\\]') && part.length > 4)
          ) {
            const formula = part.startsWith('$$') ? part.slice(2, -2) : part.slice(2, -2);
            return (
              <MathRenderer
                key={index}
                formula={formula}
                displayMode={true}
                className="my-1.5"
              />
            );
          }

          if (
            (part.startsWith('$') && part.endsWith('$') && part.length > 2) ||
            (part.startsWith('\\(') && part.endsWith('\\)') && part.length > 4)
          ) {
            const formula = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
            return (
              <MathRenderer
                key={index}
                formula={formula}
                displayMode={false}
                className="align-baseline mx-0.5"
              />
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  }

  // 2. Tự động nhận diện nếu chuỗi là phương án trắc nghiệm dạng "A. 3x^2y + 1"
  const optionMatch = rawStr.match(/^([A-D]\.\s*)(.*)$/);
  if (optionMatch) {
    const prefix = optionMatch[1];
    const rest = optionMatch[2];
    if (rest.includes('^') || rest.includes('/') || rest.includes('\\')) {
      return (
        <span className={className}>
          <span className="font-bold mr-1">{prefix}</span>
          <MathRenderer formula={rest} displayMode={false} className="align-baseline" />
        </span>
      );
    }
  }

  // 3. Nếu chuỗi thuần túy là công thức có số mũ (ví dụ: "3x^2y")
  if (rawStr.includes('^')) {
    return (
      <span className={className}>
        <MathRenderer formula={rawStr} displayMode={false} className="align-baseline" />
      </span>
    );
  }

  return <span className={className}>{rawStr}</span>;
};

export default MathRenderer;



