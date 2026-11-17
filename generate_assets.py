import os

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
PRODUCTS_DIR = os.path.join(STATIC_DIR, 'images', 'products')
CATEGORIES_DIR = os.path.join(STATIC_DIR, 'images', 'categories')
AVATARS_DIR = os.path.join(STATIC_DIR, 'images', 'avatars')

for d in [PRODUCTS_DIR, CATEGORIES_DIR, AVATARS_DIR]:
    os.makedirs(d, exist_ok=True)

# SVG templates with vibrant gradients and clean modern design
def make_svg(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

# Product SVGs
make_svg(os.path.join(PRODUCTS_DIR, 'data_structures.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#3730a3" />
    </linearGradient>
    <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="600" height="450" fill="url(#bg)"/>
  <!-- Decorative Grid Pattern -->
  <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
    <line x1="50" y1="0" x2="50" y2="450"/>
    <line x1="150" y1="0" x2="150" y2="450"/>
    <line x1="250" y1="0" x2="250" y2="450"/>
    <line x1="350" y1="0" x2="350" y2="450"/>
    <line x1="450" y1="0" x2="450" y2="450"/>
    <line x1="550" y1="0" x2="550" y2="450"/>
    <line x1="0" y1="90" x2="600" y2="90"/>
    <line x1="0" y1="180" x2="600" y2="180"/>
    <line x1="0" y1="270" x2="600" y2="270"/>
    <line x1="0" y1="360" x2="600" y2="360"/>
  </g>
  <!-- Book spine / pages stack shadow -->
  <rect x="180" y="70" width="250" height="320" rx="12" fill="#0f172a" opacity="0.5" filter="url(#shadow)"/>
  <!-- Pages Stack -->
  <path d="M 195 75 L 435 75 L 425 385 L 185 385 Z" fill="#f8fafc" />
  <path d="M 425 75 L 435 80 L 435 380 L 425 385 Z" fill="#cbd5e1" />
  <!-- Book Front Cover -->
  <rect x="175" y="70" width="245" height="315" rx="10" fill="url(#bookCover)" filter="url(#shadow)"/>
  <rect x="175" y="70" width="25" height="315" rx="6" fill="#312e81"/>
  <!-- Cover Details -->
  <rect x="215" y="95" width="80" height="6" rx="3" fill="url(#goldAcc)"/>
  <text x="215" y="140" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="24">DATA</text>
  <text x="215" y="170" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="24">STRUCTURES</text>
  <text x="215" y="195" fill="#a5b4fc" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="14">USING C &amp; ALGORITHMS</text>
  
  <!-- Binary Tree Diagram Graphic on Cover -->
  <circle cx="300" cy="245" r="10" fill="#38bdf8"/>
  <line x1="300" y1="245" x2="270" y2="285" stroke="#38bdf8" stroke-width="2"/>
  <line x1="300" y1="245" x2="330" y2="285" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="270" cy="285" r="8" fill="#818cf8"/>
  <circle cx="330" cy="285" r="8" fill="#818cf8"/>
  <line x1="270" y1="285" x2="255" y2="315" stroke="#818cf8" stroke-width="1.5"/>
  <line x1="270" y1="285" x2="285" y2="315" stroke="#818cf8" stroke-width="1.5"/>
  <circle cx="255" cy="315" r="6" fill="#c084fc"/>
  <circle cx="285" cy="315" r="6" fill="#c084fc"/>
  <circle cx="345" cy="315" r="6" fill="#c084fc"/>
  <line x1="330" y1="285" x2="345" y2="315" stroke="#818cf8" stroke-width="1.5"/>

  <rect x="215" y="340" width="165" height="2" fill="#6366f1" opacity="0.6"/>
  <text x="215" y="360" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500">Reema Thareja • 3rd Edition</text>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'eng_maths.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgMath" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="mathCover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgMath)"/>
  <circle cx="480" cy="90" r="140" fill="#0284c7" opacity="0.1"/>
  <!-- Book Backing -->
  <rect x="180" y="70" width="245" height="315" rx="10" fill="#0f172a" opacity="0.6"/>
  <rect x="175" y="70" width="245" height="315" rx="10" fill="url(#mathCover)"/>
  <rect x="175" y="70" width="24" height="315" rx="6" fill="#075985"/>
  <text x="215" y="130" fill="#e0f2fe" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20">HIGHER</text>
  <text x="215" y="160" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24">ENGINEERING</text>
  <text x="215" y="190" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22">MATHEMATICS</text>
  <!-- Integral and Formula art -->
  <text x="280" y="270" fill="#ffffff" opacity="0.3" font-family="serif" font-style="italic" font-size="64">∫</text>
  <text x="250" y="300" fill="#bae6fd" font-family="monospace" font-size="14">e^(iπ) + 1 = 0</text>
  <text x="235" y="325" fill="#7dd3fc" font-family="monospace" font-size="13">∇²Ψ + (8π²m/h²)(E-V)Ψ = 0</text>
  <text x="215" y="365" fill="#f0f9ff" font-family="sans-serif" font-size="12" font-weight="bold">Dr. B.S. GREWAL • 44th Edition</text>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'calculator.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgCalc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#27272a" />
    </linearGradient>
    <linearGradient id="calcBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#262626" />
      <stop offset="100%" stop-color="#171717" />
    </linearGradient>
    <linearGradient id="lcd" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c7d2fe" />
      <stop offset="100%" stop-color="#a5b4fc" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgCalc)"/>
  <!-- Calculator Body -->
  <rect x="200" y="45" width="200" height="360" rx="20" fill="url(#calcBody)" stroke="#404040" stroke-width="2"/>
  <!-- Top Solar panel and brand -->
  <text x="220" y="72" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="14">CASIO</text>
  <text x="220" y="85" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="8">fx-991EX CLASSWIZ</text>
  <rect x="330" y="60" width="50" height="20" rx="3" fill="#3b2b1a" stroke="#78350f" stroke-width="1"/>
  <!-- LCD Display -->
  <rect x="218" y="98" width="164" height="65" rx="6" fill="url(#lcd)"/>
  <text x="228" y="125" fill="#1e1b4b" font-family="monospace" font-size="14" font-weight="bold">sin(45°) + √(144)</text>
  <text x="325" y="152" fill="#1e1b4b" font-family="monospace" font-size="18" font-weight="bold">= 12.707</text>
  <!-- Function buttons -->
  <circle cx="300" cy="180" r="16" fill="#3f3f46" stroke="#71717a" stroke-width="1"/>
  <!-- Keypad buttons grid -->
  <g fill="#3f3f46" rx="4">
    <rect x="220" y="205" width="26" height="18" rx="4"/>
    <rect x="254" y="205" width="26" height="18" rx="4"/>
    <rect x="288" y="205" width="26" height="18" rx="4"/>
    <rect x="322" y="205" width="26" height="18" rx="4"/>
    <rect x="356" y="205" width="26" height="18" rx="4"/>

    <rect x="220" y="230" width="26" height="18" rx="4"/>
    <rect x="254" y="230" width="26" height="18" rx="4"/>
    <rect x="288" y="230" width="26" height="18" rx="4"/>
    <rect x="322" y="230" width="26" height="18" rx="4"/>
    <rect x="356" y="230" width="26" height="18" rx="4"/>

    <rect x="220" y="260" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="262" y="260" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="304" y="260" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="346" y="260" width="34" height="22" rx="4" fill="#dc2626"/>

    <rect x="220" y="290" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="262" y="290" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="304" y="290" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="346" y="290" width="34" height="22" rx="4" fill="#ea580c"/>

    <rect x="220" y="320" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="262" y="320" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="304" y="320" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="346" y="320" width="34" height="22" rx="4" fill="#4f46e5"/>

    <rect x="220" y="350" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="262" y="350" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="304" y="350" width="34" height="22" rx="4" fill="#52525b"/>
    <rect x="346" y="350" width="34" height="22" rx="4" fill="#4f46e5"/>
  </g>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'lab_coat.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgCoat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgCoat)"/>
  <!-- Hanger -->
  <path d="M 230 110 Q 300 60 370 110" stroke="#b45309" stroke-width="6" fill="none"/>
  <circle cx="300" cy="55" r="14" stroke="#b45309" stroke-width="4" fill="none"/>
  <!-- White Lab Coat Body -->
  <path d="M 230 110 L 160 210 L 200 235 L 245 180 L 245 390 L 355 390 L 355 180 L 400 235 L 440 210 L 370 110 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <!-- Collar / Lapels -->
  <path d="M 270 110 L 300 200 L 250 200 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
  <path d="M 330 110 L 300 200 L 350 200 Z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Center seam & Buttons -->
  <line x1="300" y1="200" x2="300" y2="390" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="300" cy="235" r="4" fill="#94a3b8"/>
  <circle cx="300" cy="275" r="4" fill="#94a3b8"/>
  <circle cx="300" cy="315" r="4" fill="#94a3b8"/>
  <!-- Pockets -->
  <rect x="255" y="215" width="30" height="35" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- College crest embroidery -->
  <rect x="260" y="222" width="20" height="4" rx="2" fill="#0284c7"/>
  <rect x="252" y="300" width="38" height="48" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <rect x="310" y="300" width="38" height="48" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'drawing_board.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgWood" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="woodBoard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="100%" stop-color="#fde68a" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgWood)"/>
  <!-- Wooden Board -->
  <rect x="110" y="70" width="380" height="280" rx="8" fill="url(#woodBoard)" stroke="#d97706" stroke-width="6"/>
  <!-- Sheet pinned to board -->
  <rect x="140" y="95" width="320" height="230" rx="3" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <!-- Pins -->
  <circle cx="148" cy="103" r="5" fill="#ef4444"/>
  <circle cx="452" cy="103" r="5" fill="#ef4444"/>
  <circle cx="148" cy="317" r="5" fill="#ef4444"/>
  <circle cx="452" cy="317" r="5" fill="#ef4444"/>
  <!-- Architectural blueprint lines -->
  <rect x="165" y="125" width="130" height="90" fill="none" stroke="#3b82f6" stroke-width="2"/>
  <line x1="165" y1="170" x2="295" y2="170" stroke="#3b82f6" stroke-width="1.5"/>
  <line x1="230" y1="125" x2="230" y2="215" stroke="#3b82f6" stroke-width="1.5"/>
  <circle cx="370" cy="170" r="40" fill="none" stroke="#6366f1" stroke-width="2"/>
  <!-- Mini drafter clamp & arms -->
  <rect x="95" y="60" width="30" height="30" rx="4" fill="#334155" stroke="#64748b" stroke-width="2"/>
  <line x1="120" y1="75" x2="220" y2="150" stroke="#64748b" stroke-width="6" stroke-linecap="round"/>
  <circle cx="220" cy="150" r="10" fill="#0284c7"/>
  <!-- Drafter Scales -->
  <line x1="220" y1="150" x2="310" y2="150" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
  <line x1="220" y1="150" x2="220" y2="240" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'backpack.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgBag" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1f2937" />
    </linearGradient>
    <linearGradient id="bagMain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgBag)"/>
  <!-- Backpack Handle -->
  <path d="M 260 90 Q 300 40 340 90" stroke="#334155" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- Backpack Main Shell -->
  <path d="M 220 120 Q 300 70 380 120 L 400 370 Q 300 395 200 370 Z" fill="url(#bagMain)" stroke="#38bdf8" stroke-width="2"/>
  <!-- Front Zipper Pocket -->
  <path d="M 230 220 Q 300 200 370 220 L 375 350 Q 300 365 225 350 Z" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Reflective strip -->
  <rect x="250" y="270" width="100" height="8" rx="4" fill="#38bdf8" opacity="0.8"/>
  <!-- Water bottle mesh -->
  <path d="M 195 250 L 210 250 L 210 340 L 195 330 Z" fill="#64748b" opacity="0.5"/>
  <path d="M 390 250 L 405 250 L 405 330 L 390 340 Z" fill="#64748b" opacity="0.5"/>
  <!-- Logo Badge -->
  <circle cx="300" cy="160" r="14" fill="#0f172a"/>
  <polygon points="295,153 307,160 295,167" fill="#38bdf8"/>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'arduino_kit.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgArd" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042f2e" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="pcb" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00878F" />
      <stop offset="100%" stop-color="#005b61" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgArd)"/>
  <!-- Arduino Board -->
  <rect x="160" y="90" width="280" height="190" rx="14" fill="url(#pcb)" stroke="#5eead4" stroke-width="2"/>
  <!-- USB Port -->
  <rect x="135" y="110" width="40" height="35" rx="3" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
  <!-- DC Jack -->
  <rect x="135" y="220" width="45" height="40" rx="4" fill="#1e293b" stroke="#000" stroke-width="2"/>
  <!-- Main IC Chip -->
  <rect x="270" y="175" width="110" height="35" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <text x="280" y="198" fill="#94a3b8" font-family="monospace" font-size="11">ATMEGA328P</text>
  <!-- Header Pins Top & Bottom -->
  <rect x="220" y="95" width="200" height="14" rx="2" fill="#1e293b"/>
  <rect x="220" y="260" width="200" height="14" rx="2" fill="#1e293b"/>
  <!-- LED and Crystal -->
  <circle cx="230" cy="140" r="4" fill="#22c55e"/>
  <circle cx="250" cy="140" r="4" fill="#eab308"/>
  <text x="360" y="145" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="16">UNO</text>
  <text x="360" y="160" fill="#a7f3d0" font-family="sans-serif" font-size="9">ARDUINO R3</text>
  <!-- Breadboard underneath -->
  <rect x="140" y="305" width="320" height="70" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <g fill="#94a3b8">
    <circle cx="160" cy="325" r="2"/><circle cx="180" cy="325" r="2"/><circle cx="200" cy="325" r="2"/>
    <circle cx="220" cy="325" r="2"/><circle cx="240" cy="325" r="2"/><circle cx="260" cy="325" r="2"/>
    <circle cx="280" cy="325" r="2"/><circle cx="300" cy="325" r="2"/><circle cx="320" cy="325" r="2"/>
    <circle cx="340" cy="325" r="2"/><circle cx="360" cy="325" r="2"/><circle cx="380" cy="325" r="2"/>
    <circle cx="400" cy="325" r="2"/><circle cx="420" cy="325" r="2"/><circle cx="440" cy="325" r="2"/>
  </g>
  <line x1="150" y1="312" x2="450" y2="312" stroke="#ef4444" stroke-width="2"/>
  <line x1="150" y1="365" x2="450" y2="365" stroke="#3b82f6" stroke-width="2"/>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'graphics_instruments.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgBox" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#311042" />
      <stop offset="100%" stop-color="#12051d" />
    </linearGradient>
    <linearGradient id="velvet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4c1d95" />
      <stop offset="100%" stop-color="#2e1065" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgBox)"/>
  <!-- Velvet Instrument Case -->
  <rect x="130" y="80" width="340" height="290" rx="14" fill="url(#velvet)" stroke="#a855f7" stroke-width="3"/>
  <!-- Metallic Compass -->
  <g stroke="#f8fafc" stroke-width="4" stroke-linecap="round">
    <circle cx="300" cy="140" r="10" fill="#64748b" stroke="#e2e8f0" stroke-width="3"/>
    <line x1="300" y1="150" x2="260" y2="280"/>
    <line x1="300" y1="150" x2="340" y2="280"/>
    <!-- Pencil needle -->
    <line x1="260" y1="280" x2="255" y2="300" stroke="#000" stroke-width="3"/>
    <line x1="340" y1="280" x2="342" y2="300" stroke="#cbd5e1" stroke-width="2"/>
  </g>
  <!-- Divider -->
  <g stroke="#cbd5e1" stroke-width="3" stroke-linecap="round">
    <circle cx="210" cy="170" r="8" fill="#475569"/>
    <line x1="210" y1="178" x2="185" y2="270"/>
    <line x1="210" y1="178" x2="235" y2="270"/>
  </g>
  <!-- Lead Case & Ruling pen -->
  <rect x="380" y="160" width="16" height="110" rx="4" fill="#f59e0b"/>
  <line x1="415" y1="150" x2="415" y2="290" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
  <polygon points="410,290 420,290 415,310" fill="#e2e8f0"/>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'notes.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgNotes" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgNotes)"/>
  <!-- Spiral Notebook -->
  <rect x="170" y="70" width="260" height="310" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <!-- Spiral Rings -->
  <g fill="#475569">
    <rect x="155" y="90" width="30" height="8" rx="4"/>
    <rect x="155" y="120" width="30" height="8" rx="4"/>
    <rect x="155" y="150" width="30" height="8" rx="4"/>
    <rect x="155" y="180" width="30" height="8" rx="4"/>
    <rect x="155" y="210" width="30" height="8" rx="4"/>
    <rect x="155" y="240" width="30" height="8" rx="4"/>
    <rect x="155" y="270" width="30" height="8" rx="4"/>
    <rect x="155" y="300" width="30" height="8" rx="4"/>
    <rect x="155" y="330" width="30" height="8" rx="4"/>
  </g>
  <!-- Notes Header -->
  <rect x="210" y="95" width="190" height="24" rx="4" fill="#e0e7ff"/>
  <text x="220" y="112" fill="#4338ca" font-family="sans-serif" font-weight="bold" font-size="12">DIGITAL ELECTRONICS NOTES</text>
  <!-- Lined Paper with Logic Diagrams -->
  <line x1="210" y1="140" x2="400" y2="140" stroke="#e2e8f0" stroke-width="1.5"/>
  <line x1="210" y1="165" x2="400" y2="165" stroke="#e2e8f0" stroke-width="1.5"/>
  <line x1="210" y1="190" x2="400" y2="190" stroke="#e2e8f0" stroke-width="1.5"/>
  <!-- AND / OR Gate hand-drawn style -->
  <path d="M 230 220 L 260 220 Q 280 235 260 250 L 230 250 Z" fill="#6366f1" opacity="0.2" stroke="#4f46e5" stroke-width="2"/>
  <text x="290" y="240" fill="#1e293b" font-family="monospace" font-size="12">Q = A · B + C'</text>
  <!-- Truth Table Graphic -->
  <rect x="230" y="270" width="160" height="70" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
  <line x1="230" y1="290" x2="390" y2="290" stroke="#94a3b8" stroke-width="1"/>
  <line x1="280" y1="270" x2="280" y2="340" stroke="#94a3b8" stroke-width="1"/>
  <line x1="330" y1="270" x2="330" y2="340" stroke="#94a3b8" stroke-width="1"/>
  <text x="250" y="285" fill="#334155" font-family="monospace" font-size="11">A</text>
  <text x="300" y="285" fill="#334155" font-family="monospace" font-size="11">B</text>
  <text x="350" y="285" fill="#334155" font-family="monospace" font-size="11">Y</text>
  <text x="250" y="310" fill="#64748b" font-family="monospace" font-size="10">0</text>
  <text x="300" y="310" fill="#64748b" font-family="monospace" font-size="10">1</text>
  <text x="350" y="310" fill="#16a34a" font-family="monospace" font-size="10" font-weight="bold">1</text>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'blazer.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgBlazer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="navyWool" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#172554" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgBlazer)"/>
  <!-- Blazer Hanger -->
  <path d="M 230 110 Q 300 65 370 110" stroke="#d97706" stroke-width="6" fill="none"/>
  <!-- Navy Blazer Silhouette -->
  <path d="M 230 110 L 155 220 L 195 245 L 240 190 L 240 390 L 360 390 L 360 190 L 405 245 L 445 220 L 370 110 Z" fill="url(#navyWool)" stroke="#3b82f6" stroke-width="1.5"/>
  <!-- Lapels -->
  <path d="M 270 110 L 300 240 L 235 200 Z" fill="#1e40af" stroke="#1d4ed8" stroke-width="2"/>
  <path d="M 330 110 L 300 240 L 365 200 Z" fill="#1e40af" stroke="#1d4ed8" stroke-width="2"/>
  <!-- Gold Embossed Buttons -->
  <circle cx="300" cy="275" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <circle cx="300" cy="320" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <!-- Pocket with College Emblem -->
  <rect x="250" y="205" width="34" height="24" rx="2" fill="#172554" stroke="#60a5fa" stroke-width="1.5"/>
  <circle cx="267" cy="217" r="6" fill="#fbbf24"/>
  <!-- Flap Pockets -->
  <rect x="245" y="320" width="45" height="12" rx="3" fill="#172554" stroke="#1e40af" stroke-width="1.5"/>
  <rect x="310" y="320" width="45" height="12" rx="3" fill="#172554" stroke="#1e40af" stroke-width="1.5"/>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'kettle.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgKettle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#27272a" />
    </linearGradient>
    <linearGradient id="steel" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgKettle)"/>
  <!-- Steam clouds -->
  <path d="M 210 110 Q 195 80 215 60 Q 230 40 210 20" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.4"/>
  <path d="M 225 100 Q 240 75 220 50" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.4"/>
  <!-- Kettle Body -->
  <path d="M 240 140 L 220 340 L 360 340 L 340 140 Z" fill="url(#steel)" stroke="#cbd5e1" stroke-width="2"/>
  <!-- Base -->
  <rect x="205" y="340" width="170" height="25" rx="6" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <!-- Spout -->
  <polygon points="240,150 200,120 225,180" fill="url(#steel)" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Lid & Handle -->
  <ellipse cx="290" cy="140" rx="50" ry="15" fill="#1e293b"/>
  <circle cx="290" cy="120" r="10" fill="#0f172a"/>
  <!-- Ergonomic Handle -->
  <path d="M 335 150 C 420 170, 420 300, 355 325" stroke="#0f172a" stroke-width="24" fill="none" stroke-linecap="round"/>
  <!-- Water gauge / LED indicator -->
  <rect x="285" y="210" width="10" height="80" rx="5" fill="#0284c7" opacity="0.7"/>
  <circle cx="230" cy="352" r="4" fill="#ef4444"/>
