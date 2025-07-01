"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Text } from "@chakra-ui/react";
import Results from "@/components/search/Results";
import { useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const token = useSelector((state: RootState) => state.token);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => myQuery.getSearchResults(token, query),
    enabled: !!query,
  });

  console.log(searchResults);

  return (
    <div>
      <Text>{query} search page</Text>
      <Results results={searchResults?.data} isLoading={isLoading} />
    </div>
  );
};

export default Search;
