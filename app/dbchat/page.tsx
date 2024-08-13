// app/(disabled-routes)/education/page.js
// app/(disabled-routes)/apps/page.js
// app/(disabled-routes)/efficiency/page.js
// app/(disabled-routes)/coding/page.js

import { redirect } from 'next/navigation';

export default function DisabledPage() {
  redirect('/store');
}