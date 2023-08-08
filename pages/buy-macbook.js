import { useAsync, useAsyncFn } from "react-use";
import { useCallback, useState, useEffect } from "react";
import Pagination from "rc-pagination";
import urlcat from "urlcat";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Head from "next/head";
import { getNavBar } from "../utils/getNavBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Tippy from "@tippyjs/react/headless";
import pageCss from "../styles/buy-in-phone.css";

const orderByDict = {
  RECOMMENDED: "Recommended",
  LOWEST_PRICE: "Lowest Price",
  HIGHEST_PRICE: "Highest Price",
  BEST_CONDITION: "Best Condition",
};

const conditionDescriptions = {
  ["Pristine"]: "Near flawless. Like New.",
  ["Excellent"]: "Minor Scratches (NOT visible at arm's length)",
  ["Good"]: "Light Scratches visible at arm's length",
  ["Fair"]: "Heavy sign of wear and tear but still fully functional",
};

function pageTitleHandler(pageTitle) {
  let showTitle = pageTitle;
  if (pageTitle && pageTitle.substr(pageTitle.length - 1) === "|") {
    showTitle = pageTitle.substr(0, pageTitle.length - 1);
  }
  if (showTitle && `${showTitle} | UpTrade`.length > 60) return showTitle;
  return `${showTitle} | UpTrade`;
}

