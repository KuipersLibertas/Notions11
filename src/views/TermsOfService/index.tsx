'use client';

import React from 'react';
import HelpLayout from '@/views/shared/layouts/HelpLayout';

const TermsOfService = (): JSX.Element => {
  return (
    <HelpLayout title="Terms Of Service">
      <h3>1. Terms</h3>
      <p>By accessing the website at <a href={process.env.NEXT_PUBLIC_NOTIONS11_SITE_URL}>www.notions11.com</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
      <h3>2. Use License</h3>
      <ol type="a">
        <li>Permission is granted to temporarily download one copy of the materials (information or software) on Notions11&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          <ol type="i">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on Notions11&apos;s website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
          </ol>
        </li>
        <li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Notions11 at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</li>
      </ol>
      <h3>3. Disclaimer</h3>
      <ol type="a">
        <li>The materials on Notions11&apos;s website are provided on an &apos;as is&apos; basis. Notions11 makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</li>
        <li>Further, Notions11 does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</li>
      </ol>
      <h3>4. Limitations</h3>
      <p>In no event shall Notions11 or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Notions11&apos;s website, even if Notions11 or a Notions11 authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
      <h3>5. Accuracy of materials</h3>
      <p>The materials appearing on Notions11 website could include technical, typographical, or photographic errors. Notions11 does not warrant that any of the materials on its website are accurate, complete or current. Notions11 may make changes to the materials contained on its website at any time without notice. However Notions11 does not make any commitment to update the materials.</p>
      <h3>6. Links</h3>
      <p>Notions11 has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Notions11 of the site. Use of any such linked website is at the user&apos;s own risk.</p>
      <h3>7. Modifications</h3>
      <p>Notions11 may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
      <h3>8. Marketing &amp; Promotion</h3>
      <p>By creating an account on Notions11.com, users agree and opt-in to receive periodic emails from Notions11. Users can at all times, choose to unsubscribe from the mailinglist and choose not to receive emails from Notions11 anymore. </p>
      <h3>9. Governing Law</h3>
      <p>These terms and conditions are governed by and construed in accordance with the laws of The Netherlands and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
    </HelpLayout>     
  );
};

export default TermsOfService;