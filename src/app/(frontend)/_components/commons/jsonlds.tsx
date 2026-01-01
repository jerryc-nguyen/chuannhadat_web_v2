import React from 'react';

interface JsonLdsProps {
  jsonLds?: any[];
}

const JsonLds: React.FC<JsonLdsProps> = ({ jsonLds }) => {
  if (!jsonLds || jsonLds.length === 0) {
    return null;
  }

  return (
    <>
      {jsonLds.map((jsonLd, index) => (
        <script
          key={index}
          id={`json-ld-profile-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
    </>
  );
};

export default JsonLds;