</svg>
""")

make_svg(os.path.join(PRODUCTS_DIR, 'desk_lamp.svg'), """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgLamp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <radialGradient id="glow" cx="45%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bgLamp)"/>
  <!-- Light Cone Glow -->
  <polygon points="260,110 100,410 440,410" fill="url(#glow)"/>
  <!-- Lamp Base -->
  <ellipse cx="330" cy="370" rx="60" ry="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="315" cy="368" r="6" fill="#10b981"/>
  <!-- Flexible Gooseneck -->
  <path d="M 330 360 C 340 260, 360 160, 290 120" stroke="#f8fafc" stroke-width="12" fill="none" stroke-linecap="round"/>
  <!-- Lamp Head -->
  <rect x="190" y="90" width="120" height="24" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="200" y="110" width="100" height="6" rx="3" fill="#fef08a"/>
</svg>
""")

# Category SVGs
categories = [
    ("books", "#4f46e5", "Books"),
    ("notes_and_study_material", "#0284c7", "Notes"),
    ("electronics", "#10b981", "Electronics"),
    ("calculators", "#f59e0b", "Calculators"),
    ("lab_equipment", "#ec4899", "Lab Equip"),
    ("stationery", "#8b5cf6", "Stationery"),
    ("hostel_items", "#14b8a6", "Hostel"),
    ("bags_and_accessories", "#f97316", "Bags"),
    ("college_uniform", "#3b82f6", "Uniform"),
    ("other", "#64748b", "Other")
]

for cat_slug, color, title in categories:
    make_svg(os.path.join(CATEGORIES_DIR, f"{cat_slug}.svg"), f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="28" fill="{color}" fill-opacity="0.12"/>
  <rect x="2" y="2" width="196" height="196" rx="26" fill="none" stroke="{color}" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="100" cy="85" r="45" fill="{color}" fill-opacity="0.2"/>
  <circle cx="100" cy="85" r="28" fill="{color}"/>
  <text x="100" y="160" text-anchor="middle" fill="#f8fafc" font-family="system-ui, sans-serif" font-weight="700" font-size="18">{title}</text>
</svg>
""")

# Avatar SVGs
avatars = [
    ("admin", "#dc2626", "AD", "Admin"),
    ("student", "#4f46e5", "CM", "Student"),
    ("rahul", "#0284c7", "RS", "Rahul"),
    ("priya", "#ec4899", "PP", "Priya"),
    ("rohan", "#10b981", "RV", "Rohan"),
    ("ananya", "#8b5cf6", "AS", "Ananya"),
    ("vikram", "#f59e0b", "VM", "Vikram")
]

for name, col, initials, label in avatars:
    make_svg(os.path.join(AVATARS_DIR, f"{name}.svg"), f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <circle cx="60" cy="60" r="58" fill="{col}"/>
  <circle cx="60" cy="60" r="54" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
  <text x="60" y="70" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="34">{initials}</text>
</svg>
""")

print("Generated all modern SVG assets successfully!")
