import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleShopCollection = () => {
    navigate("/collections");
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Discover Your Signature Scent</h1>
        <p>Luxury fragrances crafted for every moment. Experience the essence of elegance with NOIRE.</p>
        <button className="btn" onClick={handleShopCollection}>Shop Collection</button>
      </div>
    </section>
  );
}

export default Hero;