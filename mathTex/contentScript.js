(() => {
  console.log("✅ MathTeX with editable placeholders and full symbol sets loaded");

  const trigger = document.createElement("button");
  trigger.id = "mtx-trigger";
  trigger.textContent = "Σ";
  Object.assign(trigger.style, {
    position: "absolute",
    zIndex: 999999,
    display: "none",
    background: "#cce6ff",
    color: "#000",
    border: "1px solid #666",
    borderRadius: "4px",
    padding: "2px 6px",
    cursor: "pointer",
    fontWeight: "bold"
  });
  document.body.appendChild(trigger);

  const panel = document.createElement("div");
  panel.id = "mtx-panel";
  Object.assign(panel.style, {
    position: "absolute",
    zIndex: 999998,
    display: "none",
    flexDirection: "column",
    gap: "6px",
    background: "#f0f0f5",
    border: "1px solid #888",
    borderRadius: "6px",
    padding: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    minWidth: "320px",
    maxWidth: "640px",
    resize: "vertical",
    overflow: "auto"
  });

  panel.innerHTML = `
    <div class="mtx-header" style="display: flex; justify-content: space-between; align-items: center; background: #333; color: white; padding: 4px 8px; font-size: 14px; user-select: none; cursor: move;">
        <strong>MathTeX</strong>
        <div>
        <button id="mtx-minimize" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">🗕</button>
        <button id="mtx-maximize" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">🗖</button>
        <button id="mtx-close" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
        </div>
    </div>
    <div id="mtx-tabs" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
    <div id="mtx-symbol-panels"></div>
    <div style="display: flex; gap: 6px;">
        <input id="mtx-input" placeholder="Type LaTeX…" style="flex: 1; padding: 6px; font-family: monospace;"/>
        <button id="mtx-clear" style="background: #ffc; border: 1px solid #aaa; cursor: pointer;">🧹</button>
        <button id="mtx-delete" style="background: #ffe6e6; border: 1px solid #aaa; cursor: pointer;">⌫</button>
    </div>
    <div id="mtx-preview" style="background: white; padding: 6px; border: 1px solid #ccc; min-height: 32px;"></div>
    <button id="mtx-send" style="background: #00a884; color: white; padding: 6px; border: none; border-radius: 4px; cursor: pointer;">Send</button>
    `;
  document.body.appendChild(panel);

    const header = panel.querySelector('.mtx-header');
    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;

    header.addEventListener('mousedown', e => {
    isDragging = true;
    dragOffsetX = e.clientX - panel.offsetLeft;
    dragOffsetY = e.clientY - panel.offsetTop;
    document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', e => {
    if (isDragging) {
        panel.style.left = `${e.clientX - dragOffsetX}px`;
        panel.style.top = `${e.clientY - dragOffsetY}px`;
    }
    });

    document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
    });

  const tabs = {
    basic: "Basic",
    calc: "Calculus",
    trig: "Trigonometry",
    matrix: "Matrix",
    vector: "Vector",
    symbols: "Symbols",
    greek: "Greek",
    relation: "Relation",
    arrow: "Arrows",
    logic: "Logic",
    misc: "Misc"
  };

  const symbolSets = {
    basic: [
        { d: "a/b", c: "\\frac{□}{□}", name: "fraction" },
        { d: "x²", c: "□^2", name: "square" },
        { d: "xⁿ", c: "□^□", name: "power" },
        { d: "√", c: "\\sqrt{□}", name: "square root" },
        { d: "∛", c: "\\sqrt[3]{□}", name: "cube root" },
        { d: "ⁿ√", c: "\\sqrt[□]{□}", name: "nth root" },
        { d: "∞", c: "\\infty", name: "infinity" },
        { d: "π", c: "\\pi", name: "pi" },
        { d: "e", c: "e", name: "Euler's number" },
        { d: "e^x", c: "e^{□}", name: "exponential" },
        { d: "ln", c: "\\ln(□)", name: "natural log" },
        { d: "log", c: "\\log_{□}(□)", name: "logarithm" },
        { d: "|x|", c: "\\left|□\\right|", name: "absolute value" },
        { d: "≤", c: "□ \\le □", name: "less than or equal" },
        { d: "≥", c: "□ \\ge □", name: "greater than or equal" },
        { d: "≠", c: "□ \\ne □", name: "not equal to" }
    ],
    calc: [
        { d: "d/d□", c: "\\frac{d}{d□}(□)", name: "derivative" },
        { d: "d²/d□²", c: "\\frac{d^2}{d□^2}(□)", name: "second derivative" },
        { d: "∂/∂□", c: "\\frac{\\partial}{\\partial □}(□)", name: "partial derivative" },
        { d: "∂²/∂□²", c: "\\frac{\\partial^2}{\\partial □^2}(□)", name: "second partial derivative" },
        { d: "∂²/∂□∂□", c: "\\frac{\\partial^2}{\\partial □ \\partial □}(□)", name: "mixed partial derivative" },
        { d: "\\int □", c: "\\int □\\,d□", name: "indefinite integral" },
        { d: "\\iint □", c: "\\iint □\\,d□\\,d□", name: "double integral" },
        { d: "\\iiint □", c: "\\iiint □\\,d□\\,d□\\,d□", name: "triple integral" },
        { d: "\\int_{□}^{□} □", c: "\\int_{□}^{□} □\\,d□", name: "definite integral" },
        { d: "\\int_{□}^{□} \\int_{□}^{□} □", c: "\\int_{□}^{□} \\int_{□}^{□} □\\,d□\\,d□", name: "double definite integral" },
        { d: "\\int_{□}^{□} \\int_{□}^{□} \\int_{□}^{□} □", c: "\\int_{□}^{□} \\int_{□}^{□} \\int_{□}^{□} □\\,d□\\,d□\\,d□", name: "triple definite integral" },
        { d: "\\displaystyle\\sum_{□=□}^{□} □", c: "\\sum_{□=□}^{□} □", name: "summation" },
        { d: "\\displaystyle\\prod_{□=□}^{□} □", c: "\\prod_{□=□}^{□} □", name: "product notation" },
        { d: "lim_{□→□}□", c: "\\lim_{□ \\to □} □", name: "limit" },
        { d: "lim_{□→□⁺}□", c: "\\lim_{□ \\to □^+} □", name: "right-hand limit" },
        { d: "lim_{□→□⁻}□", c: "\\lim_{□ \\to □^-} □", name: "left-hand limit" },
        { d: "lim_{(□,□)→(□,□)}□", c: "\\lim_{(□,□) \\to (□,□)} □", name: "multivariable limit" },
        { d: "L_□(□)(□)", c: "\\mathcal{L}_{□}(□)(□)", name: "Laplace transform" },
        { d: "L⁻¹_□(□)(□)", c: "\\mathcal{L}^{-1}_{□}(□)(□)", name: "Inverse Laplace transform" },
        { d: "F_□(□)(□)", c: "\\mathcal{F}_{□}(□)(□)", name: "Fourier transform" },
        { d: "F⁻¹_□(□)(□)", c: "\\mathcal{F}^{-1}_{□}(□)(□)", name: "Inverse Fourier transform" }
    ],
    trig: [
    { d: "\\pi", c: "\\pi", name: "pi" },
    { d: "\\text{deg}", c: "\\text{deg}", name: "degree" },
    { d: "\\text{rad}", c: "\\text{rad}", name: "radian" },
    { d: "\\sin(□)", c: "\\sin(□)", name: "sine" },
    { d: "\\cos(□)", c: "\\cos(□)", name: "cosine" },
    { d: "\\tan(□)", c: "\\tan(□)", name: "tangent" },
    { d: "\\sec(□)", c: "\\sec(□)", name: "secant" },
    { d: "\\csc(□)", c: "\\csc(□)", name: "cosecant" },
    { d: "\\cot(□)", c: "\\cot(□)", name: "cotangent" },
    { d: "\\arcsin(□)", c: "\\arcsin(□)", name: "inverse sine" },
    { d: "\\arccos(□)", c: "\\arccos(□)", name: "inverse cosine" },
    { d: "\\arctan(□)", c: "\\arctan(□)", name: "inverse tangent" },
    { d: "\\text{arcsec}(□)", c: "\\text{arcsec}(□)", name: "inverse secant" },
    { d: "\\text{arccsc}(□)", c: "\\text{arccsc}(□)", name: "inverse cosecant" },
    { d: "\\text{arccot}(□)", c: "\\text{arccot}(□)", name: "inverse cotangent" },
    { d: "\\sinh(□)", c: "\\sinh(□)", name: "hyperbolic sine" },
    { d: "\\cosh(□)", c: "\\cosh(□)", name: "hyperbolic cosine" },
    { d: "\\tanh(□)", c: "\\tanh(□)", name: "hyperbolic tangent" },
    { d: "\\text{sech}(□)", c: "\\text{sech}(□)", name: "hyperbolic secant" },
    { d: "\\text{csch}(□)", c: "\\text{csch}(□)", name: "hyperbolic cosecant" },
    { d: "\\text{coth}(□)", c: "\\text{coth}(□)", name: "hyperbolic cotangent" },
    { d: "\\text{arcsinh}(□)", c: "\\text{arcsinh}(□)", name: "inverse hyperbolic sine" },
    { d: "\\text{arccosh}(□)", c: "\\text{arccosh}(□)", name: "inverse hyperbolic cosine" },
    { d: "\\text{arctanh}(□)", c: "\\text{arctanh}(□)", name: "inverse hyperbolic tangent" },
    { d: "\\text{arcsech}(□)", c: "\\text{arcsech}(□)", name: "inverse hyperbolic secant" },
    { d: "\\text{arccsch}(□)", c: "\\text{arccsch}(□)", name: "inverse hyperbolic cosecant" },
    { d: "\\text{arccoth}(□)", c: "\\text{arccoth}(□)", name: "inverse hyperbolic cotangent" }
    ],
    matrix: [
    { d: "\\begin{pmatrix} □ & □ \\\\ □ & □ \\end{pmatrix}", c: "\\begin{pmatrix} □ & □ \\\\ □ & □ \\end{pmatrix}", name: "2×2 matrix" },
    { d: "\\begin{pmatrix} □ & □ & □ \\\\ □ & □ & □ \\end{pmatrix}", c: "\\begin{pmatrix} □ & □ & □ \\\\ □ & □ & □ \\end{pmatrix}", name: "2×3 matrix" },
    { d: "\\begin{pmatrix} □ & □ \\\\ □ & □ \\\\ □ & □ \\end{pmatrix}", c: "\\begin{pmatrix} □ & □ \\\\ □ & □ \\\\ □ & □ \\end{pmatrix}", name: "3×2 matrix" },
    { d: "\\begin{pmatrix} □ & □ & □ \\\\ □ & □ & □ \\\\ □ & □ & □ \\end{pmatrix}", c: "\\begin{pmatrix} □ & □ & □ \\\\ □ & □ & □ \\\\ □ & □ & □ \\end{pmatrix}", name: "3×3 matrix" }
    ],
    vector: [
    { d: "\\begin{bmatrix} □ & □ \\end{bmatrix}", c: "\\begin{bmatrix} □ & □ \\end{bmatrix}", name: "horizontal 2-vector" },
    { d: "\\begin{bmatrix} □ & □ & □ \\end{bmatrix}", c: "\\begin{bmatrix} □ & □ & □ \\end{bmatrix}", name: "horizontal 3-vector" },
    { d: "\\begin{bmatrix} □ & □ & □ & □ \\end{bmatrix}", c: "\\begin{bmatrix} □ & □ & □ & □ \\end{bmatrix}", name: "horizontal 4-vector" },
    { d: "\\begin{bmatrix} □ \\\\ □ \\end{bmatrix}", c: "\\begin{bmatrix} □ \\\\ □ \\end{bmatrix}", name: "vertical 2-vector" },
    { d: "\\begin{bmatrix} □ \\\\ □ \\\\ □ \\end{bmatrix}", c: "\\begin{bmatrix} □ \\\\ □ \\\\ □ \\end{bmatrix}", name: "vertical 3-vector" },
    { d: "\\begin{bmatrix} □ \\\\ □ \\\\ □ \\\\ □ \\end{bmatrix}", c: "\\begin{bmatrix} □ \\\\ □ \\\\ □ \\\\ □ \\end{bmatrix}", name: "vertical 4-vector" }
    ],
    symbols: [
    { d: "π", c: "\\pi", name: "pi" },
    { d: "√", c: "\\sqrt{□}", name: "square root" },
    { d: "∞", c: "\\infty", name: "infinity" },
    { d: "½", c: "\\frac{1}{2}", name: "one-half" }
    ],
    greek: [
    { d: "α", c: "\\alpha", name: "alpha" }, { d: "β", c: "\\beta", name: "beta" },
    { d: "γ", c: "\\gamma", name: "gamma" }, { d: "δ", c: "\\delta", name: "delta" },
    { d: "ε", c: "\\epsilon", name: "epsilon" }, { d: "ζ", c: "\\zeta", name: "zeta" },
    { d: "η", c: "\\eta", name: "eta" }, { d: "κ", c: "\\kappa", name: "kappa" },
    { d: "λ", c: "\\lambda", name: "lambda" }, { d: "μ", c: "\\mu", name: "mu" },
    { d: "ν", c: "\\nu", name: "nu" }, { d: "ξ", c: "\\xi", name: "xi" },
    { d: "σ", c: "\\sigma", name: "sigma" }, { d: "τ", c: "\\tau", name: "tau" },
    { d: "φ", c: "\\phi", name: "phi" }, { d: "χ", c: "\\chi", name: "chi" },
    { d: "ψ", c: "\\psi", name: "psi" }, { d: "ω", c: "\\omega", name: "omega" },
    { d: "Δ", c: "\\Delta", name: "capital delta" }, { d: "Θ", c: "\\Theta", name: "capital theta" },
    { d: "Ξ", c: "\\Xi", name: "capital xi" }, { d: "Σ", c: "\\Sigma", name: "capital sigma" },
    { d: "Φ", c: "\\Phi", name: "capital phi" }, { d: "Ω", c: "\\Omega", name: "capital omega" }
    ],
    relation: [
    { d: "≤", c: "\\le", name: "less than or equal" }, { d: "≥", c: "\\ge", name: "greater than or equal" },
    { d: "≠", c: "\\neq", name: "not equal" }, { d: "≈", c: "\\approx", name: "approximately equal" },
    { d: "≅", c: "\\cong", name: "congruent" }, { d: "∼", c: "\\sim", name: "similar" },
    { d: "≡", c: "\\equiv", name: "equivalent" }, { d: "⊂", c: "\\subset", name: "subset" },
    { d: "⊆", c: "\\subseteq", name: "subset or equal" }, { d: "⊄", c: "\\not\\subset", name: "not subset" },
    { d: "⊇", c: "\\supseteq", name: "superset or equal" }, { d: "∈", c: "\\in", name: "element of" },
    { d: "∉", c: "\\notin", name: "not element of" }, { d: "∅", c: "\\emptyset", name: "empty set" }
    ],
    arrow: [
    { d: "→", c: "\\to", name: "right arrow" }, { d: "←", c: "\\leftarrow", name: "left arrow" },
    { d: "↔", c: "\\leftrightarrow", name: "left-right arrow" }, { d: "⇒", c: "\\Rightarrow", name: "implies" },
    { d: "⇐", c: "\\Leftarrow", name: "implied by" }, { d: "⇔", c: "\\Leftrightarrow", name: "if and only if" }
    ],
    logic: [
    { d: "∧", c: "\\land", name: "logical and" }, { d: "∨", c: "\\lor", name: "logical or" },
    { d: "¬", c: "\\neg", name: "not" }, { d: "⊕", c: "\\oplus", name: "xor" },
    { d: "⊗", c: "\\otimes", name: "tensor product" }, { d: "∀", c: "\\forall", name: "for all" },
    { d: "∃", c: "\\exists", name: "there exists" }
    ],
    misc: [
    { d: "°", c: "^{\\circ}", name: "degree symbol" }, { d: "±", c: "\\pm", name: "plus-minus" },
    { d: "√", c: "\\sqrt{□}", name: "square root" }, { d: "ℏ", c: "\\hbar", name: "h-bar" },
    { d: "µ", c: "\\mu", name: "micro" }, { d: "€", c: "\\euro", name: "euro" }
    ]
  };

  const tabBar = panel.querySelector("#mtx-tabs");
  const symbolPanes = panel.querySelector("#mtx-symbol-panels");
  const input = panel.querySelector("#mtx-input");
  const preview = panel.querySelector("#mtx-preview");

    const minimizeBtn = panel.querySelector("#mtx-minimize");
    const maximizeBtn = panel.querySelector("#mtx-maximize");
    const contentElements = [
    "#mtx-tabs",
    "#mtx-symbol-panels",
    "#mtx-input",
    "#mtx-clear",
    "#mtx-delete",
    "#mtx-preview",
    "#mtx-send"
    ].map(id => panel.querySelector(id));

    let isMinimized = false;
    let isMaximized = false;
    let originalStyles = {};

    minimizeBtn.onclick = () => {
    if (!isMinimized) {
        contentElements.forEach(el => el && (el.style.display = "none"));
        panel.style.height = "auto";
        isMinimized = true;
    } else {
        contentElements.forEach(el => el && (el.style.display = ""));
        isMinimized = false;
    }
    };

    maximizeBtn.onclick = () => {
    if (!isMaximized) {
        originalStyles = {
        width: panel.style.width,
        height: panel.style.height,
        left: panel.style.left,
        top: panel.style.top
        };
        panel.style.left = "0";
        panel.style.top = "0";
        panel.style.width = "100vw";
        panel.style.height = "95vh";
        isMaximized = true;
    } else {
        panel.style.left = originalStyles.left;
        panel.style.top = originalStyles.top;
        panel.style.width = originalStyles.width;
        panel.style.height = originalStyles.height;
        isMaximized = false;
    }
    };

  for (const [id, label] of Object.entries(tabs)) {
    const tabBtn = document.createElement("button");
    tabBtn.textContent = label;
    tabBtn.dataset.tab = id;
    tabBtn.onclick = () => switchTab(id);
    tabBar.appendChild(tabBtn);

    const panelDiv = document.createElement("div");
    panelDiv.id = `mtx-symbols-${id}`;
    panelDiv.style.display = "none";
    panelDiv.style.flexWrap = "wrap";
    panelDiv.style.gap = "4px";
    panelDiv.className = "mtx-symbols";

    (symbolSets[id] || []).forEach(sym => {
      const btn = document.createElement("button");
      Object.assign(btn.style, {
        padding: "2px",
        margin: "2px",
        lineHeight: "1",
        height: "auto",
        width: "auto",
        display: "inline-block",
        align: "center",
        overflow: "visible"
      });
    //   btn.textContent = sym.d;
      const container = document.createElement("div");
      Object.assign(container.style, {
        transform: "scale(0.8)",
        transformOrigin: "top left",
        display: "inline-block",
        fontSize: "14px"
      });
      katex.render(sym.d, container, { throwOnError: false, displayMode: true });
      btn.appendChild(container);
      btn.dataset.code = sym.c;
      btn.title = sym.name;
      btn.onclick = () => {
        insertAtCaret(input, sym.c);
        input.dispatchEvent(new Event("input"));
      };
      panelDiv.appendChild(btn);
    });

    symbolPanes.appendChild(panelDiv);
  }

  function switchTab(tabId) {
    tabBar.querySelectorAll("button").forEach(btn => {
      btn.style.background = btn.dataset.tab === tabId ? "#007bff" : "#e0e0e0";
      btn.style.color = btn.dataset.tab === tabId ? "#fff" : "#000";
    });
    symbolPanes.querySelectorAll(".mtx-symbols").forEach(div => {
      div.style.display = div.id.endsWith(tabId) ? "flex" : "none";
    });
  }

  switchTab("basic");

  function renderPreview() {
    const latex = input.value;
    try {
      katex.render(latex, preview, {
        throwOnError: true,
        trust: true, output: "html",
        displayMode: true,
      });
    } catch (err) {
      preview.innerHTML = err.message;
      return;
    }

    const walker = document.createTreeWalker(preview, NodeFilter.SHOW_TEXT, null, false);
    const placeholders = [];
    let node;

    while ((node = walker.nextNode())) {
      const parts = node.nodeValue.split("□");
      if (parts.length <= 1) continue;

      const parent = node.parentNode;
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) parent.insertBefore(document.createTextNode(parts[i]), node);
        if (i < parts.length - 1) {
          const span = document.createElement("span");
          span.contentEditable = true;
          span.className = "editable-placeholder";
          span.textContent = "?";
          Object.assign(span.style, {
            background: "yellow",
            padding: "4px 6px",
            margin: "2px",
            borderRadius: "4px",
            display: "inline-block",
            minWidth: "20px",
            textAlign: "center",
            verticalAlign: "middle",
            cursor: "text"
          });
          parent.insertBefore(span, node);
          placeholders.push(span);
        }
      }
      parent.removeChild(node);
    }

    placeholders.forEach((span, idx) => {
      span.addEventListener("input", () => {
        const values = Array.from(placeholders).map(s => s.textContent);
        let count = 0;
        input.value = input.value.replace(/□/g, () => values[count++] ?? "□");
        renderPreview();
      });
      span.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          const all = Array.from(preview.querySelectorAll(".editable-placeholder"));
          const curIdx = all.indexOf(e.target);
          for (let j = curIdx + 1; j < all.length; j++) {
            if (all[j].textContent.trim() === "?") {
              all[j].focus();
              return;
            }
          }
        }
      });
      span.addEventListener("click", () => {
        const parts = [];
        let count = -1;
        for (let i = 0; i < input.value.length; i++) {
          if (input.value[i] === "□") {
            count++;
            if (count === idx) {
              input.focus();
              input.setSelectionRange(i, i + 1);
              break;
            }
          }
        }
      });
    });
  }

  input.addEventListener("input", renderPreview);
  renderPreview();

  panel.querySelector("#mtx-clear").onclick = () => {
    input.value = "";
    preview.innerHTML = "";
  };
  panel.querySelector("#mtx-delete").onclick = () => {
    input.value = input.value.slice(0, -1);
    input.dispatchEvent(new Event("input"));
  };
  panel.querySelector("#mtx-send").onclick = async () => {
  try {
    const latex = input.value;
    const renderedLatex = latex.replace(/□/g, '?');

    // Create an iframe to isolate KaTeX rendering
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.width = "800px";
    iframe.style.height = "300px";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
        <html>
        <head>
            <link rel="stylesheet" href="${document.querySelector('link[href*="katex"]')?.href || 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'}">
            <style>
            html, body {
                margin: 0;
                padding: 0;
                background: white;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            }
            #math {
                font-size: 26px;
                font-family: KaTeX_Main, serif;
                color: black;
                padding: 16px 24px;
                max-width: 90%;
                text-align: center;
                box-sizing: border-box;
            }
            </style>
        </head>
        <body>
            <div id="math"></div>
        </body>
        </html>
    `);

    // Wait for iframe to load KaTeX
    await new Promise(r => setTimeout(r, 50));

    // Render inside iframe
    const mathDiv = doc.getElementById("math");
    katex.render(renderedLatex, mathDiv, {
      throwOnError: true,
      trust: true,
      output: "html"
    });

    // Wait a bit for fonts to fully apply
    await new Promise(r => setTimeout(r, 50));

    // Use html2canvas to snapshot iframe content
    const canvas = await html2canvas(mathDiv, {
      backgroundColor: "white",
      scale: 2,
      useCORS: true,
      windowWidth: 800,
      windowHeight: 300
    });

    iframe.remove(); // cleanup

    canvas.toBlob(async blob => {
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        alert("✅ Math image copied to clipboard");
        currentField?.focus();
        hidePanel();
      } else {
        alert("❌ Failed to create image");
      }
    });
  } catch (err) {
    alert("❌ Error during math render: " + err.message);
  }
};
  panel.querySelector("#mtx-close").onclick = hidePanel;
  function hidePanel() {
    panel.style.display = "none";
    input.value = "";
    preview.innerHTML = "";
  }
  function insertAtCaret(el, text) {
    const start = el.selectionStart ?? 0, end = el.selectionEnd ?? 0;
    el.value = el.value.slice(0, start) + text + el.value.slice(end);
    el.selectionStart = el.selectionEnd = start + text.length;
  }
  let currentField = null;
  
  function showTriggerNear(el) {
    if (!el) return;
    currentField = el;
    const r = el.getBoundingClientRect();
    Object.assign(trigger.style, {
        display: "block",
        top: `${window.scrollY + r.top - 28}px`,
        left: `${window.scrollX + r.right - 32}px`
    });
  }

  document.addEventListener("focusin", e => {
    const el = e.target;
    if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.isContentEditable)) {
        showTriggerNear(el);
    }
  });

  // Observe dynamic pages like WhatsApp
  const observer = new MutationObserver(() => {
    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT" || active.isContentEditable)) {
            showTriggerNear(active);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  trigger.onclick = () => {
    if (!currentField) return;
    const r = currentField.getBoundingClientRect();
    const panelHeight = panel.offsetHeight || 200;
    const below = window.innerHeight - r.bottom;
    const top = below > panelHeight + 20
      ? window.scrollY + r.bottom + 4
      : window.scrollY + r.top - panelHeight - 4;
    Object.assign(panel.style, {
      display: "flex",
      top: `${top}px`,
      left: `${window.scrollX + r.left}px`,
      width: `${r.width}px`
    });
    input.focus();
    renderPreview();
  };
})();