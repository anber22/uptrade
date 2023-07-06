import { useAsync, useAsyncFn } from "react-use";
import { useCallback, useState, useEffect } from "react";
import Pagination from "rc-pagination";
import SelectSearch from "react-select-search";
import urlcat from "urlcat";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Head from "next/head";
import { getNavBar } from "../utils/getNavBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Tippy from "@tippyjs/react/headless";
import pageCss from "!raw-loader!../styles/buy-in-phone.css";

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
  sellAppleList,
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
    (item, conditionName) => {
      setSearchKeys((prev) => {
        const values = prev.selectedValues.some(
          (x) => x.categoryValueId === item.categoryValueId
        )
          ? prev.selectedValues.filter(
              (x) => x.categoryValueId !== item.categoryValueId
            )
          : [...prev.selectedValues, item];

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
        urlcat("https://api-single.uptradeit.com/search/category/values", {
          parentCategoryValueIds: ids.join(","),
        })
      ).then((response) => response.json());

      if (!response.success) return initialConditions;

      return response.data;
    } catch {
      return initialConditions;
    }
  }, [searchKeys.selectedValues, initialConditions]);

  const { value: data = initData } = useAsync(async () => {
    if (
      !searchKeys.selectedValues.length &&
      searchKeys.pageNum === 1 &&
      searchKeys.orderBy === "RECOMMENDED" &&
      !searchKeys.searchKey
    ) {
      return initData;
    }

    try {
      // filter data
      const body = {
        all: false,
        pageNum: searchKeys.pageNum,
        pageSize: 20,
        conditions: searchKeys.selectedValues
          .filter((x) => x.categoryId === 1)
          .map((x) => x.name),
        carriers: searchKeys.selectedValues
          .filter((x) => x.categoryId === 2)
          .map((x) => x.name),
        storages: searchKeys.selectedValues
          .filter((x) => x.categoryId === 5)
          .map((x) => x.name),
        colors: searchKeys.selectedValues
          .filter((x) => x.categoryId === 6)
          .map((x) => x.name),
        prices: searchKeys.selectedValues
          .filter((x) => x.categoryId === 7)
          .map((x) =>
            x.name
              .split(" ")
              .filter((x) => x !== "-")
              .join("_")
              .toUpperCase()
          ),
        brands: searchKeys.selectedValues
          .filter((x) => x.categoryId === 3)
          .map((x) => x.name),
        models: searchKeys.selectedValues
          .filter((x) => x.categoryId === 4)
          .map((x) => x.name),
        merchants: searchKeys.selectedValues
          .filter((x) => x.categoryId === 8)
          .map((x) => x.name),
        searchKey: searchKeys.searchKey,
        orderBy: searchKeys.orderBy,
      };

      const listData = await fetch("https://api-single.uptradeit.com/search", {
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

  useEffect(() => {
    if (!router?.query) return;

    const {
      brand,
      brandCategoryValueId,
      modelName,
      modelId,
      searchKey,
      toResult,
    } = router.query;

    setSearchKey(searchKey ?? "");
    setSearchKeys({
      pageNum: 1,
      searchKey: searchKey ?? "",
      orderBy: "RECOMMENDED",
      brands: [],
      models: [],
      merchants: [],
      selectedValues: [
        modelId
          ? { name: modelName, categoryValueId: Number(modelId), categoryId: 4 }
          : undefined,
        brand
          ? {
              name: brand,
              categoryValueId: Number(brandCategoryValueId),
              categoryId: 3,
            }
          : undefined,
      ].filter(Boolean),
    });

    if (toResult) {
      window.scrollTo(0, 350);
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "ProductList",
              itemListElement: data?.data?.map((item, index) => {
                return {
                  "@type": "ListItem",
                  position: index + 1,
                  name: `${item.name} ${item.carrier} ${item.storage} ${item.color}`,
                  url: urlcat(
                    `${process.env.BASEURL}/redirect/:gradeAndMerchant`,
                    {
                      gradeAndMerchant: `${item.productId}-${item.contion}-${item.merchant}`,
                      redirectUrl: item.buyUrl,
                    }
                  ),
                };
              }),
            }),
          }}
        />
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
            `Browse Used Refurbished Phones and Devices for Sale`
          )}
          canonical={`${process.env.BASEURL}/buy-phone`}
          description={`Considering buying a used phone? Browse UpTrade certified phones. View photos of the phone you'll receive. 30 day free returns. Free shipping.`}
          openGraph={{
            title: pageTitleHandler(
              `Browse Used Refurbished Phones and Devices for Sale`
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
                          onClick={() => onOptionSelect(item)}
                          className={`condition-item ${
                            searchKeys.selectedValues.some(
                              (x) => x.categoryValueId === item.categoryValueId
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
            <h1>Browse Refurbished Phones and Devices for Sale</h1>
            <h2>
              Among hundreds of used phone and device sellers, we have selected
              a handful of certified resellers and marketplaces that provide
              quality certified used or refurbished phones and devices.
            </h2>
          </div>

          <div className="buy-phone-search-form">
            <SelectSearch
              options={products}
              name="search"
              value={searchKey}
              onChange={(key) => setSearchKey(key)}
              placeholder="Search phone manufacturer and model"
              search
              getOptions={getOptions}
              debounce={1000}
              renderValue={(props, snapshot, className) => {
                return (
                  <input
                    {...props}
                    value={searchKey}
                    onChange={(event) => {
                      setSearchKey(event.target.value);
                      props.onChange(event);
                    }}
                    onKeyDown={(event) => {
                      props.onKeyDown(event);
                      if (event.key === "Enter") {
                        onSearchClick();
                      }
                    }}
                    onFocus={(e) => {
                      props.onFocus(e);
                      setIsFocus(true);
                    }}
                    onBlur={(e) => {
                      props.onBlur(e);
                      setIsFocus(false);
                    }}
                    className={className}
                  />
                );
              }}
              renderOption={(optionsProps, optionData) => {
                return (
                  <button
                    {...optionsProps}
                    onMouseDown={(event) => {
                      optionsProps.onMouseDown(event);
                      onSearchClick(optionData.name);
                      addRank(optionData.name);
                    }}
                  >
                    {optionData.name}
                  </button>
                );
              }}
            />
            <button
              className="btn btn-primary search-button"
              onClick={() => onSearchClick()}
            >
              Search
            </button>
            <svg
              className="form-search-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              onClick={() => onSearchClick()}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </div>
          <div
            className="carrier-options"
            style={{
              height: !matchMedia && !chevronExpand ? 88 : undefined,
            }}
          >
            {carrierOptions.map((item) => (
              <div
                key={item.categoryValueId}
                className={`carrier-option ${
                  searchKeys.selectedValues.some(
                    (x) => x.categoryValueId === item.categoryValueId
                  )
                    ? "selected-carrier-option"
                    : undefined
                }`}
                onClick={() => onOptionSelect(item)}
              >
                {item.name}
              </div>
            ))}
          </div>

          {!matchMedia ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "12px",
              }}
            >
              <img
                src="/svg/chevron-states.svg"
                className="chevron"
                width="18"
                height="18"
                style={{
                  transform: chevronExpand ? "rotate(180deg)" : undefined,
                }}
                onClick={() => setChevronExpand(!chevronExpand)}
              />
            </div>
          ) : null}

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
                            ? data.values.map((item) => (
                                <div
                                  key={item.categoryValueId}
                                  onClick={() => {
                                    onOptionSelect(item);
                                    setFilterDrawerOpen(false);
                                    document.body.style.overflow = "unset";
                                    document.body.style.position = "unset";
                                  }}
                                  className={`condition-item ${
                                    searchKeys.selectedValues.some(
                                      (x) =>
                                        x.categoryValueId ===
                                        item.categoryValueId
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
                    {x.name}
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      onClick={() => onOptionSelect(x)}
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
                        {`${item.carrier} ${item.storage} ${item.color}`}
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
                          {`${item.carrier} ${item.storage} ${item.color}`}
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

  console.log("fetch category data");
  const data = await fetch(
    "https://api-single.uptradeit.com/search/category/values"
  ).then((response) => response.json());
  const listData = await fetch("https://api-single.uptradeit.com/search", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());

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

  const carrierOptions = data.data.find((x) => x.name === "CARRIER");

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
