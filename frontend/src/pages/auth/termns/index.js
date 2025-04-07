import {setLayout, useMaterialUIController} from "../../../context";
import {useLocation} from "react-router-dom";
import React, {useEffect} from "react";
import PageLayout from "../../../components/PageLayout";


const TermsAndConditions = () => {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{marginBottom: '20px', fontSize: '2.5em', color: '#333'}}>Terms of Service</h1>
      <p style={{maxWidth: '800px', textAlign: 'left'}}>
        This section is used to inform website visitors regarding our terms of use and acceptable use policy.
        By accessing the Platform or the Services Corrosion One LLC or any of our associated products or platforms), you
        agree:
      </p>
      <ul style={{maxWidth: '800px', textAlign: 'left', paddingLeft: '20px'}}>
        <li>to comply with the Agreement and all applicable laws, rules and regulations in connection with your use of
          the Platform and Services, including, without limitation, laws regarding online conduct;
        </li>
        <li>not to use the Platform or Services for any commercial or other purposes that are not expressly permitted by
          this Agreement or in a manner that falsely implies our endorsement, partnership or otherwise misleads others
          as to your affiliation with us;
        </li>
        <li>not to access the Platform or Services using a third party's account/registration without the express
          consent of the Account holder and not to attempt to impersonate another user or person;
        </li>
        <li>not to avoid, bypass, remove, deactivate, impair, descramble, or attempt, through any means, to circumvent
          any technological measure implemented to protect the Platform, or otherwise attempt to gain unauthorized
          access to any part of the Platform and/or any Service, other Account, computer system, and/or network
          connected to any server;
        </li>
        <li>not to use the Platform or Services in any manner that could damage, disable, overburden, and/or impair the
          Platform, any server, or the network(s) connected to any server, and/or interfere with any other party's use
          and enjoyment of the Platform;
        </li>
        <li>not to advertise to, or solicit, any user, Customer, or other business to buy or sell any products or
          services, or use any information obtained from the Platform or the Services in order to contact, solicit, or
          advertise or sell to any Customer or other business, in each case, unless specifically authorized in writing
          by Corrosion One LLC;
        </li>
        <li>not to deep-link to or frame the Platform and/or access the Platform manually and/or with any robot, spider,
          web crawler, extraction software, automated process, and/or device or other means to scrape, copy, and/or
          monitor any portion of the Platform and/or any Materials and/or other content on the Platform, unless
          specifically authorized in writing by Corrosion One LLC;
        </li>
        <li>not to conduct any scraping, indexing, surveying, data mining, or any other kind of systematic retrieval of
          data or other content from the Platform;
        </li>
        <li>not to copy, publish, or redistribute any coupon or discount code or act in bad faith in an attempt to
          manipulate or gain an unintended commercial benefit from offers;
        </li>
        <li>not to harass, annoy, intimidate, threaten or engage in any racist, sexist, or other behavior that Corrosion
          One LLC finds objectionable to any Corrosion One LLC employees, contractors, or agents engaged in providing
          any portion of the Services and not to engage in any other behavior that Corrosion One LLC deems inappropriate
          when using the Platform or Services;
        </li>
        <li>not to engage in any criminal or tortious activity, including, without limitation, fraud, spamming (e.g. by
          email or instant message), sending of viruses or other harmful files, harassment, stalking, copyright
          infringement, patent infringement, or theft of trade secrets or otherwise deleting the copyright or other
          proprietary rights notice from any of the Materials or from any portion of the Platform or the Services;
        </li>
        <li>not to rent, lease, redistribute, sell, sublicense, decompile, reverse engineer, disassemble, or otherwise
          reduce the Platform and/or the Materials, in whole or in part, to a human-perceivable form for any purpose,
          including, without limitation, to build a product and/or service competitive with the Platform and its
          Services; and
        </li>
        <li>not to disrupt, interfere with, or otherwise harm or violate the security of the Platform, or any Services,
          system resources, accounts, passwords, servers or networks connected to or accessible through the Platform or
          affiliated or linked sites (including, without limitation, those of our Merchant).
        </li>
      </ul>
      <p style={{maxWidth: '800px', textAlign: 'left'}}>
        You agree to comply with the above conduct requirements and agree not assist or permit any person in engaging in
        any conduct that does not comply with the above conduct. In the event that Corrosion One LLC believes that you
        have breached any of the above conduct requirements, Corrosion One LLC reserves the right to suspend and/or
        permanently terminate your Account at our sole discretion.
      </p>
      <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '2em', color: '#333'}}>Changes</h2>
      <p style={{maxWidth: '800px', textAlign: 'left'}}>
        We may update our Terms of Use from time to time. Thus, we advise you to review this page periodically for any
        changes. We will notify you of any changes by posting the new terms on this page. These changes are effective
        immediately, after they are posted on this page.
      </p>
      <h2 style={{marginTop: '40px', marginBottom: '20px', fontSize: '2em', color: '#333'}}>Contact Us</h2>
      <p style={{maxWidth: '800px', textAlign: 'left'}}>
        If you have any questions or suggestions about our Terms of Use, do not hesitate to contact us via email or
        phone at the contact information listed below.
      </p>
      <address style={{maxWidth: '800px', textAlign: 'left'}}>
        <strong>Corrosion One LLC</strong><br/>
        P.O. Box 2428<br/>
        Crystal Lake, IL 60039<br/>
        Contact: Tom Hayden<br/>
        Email: <a href="mailto:thayden@corrosionone.com">thayden@corrosionone.com</a><br/>
        Telephone: 313-247-9453<br/>
        Available: 8am – 5pm, M-F
      </address>
      <p style={{maxWidth: '800px', textAlign: 'left', marginTop: '40px'}}>
        &copy; 2025 Corrosion One LLC | <a href="mailto:info@corrosionone.com">info@corrosionone.com</a>
      </p>
    </div>
)
};

export default TermsAndConditions;
