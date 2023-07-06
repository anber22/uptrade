import { NextSeo } from "next-seo";
import pageCss from "!raw-loader!../../styles/redirect-coupon.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useCopyToClipboard, useLocation } from "react-use";
export default function RedirectCoupon() {
  const location = useLocation();
  const [state, handleCopy] = useCopyToClipboard();
  const [redirectUrl, setRedirectUrl] = useState()
  const [matchName, setMatchName] = useState()
  const [id, setId] = useState()
  const [type, setType] = useState()
  
  useEffect(() => {
    console.log('初始化')
    if(window && window.urlObj){
      setRedirectUrl(window.urlObj.redirectUrl)
      setMatchName(window.urlObj.matchName)
      setId(window.urlObj.id)
      setType(window.urlObj.type)
      fetch("https://api-v2.276qa.com/statistics/request-record", {
        method: "POST",
        headers: {
          ["Content-Type"]: "application/json",
        },
        body: JSON.stringify({
          productId: window.urlObj.id,
          targetUrl: window.urlObj.redirectUrl,
          type: window.urlObj.type === "tradein" ? "TRADE_IN" : "BUY",
        }),
      });
    } else if(window && !window.urlObj) {
      console.log('页面地址', window.location)
      window.location.replace(window.origin)
    }
  }, []);
  return (
    <>
      <Head>
        <style
          amp-custom=""
          dangerouslySetInnerHTML={{
            __html: pageCss,
          }}
        />
      </Head>
      <main className="redirect-page">
        <NextSeo nofollow noindex />
        <h1>25% Off Your Order</h1>
        <div className="copy-input">
          <div className="coupon-code">UPTRADE25</div>
          <button
            className="primary-button copy-button"
            onClick={() => handleCopy("UPTRADE25")}
          >
            {state.value ? "COPIED!" : "COPY"}
          </button>
        </div>
        <div className="tip">
          Copy the code and visit{" "}
          <a
            className="redirect-url"
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {matchName === "smartphonesplus" ? "SmartphonesPLUS" : matchName}
          </a>
        </div>

        <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
          <button className="primary-button next-button">NEXT</button>
        </a>
      </main>
    </>
  );
}
