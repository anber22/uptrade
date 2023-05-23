import Head from "next/head";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAmp } from "next/amp";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  const isAmp = useAmp();
  return (
    <>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="twitter:card" content="summary" />
        {isAmp ? (
          <>
            <script
              async
              custom-element="amp-autocomplete"
              src="https://cdn.ampproject.org/v0/amp-autocomplete-0.1.js"
            />
            <script
              async
              custom-element="amp-form"
              src="https://cdn.ampproject.org/v0/amp-form-0.1.js"
            />
            <script
              async
              custom-element="amp-bind"
              src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
            ></script>
            <script
              async
              custom-element="amp-selector"
              src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"
            ></script>
            <script
              async
              custom-element="amp-accordion"
              src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"
            ></script>
            <script
              async
              custom-template="amp-mustache"
              src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"
            ></script>
            <script
              async
              custom-element="amp-list"
              src="https://cdn.ampproject.org/v0/amp-list-0.1.js"
            ></script>
            <script
              async
              custom-element="amp-analytics"
              src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
            ></script>
          </>
        ) : null}
      </Head>
      <Component {...pageProps} />
      {isAmp ? (
        <a href="/contact" className="global-help" target="_blank">
          <amp-img
            src="/svg/help-pc.svg"
            className="help-pc"
            width="105"
            height="34"
          />
          <amp-img
            src="/svg/help-mobile.svg"
            width="36"
            height="36"
            className="help-mobile"
          />
        </a>
      ) : (
        <a href="/contact" className="global-help" target="_blank">
          <img
            src="/svg/help-pc.svg"
            className="help-pc"
            width="105"
            height="34"
          />
          <img
            src="/svg/help-mobile.svg"
            width="36"
            height="36"
            className="help-mobile"
          />
        </a>
      )}
    </>
  );
}
export default MyApp;
