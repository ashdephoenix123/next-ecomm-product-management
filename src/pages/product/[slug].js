import ProductForm from "@/components/ProductForm";

const ProductPage = ({ product, error }) => {
  if (error) {
    console.log(error);
    return <p>Failed to load! check console!</p>;
  }
  return (
    <div className="container mx-auto my-12">
      <ProductForm product={product} />
    </div>
  );
};

export default ProductPage;

export async function getServerSideProps(context) {
  try {
    const slug = context.query.slug;
    const fetchdetails = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/getCommodity?slug=${slug}`
    );
    const productdetails = await fetchdetails.json();

    return {
      props: {
        product: productdetails[0],
      },
    };
  } catch (error) {
    return {
      props: {
        error: "Something went wrong!",
      },
    };
  }
}
