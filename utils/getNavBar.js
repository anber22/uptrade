let cache = null;

export const getNavBar = async () => {
  if (!cache) {
    console.log("navbardata");
    const navbarResponse = await fetch(
      "https://api-v2.276qa.com/search/category/buy/navigation/bar"
    ).then((response) => response.json());

    const sellNavbarResponse = await fetch(
      "https://api-single.uptradeit.com/search/trade-in/category/navigation/bar"
    ).then((response) => response.json());

    const appleList = navbarResponse?.data?.find(
      (x) => x.key === "Apple"
    ).values;
    const sellAppleList = sellNavbarResponse?.data?.find(
      (x) => x.key === "Apple"
    ).values;

    cache = {
      navbar: navbarResponse.data,
      sellNavbar: sellNavbarResponse.data,
      appleList: appleList,
      sellAppleList,
    };
  }

  return cache;
};
