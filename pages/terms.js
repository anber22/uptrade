import urlcat from "urlcat";
import { NextSeo } from "next-seo";
import { getNavBar } from "../utils/getNavBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const config = { amp: true };

export default function Terms({
  navbar,
  appleList,
  sellNavbar,
  sellAppleList,
}) {
  return (
    <>
      <Header navbar={navbar} sellNavbar={sellNavbar} />
      <main className="terms-page">
        <NextSeo
          title="Terms and Conditions | UpTrade"
          description="Terms and Conditions | UpTrade"
          canonical={`${process.env.BASEURL}/terms`}
        />
        <div className="content">
          <h1>Terms and Conditions</h1>
          <div>
            <h2>Agreement between User and UpTradeit.com</h2>
          </div>
          <p>
            Welcome to UpTradeit.com. The UpTradeit.com website (the
            &quot;Site&quot;) is comprised of various web pages operated by
            UpTrade Netowrks Inc (&quot;UP Trade&quot;). UpTradeit.com is
            offered to you conditioned on your acceptance without modification
            of the terms, conditions, and notices contained herein (the
            &quot;Terms&quot;). Your use of UpTradeit.com constitutes your
            agreement to all such Terms. Please read these terms carefully, and
            keep a copy of them for your reference.
          </p>

          <p>
            UpTradeit.com gives users the ability to sell, buy or donate certain
            electronic devices such as mobile phones.
          </p>
          <p>
            UP Trade sells, buys or donate certain electronic devices such as
            mobile phones.
          </p>
          <h2>Electronic Communications</h2>
          <p>
            Visiting UpTradeit.com or sending emails to UP Trade constitutes
            electronic communications. You consent to receive electronic
            communications and you agree that all agreements, notices,
            disclosures and other communications that we provide to you
            electronically, via email and on the Site, satisfy any legal
            requirement that such communications be in writing.
          </p>
          <h2>Your Account</h2>
          <p>
            If you use this site, you are responsible for maintaining the
            confidentiality of your account and password and for restricting
            access to your computer, and you agree to accept responsibility for
            all activities that occur under your account or password. You may
            not assign or otherwise transfer your account to any other person or
            entity. You acknowledge that UP Trade is not responsible for third
            party access to your account that results from theft or
            misappropriation of your account. UP Trade and its associates
            reserve the right to refuse or cancel service, terminate accounts,
            or remove or edit content in our sole discretion.
          </p>
          <h2>Children Under Thirteen</h2>
          <p>
            UP Trade does not knowingly collect, either online or offline,
            personal information from persons under the age of thirteen. If you
            are under 18, you may use UpTradeit.com only with permission of a
            parent or guardian.
          </p>
          <h2>Cancellation/Refund Policy</h2>
          <p>
            Once you accept the offer from UP Trade, it will be considered a
            final transaction unless we determine that the physical condition of
            the device is different from the original description that was
            submitted. If this happens, we will provide you an updated offer
            based on the value of the device. If you decline the new offer, we
            will return your device to you at no cost and the transaction will
            be canceled. If no action is taken after four days, we will proceed
            with the updated offer.
          </p>
          <h2>Links to Third Party Sites/Third Party Services</h2>

          <p>
            UpTradeit.com may contain links to other websites (&quot;Linked
            Sites&quot;). The Linked Sites are not under the control of UP Trade
            and UP Trade is not responsible for the contents of any Linked Site,
            including without limitation any link contained in a Linked Site, or
            any changes or updates to a Linked Site. UP Trade is providing these
            links to you only as a convenience, and the inclusion of any link
            does not imply endorsement by UP Trade of the site or any
            association with its operators.
          </p>
          <p>
            Third party sites and organizations deliver certain services made
            available via UpTradeit.com. By using any product, service or
            functionality originating from the UpTradeit.com domain, you hereby
            acknowledge and consent that UP Trade may share such information and
            data with any third party with whom UP Trade has a contractual
            relationship to provide the requested product, service or
            functionality on behalf of UpTradeit.com users and customers.
          </p>

          <h2>No Unlawful or Prohibited Use/Intellectual Property</h2>

          <p>
            You are granted a non-exclusive, non-transferable, revocable license
            to access and use UpTradeit.com strictly in accordance with these
            terms of use. As a condition of your use of the Site, you warrant to
            UP Trade that you will not use the Site for any purpose that is
            unlawful or prohibited by these Terms. You may not use the Site in
            any manner which could damage, disable, overburden, or impair the
            Site or interfere with any other party&apos;s use and enjoyment of
            the Site. You may not obtain or attempt to obtain any materials or
            information through any means not intentionally made available or
            provided for through the Site.
          </p>
          <p>
            All content included as part of the Service, such as text, graphics,
            logos, images, as well as the compilation thereof, and any software
            used on the Site, is the property of UP Trade or its suppliers and
            protected by copyright and other laws that protect intellectual
            property and proprietary rights. You agree to observe and abide by
            all copyright and other proprietary notices, legends or other
            restrictions contained in any such content and will not make any
            changes thereto.
          </p>

          <p>
            You will not modify, publish, transmit, reverse engineer,
            participate in the transfer or sale, create derivative works, or in
            any way exploit any of the content, in whole or in part, found on
            the Site. UP Trade content is not for resale. Your use of the Site
            does not entitle you to make any unauthorized use of any protected
            content, and in particular, you will not delete or alter any
            proprietary rights or attribution notices in any content. You will
            use protected content solely for your personal use and will make no
            other use of the content without the express written permission of
            UP Trade and the copyright owner. You agree that you do not acquire
            any ownership rights in any protected content. We do not grant you
            any licenses, express or implied, to the intellectual property of UP
            Trade or our licensors except as expressly authorized by these
            Terms.
          </p>

          <h2>Lost, Stolen or Damaged During Transportation</h2>
          <p>
            Upon UP Trade receiving your device(s), we will record an unboxing
            video to show you the status in which it was received. If your
            device(s) have been lost, stolen or damaged before UP Trade
            receives, we will make our best effort to help you find the best
            solution, but UP Trade will not be responsible for any compensation.
            Up Trade will not be held liable for any devices that were
            improperly packaged. The lack of “proper packing” includes but is
            not limited to an unpadded or unsealed box or envelope or not enough
            padding to keep the electronic device(s) secure within the package.
            The value of any electronic device(s) that are inadequately packaged
            will NOT be reimbursed. If you have questions regarding how to
            package your item please discuss your concerns with a local shipping
            consultant. For all insurance claims, you must be able to show proof
            of purchase and be willing to take all the appropriate steps to
            satisfy the information needed for the claim.
          </p>
          <h2>Use of Communication Services</h2>

          <p>
            The Site may contain bulletin board services, chat areas, news
            groups, forums, communities, personal web pages, calendars, and/or
            other message or communication facilities designed to enable you to
            communicate with the public at large or with a group (collectively,
            &quot;Communication Services&quot;). You agree to use the
            Communication Services only to post, send and receive messages and
            material that are proper and related to the particular Communication
            Service.
          </p>
          <p>
            By way of example, and not as a limitation, you agree that when
            using a Communication Service, you will not: defame, abuse, harass,
            stalk, threaten or otherwise violate the legal rights (such as
            rights of privacy and publicity) of others; publish, post, upload,
            distribute or disseminate any inappropriate, profane, defamatory,
            infringing, obscene, indecent or unlawful topic, name, material or
            information; upload files that contain software or other material
            protected by intellectual property laws (or by rights of privacy of
            publicity) unless you own or control the rights thereto or have
            received all necessary consents; upload files that contain viruses,
            corrupted files, or any other similar software or programs that may
            damage the operation of another&apos;s computer; advertise or offer
            to sell or buy any goods or services for any business purpose,
            unless such Communication Service specifically allows such messages;
            conduct or forward surveys, contests, pyramid schemes or chain
            letters; download any file posted by another user of a Communication
            Service that you know, or reasonably should know, cannot be legally
            distributed in such manner; falsify or delete any author
            attributions, legal or other proper notices or proprietary
            designations or labels of the origin or source of software or other
            material contained in a file that is uploaded; restrict or inhibit
            any other user from using and enjoying the Communication Services;
            violate any code of conduct or other guidelines which may be
            applicable for any particular Communication Service; harvest or
            otherwise collect information about others, including e-mail
            addresses, without their consent; violate any applicable laws or
            regulations.
          </p>

          <p>
            UP Trade has no obligation to monitor the Communication Services.
            However, UP Trade reserves the right to review materials posted to a
            Communication Service and to remove any materials in its sole
            discretion. UP Trade reserves the right to terminate your access to
            any or all of the Communication Services at any time without notice
            for any reason whatsoever.
          </p>

          <p>
            UP Trade reserves the right at all times to disclose any information
            as necessary to satisfy any applicable law, regulation, legal
            process or governmental request, or to edit, refuse to post or to
            remove any information or materials, in whole or in part, in UP
            Trade&apos;s sole discretion.
          </p>

          <p>
            Always use caution when giving out any personally identifying
            information about yourself or your children in any Communication
            Service. UP Trade does not control or endorse the content, messages
            or information found in any Communication Service and, therefore, UP
            Trade specifically disclaims any liability with regard to the
            Communication Services and any actions resulting from your
            participation in any Communication Service. Managers and hosts are
            not authorized UP Trade spokespersons, and their views do not
            necessarily reflect those of UP Trade.
          </p>

          <p>
            Materials uploaded to a Communication Service may be subject to
            posted limitations on usage, reproduction and/or dissemination. You
            are responsible for adhering to such limitations if you upload the
            materials.
          </p>

          <h2>
            Materials Provided to UpTradeit.com or Posted on Any UP Trade Web
            Page
          </h2>

          <p>
            UP Trade does not claim ownership of the materials you provide to
            UpTradeit.com (including feedback and suggestions) or post, upload,
            input or submit to any UP Trade Site or our associated services
            (collectively &quot;Submissions&quot;). However, by posting,
            uploading, inputting, providing or submitting your Submission you
            are granting UP Trade, our affiliated companies and necessary
            sublicensees permission to use your Submission in connection with
            the operation of their Internet businesses including, without
            limitation, the rights to: copy, distribute, transmit, publicly
            display, publicly perform, reproduce, edit, translate and reformat
            your Submission; and to publish your name in connection with your
            Submission.
          </p>

          <p>
            No compensation will be paid with respect to the use of your
            Submission, as provided herein. UP Trade is under no obligation to
            post or use any Submission you may provide and may remove any
            Submission at any time in UP Trade&apos;s sole discretion.
          </p>

          <p>
            By posting, uploading, inputting, providing or submitting your
            Submission you warrant and represent that you own or otherwise
            control all of the rights to your Submission as described in this
            section including, without limitation, all the rights necessary for
            you to provide, post, upload, input or submit the Submissions.
          </p>

          <h2>Electronic Device Eligibility for Sale</h2>

          <p>
            The sale of stolen property violates state, federal, and
            international law, and we may notify law enforcement of any sale of,
            or attempts to sell, stolen, counterfeit, or fraudulent property on
            our Site. We also support the investigation and prosecution of
            sellers who violate this policy, and such listings may be removed,
            and you may be subject to a range of other actions, including limits
            of your buying and selling privileges and suspension of your
            account.
          </p>
          <p>
            You represent and warrant that, for any and all electronic device(s)
            (“device(s)”) you seek to sell or sell to Up Trade, (1) you have all
            ownership rights for all such device(s), (2) all such device(s)
            shall be able to be activated for new service (with the exception of
            device(s) incapable of being activated because it is in a
            nonfunctional or broken condition and is disclosed as such), (3) the
            device(s) and the sale and shipment of such device(s) to UP Trade
            are not stolen, counterfeit, or fraudulent, (4) the device(s) do not
            infringe on third party intellectual property rights, (5) the
            device(s) are free of any liens or encumbrances, including
            third-party software which may not be transferred or for which
            royalties are due, (6) you have removed any security codes that
            would prevent the use of such device(s), and (7) you have
            discontinued phone, Internet and/or any similar service on such
            device(s) prior to selling it to UP Trade. By using UP Trade
            services, you agree to indemnify UP Trade from all claims or losses,
            including but not limited to attorney fees, sustained by UP Trade as
            a result of any breach of your representations and warranties. UP
            Trade is not responsible for any service charges related to your
            electronic device(s), whether you incur such charges before, during
            or after your use of the services.
          </p>

          <h2>Third Party Accounts</h2>
          <p>
            You will be able to connect your UP Trade account to third party
            accounts. By connecting your UP Trade account to your third party
            account, you acknowledge and agree that you are consenting to the
            continuous release of information about you to others (in accordance
            with your privacy settings on those third party sites). If you do
            not want information about you to be shared in this manner, do not
            use this feature.
          </p>
          <h2>International Users</h2>
          <p>
            The Service is controlled, operated and administered by UP Trade
            from our offices within the USA. If you access the Service from a
            location outside the USA, you are responsible for compliance with
            all local laws. You agree that you will not use the UP Trade Content
            accessed through UpTradeit.com in any country or in any manner
            prohibited by any applicable laws, restrictions or regulations.
          </p>
          <h2>Indemnification</h2>
          <p>
            You agree to indemnify, defend and hold harmless UP Trade, its
            officers, directors, employees, agents and third parties, for any
            losses, costs, liabilities and expenses (including reasonable
            attorney&apos;s fees) relating to or arising out of your use of or
            inability to use the Site or services, any user postings made by
            you, your violation of any terms of this Agreement or your violation
            of any rights of a third party, or your violation of any applicable
            laws, rules or regulations. UP Trade reserves the right, at its own
            cost, to assume the exclusive defense and control of any matter
            otherwise subject to indemnification by you, in which event you will
            fully cooperate with UP Trade in asserting any available defenses.
          </p>
          <h2>Arbitration</h2>
          <p>
            In the event the parties are not able to resolve any dispute between
            them arising out of or concerning these Terms and Conditions, or any
            provisions hereof, whether in contract, tort, or otherwise at law or
            in equity for damages or any other relief, then such dispute shall
            be resolved only by final and binding arbitration pursuant to the
            Federal Arbitration Act, conducted by a single neutral arbitrator
            and administered by the American Arbitration Association, or a
            similar arbitration service selected by the parties, in a location
            mutually agreed upon by the parties. The arbitrator&apos;s award
            shall be final, and judgment may be entered upon it in any court
            having jurisdiction. In the event that any legal or equitable
            action, proceeding or arbitration arises out of or concerns these
            Terms and Conditions, the prevailing party shall be entitled to
            recover its costs and reasonable attorney&apos;s fees. The parties
            agree to arbitrate all disputes and claims in regards to these Terms
            and Conditions or any disputes arising as a result of these Terms
            and Conditions, whether directly or indirectly, including Tort
            claims that are a result of these Terms and Conditions. The parties
            agree that the Federal Arbitration Act governs the interpretation
            and enforcement of this provision. The entire dispute, including the
            scope and enforceability of this arbitration provision shall be
            determined by the Arbitrator. This arbitration provision shall
            survive the termination of these Terms and Conditions.
          </p>
          <h2>Class Action Waiver</h2>
          <p>
            Any arbitration under these Terms and Conditions will take place on
            an individual basis; class arbitrations and
            class/representative/collective actions are not permitted. THE
            PARTIES AGREE THAT A PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY
            IN EACH&apos;S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS
            MEMBER IN ANY PUTATIVE CLASS, COLLECTIVE AND/ OR REPRESENTATIVE
            PROCEEDING, SUCH AS IN THE FORM OF A PRIVATE ATTORNEY GENERAL ACTION
            AGAINST THE OTHER. Further, unless both you and UP Trade agree
            otherwise, the arbitrator may not consolidate more than one
            person&apos;s claims, and may not otherwise preside over any form of
            a representative or class proceeding.
          </p>
          <h2>Liability Disclaimer</h2>

          <p>
            THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR
            AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL
            ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN. UP
            TRADE TECHNOLOGIES, INCORPORATED AND/OR ITS SUPPLIERS MAY MAKE
            IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME. <br />
            UP TRADE TECHNOLOGIES, INCORPORATED AND/OR ITS SUPPLIERS MAKE NO
            REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY,
            TIMELINESS, AND ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS,
            SERVICES AND RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE.
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH
            INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS ARE
            PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OR CONDITION OF ANY
            KIND. UP TRADE TECHNOLOGIES, INCORPORATED AND/OR ITS SUPPLIERS
            HEREBY DISCLAIM ALL WARRANTIES AND CONDITIONS WITH REGARD TO THIS
            INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS,
            INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.
          </p>

          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            UP TRADE TECHNOLOGIES, INCORPORATED AND/OR ITS SUPPLIERS BE LIABLE
            FOR ANY DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT
            LIMITATION, DAMAGES FOR LOSS OF USE, DATA OR PROFITS, ARISING OUT OF
            OR IN ANY WAY CONNECTED WITH THE USE OR PERFORMANCE OF THE SITE,
            WITH THE DELAY OR INABILITY TO USE THE SITE OR RELATED SERVICES, THE
            PROVISION OF OR FAILURE TO PROVIDE SERVICES, OR FOR ANY INFORMATION,
            SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS OBTAINED THROUGH
            THE SITE, OR OTHERWISE ARISING OUT OF THE USE OF THE SITE, WHETHER
            BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE,
            EVEN IF UP TRADE TECHNOLOGIES, INCORPORATED OR ANY OF ITS SUPPLIERS
            HAS BEEN ADVISED OF THE POSSIBILITY OF DAMAGES. BECAUSE SOME
            STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
            LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, THE ABOVE
            LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY
            PORTION OF THE SITE, OR WITH ANY OF THESE TERMS OF USE, YOUR SOLE
            AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.
          </p>

          <h2>Termination/Access Restriction</h2>

          <p>
            UP Trade reserves the right, in its sole discretion, to terminate
            your access to the Site and the related services or any portion
            thereof at any time, without notice. To the maximum extent permitted
            by law, this agreement is governed by the laws of the State of Texas
            and you hereby consent to the exclusive jurisdiction and venue of
            courts in Texas in all disputes arising out of or relating to the
            use of the Site. Use of the Site is unauthorized in any jurisdiction
            that does not give effect to all provisions of these Terms,
            including, without limitation, this section.
          </p>

          <p>
            You agree that no joint venture, partnership, employment, or agency
            relationship exists between you and UP Trade as a result of this
            agreement or use of the Site. UP Trade&apos;s performance of this
            agreement is subject to existing laws and legal process, and nothing
            contained in this agreement is in derogation of UP Trade&apos;s
            right to comply with governmental, court and law enforcement
            requests or requirements relating to your use of the Site or
            information provided to or gathered by UP Trade with respect to such
            use. If any part of this agreement is determined to be invalid or
            unenforceable pursuant to applicable law including, but not limited
            to, the warranty disclaimers and liability limitations set forth
            above, then the invalid or unenforceable provision will be deemed
            superseded by a valid, enforceable provision that most closely
            matches the intent of the original provision and the remainder of
            the agreement shall continue in effect.
          </p>

          <p>
            Unless otherwise specified herein, this agreement constitutes the
            entire agreement between the user and UP Trade with respect to the
            Site and it supersedes all prior or contemporaneous communications
            and proposals, whether electronic, oral or written, between the user
            and UP Trade with respect to the Site. A printed version of this
            agreement and of any notice given in electronic form shall be
            admissible in judicial or administrative proceedings based upon or
            relating to this agreement to the same extent and subject to the
            same conditions as other business documents and records originally
            generated and maintained in printed form. It is the express wish to
            the parties that this agreement and all related documents be written
            in English.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            UP Trade reserves the right, in its sole discretion, to change the
            Terms under which UpTradeit.com is offered. The most current version
            of the Terms will supersede all previous versions. UP Trade
            encourages you to periodically review the Terms to stay informed of
            our updates.
          </p>
          <h2>Contact Us</h2>
          <p>
            UP Trade welcomes your questions or comments regarding the Terms:{" "}
          </p>
          <p>
            UpTrade Netowrks Inc <br />
            3400 N Central Expy, Suite 110-276
            <br />
            Richardson, TX 75080 <br />
          </p>
          <p>Email Address: support@UpTradeit.com</p>
          <div className="terms-divider"></div>
          <p>
            <p>Last Updated: July 19, 2022</p>
          </p>
        </div>
      </main>
      <Footer
        appleList={appleList}
        sellAppleList={sellAppleList}
        buyNavbar={navbar}
        sellNavbar={sellNavbar}
      />
    </>
  );
}

export async function getStaticProps() {
  const navBarData = await getNavBar();

  return {
    props: {
      ...navBarData,
    },
  };
}
