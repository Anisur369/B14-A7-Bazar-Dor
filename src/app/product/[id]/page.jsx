import ProductDetails from "@/components/ProductDetails";

const Peyaj = async ({ params }) => {
  const { id } = await params;
  return (
    <>
        <ProductDetails productId={id} />
    </>
  );
};

export default Peyaj;