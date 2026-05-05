import "./Home.css";
import { useState } from "react";

import Hero from "../../sections/Hero/Hero";
import FeaturedProducts from "../../sections/FeaturedProducts/FeaturedProducts";
import Brands from "../../sections/Brands/Brands";
import Collections from "../../sections/Collections/Collections";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="home-page">
      <Hero />
      <Collections />
      <Brands />
      <FeaturedProducts searchQuery={searchQuery} />
    </div>
  );
}

export default Home;