"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Text } from "@chakra-ui/react";
import Results from "@/components/search/Results";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div>
      <Text>{query} search page</Text>
      <Results />
    </div>
  );
};

export default Search;
