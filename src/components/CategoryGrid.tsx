import Button from './Button'
import Card from './Card'

function CategoryGrid() {
  return (
    <section className="category-section">
      <div className="category-grid">
        
        {/* Card 1 */}
        <Card variant="elevated" className="category-card">
          <div className="category-card-content">
            <h3 className="category-card-title">Order Now</h3>
            <p className="category-card-text">
              Already know your part number?
            </p>
          </div>
          <Button variant="primary">ORDER NOW</Button>
        </Card>

        {/* Card 2 */}
        <Card variant="flat" className="category-card">
          <div className="category-card-content">
            <h3 className="category-card-title">Aftermarket Products</h3>
            <p className="category-card-text">
              Browse through our parts catalog.
            </p>
          </div>
          <Button variant="primary">AFTERMARKET PRODUCTS</Button>
        </Card>

        {/* Card 3 */}
        <Card variant="elevated" className="category-card">
          <div className="category-card-content">
            <h3 className="category-card-title">Interactive Parts Manuals</h3>
            <p className="category-card-text">
              Find the right parts in our interactive manuals.
            </p>
          </div>
          <Button variant="primary">VIEW MANUALS</Button>
        </Card>

        {/* Card 4 */}
        <Card variant="flat" className="category-card">
          <div className="category-card-content">
            <h3 className="category-card-title">Technical Publications</h3>
            <p className="category-card-text">
              Download schematics, forms and manuals (Parts, Operation, Service and Supplemental).
            </p>
          </div>
          <Button variant="primary">SEARCH PUBLICATIONS</Button>
        </Card>

      </div>
    </section>
  )
}

export default CategoryGrid
