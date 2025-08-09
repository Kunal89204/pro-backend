import React from "react";
import Result from "./Result";

export interface SearchResult {
  _id: string;
  title: string;
  thumbnail: string;
  duration: string | number;
  views: number;
  owner: {
    _id: string;
    fullName: string;
    username: string;
    avatar: string;
  };
  description: string;
  createdAt: string;
}

const Results = ({ results, isLoading }: { results: SearchResult[], isLoading: boolean }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4">
      {results?.map((item: SearchResult, index: number) => (
        <Result key={index} item={item} />
      ))}
     
    </div>
  );
};

export default Results;
