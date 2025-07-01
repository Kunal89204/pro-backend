import React from "react";
import Image from "next/image";
import { SearchResult } from "./Results";

const Result = ({ item }: { item: SearchResult }) => {
  return (
    <div>
      <Image src={item.thumbnail} alt={item.title} width={100} height={100} />
      {item.title}
    </div>
  );
};

export default Result;
