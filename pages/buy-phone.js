import { useAsync, useAsyncFn } from "react-use";
import { useCallback, useState, useEffect } from "react";
import Pagination from "rc-pagination";
import SelectSearch from "react-select-search";
import urlcat from "urlcat";
import { NextSeo } from "next-seo";
import {useRouter} from "next/router";
import Head from "next/head";

const orderByDict = {
  LOWEST_PRICE: "Lowest Price",
  HIGHEST_PRICE: "Highest Price",
  BEST_CONDITION: "Best Condition",
};


function pageTitleHandler(pageTitle) {
  let showTitle = pageTitle

  if (pageTitle && pageTitle.substr(pageTitle.length - 1) === '|') {
    showTitle = pageTitle.substr(0, pageTitle.length - 1)
  }
  if (showTitle && `${showTitle} | UpTrade`.length > 60) return showTitle
  return `${showTitle} | UpTrade`
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
}) {
  const router = useRouter()
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchKeys, setSearchKeys] = useState({
    selectedValues: [],
    pageNum: 1,
    searchKey: "",
    orderBy: "LOWEST_PRICE",
    brands: [],
    models: [],
    merchants: [],
  });
  const [chevronExpand, setChevronExpand] = useState(false);

  const matchMedia = useMediaQuery("(min-width: 1280px");

  const onOptionSelect = useCallback((item) => {
    setSearchKeys((prev) => {
      const values = prev.selectedValues.some(
        (x) => x.categoryValueId === item.categoryValueId
      )
        ? prev.selectedValues.filter(
            (x) => x.categoryValueId !== item.categoryValueId
          )
        : [...prev.selectedValues, item];

      return {
        pageNum: 1,
        ...prev,
        selectedValues: values,
      };
    });
  }, []);

  const onSearchClick = useCallback(() => {
    if (!searchKey) return;

    setSearchKeys((prev) => ({
      ...prev,
      pageNum: 1,
      searchKey,
    }));
  }, [searchKey]);

  const getOptions = useCallback(
    async (query) => {
      if (!searchKey) return products;

      try {
        const productData = await fetch(
          urlcat("https://api.276qa.com/search/product", { name: searchKey })
        ).then((response) => response.json());

        if (!productData.success) return products;

        return productData.data.map((x) => ({ name: x.name, value: x.name }));
      } catch {
        return products;
      }
    },
    [products, searchKey]
  );

  const onOrderClick = useCallback((orderBy) => {
    setSearchKeys((prev) => ({
      ...prev,
      orderBy,
      pageNum: 1,
    }));
  }, []);

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
        urlcat("https://api.276qa.com/search/category/values", {
          parentCategoryValueIds: ids.join(","),
        })
      ).then((response) => response.json());

      if (!response.success) return initialConditions;

      return response.data;
    } catch {
      return initialConditions;
    }
  }, [searchKeys.selectedValues, initialConditions]);

  const { value: data } = useAsync(async () => {
    if (
      !searchKeys.selectedValues.length &&
      searchKeys.pageNum === 1 &&
      searchKeys.orderBy === "LOWEST_PRICE" &&
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
        valueIds: searchKeys.selectedValues
          .filter((x) => ![3, 4, 8].includes(x.categoryId))
          .map((x) => x.categoryValueId),
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

      const listData = await fetch("https://api.276qa.com/search", {
        method: "POST",
        headers: {
          ["Content-Type"]: "application/json",
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());

      if (!listData.success) return cacheList.current;

      const listResults = listData.data.data.map((item) => {
        const specs = item.specs.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        );
        return {
          ...item,
          ...specs,
        };
      });

      return {
        ...listData.data,
        data: listResults,
      };
    } catch (error) {
      return cacheList.current;
    }
  }, [searchKeys, initData]);

  const [, addRank] = useAsyncFn(async (name) => {
    return fetch(urlcat("https://api.276qa.com/search/:name/rank", { name }), {
      method: "PUT",
    });
  }, []);

  useEffect(() => {
    if (!location?.search) return;

    const search = new URLSearchParams(location.search);
    const brand = search.get("brand");
    const brandCategoryValueId = search.get("brandCategoryValueId");
    const modelName = search.get("modelName");
    const modelId = search.get("modelId");

    setSearchKeys((prev) => ({
      ...prev,
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
    }));
  }, []);

  return (
   <>
     <Head>
       <link rel="stylesheet" href="/rc.css" />
     </Head>
     <main className="buy-phone-page">
       <NextSeo
           title={pageTitleHandler(
               `Browse Used Refurbished Phones and Devices for Sale`,
           )}
           canonical={`${process.env.BASEURL}/buy-phone`}
           description={`Considering buying a used phone? Browse UpTrade certified phones. View photos of the phone you'll receive. 30 day free returns. Free shipping.`}
           openGraph={{
             title: pageTitleHandler(
                 `Browse Used Refurbished Phones and Devices for Sale`,
             ),
             type: 'Product.group',
             'twitter:image':
                 'https://prod-uptrade.s3.us-east-2.amazonaws.com/website/logo/Up_Logo.png',
             images: [
               {
                 url: `${process.env.BASEURL}/og_logo.png`,
                 width: 200,
                 height: 200,
               },
             ],
             url: `${process.env.BASEURL}${router.asPath}`,
             description: `Considering buying a used phone? Browse UpTrade certified phones. View photos of the phone you'll receive. 30 day free returns. Free shipping.`,
             site_name: 'UpTrade',
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
                 <div
                     className="condition-content"
                     style={{
                       display: expanded.some((x) => x === data.name)
                           ? "block"
                           : "none",
                     }}
                 >
                   {data.values.map((item) => (
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
                   ))}
                 </div>
               </div>
           ))}
         </div>
       </div>

       <div className="buy-phone-content">
         <div className="buy-phone-page-title">
           <h1>Browse Refurbished Phones and Devices for Sale</h1>
           <h2>
             Among hundreds of used phone and device sellers, we have selected a
             handful of certified resellers and marketplaces that provide quality
             certified used or refurbished phones and devices.
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
                         className={className}
                     />
                 );
               }}
               renderOption={(optionsProps, optionData) => {
                 console.log(optionsProps);
                 return (
                     <button
                         {...optionsProps}
                         onMouseDown={(event) => {
                           optionsProps.onMouseDown(event);
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
               onClick={onSearchClick}
           >
             Search
           </button>
           <svg
               className="form-search-icon"
               viewBox="0 0 24 24"
               aria-hidden="true"
               onClick={onSearchClick}
           >
             <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
           </svg>
         </div>
         <div
             className="carrier-options"
             style={{
               height:
                   typeof window !== "undefined" && !matchMedia && !chevronExpand
                       ? 88
                       : undefined,
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
         <div className="option-controllers">
           <div className="filter-controller">
             <label className="dropdown">
              <span onClick={() => setFilterDrawerOpen(true)}>
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
                   onClick={() => setFilterDrawerOpen(false)}
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
                       <div
                           className="condition-content"
                           style={{
                             display: expanded.some((x) => x === data.name)
                                 ? "block"
                                 : "none",
                           }}
                       >
                         {data.values.map((item) => (
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
                         ))}
                       </div>
                     </div>
                 ))}
               </div>
             </div>
           </div>
           {!matchMedia ? (
               <img
                   src="/svg/chevron-states.svg"
                   className="chevron"
                   width="24"
                   height="24"
                   style={{
                     transform: chevronExpand ? "rotate(180deg)" : undefined,
                   }}
                   onClick={() => setChevronExpand(!chevronExpand)}
               />
           ) : null}
           <div className="sort-controller">
             <label className="dropdown">
              <span
                  className="dropdown-toggle"
                  onClick={() => setSortDrawerOpen(true)}
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
                   onClick={() => setSortDrawerOpen(false)}
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
                             onClick={() => onOrderClick(key)}
                         >
                           <span>{value}</span>
                           {searchKeys.orderBy === key ? (
                               <img width="20" height="20" src="/svg/check.svg" />
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

         <div className="desktop-phone-list">
           {data?.data?.map((item) => (
               <a
                   key={item.productId}
                   href={urlcat(`/redirect/:gradeAndMerchant`, {
                     gradeAndMerchant: `${item.productId}-${item.CONDITION}-${item.merchant}`,
                     redirectUrl: item.buyUrl,
                   })}
                   target="_blank"
                   rel="nofollow noreferrer"
                   className="phone-list-item"
               >
                 <div className="img-container">
                   <img width="100" height="100" src={item.brandLogoUrl} />
                 </div>
                 <div className="description">
                   <span>{item.name}</span>
                   <span className="attr">
                  {`${item.CARRIER} ${item.STORAGE} ${item.COLOR}`}
                </span>
                 </div>

                 <div className="condition-container">
                   <div className={`condition ${item.CONDITION} `}>
                     {item.CONDITION}
                   </div>
                 </div>

                 <div className="action">
                   <span className="price">${item.currentPrice / 100}</span>
                   <div className="view-detail">View Detail</div>
                 </div>
               </a>
           ))}
         </div>

         <div className="mobile-phone-list">
           {data?.data?.map((item) => (
               <a
                   key={item.productId}
                   href={urlcat(`/redirect/:gradeAndMerchant`, {
                     gradeAndMerchant: `${item.productId}-${item.CONDITION}-${item.merchant}`,
                     redirectUrl: item.buyUrl,
                   })}
                   className="phone-list-item"
                   target="_blank"
                   rel="nofollow noreferrer"
               >
                 <div className="top">
                   <img width="50" height="50" src={item.brandLogoUrl} />
                   <div className={`condition ${item.CONDITION} `}>
                     {item.CONDITION}
                   </div>
                 </div>
                 <div className="bottom">
                   <div className="description">
                     <span>{item.name}</span>
                     <span className="attr">
                    {`${item.CARRIER} ${item.STORAGE} ${item.COLOR}`}
                  </span>
                   </div>

                   <span className="price">${item.currentPrice / 100}</span>
                 </div>
               </a>
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
       </div>
     </main>
    </>
  );
}

export async function getStaticProps() {
  const body = {
    all: false,
    pageNum: 1,
    pageSize: 20,
  };

  const data = await fetch("https://api.276qa.com/search/category/values").then(
    (response) => response.json()
  );
  const listData = await fetch("https://api.276qa.com/search", {
    method: "POST",
    headers: {
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());

  const productData = await fetch("https://api.276qa.com/search/product").then(
    (response) => response.json()
  );

  if (!data.success || !listData.success || !productData.success)
    return {
      props: {
        conditions: [],
        carrierOptions: [],
        data: [],
        products: [],
      },
    };

  const carrierOptions = data.data.find((x) => x.name === "CARRIER");

  const listResults = listData.data.data.map((item) => {
    const specs = item.specs.reduce(
      (acc, { key, value }) => ({ ...acc, [key]: value }),
      {}
    );
    return {
      ...item,
      ...specs,
    };
  });
  return {
    props: {
      conditions: data.data,
      carrierOptions: carrierOptions ? carrierOptions.values : [],
      data: {
        ...listData.data,
        data: listResults,
      },
      products: productData.data.map((x) => ({ name: x.name, value: x.name })),
    },
  };
}
