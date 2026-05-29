const fs = require('fs');
const p = 'apps/web/app/dashboard/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/const room = searchParams\?\.get\(\"room\"\)/g, 'const tab = searchParams?.get(\"tab\")');
c = c.replace(/room ===/g, 'tab ===');
c = c.replace(/\"living-room\"/g, '\"overview\"');
c = c.replace(/\"kids-room\"/g, '\"my-forms\"');
c = c.replace(/\"dining-room\"/g, '\"builder\"');
c = c.replace(/\"study-room\"/g, '\"templates\"');
c = c.replace(/\"mailbox-area\"/g, '\"submissions\"');
c = c.replace(/\"backyard\"/g, '\"analytics\"');
c = c.replace(/\"trophy-room\"/g, '\"explore\"');
c = c.replace(/\"utility-room\"/g, '\"settings\"');

fs.writeFileSync(p, c);
console.log('Fixed routing');
