import Button from './Button'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <img
        src="/hero.png"
        alt="Construction equipment"
        className="hero-image"
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>Find Construction Parts</h1>

        <p>
          Find the parts and products you need to keep your equipment moving.
        </p>

        <Button variant="primary" className="hero-button">
          Shop Now
        </Button>
      </div>
    </section>
  )
}

export default Hero