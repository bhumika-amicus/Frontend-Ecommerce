
import Button from '../components/Button'
import Card from '../components/Card'
import './Assignment3.css'

export default function Assignment3() {
  return (
    <div className="assignment-container">
      <h1>Assignment 3 — Reusable Button & Card Library</h1>

      {/* Section A: Buttons */}
      <div className="section-container">
        <div className="section-header">SECTION A — BUTTON VARIANTS</div>
        <div className="section-content button-row">

          <div className="item-wrapper">
            <Button variant="primary">ORDER NOW</Button>
            <span className="item-label">Primary</span>
          </div>

          <div className="item-wrapper">
            <Button variant="secondary">VIEW MANUALS</Button>
            <span className="item-label">Secondary</span>
          </div>

          <div className="item-wrapper">
            <Button variant="outline">SEARCH</Button>
            <span className="item-label">Outline</span>
          </div>

          <div className="item-wrapper">
            <Button variant="danger">REMOVE</Button>
            <span className="item-label">Danger</span>
          </div>

        </div>
      </div>

      {/* Section B: Cards */}
      <div className="section-container">
        <div className="section-header">SECTION B — CARD VARIANTS</div>
        <div className="section-content card-row">

          <div className="item-wrapper">
            <Card variant="elevated">
              <h2 className="card-title">Order Now</h2>
              <p className="card-text">Quickly place your order for parts.</p>
              <Button variant="primary">ORDER NOW</Button>
            </Card>
            <span className="item-label">Elevated</span>
          </div>

          <div className="item-wrapper">
            <Card variant="bordered">
              <h2 className="card-title">Aftermarket Products</h2>
              <p className="card-text">Spare parts catalog.</p>
              <Button variant="primary">BROWSE PRODUCTS</Button>
            </Card>
            <span className="item-label">Bordered</span>
          </div>

          <div className="item-wrapper">
            <Card variant="flat">
              <h2 className="card-title">Support</h2>
              <p className="card-text">Technical help center.</p>
              <Button variant="outline">CONTACT SUPPORT</Button>
            </Card>
            <span className="item-label">Flat</span>
          </div>

        </div>
      </div>
    </div>
  )
}