function useMediaQuery(query) {
  const getMatches = (query) => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(false);

  function handleChange() {
    setMatches(getMatches(query));
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

export default function BuyPhone({
  conditions: initialConditions,
  carrierOptions,
  data: initData,
  products,
  navbar,
  appleList,
  sellNavbar,
  sellAppleList
}) {
  const router = useRouter();
  const [isFocus, setIsFocus] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(["CONDITION"]);
  const [searchKey, setSearchKey] = useState("");
  const [searchKeys, setSearchKeys] = useState({
    selectedValues: [],
    pageNum: 1,
    searchKey: "",
    orderBy: "RECOMMENDED",
    brands: [],
    models: [],
    merchants: [],
  });
  const [chevronExpand, setChevronExpand] = useState(false);

  const matchMedia = useMediaQuery("(min-width: 1280px");

  const onOptionSelect = useCallback(
    (item, conditionName, isDelete) => {
      console.log('item', item, conditionName)
      setSearchKeys((prev) => {
        let values = []
        if(isDelete){
          values = prev.selectedValues.filter(
            (x) => x.value !== item.value
          )
        }else{
          values = prev.selectedValues.some(
            (x) => x.value === item.name
          )
            ? prev.selectedValues.filter(
                (x) => x.value !== item.name
              )
            : [...prev.selectedValues, {name: conditionName?.toLowerCase(), value: item.name}];
        }
       
        return {
          ...prev,
          searchKey,
          pageNum: 1,
          selectedValues: values,
        };
      });
    },
    [searchKey]
  );

  const onSearchClick = useCallback(
    (name) => {
      if (!searchKey && !name) return;

      setSearchKeys((prev) => ({
        ...prev,
        pageNum: 1,
        searchKey: name ?? searchKey,
      }));
    },
    [searchKey]
  );

  const getOptions = useCallback(
    async (query) => {
      if (!searchKey) return products;

      try {
        const productData = await fetch(
          urlcat("https://api-single.uptradeit.com/search/product", {
            name: searchKey,
          })
        ).then((response) => response.json());

        if (!productData.success) return products;

        return productData.data.map((x) => ({ name: x.name, value: x.name }));
      } catch {
        return products;
      }
    },
    [products, searchKey]
  );
  
  const onOrderClick = useCallback(
    (orderBy) => {
      setSearchKeys((prev) => ({
        ...prev,
        searchKey,
        orderBy,
        pageNum: 1,
      }));
    },
    [searchKey]
  );

  const onAccordionClick = useCallback((item) => {
    setExpanded((prev) => {
      return prev.some((x) => x === item)
        ? prev.filter((x) => x !== item)
        : [...prev, item];
    });
  }, []);

  const { value: conditions = [] } = useAsync(async () => {
    if (!searchKeys.selectedValues.length) return initialConditions;

    try {
      const ids = searchKeys.selectedValues.map((x) => x.categoryValueId);

      const response = await fetch(
        urlcat("https://api-v2.276qa.com/search/product/macbook/condition/list")
      ).then((response) => response.json());

      if (!response.success) return initialConditions;

      return response.data;
    } catch {
      return initialConditions;
    }
  }, [searchKeys.selectedValues, initialConditions]);

  const { value: data = initData } = useAsync(async () => {
    console.log('触发遍历',conditions)
    if (
      !searchKeys.selectedValues.length &&
      searchKeys.pageNum === 1 &&
      searchKeys.orderBy === "RECOMMENDED" &&
      !searchKeys.searchKey
    ) {
      return initData;
    }
    console.log('searchKeys.selectedValues', searchKeys.selectedValues)
    try {
      // filter data
      const body = {
        all: false,
        pageNum: searchKeys.pageNum,
        pageSize: 20,
        conditions: searchKeys.selectedValues
          .filter((x) => x.name === 'condition')
          .map((x) => x.value),
        brands: searchKeys.selectedValues
          .filter((x) => x.name === 'brand')
          .map((x) => x.value),
        models: searchKeys.selectedValues
          .filter((x) => x.name === 'model')
          .map((x) => x.value),
        screenSizes: searchKeys.selectedValues
          .filter((x) => x.name === 'screen size')
          .map((x) => x.value),
        years: searchKeys.selectedValues
          .filter((x) => x.name === 'years')
          .map((x) => x.value),
        cpus: searchKeys.selectedValues
          .filter((x) => x.name === 'cpu')
          .map((x) => x.value),
        rams: searchKeys.selectedValues
          .filter((x) => x.name === 'ram')
          .map((x) => x.value),
        storages: searchKeys.selectedValues
          .filter((x) => x.name === 'storage')
          .map((x) => x.value),
        colors: searchKeys.selectedValues
          .filter((x) => x.name === 'color')
          .map((x) => x.value),
        prices: searchKeys.selectedValues
          .filter((x) => x.name === 'price')
          .map((x) => x.value),
        merchants: searchKeys.selectedValues
          .filter((x) => x.name === 'merchant')
          .map((x) => x.value),
        searchKey: searchKeys.searchKey,
        orderBy: searchKeys.orderBy,
      };
console.log('body', body,searchKeys.selectedValues)
      const listData = await fetch("https://api-v2.276qa.com/search/product/macbook/result/list", {
        method: "POST",
        headers: {
          ["Content-Type"]: "application/json",
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());

      if (!listData.success) return cacheList.current;

      return listData.data;
    } catch (error) {
      return cacheList.current;
    }
  }, [searchKeys, initData]);

  const [, addRank] = useAsyncFn(async (name) => {
    return fetch(
      urlcat("https://api-single.uptradeit.com/search/:name/rank", { name }),
      {
        method: "PUT",
      }
    );
  }, []);

  const getId = (key, value) => {
    // console.log('aaa', conditions)
    // const target = conditions.find(item => item.name.toLowerCase() === key)
    // console.log('target', key, target)

    return
  }
  useEffect(() => {
    if (!router?.query) return;
    const {
      year,
      screenSize,
      cpu,
      ram,
      storage,
      color,
      toResult,
    } = router.query;
    console.log('xxx', year,
    screenSize,
    cpu,
    ram,
    storage,
    color)
    setSearchKey(searchKey ?? "");

    setSearchKeys({
      pageNum: 1,
      searchKey: searchKey ?? "",
      orderBy: "RECOMMENDED",
      brands: [],
      models: [],
      merchants: [],
      selectedValues: [
        year ? {name: 'years', value:year} : undefined,
        screenSize ? {name: 'screenSizes', value: screenSize} : undefined,
        cpu ? {name: 'cpus', value: cpu} : undefined,
        ram ? {name: 'rams', value: ram} : undefined,
        storage ? {name: 'storages', value:storage} : undefined,
        color ? {name: 'colors', value: color} : undefined
      ].filter(Boolean),
    });

    if (toResult) {
      window.scrollTo(0, 0);
    }
  }, [router]);
  const getUrl = item =>{
    var urlObj = {}
    let result = ''
    if(item.merchant === "SmartphonesPLUS"){
      result = urlcat(`/redirect-coupon/buy`)
      urlObj = {
        gradeAndMerchant: item.merchant,
        redirectUrl: item.buyUrl,
        id: item.productId,
      }
    }else{
      result = urlcat(`/redirect/buy`)
      urlObj = {
        merchant: item.merchant,
        gradeAndMerchant: `buy-${item.name.replace(
          /\s*/g,
          ""
        )}-${item.condition}-${item.merchant}`,
        redirectUrl: item.buyUrl,
        id: item.productId
      }
    }
    var newwin = window.open(result)
    newwin.urlObj = urlObj
  }
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
      <Header navbar={navbar} sellNavbar={sellNavbar} />
      <main className="buy-phone-page">
        <NextSeo
          title={pageTitleHandler(
            `Browse Certified Refrubished Product for Sales`
          )}
          canonical={`${process.env.BASEURL}/buy-phone`}
          description={`Considering buying a used phone? Browse UpTrade certified phones. View photos of the phone you'll receive. 30 day free returns. Free shipping.`}
          openGraph={{
            title: pageTitleHandler(
              `Browse Certified Refrubished Product for Sales`
            ),
            type: "Product.group",
            "twitter:image":
              "https://prod-uptrade.s3.us-east-2.amazonaws.com/website/logo/Up_Logo.png",
            images: [
              {
                url: `${process.env.BASEURL}/og_logo.png`,
                width: 200,
                height: 200,
              },
            ],
            url: `${process.env.BASEURL}${router.asPath}`,
            description: `Considering buying a used phone? Browse UpTrade certified phones. View photos of the phone you'll receive. 30 day free returns. Free shipping.`,
            site_name: "UpTrade",
          }}
        />
         <div className="buy-phone-conditions">
          <div className="conditions-content">
            {conditions.map((data) => (
              <div className="condition-section" key={data.id}>
                <div
                  className="accordion-header-item"
                  onClick={() => onAccordionClick(data.name)}
                >
                  <h3 className="condition-header">
                    {data.name}
                    {data.name === "CONDITION" ? (
                      <a href="/cosmetic-conditions" target="_blank">
                        <img
                          className="condition-alert"
                          src="/svg/alert-circle.svg"
                          width="12"
                          height="12"
                        />
                      </a>
                    ) : null}
                  </h3>
                  <img
                    src="/svg/arrow-down.svg"
                    alt="arrow-down"
                    style={{ width: 24, height: 24 }}
                  />
                </div>
                <div className="condition-content">
                  {expanded.some((x) => x === data.name)
                    ? data.values.map((item) => (
                        <div
                          key={item.categoryValueId}
                          onClick={() => onOptionSelect(item, data.name)}
                          className={`condition-item ${
                            searchKeys.selectedValues.some(
                              (x) => x.value === item.name
                            )
                              ? "selected-condition-item"
                              : undefined
                          }`}
                        >
                          {item.name}
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="buy-phone-content">
          <div className="buy-phone-page-title">
            <h1>Browse Certified Refrubished Product for Sales</h1>
            <h2>
            Experience peace of mind and simplified shopping. From thousands of sellers, we select the best certified resellers for top-notch quality. Our apple-to-apple comparisons make finding the best price effortless. Buy Used Without The Risk.
            </h2>
          </div>

          <div
            style={{ position: !isFocus ? "sticky" : undefined }}
            className="options-controller-container"
          >
            <div className="option-controllers">
              <div className="filter-controller">
                <label>
                  <span
                    onClick={() => {
                      setFilterDrawerOpen(true);
                      if (!matchMedia) {
                        document.body.style.overflow = "hidden";
                        document.body.style.position = "fixed";
                      }
                    }}
                  >
                    <img src="/svg/filter.svg" width="20" height="12" />
                    <span>Filters</span>
                  </span>
                </label>

                <div
                  className={`filter-drawer-close ${
                    filterDrawerOpen ? "filter-drawer-show" : ""
                  }`}
                >
                  <div
                    className="filter-drawer-backdrop"
                    onClick={() => {
                      setFilterDrawerOpen(false);
                      document.body.style.overflow = "unset";
                      document.body.style.position = "unset";
                    }}
                  ></div>

                  <div className="filter-drawer-content">
                    {conditions.map((data) => (
                      <div className="condition-section" key={data.id}>
                        <div
                          className="accordion-header-item"
                          onClick={() => onAccordionClick(data.name)}
                        >
                          <h3 className="condition-header">
                            {data.name}
                            {data.name === "CONDITION" ? (
                              <a href="/cosmetic-conditions" target="_blank">
                                <img
                                  className="condition-alert"
                                  src="/svg/alert-circle.svg"
                                  width="12"
                                  height="12"
                                />
                              </a>
                            ) : null}
                          </h3>
                          <img
                            src="/svg/arrow-down.svg"
                            alt="arrow-down"
                            style={{ width: 24, height: 24 }}
                          />
                        </div>
                        <div className="condition-content">
                          {expanded.some((x) => x === data.name)
                            ? data.values?.map((item) => (
                                <div
                                  key={item.categoryValueId}
                                  onClick={() => {
                                    onOptionSelect(item, data.name);
                                    setFilterDrawerOpen(false);
                                    document.body.style.overflow = "unset";
                                    document.body.style.position = "unset";
                                  }}
                                  className={`condition-item ${
                                    searchKeys.selectedValues.some(
                                      (x) =>
                                        x.value ===
                                        item.name
                                    )
                                      ? "selected-condition-item"
                                      : undefined
                                  }`}
                                >
                                  {item.name}
                                </div>
                              ))
                            : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sort-controller">
                <label>
                  <span
                    className="dropdown-toggle"
                    onClick={() => {
                      setSortDrawerOpen(true);
                      if (!matchMedia) {
                        document.body.style.overflow = "hidden";
                        document.body.style.position = "fixed";
                      }
                    }}
                  >
                    <img src="/svg/sort.svg" width="20" height="15" />
                    <span className="desktop-sort">
                      Sort By: {orderByDict[searchKeys.orderBy]}
                    </span>
                    <span className="mobile-sort">Sort</span>
                  </span>
                  <input type="checkbox" className="dropdown-input" id="sort" />
                  <ul className="dropdown-menu">
                    {Object.entries(orderByDict).map(([key, value]) => {
                      return (
                        <li
                          className="dropdown-item"
                          key={key}
                          onClick={() => onOrderClick(key)}
                        >
                          <span>{value}</span>
                          {searchKeys.orderBy === key ? (
                            <img width="20" height="20" src="/svg/check.svg" />
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </label>

                <div
                  className={`sort-drawer-close ${
                    sortDrawerOpen ? "sort-drawer-show" : ""
                  }`}
                >
                  <div
                    className="sort-drawer-backdrop"
                    onClick={() => {
                      setSortDrawerOpen(false);
                      document.body.style.overflow = "unset";
                      document.body.style.position = "unset";
                    }}
                  ></div>
                  <div className="sort-drawer-content">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "8px 0",
                      }}
                    >
                      {Object.entries(orderByDict).map(([key, value]) => {
                        return (
                          <div
                            className="drawer-sort-item"
                            key={key}
                            onClick={() => {
                              onOrderClick(key);
                              setSortDrawerOpen(false);
                              document.body.style.overflow = "unset";
                              document.body.style.position = "unset";
                            }}
                          >
                            <span>{value}</span>
                            {searchKeys.orderBy === key ? (
                              <img
                                width="20"
                                height="20"
                                src="/svg/check.svg"
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="options-container">
              <div className="filter-options">
                {searchKeys.selectedValues.map((x) => (
                  <div className="filter-option" key={x.categoryValueId}>
                    {x.value}
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      onClick={() => onOptionSelect(x, '', true)}
                    >
                      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {data?.data?.length ? (
            <>
              <div className="desktop-phone-list">
                {(data?.data ?? initData?.data)?.map((item, index) => (
                  // <a
                  //   key={index}
                  //   href={
                  //     item.merchant === "SmartphonesPLUS"
                  //       ? urlcat(`/redirect-coupon/:gradeAndMerchant`, {
                  //           gradeAndMerchant: item.merchant,
                  //           redirectUrl: item.buyUrl,
                  //           id: item.productId,
                  //         })
                  //       : urlcat(`/redirect/:gradeAndMerchant`, {
                  //           gradeAndMerchant: `buy-${item.name.replace(
                  //             /\s*/g,
                  //             ""
                  //           )}-${item.condition}-${item.merchant}`,
                  //           redirectUrl: item.buyUrl,
                  //           id: item.productId,
                  //         })
                  //   }
                  //   target="_blank"
                  //   rel="nofollow noreferrer"
                  //   className="phone-list-item"
                  // >
                  <div key={index} className="phone-list-item" onClick={() => getUrl(item)}>
                    <div className="img-container">
                      <img width="100" height="100" src={item.brandLogoUrl} />
                    </div>
                    <div className="description">
                      <span>{item.name}</span>
                      <span className="attr">
                        {`${item.year} ${item.cpu} `}
                        <br/>
                        {`${item.screenSize} ${item.color}`}
                        <br/>
                        {`${item.ram} ${item.storage}`}
                      </span>
                    </div>

                    <div className="condition-container">
                      <Tippy
                        render={(attrs) => {
                          return (
                            <div
                              className="condition-description-tooltip"
                              {...attrs}
                            >
                              {conditionDescriptions[item.condition]}
                            </div>
                          );
                        }}
                      >
                        <div className={`condition ${item.condition} `}>
                          {item.condition}
                        </div>
                      </Tippy>
                    </div>

                    {item.merchant === "SmartphonesPLUS" ? (
                      <div className="action">
                        <span className="old-price">
                          ${item.currentPrice / 100}
                        </span>
                        <span className="price">
                          ${Number((item.currentPrice / 100) * 0.75).toFixed()}
                        </span>
                      </div>
                    ) : (
                      <div className="action">
                        <span className="price">
                          ${item.currentPrice / 100}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mobile-phone-list">
                {(data?.data ?? initData?.data)?.map((item, index) => (
                  // <a
                  //   key={index}
                  //   href={
                  //     item.merchant === "SmartphonesPLUS"
                  //       ? urlcat(`/redirect-coupon/:gradeAndMerchant`, {
                  //           gradeAndMerchant: item.merchant,
                  //           redirectUrl: item.buyUrl,
                  //           id: item.productId,
                  //         })
                  //       : urlcat(`/redirect/:gradeAndMerchant`, {
                  //           gradeAndMerchant: `buy-${item.name.replace(
                  //             /\s*/g,
                  //             ""
                  //           )}-${item.condition}-${item.merchant}`,
                  //           redirectUrl: item.buyUrl,
                  //           id: item.productId,
                  //         })
                  //   }
                  //   className="phone-list-item"
                  //   target="_blank"
                  //   rel="nofollow noreferrer"
                  // >
                  <div className="phone-list-item" key={index} onClick={() => getUrl(item)}>
                    <div className="top">
                      <img width="50" height="50" src={item.brandLogoUrl} />
                      <div className={`condition ${item.condition} `}>
                        {item.condition}
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="description">
                        <span className="attr-name">{item.name}</span>
                        <span className="attr">
                        {`${item.year} ${item.cpu} `}
                        <br/>
                        {`${item.screenSize} ${item.color}`}
                        <br/>
                        {`${item.ram} ${item.storage}`}
                        </span>
                      </div>

                      {item.merchant === "SmartphonesPLUS" ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          }}
                        >
                          <span className="old-price">
                            ${item.currentPrice / 100}
                          </span>
                          <span className="price">
                            $
                            {Number((item.currentPrice / 100) * 0.75).toFixed()}
                          </span>
                        </div>
                      ) : (
                        <span className="price">
                          ${item.currentPrice / 100}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="next-page-container">
                <Pagination
                  onChange={(value) =>
                    setSearchKeys((prev) => ({ ...prev, pageNum: value }))
                  }
                  current={searchKeys.pageNum}
                  total={data?.count ?? 0}
                  pageSize={20}
                />
              </div>
            </>
          ) : (
            <div style={{ fontSize: 14 }}>
              We couldn&apos;t find anything that matches what you were looking
              for. Try to change the filter setting.
            </div>
          )}
        </div>
      </main>
      <div
        className="other-content condition-description-content"
        style={{ marginBottom: 40 }}
      >
        <div className="desktop-divider divider"></div>
        <h2 className="model-page-sub-title">
          About <br className="mobile-break-line" /> Used Condition
        </h2>

        <div className="mobile-divider divider"></div>
        <div className="used-condition-content">
          <p className="tips" style={{ padding: 0, textAlign: "left" }}>
            Tips: All Certified Used Phones/Devices are fully functional. The
            main difference is cosmetic. The better the condition, the more
            expensive. If you want the cheapest, pick <strong>Fair</strong>. If
            you want a balanced choice, choose <strong>Good</strong>.
          </p>
          <div className="conditions">
            <div className="model-page-condition-item">
              <div className="model-page-condition-card Pristine">Pristine</div>
              <div className="description">Near flawless. Like New.</div>
            </div>
            <div className="model-page-condition-item">
              <div className="model-page-condition-card Excellent">
                Excellent
              </div>
              <div className="description">
                Minor Scratches (NOT visible at arm&apos;s length)
              </div>
            </div>
            <div className="model-page-condition-item">
              <div className="model-page-condition-card Good">Good</div>
              <div className="description">
                Light Scratches visible at arm&apos;s length
              </div>
            </div>
            <div className="model-page-condition-item">
              <div className="model-page-condition-card Fair">Fair</div>
              <div className="description">
                Heavy sign of wear and tear but still fully functional
              </div>
            </div>
          </div>
        </div>
      </div>
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
  const body = {
    all: false,
    pageNum: 1,
    pageSize: 20,
    orderBy: "RECOMMENDED",
  };
  const data = await fetch(
    "https://api-v2.276qa.com/search/product/macbook/condition/list"
  ).then((response) => response.json());
  const listData = await fetch("https://api-v2.276qa.com/search/product/macbook/result/list", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
  console.log('xxx', data.data)
  console.log('xxx', data.data[3].values)
  console.log('bbb', listData.data)
  const productData = await fetch(
    "https://api-single.uptradeit.com/search/product"
  ).then((response) => response.json());

  if (!data.success || !listData.success || !productData.success)
    return {
      props: {
        conditions: [],
        carrierOptions: [],
        data: [],
        products: [],
        navbar: [],
        appleList: [],
      },
    };

  const carrierOptions = {values: []}
  // data.data.find((x) => x.name === "CARRIER");

  const navBarData = await getNavBar();

  return {
    props: {
      ...navBarData,
      conditions: data.data,
      carrierOptions: carrierOptions ? carrierOptions.values : [],
      data: listData.data,
      products: productData.data.map((x) => ({ name: x.name, value: x.name })),
    },
  };
}
