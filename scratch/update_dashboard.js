const fs = require('fs');
let p = 'apps/web/app/dashboard/page.tsx';
let c = fs.readFileSync(p, 'utf8');

// Replace card classes
c = c.replace(/glass-panel border-none shadow-soft rounded-3xl/g, 'scribble-border scribble-shadow bg-white');

// Give specific colors to specific cards
c = c.replace(/bg-gradient-to-br from-\[\#7b61ff\]\/10 to-\[\#ff7ee2\]\/10/g, 'bg-pastel-purple');

// Text fonts
c = c.replace(/font-black/g, 'font-bold font-caveat tracking-wider');

// Replace badges
c = c.replace(/Badge className=\"bg-orange-500 text-white hover:bg-orange-600 border-none/g, 'Badge className=\"scribble-border bg-pastel-orange text-[#2d2638]');
c = c.replace(/Badge className=\"bg-\[\#ff7ee2\] text-white border-none/g, 'Badge className=\"scribble-border bg-pastel-pink text-[#2d2638]');
c = c.replace(/Badge className=\"bg-amber-500 text-white border-none/g, 'Badge className=\"scribble-border bg-pastel-yellow text-[#2d2638]');
c = c.replace(/Badge className=\"bg-red-500 text-white border-none/g, 'Badge className=\"scribble-border bg-pastel-red text-[#2d2638]');
c = c.replace(/Badge className=\"bg-violet-600 text-white border-none/g, 'Badge className=\"scribble-border bg-pastel-purple text-[#2d2638]');

// Replace buttons
c = c.replace(/className=\"(bg-\[\#7b61ff\][^"]+)\"/g, 'className=\"scribble-btn $1\"');
c = c.replace(/className=\"([^\"]*bg-white\/70[^\"]*)\"/g, 'className=\"scribble-btn $1\"');

fs.writeFileSync(p, c);
console.log('Done styling dashboard');
