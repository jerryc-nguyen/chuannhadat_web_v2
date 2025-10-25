/**
 * Creates metadata for SEO, including Twitter metadata.
 *
 * @param {Metadata} rawMetadata - The raw metadata object.
 * @returns {object} metadata object with Twitter metadata included.
 */

import { Metadata } from "next";

export const createMetadata = (rawMetadata: Metadata, hasQueryString?: boolean) => {
  return {
    ...rawMetadata,
    twitter: {
      title: rawMetadata.title as string,
      description: rawMetadata.description as string,
      images: rawMetadata.openGraph?.images,
    },
    // Prevent robots indexing if URL contains query strings
    ...(hasQueryString && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
};
