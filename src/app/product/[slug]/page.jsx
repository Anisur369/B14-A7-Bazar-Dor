import ProductDetails from "@/components/ProductDetails";

const Peyaj = async ({ params }) => {
  const { slug } = await params;
  return (
    <>
        <ProductDetails slug={slug} />
    </>
  );
};

export default Peyaj;