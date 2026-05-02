export default function ProductVisual({ product }) {
  const imageSource = product.imageData || product.imageUrl;

  if (imageSource) {
    return (
      <div className="product-visual image-visual">
        <img src={imageSource} alt={`${product.name} design`} />
      </div>
    );
  }

  return (
    <div
      className="product-visual"
      style={{
        "--product-color": product.color,
        "--product-accent": product.accent
      }}
      aria-label={`${product.name} image`}
    >
      <span className="top-rail" />
      <span className="left-leg" />
      <span className="right-leg" />
      <span className="cross-bar" />
      <span className="bolt bolt-one" />
      <span className="bolt bolt-two" />
    </div>
  );
}
