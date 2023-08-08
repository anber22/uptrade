import SelectSearch from "react-select-search";
import { useCallback, useState } from "react";
import urlcat from "urlcat";
import { useRouter } from "next/router";

export default function Search() {
  const router = useRouter();
  const [searchKey, setSearchKey] = useState("");
  const getOptions = useCallback(
    async (query) => {
      if (!searchKey) return [];

      try {
        const productData = await fetch(
          urlcat("https://api-v2.276qa.com/home/search/product", {
            searchKey: searchKey,
          })
        ).then((response) => response.json());
        console.log('搜索信息', productData)
        if (!productData.success) return products;

        return productData.data.map((x) => ({
          name: x.name,
          value: x.name,
          url: x.url,
          id: x.id,
          type: x.type
        }));
      } catch {
        return [];
      }
    },
    [searchKey]
  );
  const selectSomeOne = async option => {
    console.log('选中', option)
    let body = {
      modelId: option.id,
      modelType: option.type
    }
    const result = await fetch("https://api-v2.276qa.com/home/search/product", {
      method: "POST",
      headers: {
        ["Content-Type"]: "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
    console.log('请求结果', result)
  }
  return (
    <SelectSearch
      options={[]}
      name="search"
      value={searchKey}
      onChange={(key) => setSearchKey(key)}
      placeholder="Search product"
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
              router.push(optionData.url);
              selectSomeOne(optionData)
            }}
          >
            {optionData.name}
          </button>
        );
      }}
    />
  );
}
