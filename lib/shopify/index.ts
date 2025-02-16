import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "lib/constants";
import { isShopifyError } from "lib/type-guards";
import { ensureStartsWith } from "lib/utils";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyCollection,
  ShopifyProduct,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw {
      error: e,
      query,
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  // const res = await shopifyFetch<ShopifyCollectionOperation>({
  //   query: getCollectionQuery,
  //   variables: {
  //     handle
  //   }
  // });

  // return reshapeCollection(res.body.data.collection);
  return undefined;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  // const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
  //   query: getCollectionProductsQuery,
  //   variables: {
  //     handle: collection,
  //     reverse,
  //     sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
  //   }
  // });

  // if (!res.body.data.collection) {
  //   console.log(`No collection found for \`${collection}\``);
  //   return [];
  // }

  // return reshapeProducts(
  //   removeEdgesAndNodes(res.body.data.collection.products)
  // );
  return [];
}

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }
  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];
  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);
      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }
  return reshapedCollections;
};

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  // const res = await shopifyFetch<ShopifyCollectionsOperation>({
  //   query: getCollectionsQuery
  // });
  // const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  // const collections = [
  //   {
  //     handle: '',
  //     title: 'All',
  //     description: 'All products',
  //     seo: {
  //       title: 'All',
  //       description: 'All products'
  //     },
  //     path: '/search',
  //     updatedAt: new Date().toISOString()
  //   },
  //   // Filter out the `hidden` collections.
  //   // Collections that start with `hidden-*` need to be hidden on the search page.
  //   ...reshapeCollections(shopifyCollections).filter(
  //     (collection) => !collection.handle.startsWith('hidden')
  //   )
  // ];

  // return collections;
  return [];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  // const res = await shopifyFetch<ShopifyMenuOperation>({
  //   query: getMenuQuery,
  //   variables: {
  //     handle
  //   }
  // });

  // return (
  //   res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
  //     title: item.title,
  //     path: item.url
  //       .replace(domain, '')
  //       .replace('/collections', '/search')
  //       .replace('/pages', '')
  //   })) || []
  // );
  return [];
}

export async function getPage(handle: string): Promise<Page> {
  // const res = await shopifyFetch<ShopifyPageOperation>({
  //   query: getPageQuery,
  //   variables: { handle }
  // });

  // return res.body.data.pageByHandle;
  return {
    id: "id",
    title: "title",
    body: "body",
    bodySummary: "bodySummary",
    createdAt: "createdAt",
    handle: "handle",
    updatedAt: new Date().toISOString(),
  };
}

export async function getPages(): Promise<Page[]> {
  // const res = await shopifyFetch<ShopifyPagesOperation>({
  //   query: getPagesQuery
  // });

  // return removeEdgesAndNodes(res.body.data.pages);
  return [];
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  // const res = await shopifyFetch<ShopifyProductOperation>({
  //   query: getProductQuery,
  //   variables: {
  //     handle
  //   }
  // });

  // return reshapeProduct(res.body.data.product, false);
  return undefined;
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  // const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
  //   query: getProductRecommendationsQuery,
  //   variables: {
  //     productId
  //   }
  // });

  // return reshapeProducts(res.body.data.productRecommendations);
  return [];
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  // const res = await shopifyFetch<ShopifyProductsOperation>({
  //   query: getProductsQuery,
  //   variables: {
  //     query,
  //     reverse,
  //     sortKey
  //   }
  // });

  // return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
  return [];
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
